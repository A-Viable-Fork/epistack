// Role: the math kernel store. The stage-zero axioms of the confidence order as declarations, and the
//   foundational properties the code computes as claims. At stage three each property carries its
//   grounding: the lattice-law theorems rest on the axioms and cite the exhaustion oracle (a proof),
//   holding the constitutive proof-floor; the recurrence, contamination, and crossing measurements cite
//   the differential-test harness and are lifted to the checked tier by the gate.
// Contract: exports STORE = { store_id, claims, links }. Pure data; imports nothing. Each claim is
//   { ref, kind, declared_grade, source_id, contributor_id, statement, checking_records? }; each link is
//   { link_kind, from, to, support_group, source_id, contributor_id, declared_grade }.
// Invariant: no grade is raised by hand. The declared grade is what the gate earns from the attached
//   support and checking records; without the exhaustion proof or the differential-test check the same
//   claim would floor, so the lift is the gate's computation, not an edit. The recurrence measurements
//   sit at checked because testing reaches checked; the proof-floor they admit is a characterized gap
//   in docs/sorry-ledger.md, closed by a formal proof.
"use strict";

// the two checking records, the independent evidence the gate reads. Exhaustion is a proof (a
// derivation audit over the whole finite domain); differential testing replicates the recurrence over
// random graphs. Both are distinct-party: the oracle is not the claimant.
const EXH = { checker_id: "oracle:check-math-exhaustion", method_class: "derivation-audit", method: "exhaustive enumeration of meet and join over the whole collapsed grade line", checked_at_state: "math@stage-three", outcome: "confirms", independence: "distinct-party" };
const DIFF = { checker_id: "oracle:check-math-differential", method_class: "replication", method: "differential testing: the code versus the extracted recurrence over random support graphs", checked_at_state: "math@stage-three", outcome: "confirms", independence: "distinct-party" };
const CERT = { checker_id: "oracle:check-certificate", method_class: "replication", method: "differential testing of the seal: perturb each bundled part and confirm the certificate hash moves, and confirm an identical certified assembly reproduces the hash", checked_at_state: "math@cert", outcome: "confirms", independence: "distinct-party" };

