// Role: the ALONG motion. Apply a flipped-assumption set as a non-destructive overlay,
//   propagating authored consequences along inference edges to the comparison nodes.
// Contract: (planned) perturb(map, flippedSet) -> overlay { states, trails }.
// Invariant: DOM-free and pure. The overlay is computed, never a mutation of the graph
//   (T0-3). Perturbation is AUTHORED data in v1, not computed (T1-3, exclusion reservoir).
//
// SORRY: seam only at this checkpoint. Authored-overlay rendering is v3. Do not build the
//   computed propagation engine (excluded until authored consequences + a rule audit exist).
"use strict";

if (typeof module !== "undefined" && module.exports) module.exports = {};
