#!/usr/bin/env node
// Role: the design discipline made mechanical. Enforces the linter rules in
//   docs/design-axioms.md against the data, the layer boundaries, and the corpus index.
// Contract: `node linter.js`. Exits 0 if clean, 1 with a report of violations otherwise.
// Invariant: reads the source of truth (data/schema.js) for field rules; it never hand-rolls
//   a second schema. A gap that is marked and ledgered is not a violation (T0-5).
"use strict";
const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;
const SCHEMA = require("./data/schema.js");
const graphUtil = require("./engine/graph.js");

const problems = [];
const fail = (rule, msg) => problems.push({ rule, msg });
let checked = 0;

// ---- load the data world: primitives + atlas + cases, into the one registry ----
const { PRIMITIVES } = require("./data/primitives/primitives.js");
const { ATLAS } = require("./data/atlas/atlas.js");
const { BODIES } = require("./data/bodies/bodies.js");
const GAPS = require("./engine/gaps.js");
const { VISUALS } = require("./data/components/visuals.js");
const { CARD_LAYOUTS } = require("./data/components/cards.js");
const { VIEW_COMPONENTS } = require("./data/components/views.js");
const { CLIENTS } = require("./data/clients/clients.js");
const { validateManifest } = require("./data/clients/palette.js");
const { FORKS } = require("./data/forks/forks.js");
const { buildRegistry } = require("./engine/registry.js");
const { makeResolver, referencesOf, dependents } = require("./engine/resolve.js");
const CASE_FILES = ["./data/cases/population-pipeline.js", "./data/cases/lhc-cascade.js"];
const cases = CASE_FILES.map((f) => require(f).CASE);

// thin-client manifests under clients/ (declarative, palette-composed, possibly forks)
const MANIFESTS = {};
const manifestDir = path.join(ROOT, "clients");
if (fs.existsSync(manifestDir))
  for (const f of fs.readdirSync(manifestDir).filter((x) => x.endsWith(".json"))) {
    try { const m = JSON.parse(fs.readFileSync(path.join(manifestDir, f), "utf8")); MANIFESTS[m.id] = m; }
    catch (e) { fail("kit/manifest", `clients/${f}: not valid JSON (${e.message})`); }
  }

const COMPONENTS = Object.assign({}, VISUALS, CARD_LAYOUTS, VIEW_COMPONENTS, CLIENTS, MANIFESTS);
let registry;
try {
  registry = buildRegistry({ primitives: PRIMITIVES, atlas: ATLAS, cases, components: COMPONENTS, forks: FORKS });
} catch (e) {
  fail("T0-1", "registry build failed: " + e.message);
  registry = Object.create(null);
}
const resolve = makeResolver(registry);

// schema-node subset (primitives + case nodes) for the field and decomposition checks;
// atlas entries and instances are addressable components but not schema graph nodes.
const nodeMap = Object.create(null);
for (const id of Object.keys(PRIMITIVES)) nodeMap[id] = PRIMITIVES[id];
const instances = [];
for (const c of cases) {
  for (const id of Object.keys(c.nodes || {})) nodeMap[id] = c.nodes[id];
  for (const inst of c.instances || []) instances.push(inst);
}
// the empirical floor: flatten populated body properties into measurement leaves, exactly as the
// detector does, so the linter validates them as cited primitives and sees the same graph.
const bodyLeaves = GAPS.flattenBodies(BODIES);
for (const id of Object.keys(bodyLeaves)) nodeMap[id] = bodyLeaves[id];

// ---- Rule 1: required fields per kind (via schema, the single source of truth) ----
for (const id of Object.keys(nodeMap)) {
  checked++;
  const errs = SCHEMA.validateNode(nodeMap[id]);
  for (const e of errs) fail("rule1/T0-1", e);
}

// ---- B1: teaching layer required on teaching-facing nodes of a teaching case ----
// An equation-bearing step (transformation/assumption) owes the full explain block; a
// framing question owes the lighter hook/intuition/stakes. The terse fields stay as the
// inspect layer either way. The LHC case has no teaching flag, so it is exempt (scope: B).
const QUESTION_EXPLAIN = ["hook", "intuition", "stakes"];
for (const c of cases) {
  if (!c.teaching) continue;
  for (const id of Object.keys(c.nodes || {})) {
    const n = c.nodes[id];
    if (SCHEMA.hasMarker(n)) continue;
    const isStep = n.kind === "transformation" || n.kind === "assumption";
    const isQuestion = n.kind === "question";
    if (!isStep && !isQuestion) continue;
    if (!n.explain) { fail("B1/teaching", `${id}: teaching node has no explain block`); continue; }
    const required = isQuestion ? QUESTION_EXPLAIN : SCHEMA.EXPLAIN_FIELDS;
    for (const f of required) {
      if (n.explain[f] == null || n.explain[f] === "" || (Array.isArray(n.explain[f]) && !n.explain[f].length))
        fail("B1/teaching", `${id}: explain missing required '${f}' for a ${n.kind}`);
    }
  }
}

