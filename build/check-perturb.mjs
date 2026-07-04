// Role: the perturbation oracle (Prompt 21, T1-3 discharge). Exercises the COMPUTED rule in
//   kernel/motions/perturb.js on the LHC case, verifies it REPRODUCES the authored consequence cascade
//   the data still carries (the verification fixture the hold required), and states the rule audit: the
//   propagation runs along support edges only, and no node collapses that the flip does not reach.
// Contract: `node build/check-perturb.mjs`. Exits 0 if every assertion holds, 1 with a report. A
//   mismatch between the computed cascade and an authored cascade STOPS and reports, because a mismatch
//   is information: either the rule is wrong or the authored cascade was.
// Invariant: read-only over the case data; the overlay mutates nothing and is deterministic. The audit
//   is asserted mechanically here, not merely stated in prose.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const { perturb, forwardEdges } = require("../kernel/motions/perturb.js");
const { CASE } = require("../corpora/lhc/lhc-cascade.js");

const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); };
const map = CASE.nodes;

// the authored cascades the computed rule must reproduce: read each perturbable assumption's authored
// perturb.cascade (kept as the verification fixture, docs/exclusion-reservoir.md).
function authoredOverlay(flipId) {
  const node = map[flipId];
  const states = {}, trails = [];
  if (!node || !node.perturb || !Array.isArray(node.perturb.cascade)) return { states, trails };
  let from = flipId;
  for (const step of node.perturb.cascade) {
    states[step.target] = step.new_state;
    trails.push({ from, to: step.target, new_state: step.new_state, consequence: step.consequence });
    from = step.target;
  }
  return { states, trails };
}
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// 1. the empty set returns the as-argued graph: an empty overlay.
{
  const o = perturb(map, []);
  ok(eq(o, { states: {}, trails: [] }), "perturb([]) returns the empty overlay (the as-argued graph)");
}

// 2. REPRODUCTION: the computed cascade matches the authored consequence cascade, on every perturbable
//    assumption in the case. This is the check the hold required; a mismatch is information.
const perturbable = Object.keys(map).filter((id) => map[id] && map[id].kind === "assumption" && map[id].perturb && Array.isArray(map[id].perturb.cascade));
ok(perturbable.length >= 1, "the case carries at least one authored cascade to reproduce");
for (const flipId of perturbable) {
  const computed = perturb(map, [flipId]);
  const authored = authoredOverlay(flipId);
  ok(eq(computed.states, authored.states), `computed states reproduce the authored cascade for ${flipId}`);
  ok(eq(computed.trails, authored.trails), `computed trail reproduces the authored cascade for ${flipId} (targets, states, order, and consequence)`);
  if (!eq(computed, authored)) {
    console.error(`  MISMATCH on ${flipId}:\n   computed: ${JSON.stringify(computed)}\n   authored: ${JSON.stringify(authored)}`);
  }
}

// 3. THE AUDIT, asserted mechanically.
// 3a. propagation along support edges only: every trail edge lies on the support-graph forward closure
//     of the flip (inputs / children / produced_by / outputs / tests), never on any other relation.
{
  const forward = forwardEdges(map);
  const reachable = (start) => { const seen = new Set([start]), q = [start]; while (q.length) { const c = q.shift(); for (const d of forward.get(c) || []) if (!seen.has(d)) { seen.add(d); q.push(d); } } return seen; };
  const o = perturb(map, ["lhc.assume.danger"]);
  const reach = reachable("lhc.assume.danger");
  ok(Object.keys(o.states).every((t) => reach.has(t)), "audit: every collapsed node is in the flip's support-graph forward closure (support edges only)");
  ok("lhc.prediction" in o.states && "lhc.comparison" in o.states, "audit: the flip reaches exactly the prediction and the comparison it grounds");
}
// 3b. no unfollowing collapse: a node the flip does not reach keeps its state. lhc.antecedent and
//     lhc.claim are not in the danger flip's closure, so they never appear in the overlay.
{
  const o = perturb(map, ["lhc.assume.danger"]);
  ok(!("lhc.antecedent" in o.states) && !("lhc.claim" in o.states), "audit: nodes outside the flip's closure do not collapse (no unfollowing collapse)");
}
// 3c. a non-perturbable assumption (its closure reaches no prediction/comparison) contributes nothing.
{
  const o = perturb(map, ["lhc.assume.neutral"]);
  ok(Object.keys(o.states).length === 0 && o.trails.length === 0, "audit: a flip whose closure reaches no state-bearing node contributes nothing");
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

console.log('computed perturb(["lhc.assume.danger"]) =\n' + JSON.stringify(perturb(map, ["lhc.assume.danger"]), null, 2));
if (fails.length) {
  console.error(`\n${fails.length} assertion(s) failed:`);
  for (const f of fails) console.error("  - " + f);
  process.exit(1);
}
console.log("\nOK: perturbation is COMPUTED from the support graph, reproduces the authored cascades, passes the audit, and is non-destructive and deterministic.");
process.exit(0);
