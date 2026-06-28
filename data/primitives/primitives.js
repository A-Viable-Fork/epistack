// Role: the floor. Named standard transformations, the coordinate basis. Each is a leaf
//   that cites its proof and is never re-derived in the engine (T1-2). Shared across the
//   DAG: a primitive has many parents, which is how branches "share a basis".
// Contract: exports { id -> primitive node } conforming to data/schema.js (kind primitive).
// Invariant: pure data. A primitive carries a citation and no children. If one grows an
//   implementation it has stopped being a primitive (exclusion reservoir).
"use strict";

const PRIMITIVES = {
  // -- population-pipeline floor (docs/population-pipeline.md) --
  "prim.estimator": {
    id: "prim.estimator",
    kind: "primitive",
    label: "Summary statistic",
    role: "compute a summary statistic from a sample",
    math: "T = f({x_i})",
    formal_status: "nl",
    children: [],
    citation: { source: "standard estimation theory", target: "textbook" },
    // shared leaf: parent of both pipeline stages (one node, two parents)
    parents: ["pipe.stage1", "pipe.stage2"],
  },
  "prim.exchangeability": {
    id: "prim.exchangeability",
    kind: "primitive",
    label: "Exchangeability / selection",
    role: "the condition that sample inclusion is independent of the estimand",
    math: "P(include | x) = const",
    formal_status: "nl",
    children: [],
    citation: { source: "exchangeability / selection-bias, standard", target: "textbook" },
    parents: ["pipe.stage1"],
  },
  "prim.sufficiency": {
    id: "prim.sufficiency",
    kind: "primitive",
    label: "Sufficiency",
    role: "the relation between a statistic and the information it retains about a parameter",
    math: "T sufficient for theta iff P(x | T, theta) = P(x | T)",
    formal_status: "nl",
    children: [],
    citation: { source: "sufficiency / Fisher-Neyman factorization", target: "textbook" },
    parents: ["pipe.stage2"],
  },

  // -- LHC Branch 2 floor (docs/lhc-cascade.md) --
  "prim.lorentz-boost": {
    id: "prim.lorentz-boost",
    kind: "primitive",
    label: "Lorentz boost",
    role: "convert a center-of-mass velocity to the lab frame",
    math: "beta_lab from the CoM-to-lab boost",
    formal_status: "typed",
    children: [],
    citation: { source: "Lorentz boost; standard relativistic kinematics", target: "Mathlib / PDG" },
    parents: ["lhc.N2.1"],
  },
  "prim.bethe-bloch": {
    id: "prim.bethe-bloch",
    kind: "primitive",
    label: "Bethe-Bloch stopping power",
    role: "electromagnetic energy loss per length for a charged projectile in matter",
    math: "-dE/dx (charged), Bethe-Bloch",
    formal_status: "typed",
    children: [],
    citation: { source: "Bethe-Bloch stopping-power integral", target: "PDG" },
    parents: ["lhc.N2.2"],
  },
  "prim.geometric-capture": {
    id: "prim.geometric-capture",
    kind: "primitive",
    label: "Geometric / gravitational capture",
    role: "energy loss by capture for a neutral object, far weaker, density-gated",
    math: "-dE/dx (neutral), geometric capture cross-section",
    formal_status: "nl",
    children: [],
    citation: { source: "geometric capture; gravitational stopping", target: "Giddings-Mangano arXiv:0806.3381" },
    parents: ["lhc.N2.2"],
  },
};

if (typeof module !== "undefined" && module.exports) module.exports = { PRIMITIVES };
