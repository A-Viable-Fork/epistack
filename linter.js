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

// ---- load the data world: primitives + atlas + cases ----
const { PRIMITIVES } = require("./data/primitives/primitives.js");
const { ATLAS } = require("./data/atlas/atlas.js");
const CASE_FILES = ["./data/cases/population-pipeline.js", "./data/cases/lhc-cascade.js"];
const cases = CASE_FILES.map((f) => require(f).CASE);

// merged node map (every graph node, including shared primitives)
const nodeMap = Object.create(null);
for (const id of Object.keys(PRIMITIVES)) nodeMap[id] = PRIMITIVES[id];
const instances = [];
for (const c of cases) {
  for (const id of Object.keys(c.nodes || {})) {
    if (nodeMap[id]) fail("T0-1", `duplicate node id across data: ${id}`);
    nodeMap[id] = c.nodes[id];
  }
  for (const inst of c.instances || []) instances.push(inst);
}

// ---- Rule 1: required fields per kind (via schema, the single source of truth) ----
for (const id of Object.keys(nodeMap)) {
  checked++;
  const errs = SCHEMA.validateNode(nodeMap[id]);
  for (const e of errs) fail("rule1/T0-1", e);
}

// ---- Rule 2: atlas_ref / child / input / output references resolve ----
function refExists(id) {
  return Boolean(nodeMap[id]);
}
for (const id of Object.keys(nodeMap)) {
  const n = nodeMap[id];
  if (SCHEMA.hasMarker(n)) continue; // ledgered stub: its refs are part of the gap
  for (const c of n.children || []) if (!refExists(c)) fail("rule2/T0-4", `${id}: child '${c}' does not resolve`);
  for (const i of n.inputs || []) if (!refExists(i)) fail("rule2", `${id}: input '${i}' does not resolve`);
  for (const o of n.outputs || []) if (!refExists(o)) fail("rule2", `${id}: output '${o}' does not resolve`);
  if (n.atlas_ref && !ATLAS[n.atlas_ref]) fail("rule2", `${id}: atlas_ref '${n.atlas_ref}' does not resolve`);
}
for (const inst of instances) {
  if (inst.atlas_ref && !ATLAS[inst.atlas_ref]) fail("rule2", `instance ${inst.id}: atlas_ref '${inst.atlas_ref}' does not resolve`);
  if (inst.instantiates && !refExists(inst.instantiates)) fail("rule2", `instance ${inst.id}: instantiates '${inst.instantiates}' does not resolve`);
  if (inst.broken_node && !refExists(inst.broken_node)) fail("rule2", `instance ${inst.id}: broken_node '${inst.broken_node}' does not resolve`);
}
// atlas clones point at a real node or a real instance
const instanceIds = new Set(instances.map((i) => i.id));
const refOrInstance = (id) => refExists(id) || instanceIds.has(id);
for (const e of Object.values(ATLAS)) {
  for (const cl of e.clones || []) if (!refOrInstance(cl.node_id)) fail("rule2", `atlas ${e.id}: clone node_id '${cl.node_id}' does not resolve`);
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
