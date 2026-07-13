// Role: the math kernel store. Holds the stage-zero axioms of the confidence order as declarations,
//   and the stage-two foundational properties the code computes as bare theorem and measurement
//   claims with no support, so the gate floors them: the honest before-state that stage three grounds.
//   The lattice laws are theorems (proof-floor, to be grounded by exhaustion); the recurrence,
//   contamination, and crossing properties are measurements (checked tier, to be grounded by
//   differential testing).
// Contract: exports STORE = { store_id, claims, links }. Pure data; imports nothing. Each claim is
//   { ref, kind, declared_grade, source_id, contributor_id, statement }.
// Invariant: no support links exist yet; that absence is the point. A bare claim resolves to the floor
//   its kind's rule gives it (a constitutive-kind theorem to constitutive, a measurement to asserted),
//   with support delivery bare, and stage three attaches the grounding that earns or justifies it.
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

    // ---- the grade lattice: theorems that ground later by exhaustion (proof-floor) ----
    {
      ref: "thm.meet-commutative",
      kind: "theorem",
      declared_grade: "constitutive",
      source_id: "src:exhaustion",
      contributor_id: "author:epistack",
      statement: "THEOREM (meet commutative): meet(a, b) = meet(b, a) for all grades a, b on the collapsed working line, where meet is the weakest-of, the lower of the two by collapsed rank (kernel/schema/confidence.mjs).",
    },
    {
      ref: "thm.meet-associative",
      kind: "theorem",
      declared_grade: "constitutive",
      source_id: "src:exhaustion",
      contributor_id: "author:epistack",
      statement: "THEOREM (meet associative): meet(meet(a, b), c) = meet(a, meet(b, c)) for all grades a, b, c on the collapsed working line.",
    },
    {
      ref: "thm.meet-idempotent",
      kind: "theorem",
      declared_grade: "constitutive",
      source_id: "src:exhaustion",
      contributor_id: "author:epistack",
      statement: "THEOREM (meet idempotent): meet(a, a) = a for every grade a on the collapsed working line.",
    },
    {
      ref: "thm.join-commutative",
      kind: "theorem",
      declared_grade: "constitutive",
      source_id: "src:exhaustion",
      contributor_id: "author:epistack",
      statement: "THEOREM (join commutative): join(a, b) = join(b, a) for all grades a, b, where join is the strongest-of, the higher of the two by collapsed rank (kernel/schema/confidence.mjs).",
    },
    {
      ref: "thm.join-associative",
      kind: "theorem",
      declared_grade: "constitutive",
      source_id: "src:exhaustion",
      contributor_id: "author:epistack",
      statement: "THEOREM (join associative): join(join(a, b), c) = join(a, join(b, c)) for all grades a, b, c.",
    },
    {
      ref: "thm.join-idempotent",
      kind: "theorem",
      declared_grade: "constitutive",
      source_id: "src:exhaustion",
      contributor_id: "author:epistack",
      statement: "THEOREM (join idempotent): join(a, a) = a for every grade a.",
    },
    {
      ref: "thm.absorption",
      kind: "theorem",
      declared_grade: "constitutive",
      source_id: "src:exhaustion",
      contributor_id: "author:epistack",
      statement: "THEOREM (absorption): meet(a, join(a, b)) = a and join(a, meet(a, b)) = a for all grades a, b, the absorption laws relating meet and join.",
    },
    {
      ref: "thm.lattice",
      kind: "theorem",
      declared_grade: "constitutive",
      source_id: "src:exhaustion",
      contributor_id: "author:epistack",
      statement: "THEOREM (lattice): the five-level collapsed grade set under meet and join is a lattice, the conjunction the commutativity, associativity, idempotence, and absorption laws establish by exhaustion over all pairs and triples.",
    },
    {
      ref: "thm.mode-incomparable-welldefined",
      kind: "theorem",
      declared_grade: "constitutive",
      source_id: "src:exhaustion",
      contributor_id: "author:epistack",
      statement: "THEOREM (meet and join well-defined under mode incomparability): meet and join collapse the settled tier to a single rank before comparing, so they are total on the collapsed line even though checked, independently-rechecked, and constitutive are incomparable across modes in the full order; the operations never produce a false ordering between two incomparable settled positions.",
    },

    // ---- the earned-grade recurrence: measurements that ground later by differential testing (checked) ----
    {
      ref: "thm.earned-recurrence",
      kind: "measurement",
      declared_grade: "asserted",
      source_id: "src:differential-test",
      contributor_id: "author:epistack",
      statement: "PROPERTY (earned-grade recurrence): the earned grade of a claim is, per support group, the weakest-of (meet) of each member's min(its own earned grade, its link's declared grade); then the strongest-of (join) across groups; lifted to corroborated when two groups with disjoint source footprints each deliver at least supported (the independence lift); combined with the claim's own basis (a distinct-party checking record or a constitutive kind) by the two-row rule; and capped by the kind's ceiling, as computed by kernel/grounding/earned-grade.mjs.",
    },
    {
      ref: "thm.earned-linear",
      kind: "measurement",
      declared_grade: "asserted",
      source_id: "src:differential-test",
      contributor_id: "author:epistack",
      statement: "PROPERTY (linear resolution): the earned grade is memoized per claim identity, so each claim resolves once and each support edge is followed once; a full resolution is linear in the support graph, order V plus E.",
    },
    {
      ref: "thm.ungrouped-singleton",
      kind: "measurement",
      declared_grade: "asserted",
      source_id: "src:differential-test",
      contributor_id: "author:epistack",
      statement: "PROPERTY (ungrouped supports are singletons): a support with no support_group is its own singleton group, an independent alternative, never collected with other ungrouped supports, so ungrouped supports combine strongest-of rather than weakest-of.",
    },
    {
      ref: "thm.cycle-guard",
      kind: "measurement",
      declared_grade: "asserted",
      source_id: "src:differential-test",
      contributor_id: "author:epistack",
      statement: "PROPERTY (cycle guard): a support cycle resolves the in-cycle claim to asserted, because the memoization sets the cache to asserted before recursing, so the earned-grade computation terminates deterministically on cyclic support.",
    },
    {
      ref: "thm.settled-not-inherited",
      kind: "measurement",
      declared_grade: "asserted",
      source_id: "src:differential-test",
      contributor_id: "author:epistack",
      statement: "PROPERTY (settledness not inherited): a claim resting on settled support delivers at most corroborated; only the claim's own basis, a distinct-party check or a constitutive kind, reaches the settled tier, and the kind ceiling enforces this.",
    },
    {
      ref: "thm.determinism",
      kind: "measurement",
      declared_grade: "asserted",
      source_id: "src:differential-test",
      contributor_id: "author:epistack",
      statement: "PROPERTY (determinism): the earned grade is a deterministic function of the graph, independent of the order supports or groups are visited, because meet and join are commutative and associative and the memoization is order-independent.",
    },

    // ---- contamination and crossing: measurements that ground later by differential testing (checked) ----
    {
      ref: "thm.contamination-monotone",
      kind: "measurement",
      declared_grade: "asserted",
      source_id: "src:differential-test",
      contributor_id: "author:epistack",
      statement: "PROPERTY (contamination monotone, single pass): contamination propagates monotonically along support edges by the weakest-of rule, so a contested support can only lower a claim's grade, never raise it, and the memoized resolution reaches the fixpoint in one pass on the acyclic support graph.",
    },
    {
      ref: "thm.crossing-min",
      kind: "measurement",
      declared_grade: "asserted",
      source_id: "src:differential-test",
      contributor_id: "author:epistack",
      statement: "PROPERTY (crossing min): a cross-kernel crossing grades a composite claim as min(ceiling, min over its necessary carried grades) under the meet (compositeGrade in kernel/composition/transfer.mjs), folding from the top of scale, so the cross-boundary grade is well-defined on the collapsed line even across settled grades incomparable within their modes; corroborating citations are visible but not folded.",
    },
    {
      ref: "thm.untyped-floor",
      kind: "measurement",
      declared_grade: "asserted",
      source_id: "src:differential-test",
      contributor_id: "author:epistack",
      statement: "PROPERTY (untyped floor, fork restores): a crossing into a kernel that does not pin the same type-hash arrives untyped and grounds nothing until an owned fork adopts the type locally, which restores standing; a same-hash crossing composes native and lossless.",
    },
  ],
  links: [],
};

module.exports = { STORE };
