// Role: the body corpus, the empirical floor, sibling to data/primitives (the mathematical floor)
//   and data/atlas. A body (Earth, the Sun, a white dwarf, a neutron star) is an entry whose
//   properties are measurement-terminal leaves: each populated property has a value, a unit, and a
//   citation, and it grounds the graph because the world closed it, the way a math primitive
//   grounds because a derivation legitimately stops.
// Contract: exports { BODIES }, a map body_id -> { id, name, properties }. A property maps a name
//   to either a populated leaf { value, unit, citation, terminal_type: "measurement", regime? } or
//   a declared-but-unpopulated stub { sorry: "<what would close it>" }. The engine flattens ONLY
//   populated properties into measurement leaves at id `body.<body_id>.<property>` (kind primitive,
//   terminal_type measurement). A stub never becomes a node, so it cannot accidentally ground.
// Invariant: pure data, no DOM. Values are one-significant-figure standard astrophysics, encoded as
//   given (placeholders, not refined here). Every populated property carries a citation so it
//   grounds. The dense-body density and radius citations are the bound-load-bearing ones, flagged
//   for tightening to the source treatment. No model node cites a body yet (consumer-wiring is a
//   later phase); these are the floor, populated on demand.
"use strict";

// a standard order-of-magnitude astrophysical reference for the generic scalars.
const STD = { source: "standard astrophysical reference (order-of-magnitude)", target: "textbook" };
// the dense-body structural scalars that the survival bound leans on; tighten to the source.
const BOUND = {
  source: "white-dwarf / neutron-star structure (order-of-magnitude)",
  target: "textbook",
  note: "bound-load-bearing: tighten to the source treatment (Giddings-Mangano arXiv:0806.3381 regime)",
};
// the accretion-regime stub, shared by the dense bodies. It points at the EXISTING branch-3 marker
// and mints no new ledger marker; because no node references it this PR, it fires no gap.
const ACCRETION_STUB = {
  sorry:
    "The accretion regime (the dM/dt law for a micro black hole in degenerate matter) is regime-dependent and must be read from Giddings-Mangano (arXiv:0806.3381), not reconstructed. Do not populate by guessing. Same open item as docs/sorry-ledger.md lhc.branch3#sorry.",
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
      // declared-but-unpopulated: the regime, deferred to Giddings-Mangano.
      accretion_regime: ACCRETION_STUB,
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
      accretion_regime: ACCRETION_STUB,
    },
  },
};

if (typeof module !== "undefined" && module.exports) module.exports = { BODIES };