// ---- Rule 2 + A4: every reference resolves (through the resolver), and reference-not-inline.
// A reference field holds an id (a string); an embedded object is inlined duplication.
const REF_ARRAY_FIELDS = ["children", "inputs", "outputs"];
const REF_SCALAR_FIELDS = ["atlas_ref", "produced_by", "instantiates", "broken_node", "forks", "copy_of"];
for (const id of Object.keys(registry)) {
  const c = registry[id];
  // reference-not-inline: shared references must be id strings, never embedded components
  for (const f of REF_ARRAY_FIELDS) {
    if (c[f] != null && Array.isArray(c[f]))
      c[f].forEach((x) => { if (typeof x !== "string") fail("A2/reference-not-inline", `${id}: '${f}' holds an inlined component, not an id`); });
  }
  for (const f of REF_SCALAR_FIELDS) {
    if (c[f] != null && typeof c[f] !== "string") fail("A2/reference-not-inline", `${id}: '${f}' holds an inlined component, not an id`);
  }
  if (SCHEMA.hasMarker(c)) continue; // ledgered stub: its refs are part of the gap
  for (const ref of referencesOf(c)) {
    if (resolve(ref) === undefined) fail("rule2/T0-4", `${id}: reference '${ref}' does not resolve`);
  }
}

// ---- A3: the dependents query is consistent with declared back-references ----
// A primitive's `parents` are its back-references; they must equal what actually references
// it. This catches a stale back-reference and exercises the blast-radius query.
for (const id of Object.keys(PRIMITIVES)) {
  const declared = PRIMITIVES[id].parents;
  if (!declared) continue;
  const actual = dependents(registry, id);
  const dSet = new Set(declared);
  const aSet = new Set(actual);
  for (const p of declared) if (!aSet.has(p)) fail("A3/dependents", `${id}: declared parent '${p}' does not reference it`);
  for (const p of actual) if (!dSet.has(p)) fail("A3/dependents", `${id}: '${p}' references it but is not in its parents back-reference`);
}

// ---- C2: every fork resolves (forks/copy_of parent exists) and no fork cycles ----
for (const id of Object.keys(registry)) {
  const c = registry[id];
  const parent = c.forks || c.copy_of;
  if (!parent) continue;
  if (!registry[parent]) { fail("C2/fork", `${id}: fork parent '${parent}' does not resolve`); continue; }
  // walk the parent chain; a revisit is a cycle
  const seen = new Set([id]);
  let cur = parent;
  while (cur) {
    if (seen.has(cur)) { fail("C2/fork", `${id}: fork cycle through '${cur}'`); break; }
    seen.add(cur);
    const p = registry[cur];
    cur = p && (p.forks || p.copy_of);
  }
}

// ---- Rule 3: marker <-> ledger one-to-one ----
const liveMarkers = new Set();
const scanMarkers = (rec) => {
  for (const f of SCHEMA.SORRY_FIELDS) if (rec && rec[f]) liveMarkers.add(`${rec.id}#${f}`);
};
for (const id of Object.keys(nodeMap)) scanMarkers(nodeMap[id]);
for (const inst of instances) scanMarkers(inst);

const ledgerPath = path.join(ROOT, "docs", "sorry-ledger.md");
const ledgerText = fs.readFileSync(ledgerPath, "utf8");
const ledgerMarkers = new Set();
// the machine-checked table: rows whose first cell is `id#field`
const rowRe = /^\|\s*`([^`]+#[A-Za-z_]+)`\s*\|/gm;
let m;
while ((m = rowRe.exec(ledgerText))) ledgerMarkers.add(m[1]);

for (const k of liveMarkers) if (!ledgerMarkers.has(k)) fail("rule3/T0-5", `node marker '${k}' is not in the sorry ledger`);
for (const k of ledgerMarkers) if (!liveMarkers.has(k)) fail("rule3/T0-5", `ledger entry '${k}' has no live node marker`);

// ---- Rule 5: acyclic decomposition, primitives have no children, leaves are cited primitives ----
const ac = graphUtil.decompositionAcyclic(nodeMap);
if (!ac.acyclic) fail("rule5/T1-2", `decomposition cycle: ${ac.cycle.join(" -> ")}`);
// every node referenced as a child that is itself childless must be a primitive with a citation
const referencedAsChild = new Set();
for (const n of Object.values(nodeMap)) for (const c of n.children || []) referencedAsChild.add(c);
for (const id of referencedAsChild) {
  const n = nodeMap[id];
  if (!n) continue; // already caught by rule 2
  const childless = !n.children || n.children.length === 0;
  if (!childless) continue;
  if (SCHEMA.hasMarker(n)) continue; // ledgered stub leaf is an allowed gap
  if (n.kind !== "primitive") fail("rule5/T1-2", `${id}: decomposition leaf is not a primitive (kind ${n.kind})`);
  else if (!n.citation) fail("rule5/T1-2", `${id}: primitive leaf has no citation`);
}
for (const n of Object.values(nodeMap)) {
  if (n.kind === "primitive" && n.children && n.children.length) fail("rule5/T1-2", `${n.id}: primitive has children`);
}

