// Role: the body corpus, the empirical floor, sibling to data/primitives (the mathematical floor).
//   A body (Earth, the Sun, a white dwarf, a neutron star) is an entry whose populated properties
//   are measurement-terminal leaves: each has value + unit + citation, and grounds because the
//   world closed it, the way a math primitive grounds because a derivation legitimately stops.
// Contract: exports { BODIES }, body_id -> { id, name, properties }. A property has one of three
//   shapes: a populated leaf { value, unit, citation, terminal_type: "measurement" }; a stub
//   { sorry }; or a resolved cross-reference { regime_ref } to an authored node for a non-scalar
//   property. The engine flattens ONLY populated properties into leaves `body.<body>.<property>`;
//   a stub or a cross-reference never becomes a node, so it cannot accidentally ground.
// Invariant: pure data, no DOM. Values are one-significant-figure standard astrophysics
//   (placeholders). The dense-body density and radius citations are bound-load-bearing, flagged
//   for tightening to the source treatment. The LHC model cites these as its empirical floor.
"use strict";

// a standard order-of-magnitude astrophysical reference for the generic scalars.
const STD = { source: "standard astrophysical reference (order-of-magnitude)", target: "textbook" };
// the dense-body structural scalars that the survival bound leans on; tighten to the source.
const BOUND = {
  source: "white-dwarf / neutron-star structure (order-of-magnitude)",
  target: "textbook",
  note: "bound-load-bearing: tighten to the source treatment (Giddings-Mangano arXiv:0806.3381 regime)",
};
// the accretion regime, shared by the dense bodies. Formerly a sorry pointing at lhc.branch3#sorry;
// now that Branch 3 is authored to the floor from Giddings-Mangano (arXiv:0806.3381), it is a
// resolved cross-reference to the authored regime node (lhc.N3.1). It is not a scalar measurement
// (the dM/dt law is piecewise, not a single value), so it carries no value and no citation; it
// grounds nothing and fires no gap (no node body_refs it, and it is not a stub).
const ACCRETION_REGIME = {
  regime_ref: "lhc.N3.1",
  note:
    "the dM/dt law for a micro black hole in degenerate matter is regime-dependent and is authored to the floor at lhc.N3.1 (Giddings-Mangano arXiv:0806.3381), not a single scalar; this points the empirical floor at the authored regime.",
};

const BODIES = {
  earth: {
    id: "earth",
    name: "Earth",
    properties: {
      // foil: too sparse to stop a fast neutral black hole, so its survival is uninformative.
      mean_density: { value: 5e3, unit: "kg/m^3", citation: STD, terminal_type: "measurement" },
      radius: { value: 6e6, unit: "m", citation: STD, terminal_type: "measurement" },
    },
  },
  sun: {
    id: "sun",
    name: "the Sun",
    properties: {
      // bounds the charged case.
      mean_density: { value: 1e3, unit: "kg/m^3", citation: STD, terminal_type: "measurement" },
      radius: { value: 7e8, unit: "m", citation: STD, terminal_type: "measurement" },
      mass: { value: 2e30, unit: "kg", citation: STD, terminal_type: "measurement" },
      age: { value: 1.6e17, unit: "s", citation: STD, terminal_type: "measurement", note: "~5 Gyr" },
    },
  },
  "white-dwarf": {
    id: "white-dwarf",
    name: "a white dwarf",
    properties: {
      // density and radius are bound-load-bearing (core can reach 1e10-1e11 kg/m^3).
      mean_density: { value: 1e9, unit: "kg/m^3", citation: BOUND, terminal_type: "measurement" },
      radius: { value: 7e6, unit: "m", citation: BOUND, terminal_type: "measurement" },
      mass: { value: 1.2e30, unit: "kg", citation: STD, terminal_type: "measurement", note: "<= Chandrasekhar 2.8e30; integration ceiling" },
      age: { value: 3e17, unit: "s", citation: STD, terminal_type: "measurement", note: "up to ~10 Gyr" },
      // resolved cross-reference: the accretion regime, authored to the floor at lhc.N3.1.
      accretion_regime: ACCRETION_REGIME,
    },
  },
  "neutron-star": {
    id: "neutron-star",
    name: "a neutron star",
    properties: {
      // the densest long-lived body; density and radius are bound-load-bearing.
      mean_density: { value: 5e17, unit: "kg/m^3", citation: BOUND, terminal_type: "measurement" },
      radius: { value: 1.1e4, unit: "m", citation: BOUND, terminal_type: "measurement" },
      mass: { value: 2.8e30, unit: "kg", citation: STD, terminal_type: "measurement", note: "<= ~4e30; integration ceiling" },
      age: { value: 3e16, unit: "s", citation: STD, terminal_type: "measurement", note: "~1e9-1e10 yr" },
      accretion_regime: ACCRETION_REGIME,
    },
  },
};

if (typeof module !== "undefined" && module.exports) module.exports = { BODIES };
