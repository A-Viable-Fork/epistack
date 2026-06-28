// Role: the DOWN motion. Zoom into a node's interior composition (sequence / conjunction
//   / guarded disjunction), terminating at primitive leaves. Walks `children` edges.
// Contract: (planned) decompose(map, id) -> the one-level-down view of a node.
// Invariant: DOM-free; pure over the node map (T0-2, T1-1, T1-5).
//
// SORRY: seam only at this checkpoint. The decompose UI is v1 (built on the population
//   pipeline first); engine traversal helpers live in engine/graph.js until then. Do not
//   build the v1 motion here yet (task non-goal). See docs/architecture-spec.md section 8.
"use strict";

if (typeof module !== "undefined" && module.exports) module.exports = {};