const claims = [
  // ---- stage zero: the axioms, declarations at the constitutive floor (the given basis) ----
  {
    ref: "ax.grade-set", kind: "declaration", declared_grade: "constitutive", source_id: "src:confidence-order", contributor_id: "author:epistack",
    statement: "AXIOM (the grade set): the confidence order has the named positions ungraded, asserted, supported, corroborated, and the settled tier (checked, independently-rechecked, constitutive), which collapse to the five-level working line ungraded, asserted, supported, corroborated, settled. This set is taken as given.",
  },
  {
    ref: "ax.order", kind: "declaration", declared_grade: "constitutive", source_id: "src:confidence-order", contributor_id: "author:epistack",
    statement: "AXIOM (the partial order): on the collapsed working line the order is total, ungraded < asserted < supported < corroborated < settled, and the settled tier is a branch above corroborated rather than a single point. This order is taken as given.",
  },
  {
    ref: "ax.mode-incomparability", kind: "declaration", declared_grade: "constitutive", source_id: "src:confidence-order", contributor_id: "author:epistack",
    statement: "AXIOM (mode incomparability): within the settled tier the empirical mode (checked < independently-rechecked) and the constitutive mode are in different modes and are incomparable, so comparing two settled positions of different mode is undefined. This incomparability is taken as given.",
  },

  // ---- the grade lattice: theorems grounded at the constitutive proof-floor by exhaustion ----
  { ref: "thm.meet-commutative", kind: "theorem", declared_grade: "constitutive", source_id: "src:exhaustion", contributor_id: "author:epistack", checking_records: [EXH],
    statement: "THEOREM (meet commutative): meet(a, b) = meet(b, a) for all grades a, b on the collapsed working line, where meet is the weakest-of, the lower of the two by collapsed rank (kernel/schema/confidence.mjs)." },
  { ref: "thm.meet-associative", kind: "theorem", declared_grade: "constitutive", source_id: "src:exhaustion", contributor_id: "author:epistack", checking_records: [EXH],
    statement: "THEOREM (meet associative): meet(meet(a, b), c) = meet(a, meet(b, c)) for all grades a, b, c on the collapsed working line." },
  { ref: "thm.meet-idempotent", kind: "theorem", declared_grade: "constitutive", source_id: "src:exhaustion", contributor_id: "author:epistack", checking_records: [EXH],
    statement: "THEOREM (meet idempotent): meet(a, a) = a for every grade a on the collapsed working line." },
  { ref: "thm.join-commutative", kind: "theorem", declared_grade: "constitutive", source_id: "src:exhaustion", contributor_id: "author:epistack", checking_records: [EXH],
    statement: "THEOREM (join commutative): join(a, b) = join(b, a) for all grades a, b, where join is the strongest-of, the higher of the two by collapsed rank (kernel/schema/confidence.mjs)." },
  { ref: "thm.join-associative", kind: "theorem", declared_grade: "constitutive", source_id: "src:exhaustion", contributor_id: "author:epistack", checking_records: [EXH],
    statement: "THEOREM (join associative): join(join(a, b), c) = join(a, join(b, c)) for all grades a, b, c." },
  { ref: "thm.join-idempotent", kind: "theorem", declared_grade: "constitutive", source_id: "src:exhaustion", contributor_id: "author:epistack", checking_records: [EXH],
    statement: "THEOREM (join idempotent): join(a, a) = a for every grade a." },
  { ref: "thm.absorption", kind: "theorem", declared_grade: "constitutive", source_id: "src:exhaustion", contributor_id: "author:epistack", checking_records: [EXH],
    statement: "THEOREM (absorption): meet(a, join(a, b)) = a and join(a, meet(a, b)) = a for all grades a, b, the absorption laws relating meet and join." },
  { ref: "thm.lattice", kind: "theorem", declared_grade: "constitutive", source_id: "src:exhaustion", contributor_id: "author:epistack", checking_records: [EXH],
    statement: "THEOREM (lattice): the five-level collapsed grade set under meet and join is a lattice, the conjunction the commutativity, associativity, idempotence, and absorption laws establish by exhaustion over all pairs and triples." },
  { ref: "thm.mode-incomparable-welldefined", kind: "theorem", declared_grade: "constitutive", source_id: "src:exhaustion", contributor_id: "author:epistack", checking_records: [EXH],
    statement: "THEOREM (meet and join well-defined under mode incomparability): meet and join collapse the settled tier to a single rank before comparing, so they are total on the collapsed line even though checked, independently-rechecked, and constitutive are incomparable across modes in the full order; the operations never produce a false ordering between two incomparable settled positions." },

  // ---- the earned-grade recurrence: measurements grounded at the checked tier by differential testing ----
  { ref: "thm.earned-recurrence", kind: "measurement", declared_grade: "checked", source_id: "src:differential-test", contributor_id: "author:epistack", checking_records: [DIFF],
    statement: "PROPERTY (earned-grade recurrence): the earned grade of a claim is, per support group, the weakest-of (meet) of each member's min(its own earned grade, its link's declared grade); then the strongest-of (join) across groups; lifted to corroborated when two groups with disjoint source footprints each deliver at least supported (the independence lift); combined with the claim's own basis (a distinct-party checking record or a constitutive kind) by the two-row rule; and capped by the kind's ceiling, as computed by kernel/grounding/earned-grade.mjs." },
  { ref: "thm.earned-linear", kind: "measurement", declared_grade: "checked", source_id: "src:differential-test", contributor_id: "author:epistack", checking_records: [DIFF],
    statement: "PROPERTY (linear resolution): the earned grade is memoized per claim identity, so each claim resolves once and each support edge is followed once; a full resolution is linear in the support graph, order V plus E." },
  { ref: "thm.ungrouped-singleton", kind: "measurement", declared_grade: "checked", source_id: "src:differential-test", contributor_id: "author:epistack", checking_records: [DIFF],
    statement: "PROPERTY (ungrouped supports are singletons): a support with no support_group is its own singleton group, an independent alternative, never collected with other ungrouped supports, so ungrouped supports combine strongest-of rather than weakest-of." },
  { ref: "thm.cycle-guard", kind: "measurement", declared_grade: "checked", source_id: "src:differential-test", contributor_id: "author:epistack", checking_records: [DIFF],
    statement: "PROPERTY (cycle guard): a support cycle resolves the in-cycle claim to asserted, because the memoization sets the cache to asserted before recursing, so the earned-grade computation terminates deterministically on cyclic support." },
  { ref: "thm.settled-not-inherited", kind: "measurement", declared_grade: "checked", source_id: "src:differential-test", contributor_id: "author:epistack", checking_records: [DIFF],
    statement: "PROPERTY (settledness not inherited): a claim resting on settled support delivers at most corroborated; only the claim's own basis, a distinct-party check or a constitutive kind, reaches the settled tier, and the kind ceiling enforces this." },
  { ref: "thm.determinism", kind: "measurement", declared_grade: "checked", source_id: "src:differential-test", contributor_id: "author:epistack", checking_records: [DIFF],
    statement: "PROPERTY (determinism): the earned grade is a deterministic function of the graph, independent of the order supports or groups are visited, because meet and join are commutative and associative and the memoization is order-independent." },
  { ref: "thm.contamination-monotone", kind: "measurement", declared_grade: "checked", source_id: "src:differential-test", contributor_id: "author:epistack", checking_records: [DIFF],
    statement: "PROPERTY (contamination monotone, single pass): contamination propagates monotonically along support edges by the weakest-of rule, so a contested support can only lower a claim's grade, never raise it, and the memoized resolution reaches the fixpoint in one pass on the acyclic support graph." },
  { ref: "thm.crossing-min", kind: "measurement", declared_grade: "checked", source_id: "src:differential-test", contributor_id: "author:epistack", checking_records: [DIFF],
    statement: "PROPERTY (crossing min): a cross-kernel crossing grades a composite claim as min(ceiling, min over its necessary carried grades) under the meet (compositeGrade in kernel/composition/transfer.mjs), folding from the top of scale, so the cross-boundary grade is well-defined on the collapsed line even across settled grades incomparable within their modes; corroborating citations are visible but not folded." },
  { ref: "thm.untyped-floor", kind: "measurement", declared_grade: "checked", source_id: "src:differential-test", contributor_id: "author:epistack", checking_records: [DIFF],
    statement: "PROPERTY (untyped floor, fork restores): a crossing into a kernel that does not pin the same type-hash arrives untyped and grounds nothing until an owned fork adopts the type locally, which restores standing; a same-hash crossing composes native and lossless." },

  // ---- the certificate seal: a measurement grounded at the checked tier by the seal oracle (CERT-2) ----
  { ref: "thm.certificate-seals-bundle", kind: "measurement", declared_grade: "checked", source_id: "src:differential-test", contributor_id: "author:epistack", checking_records: [CERT],
    statement: "PROPERTY (certificate seals the bundle): the gate receipt's certificate hash is a function of the sealed certificate bundle (the accepted claim identities and their grades, the binding table, the checking records in play, the store state verified against, and the ruleset version, schema version, and contribution hash), changing if and only if a bundled part changes and reproducing byte-for-byte for an identical certified assembly; the excluded volatile fields (findings, the decision label, the closures and matches) do not affect it. Computed downstream of grounding by certificateSeal in kernel/gate/gate.mjs, so it adds no cost to the earned-grade recurrence and its resolution stays linear." },
];

// the support the exhaustion proof rests on: each lattice theorem is grounded by the axioms, one
// co-necessary basis group per theorem. The lattice laws rest on the grade set and its order; the
// mode-incomparability theorem rests additionally on the mode axiom. The link's own grade carries the
// constitutive basis, and the checking record above cites the exhaustion oracle as the proof.
const S = (from, to) => ({ link_kind: "supports", from, to, support_group: "basis", source_id: "src:exhaustion", contributor_id: "author:epistack", declared_grade: "constitutive" });
const latticeLaws = ["thm.meet-commutative", "thm.meet-associative", "thm.meet-idempotent", "thm.join-commutative", "thm.join-associative", "thm.join-idempotent", "thm.absorption", "thm.lattice"];
const links = [];
for (const to of latticeLaws) { links.push(S("ax.grade-set", to)); links.push(S("ax.order", to)); }
links.push(S("ax.grade-set", "thm.mode-incomparable-welldefined"));
links.push(S("ax.order", "thm.mode-incomparable-welldefined"));
links.push(S("ax.mode-incomparability", "thm.mode-incomparable-welldefined"));

const STORE = { store_id: "math", claims, links };

module.exports = { STORE };
