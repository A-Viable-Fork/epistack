// Role: the typed-repository-map oracle. Assembles the node manifests, validates them, checks
//   coverage both ways, DERIVES the import edges from the real source, verifies every edge against
//   the trust-boundary invariants, checks the declared runtime flows for supporting evidence, and
//   emits the generated map (docs/repo-map.generated.json + docs/repo-map.md).
// Contract: `node build/check-map.mjs`. Exits 0 if everything holds, 1 with a named report. Writes
//   the two generated artifacts each run; role and contract are parsed from module head comments.
// Invariant: the trust boundary is a machine-checked property of the real import graph: no path
//   imports kernel from periphery except through api, and kernel imports nothing outside kernel.
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const S = require("./repo-map.schema.js");

const fails = [];
const fail = (m) => fails.push(m);
const rel = (p) => relative(ROOT, p).replace(/\\/g, "/");

// ---- assemble the node set from the six manifests ----
const MANIFESTS = ["kernel/_nodes.js", "api/_nodes.js", "corpora/_nodes.js", "periphery/_nodes.js", "build/_nodes.js", "docs/_nodes.js"];
const nodes = [];
for (const m of MANIFESTS) {
  const abs = join(ROOT, m);
  if (!existsSync(abs)) { fail(`manifest missing: ${m}`); continue; }
  const arr = require(abs);
  if (!Array.isArray(arr)) { fail(`${m}: must export an array of node records`); continue; }
  for (const n of arr) nodes.push(n);
}
const byPath = new Map();
for (const n of nodes) {
  for (const p of S.validateNode(n)) fail("schema: " + p);
  if (byPath.has(n.path)) fail(`duplicate node: ${n.path}`);
  byPath.set(n.path, n);
}

// ---- head-comment role/contract (the module's self-description) ----
function head(p) {
  const abs = join(ROOT, p);
  if (!existsSync(abs) || !/\.(js|mjs)$/.test(p)) return {};
  const lines = readFileSync(abs, "utf8").split("\n").slice(0, 16);
  const grab = (tag) => {
    const i = lines.findIndex((l) => l.includes("// " + tag + ":"));
    if (i < 0) return null;
    let s = lines[i].split(tag + ":")[1].trim();
    for (let j = i + 1; j < lines.length && /^\/\/\s+\S/.test(lines[j]) && !/^\/\/\s*(Role|Contract|Invariant):/.test(lines[j]); j++)
      s += " " + lines[j].replace(/^\/\/\s*/, "").trim();
    return s.replace(/\s+/g, " ").trim();
  };
  return { role: grab("Role"), contract: grab("Contract") };
}
for (const n of nodes) Object.assign(n, head(n.path)); // enrich for emit

// ---- coverage, both ways ----
function walk(dir, out = []) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return out;
  for (const e of readdirSync(abs, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p.replace(/\\/g, "/"));
  }
  return out;
}
// (a) every source file in the code layers corresponds to a node
const CODE_LAYERS = ["kernel", "api", "periphery", "build"];
const codeFiles = CODE_LAYERS.flatMap((d) => walk(d)).concat(["linter.js"]).filter((f) => /\.(js|mjs)$/.test(f) && !f.endsWith("_nodes.js"));
for (const f of codeFiles) if (!byPath.has(f)) fail(`coverage: source file has no node: ${f}`);
// (b) every node corresponds to a real file
for (const n of nodes) if (!existsSync(join(ROOT, n.path))) fail(`coverage: node has no file: ${n.path}`);

