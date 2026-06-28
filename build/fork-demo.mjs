#!/usr/bin/env node
// Role: demonstrate the canonical fork (docs/components-and-forking.md). pipe.stage1.plain
//   forks pipe.stage1 and overrides only explain.intuition; everything else is inherited
//   live. This prints the diff between resolving the parent and resolving the fork.
// Contract: `node build/fork-demo.mjs`. Reads the data + resolver; prints the changed and
//   inherited fields. No writes, no network.
// Invariant: pointing the build at the fork changes exactly one field; the proof is the diff.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const { PRIMITIVES } = require("../data/primitives/primitives.js");
const { ATLAS } = require("../data/atlas/atlas.js");
const { VISUALS } = require("../data/components/visuals.js");
const { CARD_LAYOUTS } = require("../data/components/cards.js");
const { FORKS } = require("../data/forks/forks.js");
const { CASE } = require("../data/cases/population-pipeline.js");
const { buildRegistry } = require("../engine/registry.js");
const { makeResolver } = require("../engine/resolve.js");

const registry = buildRegistry({
  primitives: PRIMITIVES,
  atlas: ATLAS,
  cases: [CASE],
  components: Object.assign({}, VISUALS, CARD_LAYOUTS),
  forks: FORKS,
});
const resolve = makeResolver(registry);

const parent = resolve("pipe.stage1");
const fork = resolve("pipe.stage1.plain");

// compare the two resolved objects field by field
function flat(obj, prefix, out) {
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    const key = prefix ? prefix + "." + k : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flat(v, key, out);
    else out[key] = Array.isArray(v) ? JSON.stringify(v) : String(v);
  }
  return out;
}
const a = flat(parent, "", {});
const b = flat(fork, "", {});
const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort();

const changed = [];
const inherited = [];
for (const k of keys) {
  if (a[k] !== b[k]) changed.push(k);
  else inherited.push(k);
}

console.log("fork: pipe.stage1.plain  (forks pipe.stage1, live)\n");
console.log("CHANGED (" + changed.length + "):");
for (const k of changed) {
  console.log("  " + k);
  console.log("    parent: " + (a[k] || "(absent)").slice(0, 80) + (a[k] && a[k].length > 80 ? "..." : ""));
  console.log("    fork:   " + (b[k] || "(absent)").slice(0, 80) + (b[k] && b[k].length > 80 ? "..." : ""));
}
console.log("\nINHERITED LIVE (" + inherited.length + " fields), including:");
for (const k of ["label", "role", "math.tex", "math.plain", "children", "visual.component", "explain.hook", "explain.in_words"]) {
  if (b[k] !== undefined) console.log("  " + k + " = " + b[k].slice(0, 70));
}

const ok = changed.length === 1 && changed[0] === "explain.intuition";
console.log("\n" + (ok ? "OK: the fork changes exactly one field, explain.intuition." : "UNEXPECTED: changed fields = " + changed.join(", ")));
process.exit(ok ? 0 : 1);
