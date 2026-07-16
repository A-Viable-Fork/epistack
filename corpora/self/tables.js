// Role: the self-kernel reference tables. The self-kernel adopts the three shared common kinds it needs,
//   measurement for the protocol's structural invariants, declaration for its constitutive definitions
//   and its entrance stipulations, and forum for its evaluative theses, plus the sources its claims cite.
// Contract: exports KINDS, SOURCES, ADOPTED, ADOPTED_HASHES, TIME_LOCK. Pure data; imports nothing.
// Invariant: the adopted hashes are frozen from corpora/_shared/common-types.js; build/check-self.mjs
//   (and build/check-type-hash.mjs) verify they still match the shared subtree, so a stale pin is caught.
"use strict";

const KINDS = [
  { kind: "measurement", ceiling: "checked" },      // the invariant claims: properties of the running system
  { kind: "declaration", ceiling: "constitutive" }, // the constitutive definitions and the entrance stipulations
  { kind: "forum", ceiling: "corroborated" },        // the evaluative theses, at the forum floor, contestable
];

const SOURCES = [
  {
    source_id: "src:self-checks",
    source_class: "primary-measurement",
    description: "PLACEHOLDER CLASS (source-class decision, case b, as in the math kernel): the epistack oracle suite that verifies a property operationally (build/check-crossing.mjs, build/check-composition.mjs, build/check-fork-contest.mjs, build/check-gate.mjs, build/check-certificate.mjs, build/check-math-differential.mjs). The substrate menu has no software-test class here; primary-measurement is the closest honest existing class pending the maintainer decision",
  },
  {
    source_id: "src:math-kernel",
    source_class: "institutional-report",
    description: "The epistack math kernel (corpora/math/math-data.js): the theorems and measured properties that state formally why a structural invariant must hold. A self-kernel invariant claim cites a math theorem by ref for why the property holds and a check for that the code holds it",
  },
  {
    source_id: "src:vocabulary",
    source_class: "institutional-report",
    description: "The epistack vocabulary kernel (corpora/vocabulary/vocabulary.js): the definitional terms a constitutive self-claim adopts rather than re-authoring. A definitional self-claim with no vocabulary entry is a stop-and-report",
  },
  {
    source_id: "src:self-theses",
    source_class: "institutional-report",
    description: "The submission's evaluative theses about itself, the same register the submission overview's claims occupy: floor, contestable, awaiting a community's semantic judgment. Grounding is absent by design, not by omission",
  },
];

// the shared common kinds this kernel adopts, and the type-hashes pinned at adoption (frozen from
// corpora/_shared/common-types.js; the check verifies they still match the shared subtree).
const ADOPTED = ["measurement", "declaration", "forum"];
const ADOPTED_HASHES = {
  measurement: "2ed60a0154fef12d5d630f4a3f52d06686479c75aa57a44fd3b1488d581d3621",
  declaration: "354cba45e263a9788064fbf35d71d8506dd93ddf8c35b092ba606e5c2cc3b1bd",
  forum: "04c5a97678a1228065e6c36068b0b3dcc12ca52ad1285e6727f49754030007a1",
};

// time-lock and standing: the one clean free parameter, no grounding consequence.
const TIME_LOCK = { setting: "light" };

module.exports = { KINDS, SOURCES, ADOPTED, ADOPTED_HASHES, TIME_LOCK };