// ---- Rules 4 & 6: no DOM / localStorage / shared mutable in engine/ ----
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
const engineJs = walk(path.join(ROOT, "engine")).filter((f) => f.endsWith(".js"));
const DOM_RE = /\b(document|window|localStorage|sessionStorage)\b/;
for (const f of engineJs) {
  const lines = fs.readFileSync(f, "utf8").split("\n");
  lines.forEach((l, i) => {
    const code = l.replace(/\/\/.*$/, ""); // ignore line comments (they may name the DOM)
    if (DOM_RE.test(code)) fail("rule4/T0-2", `${path.relative(ROOT, f)}:${i + 1} references the DOM/storage in engine/`);
  });
}

// ---- Rule 8: every JS module has a head comment (role, contract, invariant) ----
const MODULE_DIRS = ["data", "engine", "view", "build"];
const allModuleJs = MODULE_DIRS.flatMap((d) => walk(path.join(ROOT, d))).filter((f) => f.endsWith(".js") || f.endsWith(".mjs"));
allModuleJs.push(path.join(ROOT, "linter.js"));
for (const f of allModuleJs) {
  const head = fs.readFileSync(f, "utf8").split("\n").slice(0, 12).join("\n");
  for (const tag of ["Role:", "Contract:", "Invariant:"]) {
    if (!head.includes(tag)) fail("rule8", `${path.relative(ROOT, f)}: head comment missing '${tag}'`);
  }
}

