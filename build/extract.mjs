#!/usr/bin/env node
// Role: one-time migration tool. Slices knowledge-game.html into layered modules
//   (data/, engine/, view/) and writes view/index.template.html with include tokens.
// Contract: reads ../knowledge-game.html; writes the module files and the template.
//   Idempotent: re-running regenerates the same files from the original artifact.
// Invariant: it only MOVES bytes (and lifts two pure helpers + cleanJSON to module
//   scope); it does not rewrite logic. bundle.js must reproduce the artifact's behavior.
//
// This is kept in the repo so the extraction is auditable and repeatable, not a
// one-shot edit nobody can re-derive. The deliverable build is build/bundle.js.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const SRC = readFileSync(resolve(ROOT, "knowledge-game.html"), "utf8");

function write(rel, content) {
  const abs = resolve(ROOT, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content);
  console.log("wrote", rel, "(" + content.length + " bytes)");
}

// --- inner content of a <script ...id="ID">INNER</script> block ---
function scriptInner(id) {
  const re = new RegExp(
    '<script[^>]*\\bid="' + id + '"[^>]*>([\\s\\S]*?)</script>',
  );
  const m = SRC.match(re);
  if (!m) throw new Error("no script id=" + id);
  return m[1];
}

// --- the Nth <style>...</style> (0-indexed) ---
function styleBlock(n) {
  const re = /<style>([\s\S]*?)<\/style>/g;
  let m,
    i = 0;
  while ((m = re.exec(SRC))) {
    if (i === n) return m[1];
    i++;
  }
  throw new Error("no style block " + n);
}

// --- the Nth bare <script> (no attributes) ...</script> (0-indexed) ---
function bareScript(n) {
  const re = /<script>([\s\S]*?)<\/script>/g;
  let m,
    i = 0;
  while ((m = re.exec(SRC))) {
    if (i === n) return m[1];
    i++;
  }
  throw new Error("no bare script " + n);
}

const UMD = (names) =>
  `\nif (typeof module !== "undefined" && module.exports) module.exports = { ${names.join(", ")} };\n`;

// ===================== DATA =====================
write("data/graph.json", scriptInner("kg-graph").trim() + "\n");
write("data/compose-gate/compose_gate.py", scriptInner("cg-py"));
write("data/compose-gate/incumbent.json", scriptInner("cg-incumbent").trim() + "\n");
write("data/compose-gate/A.json", scriptInner("cg-A").trim() + "\n");
write("data/compose-gate/B.json", scriptInner("cg-B").trim() + "\n");
write("data/compose-gate/C.json", scriptInner("cg-C").trim() + "\n");
write("data/compose-gate/prompt.txt", scriptInner("cg-prompt"));
write("data/compose-gate/captured.txt", scriptInner("cg-captured"));

// ===================== STYLES =====================
write("view/styles/main.css", styleBlock(0).replace(/^\n/, "").replace(/\n$/, "") + "\n");
write("view/styles/compose-gate.css", styleBlock(1).replace(/^\n/, "").replace(/\n$/, "") + "\n");

// ===================== ENGINE + VIEW JS =====================
// The compose-gate runner (2nd-to-last bare script). cleanJSON is lifted out to an
// engine module (it is pure); the runner calls the now-global cleanJSON.
const cgRunner = bareScript(0);
const cleanRe = /\n\s*function cleanJSON\(raw\)\{[\s\S]*?\n\s{2}\}\n/;
const cleanMatch = cgRunner.match(cleanRe);
if (!cleanMatch) throw new Error("could not isolate cleanJSON in compose-gate runner");
const cleanFn = cleanMatch[0].replace(/^\n/, "").replace(/^\s{2}/gm, "");
write(
  "engine/compose-gate/clean-json.js",
  "// Role: strip code fences and surrounding prose from a model's JSON reply.\n" +
    "// Contract: cleanJSON(raw:string) -> string, the bare JSON array/object text.\n" +
    "// Invariant: pure and DOM-free; same input, same output, no side effects.\n" +
    cleanFn +
    UMD(["cleanJSON"]),
);
const cgRunnerOut = cgRunner.replace(cleanRe, "\n");
write(
  "view/compose-gate.js",
  "// Role: the in-browser compose-gate runner. Loads Pyodide on click and runs the\n" +
    "//   captured compose_gate.py over the incumbent plus the ticked contributions, with\n" +
    "//   a captured-output fallback when the network is unavailable.\n" +
    "// Contract: wires #cgBtn; reads the data blocks (#cg-*) and #cgPaste; writes #cgOut.\n" +
    "// Invariant: owns DOM only; the JSON cleanup is engine/compose-gate/clean-json.js.\n" +
    "//   The Pyodide CDN load is the one network fetch, gated behind a click (T0-6 holds:\n" +
    "//   the page opens and reaches interactive offline; the runner degrades gracefully).\n" +
    cgRunnerOut.replace(/^\n/, "").replace(/\n$/, "") +
    "\n",
);

// The main app script (last bare script).
let main = bareScript(1);

