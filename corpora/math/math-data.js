// Role: the math kernel store. Holds the stage-zero axioms of the confidence order, entered as
//   declaration-claims at the kernel's foundation: the grade set, its partial order, and the
//   empirical/constitutive mode incomparability. These are the given primitives, the basis the later
//   lattice-law and recurrence claims will ground against; they are not yet the grounded results.
// Contract: exports STORE = { store_id, claims, links }. Pure data; imports nothing. Each claim is
//   { ref, kind, declared_grade, source_id, contributor_id, statement }.
// Invariant: the axioms are declarations, so the gate grades them at the constitutive floor by the
//   declaration ceiling; they carry no supporting structure, because a given basis is adopted, not
//   derived. Started from the scaffolder's empty skeleton and filled at stage zero.
"use strict";

const STORE = {
  store_id: "math",
  claims: [
    {
      ref: "ax.grade-set",
      kind: "declaration",
      declared_grade: "constitutive",
      source_id: "src:confidence-order",
      contributor_id: "author:epistack",
      statement: "AXIOM (the grade set): the confidence order has the named positions ungraded, asserted, supported, corroborated, and the settled tier (checked, independently-rechecked, constitutive), which collapse to the five-level working line ungraded, asserted, supported, corroborated, settled. This set is taken as given.",
    },
    {
      ref: "ax.order",
      kind: "declaration",
      declared_grade: "constitutive",
      source_id: "src:confidence-order",
      contributor_id: "author:epistack",
      statement: "AXIOM (the partial order): on the collapsed working line the order is total, ungraded < asserted < supported < corroborated < settled, and the settled tier is a branch above corroborated rather than a single point. This order is taken as given.",
    },
    {
      ref: "ax.mode-incomparability",
      kind: "declaration",
      declared_grade: "constitutive",
      source_id: "src:confidence-order",
      contributor_id: "author:epistack",
      statement: "AXIOM (mode incomparability): within the settled tier the empirical mode (checked < independently-rechecked) and the constitutive mode are in different modes and are incomparable, so comparing two settled positions of different mode is undefined. This incomparability is taken as given.",
    },
  ],
  links: [],
};

module.exports = { STORE };