// ---- Rule 7 (proxy): the built artifact is one standalone file ----
const subPath = path.join(ROOT, "submission.html");
if (!fs.existsSync(subPath)) fail("rule7/T0-6", "submission.html does not exist (run node build/bundle.js)");
else {
  const sub = fs.readFileSync(subPath, "utf8");
  if (/@@INCLUDE:/.test(sub)) fail("rule7/T0-6", "submission.html has unresolved include tokens");
  if (/<script[^>]+src=(?!"https:\/\/cdn\.jsdelivr\.net\/pyodide)/.test(sub))
    fail("rule7/T0-6", "submission.html references an external script other than the click-gated Pyodide runtime");
}
// NOTE: the no-console-error-on-load half of rule 7 needs a browser and is not run here.

// ---- Phase E: the storage / API / clients boundary, proved ----
// 1. A client reaches the store only through the API. A client file (view/clients/*) may not
//    name the store, build a registry, or reach a raw resolver; the api object is its only door.
const clientDir = path.join(ROOT, "view", "clients");
if (fs.existsSync(clientDir)) {
  const FORBIDDEN = /\b(PRIMITIVES|ATLAS|VISUALS|CARD_LAYOUTS|VIEW_COMPONENTS|CLIENTS|FORKS|buildRegistry|makeResolver)\b|\bCASE\b|registry\[|require\(/;
  for (const f of walk(clientDir).filter((x) => x.endsWith(".js"))) {
    fs.readFileSync(f, "utf8").split("\n").forEach((l, i) => {
      const code = l.replace(/\/\/.*$/, "");
      if (FORBIDDEN.test(code)) fail("E/boundary", `${path.relative(ROOT, f)}:${i + 1} a client may not reach the store directly (use the API)`);
    });
  }
}
// 2. A client carries only presentation (tokens + mapping + identity), no truth field. A thin
//    client's mapping covers every node kind (the render-everything guarantee). No client may
//    invent a kind. The api object exposes no store-mutation method, so a client cannot write
//    except through submit, which is structural and needs no separate check.
const CLIENT_KEYS = new Set(["id", "kind", "tier", "renderer", "title", "tokens", "mapping"]);
const KIND_SET = SCHEMA.PRESENTATION_TYPES;
for (const id of Object.keys(CLIENTS)) {
  const c = CLIENTS[id];
  for (const key of Object.keys(c)) if (!CLIENT_KEYS.has(key)) fail("E/client-shape", `${id}: a client carries only tokens + mapping, not '${key}'`);
  if (c.mapping) for (const k of Object.keys(c.mapping)) if (!KIND_SET.includes(k)) fail("E/client-kind", `${id}: mapping names a kind '${k}' that is not in the closed set`);
  if (c.tier === "thin") for (const k of KIND_SET) if (!c.mapping || !c.mapping[k]) fail("E/thin-coverage", `${id}: thin client must cover kind '${k}'`);
}
// thin-client manifests (clients/*.json): validate the RESOLVED manifest (fork-aware) against
// the palette, covering every kind. A malformed manifest fails the build loudly.
for (const id of Object.keys(MANIFESTS)) {
  const resolved = resolve(id) || MANIFESTS[id];
  for (const p of validateManifest(resolved, KIND_SET)) fail("kit/manifest", p);
}

// ---- Body corpus shape: the empirical floor. A populated property is a measurement leaf and must
//      carry value, unit, and citation so it grounds; a stub must carry a sorry string and never a
//      value (it is a placeholder, not a terminal). The flattened leaves above are validated as
//      cited primitives by rule 1; this checks the source shape before flattening.
for (const bid of Object.keys(BODIES)) {
  const b = BODIES[bid];
  if (!b.id || !b.name || !b.properties) { fail("body/shape", `${bid}: a body needs id, name, properties`); continue; }
  for (const pname of Object.keys(b.properties)) {
    const p = b.properties[pname];
    const where = `${bid}#${pname}`;
    if (p && p.sorry) {
      if (p.value !== undefined) fail("body/shape", `${where}: a stub must not carry a value (it is unpopulated)`);
    } else if (GAPS.isPopulated(p)) {
      if (p.value === undefined) fail("body/shape", `${where}: a populated property needs a value`);
      if (!p.unit) fail("body/shape", `${where}: a populated property needs a unit`);
      if (p.terminal_type !== "measurement") fail("body/shape", `${where}: a body property is a measurement terminal`);
    } else {
      fail("body/shape", `${where}: a property is neither a populated measurement (value + unit + citation) nor a stub (sorry)`);
    }
  }
}

// ---- A2: the subjectivity boundary. The gap detector emits only OBJECTIVE structural gaps:
//      no importance/score/weight/rank/priority field, and no code path orders gaps by importance
//      or recommends one to close. Prioritization is absent by construction, not by convention
//      (docs/architecture-storage-api-clients.md; docs/status-ledger.md A2).
const detectGaps = GAPS.detectGaps;
const RANK_FIELDS = ["importance", "score", "weight", "rank", "priority"];
let gapList = [];
try {
  gapList = detectGaps({ primitives: PRIMITIVES, atlas: ATLAS, cases, bodies: BODIES });
} catch (e) {
  fail("A2/gaps", "gap detector threw: " + e.message);
}
for (const g of gapList) {
  for (const k of RANK_FIELDS)
    if (k in g) fail("A2/no-prioritization", `gap at ${g.at} carries a forbidden '${k}' field (a gap is objective; prioritization belongs to the assessment layer)`);
  if (!g.kind || !g.at || !g.missing || !g.discharge)
    fail("A2/gap-shape", `gap at ${g.at || "?"} is not a well-typed { kind, at, missing, discharge }`);
}
// static guarantee on the detector: it never sorts (emits in detection order) and never writes a
// prioritization field onto a gap. The objective layer cannot rank; the client only renders it.
fs.readFileSync(path.join(ROOT, "engine", "gaps.js"), "utf8").split("\n").forEach((l, i) => {
  const code = l.replace(/\/\/.*$/, "");
  if (/\.sort\s*\(/.test(code)) fail("A2/no-prioritization", `engine/gaps.js:${i + 1} sorts; the detector must emit gaps in detection order, never ranked`);
  if (/\b(importance|score|weight|rank|priority)\s*:/.test(code)) fail("A2/no-prioritization", `engine/gaps.js:${i + 1} writes a prioritization field onto a gap`);
});

// ---- Rule 9: corpus-index lists every module and data file ----
const indexPath = path.join(ROOT, "docs", "corpus-index.md");
const indexText = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, "utf8") : "";
const TRACK_DIRS = ["data", "engine", "view", "build"];
const tracked = TRACK_DIRS.flatMap((d) => walk(path.join(ROOT, d)));
tracked.push(path.join(ROOT, "linter.js"));
for (const f of tracked) {
  const rel = path.relative(ROOT, f);
  if (rel.endsWith("index.template.html")) continue; // the template is named via its includes
  if (!indexText.includes(rel)) fail("rule9", `corpus-index.md does not list ${rel}`);
}

// ---- report ----
console.log(`linter: ${checked} nodes checked across ${cases.length} case-families + ${Object.keys(PRIMITIVES).length} primitives.`);
if (!problems.length) {
  console.log("OK: no violations.");
  process.exit(0);
}
const byRule = {};
for (const p of problems) (byRule[p.rule] = byRule[p.rule] || []).push(p.msg);
console.error(`\n${problems.length} violation(s):`);
for (const r of Object.keys(byRule).sort()) {
  console.error(`\n[${r}]`);
  for (const msg of byRule[r]) console.error("  - " + msg);
}
process.exit(1);
