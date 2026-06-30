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
    presentation: { type: "primitive" },
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
    presentation: { type: "primitive" },
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
    presentation: { type: "primitive" },
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
    presentation: { type: "primitive" },
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
    presentation: { type: "primitive" },
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
    presentation: { type: "primitive" },
    label: "Geometric / gravitational capture",
    role: "energy loss by capture for a neutral object, far weaker, density-gated",
    math: "-dE/dx (neutral), geometric capture cross-section",
    formal_status: "nl",
    children: [],
    citation: { source: "geometric capture; gravitational stopping", target: "Giddings-Mangano arXiv:0806.3381" },
    parents: ["lhc.N2.2"],
  },

  // -- LHC Branch 1 floor (production; docs/lhc-cascade.md) --
  "prim.mandelstam-s": {
    id: "prim.mandelstam-s",
    kind: "primitive",
    presentation: { type: "primitive" },
    label: "Mandelstam s (fixed-target)",
    role: "the center-of-mass energy squared for a projectile on a stationary target",
    math: "s = 2 E_cr m_N + m_N^2 + m_cr^2  (fixed target)",
    formal_status: "typed",
    children: [],
    citation: { source: "Mandelstam invariants; fixed-target kinematics", target: "PDG" },
    parents: ["lhc.N1.1"],
  },
  "prim.cosmic-ray-flux": {
    id: "prim.cosmic-ray-flux",
    kind: "primitive",
    presentation: { type: "primitive" },
    label: "Cosmic-ray flux spectrum",
    role: "the measured differential flux of cosmic rays as a function of energy",
    math: "Phi(E) = dN / (dA dt dOmega dE)",
    formal_status: "nl",
    children: [],
    citation: { source: "cosmic-ray flux spectrum, measured", target: "PDG / Pierre Auger" },
    parents: ["lhc.N1.2"],
  },
  "prim.interaction-rate": {
    id: "prim.interaction-rate",
    kind: "primitive",
    presentation: { type: "primitive" },
    label: "Interaction-rate integral",
    role: "the count of interactions as flux times target number times exposure",
    math: "N = (area x time) x integral Phi(E) n_target dE",
    formal_status: "typed",
    children: [],
    citation: { source: "interaction rate = flux x number density x exposure", target: "textbook" },
    parents: ["lhc.N1.2"],
  },
  "prim.production-rate": {
    id: "prim.production-rate",
    kind: "primitive",
    presentation: { type: "primitive" },
    label: "Production count from cross-section",
    role: "events produced equal collisions times the production cross-section, the same model on any side",
    math: "N_BH = N_coll x sigma_BH",
    formal_status: "typed",
    children: [],
    citation: { source: "production count = luminosity (or collisions) x cross-section, standard", target: "PDG" },
    parents: ["lhc.N1.3"],
  },
};

if (typeof module !== "undefined" && module.exports) module.exports = { PRIMITIVES };