// Lift the two pure helpers (promotionFor, exportYaml) into engine/export.js.
function cutFunction(name) {
  // matches a top-level `function NAME(...) { ... }` ending at a line-start `}`
  const re = new RegExp("\\nfunction " + name + "\\([\\s\\S]*?\\n\\}\\n");
  const m = main.match(re);
  if (!m) throw new Error("could not cut function " + name);
  main = main.replace(re, "\n");
  return m[0].replace(/^\n/, "").replace(/\n$/, "");
}
const promotionFor = cutFunction("promotionFor");
const exportYaml = cutFunction("exportYaml");
write(
  "engine/export.js",
  "// Role: machine-readable export of a forked node and its typed citation edge.\n" +
    "// Contract: promotionFor(terminal)->string; exportYaml(node)->YAML string.\n" +
    "// Invariant: pure and DOM-free. The honest-status discipline (declared, never\n" +
    "//   verified) lives in the emitted YAML, not in any caller's DOM.\n" +
    promotionFor +
    "\n" +
    exportYaml +
    UMD(["promotionFor", "exportYaml"]),
);

// Lift the vocabulary-register DATA (TERMS, AUTOWRAP) into data/registers.js.
// Cut the register comment + the two const declarations, but leave the mutable view
// state `let REGISTER = "plain";` exactly where it sits in the view code.
const regStart = main.indexOf("/* ---- vocabulary registers");
const regEnd = main.indexOf("\nlet REGISTER"); // start of the line we keep in the view
if (regStart === -1 || regEnd === -1)
  throw new Error("could not locate the register data block");
const termsOnly = main.slice(regStart, regEnd).replace(/\n+$/, "") + "\n";
main = main.slice(0, regStart) + main.slice(regEnd + 1); // +1 drops the leading newline
write(
  "data/registers.js",
  "// Role: vocabulary registers. Each concept's label per register, plus the coinage\n" +
    "//   delta, so a register swap never flattens meaning. Pure data, no behavior.\n" +
    "// Contract: TERMS (id -> {plain,literature,src,delta}); AUTOWRAP (id -> [phrases]).\n" +
    "// Invariant: data only; the DOM walk that applies it lives in view/.\n" +
    termsOnly +
    UMD(["TERMS", "AUTOWRAP"]),
);

write(
  "view/app.js",
  "// Role: the single-page artifact. Renders graph nodes, the paper/overview/spec\n" +
    "//   views, the vocabulary register UI, the fork-this cell, and routing.\n" +
    "// Contract: reads data/graph.json (DOM block #kg-graph), data/registers.js,\n" +
    "//   and the engine helpers (promotionFor, exportYaml). Owns DOM, not data.\n" +
    "// Invariant: behavior-preserving migration of knowledge-game.html's main script.\n" +
    "//   DEPARTURE: the data graph is still loaded from a DOM <script> block; threading\n" +
    "//   it as an imported value is the schema-migration step (see docs/sorry-ledger.md G-C).\n" +
    main.replace(/^\n+/, "").replace(/\n+$/, "") +
    "\n",
);

// ===================== TEMPLATE =====================
// Rebuild the original document with include tokens in place of extracted content.
let tpl = SRC;
function tokenizeScript(id, token) {
  const re = new RegExp(
    '(<script[^>]*\\bid="' + id + '"[^>]*>)[\\s\\S]*?(</script>)',
  );
  tpl = tpl.replace(re, "$1@@INCLUDE:" + token + "@@$2");
}
tokenizeScript("kg-graph", "data/graph.json");
tokenizeScript("cg-py", "data/compose-gate/compose_gate.py");
tokenizeScript("cg-incumbent", "data/compose-gate/incumbent.json");
tokenizeScript("cg-A", "data/compose-gate/A.json");
tokenizeScript("cg-B", "data/compose-gate/B.json");
tokenizeScript("cg-C", "data/compose-gate/C.json");
tokenizeScript("cg-prompt", "data/compose-gate/prompt.txt");
tokenizeScript("cg-captured", "data/compose-gate/captured.txt");

// styles: first two <style> blocks become tokens (the inline .suff one stays inline)
let styleSeen = 0;
tpl = tpl.replace(/<style>[\s\S]*?<\/style>/g, (m) => {
  styleSeen++;
  if (styleSeen === 1) return "<style>@@INCLUDE:view/styles/main.css@@</style>";
  if (styleSeen === 2) return "<style>@@INCLUDE:view/styles/compose-gate.css@@</style>";
  return m;
});

// bare scripts: first (compose-gate runner) -> clean-json + compose-gate.js;
// second (main app) -> export + registers + app.js
let bareSeen = 0;
tpl = tpl.replace(/<script>[\s\S]*?<\/script>/g, (m) => {
  bareSeen++;
  if (bareSeen === 1)
    return (
      "<script>@@INCLUDE:engine/compose-gate/clean-json.js@@\n" +
      "@@INCLUDE:view/compose-gate.js@@</script>"
    );
  if (bareSeen === 2)
    return (
      "<script>@@INCLUDE:engine/export.js@@\n" +
      "@@INCLUDE:data/registers.js@@\n" +
      "@@INCLUDE:view/app.js@@</script>"
    );
  return m;
});

write("view/index.template.html", tpl);
console.log("\nextraction complete.");
