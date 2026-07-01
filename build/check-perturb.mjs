// Role: the perturbation overlay's oracle. Exercises kernel/motions/perturb.js on the LHC case: the empty
//   overlay, the authored danger-flip cascade, a non-perturbable assumption, non-destructiveness,
//   and determinism. The overlay is read from authored data, never computed by a rule (T1-3).
// Contract: `node build/check-perturb.mjs`. Exits 0 if every assertion holds, 1 with a report.
// Invariant: read-only over the case data; asserts perturb mutates nothing and is deterministic.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const { perturb } = require("../kernel/motions/perturb.js");
const { CASE } = require("../corpora/lhc/lhc-cascade.js");

const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); };
const map = CASE.nodes; // perturb accepts a node map or a resolver

// 1. the empty set returns the as-argued graph: an empty overlay.
{
  const o = perturb(map, []);
  ok(JSON.stringify(o) === JSON.stringify({ states: {}, trails: [] }), "perturb([]) returns the empty overlay (the as-argued graph)");
}

// 2. flipping the danger assumption applies its authored cascade.
{
  const o = perturb(map, ["lhc.assume.danger"]);
  ok(o.states["lhc.prediction"] === "sound", "flip: lhc.prediction becomes sound");
  ok(o.states["lhc.comparison"] === "contradicted", "flip: lhc.comparison becomes contradicted (the survival comparison turns red)");
  ok(o.trails.length === 2, "flip: two authored consequence links");
  ok(/t_destroy/.test(o.trails[0].consequence) && /neutron star should already be gone/.test(o.trails[1].consequence),
    "flip: the two authored consequence strings, in order");
  ok(o.trails[0].from === "lhc.assume.danger" && o.trails[0].to === "lhc.prediction", "flip: the trail starts at the flipped assumption");
  ok(o.trails[1].from === "lhc.prediction" && o.trails[1].to === "lhc.comparison", "flip: the trail chains along the inference path to the comparison");
}

// 3. a non-perturbable assumption (no perturb block) contributes nothing.
{
  const o = perturb(map, ["lhc.assume.neutral"]);
  ok(Object.keys(o.states).length === 0 && o.trails.length === 0, "a non-perturbable assumption contributes nothing");
}

// 4. non-destructive: the base node's state in the sources is unchanged after a perturb call.
{
  const before = map["lhc.comparison"].state;
  perturb(map, ["lhc.assume.danger"]);
  ok(map["lhc.comparison"].state === before && before === "consistent", "non-destructive: the base node's state is unchanged");
}

// 5. deterministic: the same input (in any order) produces byte-identical output.
{
  const a = JSON.stringify(perturb(map, ["lhc.assume.danger", "lhc.assume.neutral"]));
  const b = JSON.stringify(perturb(map, ["lhc.assume.neutral", "lhc.assume.danger"]));
  ok(a === b, "deterministic: same input, byte-identical output across calls and orderings");
}

console.log('perturb(["lhc.assume.danger"]) =\n' + JSON.stringify(perturb(map, ["lhc.assume.danger"]), null, 2));
if (fails.length) {
  console.error(`\n${fails.length} assertion(s) failed:`);
  for (const f of fails) console.error("  - " + f);
  process.exit(1);
}
console.log("\nOK: the perturbation overlay is authored, non-destructive, and deterministic.");
process.exit(0);