// ---- derive the import edges from the real source, verify the invariants ----
const IMPORT_RE = [/require\(\s*["']([^"']+)["']\s*\)/g, /import\s+[^"';]*?from\s*["']([^"']+)["']/g, /import\s*["']([^"']+)["']/g];
const edges = [];
const parseTargets = ["kernel", "api", "periphery", "corpora", "build"].flatMap((d) => walk(d)).concat(["linter.js"])
  .filter((f) => /\.(js|mjs)$/.test(f) && !f.endsWith("_nodes.js"));
for (const f of parseTargets) {
  // A referenced file that is not on disk (a broken clone, a stale checkout) must name itself,
  // not throw an ENOENT stack trace. linter.js is concatenated by name, so its absence lands here.
  if (!existsSync(join(ROOT, f))) {
    fail(`missing file: ${f} is referenced but not present on disk; the trust-boundary check is incomplete without it`);
    continue;
  }
  const src = readFileSync(join(ROOT, f), "utf8");
  const fromType = S.typeForPath(f);
  const seen = new Set();
  for (const reOrig of IMPORT_RE) {
    const re = new RegExp(reOrig.source, "g");
    let m;
    while ((m = re.exec(src))) {
      const spec = m[1];
      if (!spec.startsWith(".")) continue; // node: builtins, bare specifiers (jsdom): not repo edges
      const targetAbs = resolve(dirname(join(ROOT, f)), spec);
      const target = rel(targetAbs);
      if (seen.has(target)) continue;
      seen.add(target);
      const toType = S.typeForPath(target);
      if (!toType) continue;
      edges.push({ from: f, to: target, type: "imports", fromLayer: fromType, toLayer: toType });
      if (!existsSync(targetAbs) && !existsSync(targetAbs + ".js")) fail(`imports: ${f} -> ${spec} does not resolve to a file`);
      if (!S.importLegal(fromType, toType))
        fail(`TRUST BOUNDARY: ${fromType} '${f}' imports ${toType} '${target}' (illegal: ${fromType} may import ${JSON.stringify(S.IMPORT_RULES[fromType])})`);
    }
  }
}

// ---- declared runtime flows: plausibility ----
const text = (p) => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), "utf8") : "");
for (const n of nodes) {
  for (const f of n.flows || []) {
    edges.push({ from: n.path, to: f.to, type: f.type });
    if (!byPath.has(f.to)) fail(`flow: ${n.path} -${f.type}-> ${f.to} (target is not a node)`);
    const src = text(n.path);
    let ok = true, why = "";
    if (f.type === "reads-through-api") { ok = /createApi|\bapi\./.test(src) || /["'][^"']*api\//.test(src); why = "no createApi / api. reference"; }
    else if (f.type === "loads-corpus") { ok = /corpora\//.test(src); why = "no corpora/ path reference"; }
    else if (f.type === "gated-write") { ok = /\bsubmit\b|\bgate\b/i.test(src); why = "no submit/gate reference"; }
    else if (f.type === "checked-by") { ok = text(f.to).includes(n.path) || text(f.to).includes(n.path.split("/").pop()); why = `${f.to} does not reference ${n.path}`; }
    if (!ok) fail(`flow: ${n.path} -${f.type}-> ${f.to} unsupported (${why})`);
  }
}

// ---- emit the generated map ----
const importEdges = edges.filter((e) => e.type === "imports");
const flowEdges = edges.filter((e) => e.type !== "imports");
const generatedJson = {
  generated: "build/check-map.mjs -- do not edit; regenerate with `node build/check-map.mjs`",
  nodeCount: nodes.length,
  edgeCount: edges.length,
  nodes: nodes.map((n) => ({ path: n.path, type: n.type, group: n.group || null, role: n.role || null, contract: n.contract || null })),
  edges,
};
writeFileSync(join(ROOT, "docs/repo-map.generated.json"), JSON.stringify(generatedJson, null, 2) + "\n");

const md = [];
md.push("<!-- GENERATED by build/check-map.mjs -- do not edit; regenerate with `node build/check-map.mjs` -->");
md.push("# Repository Map\n");
md.push("A typed graph of the repository itself, derived from the real import graph and checked against the trust boundary (build/repo-map.schema.js). The one-way flow:\n");
md.push("```\nperiphery  ->  api  ->  kernel        corpora = pure data (no code imports out)\n   (fallible)   (membrane)  (trusted)     build -> any layer\n```\n");
md.push(`Nodes: ${nodes.length}. Import edges: ${importEdges.length}. Runtime flow edges: ${flowEdges.length}. All import edges satisfy the invariants (kernel<-kernel, api<-{kernel,api}, periphery never imports kernel directly).\n`);
md.push("## Import edges (what feeds what), by source layer\n");
for (const layer of ["kernel", "api", "periphery", "corpus", "build"]) {
  const es = importEdges.filter((e) => e.fromLayer === layer);
  if (!es.length) continue;
  md.push(`\n### ${layer}\n`);
  for (const e of es.sort((a, b) => (a.from + a.to).localeCompare(b.from + b.to)))
    md.push(`- \`${e.from}\` -> \`${e.to}\`  *(${e.fromLayer} -> ${e.toLayer})*`);
}
md.push("\n## Runtime flows (declared, not static imports)\n");
for (const e of flowEdges.sort((a, b) => (a.type + a.from).localeCompare(b.type + b.from)))
  md.push(`- \`${e.from}\` **${e.type}** \`${e.to}\``);
md.push("");
writeFileSync(join(ROOT, "docs/repo-map.md"), md.join("\n"));

// ---- report ----
console.log(`repo map: ${nodes.length} nodes, ${importEdges.length} import edges, ${flowEdges.length} flow edges.`);
if (fails.length) {
  console.error(`\n${fails.length} violation(s):`);
  for (const f of fails) console.error("  - " + f);
  process.exit(1);
}
console.log("OK: coverage holds both ways, every import edge satisfies the trust boundary, every flow is supported.");
console.log("wrote docs/repo-map.generated.json and docs/repo-map.md");
process.exit(0);
