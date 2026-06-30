// Role: the ALONG motion. Apply a flipped-assumption set as a NON-DESTRUCTIVE overlay, reading the
//   authored consequence cascade each assumption carries and propagating it along the inference
//   path to the comparison nodes. Authored data, not a computed rule (T1-3, exclusion reservoir).
// Contract: perturb(resolveOrMap, flippedSet) -> overlay { states, trails }. resolveOrMap is the id
//   resolver (or a node map); flippedSet is an iterable of assumption ids. Pure and DOM-free.
// Invariant: the overlay is computed and returned, never a mutation of the graph (T0-3). A
//   consequence is a recorded fact read from perturb.cascade, never derived by a propagation rule;
//   the computed engine stays excluded until authored consequences for every case + a rule audit
//   exist (T1-3, docs/exclusion-reservoir.md). This fills the authored-overlay application only.
"use strict";

// perturb: read each flipped assumption's authored cascade into an overlay.
//   states  - { [target]: new_state }, the as-flipped state of each consequence node.
//   trails  - the ordered consequence chain per flip, [{ from, to, new_state, consequence }, ...],
//             chained so a client can highlight the inference path (assumption -> ... -> comparison).
//   perturb([]) -> { states: {}, trails: [] }: the as-argued graph, untouched.
//   Deterministic: ids are sorted, and states is last-write-wins on that sorted traversal (the
//   documented conflict rule; v1 has a single perturbable assumption, so it never triggers).
function perturb(resolveOrMap, flippedSet) {
  const resolve = typeof resolveOrMap === "function" ? resolveOrMap : (id) => (resolveOrMap || {})[id];
  const ids = Array.from(flippedSet || []).filter((x) => typeof x === "string").sort();
  const states = {};
  const trails = [];
  for (const id of ids) {
    const node = resolve(id);
    if (!node || node.kind !== "assumption") continue; // only an assumption flips
    const p = node.perturb;
    if (!p || !p.flips || !Array.isArray(p.cascade)) continue; // and only an authored, flipping one
    let from = id; // the flip originates at the assumption; each link chains to the next target
    for (const step of p.cascade) {
      if (!step || typeof step.target !== "string") continue;
      states[step.target] = step.new_state; // last-write-wins on the sorted traversal
      trails.push({ from: from, to: step.target, new_state: step.new_state, consequence: step.consequence });
      from = step.target;
    }
  }
  return { states: states, trails: trails };
}

if (typeof module !== "undefined" && module.exports) module.exports = { perturb };
