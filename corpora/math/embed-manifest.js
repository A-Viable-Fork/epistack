// Role: the embed manifest for the math kernel (sixth exhibit, stage four guard). Names each code
//   operation the math kernel grounds, the claims that ground it, the tier those claims hold, the
//   oracle that establishes the correspondence, and a content hash of the operation's source at the
//   time it was grounded. The guard (build/check-math-embed.mjs) reads this to make the GROUNDED
//   code-to-kernel pointers mechanical: it recomputes each hash and reproves each pointer resolves.
// Contract: exports EMBED = { operations: [ { op, file, fn, claims, tier, oracle, hash } ] }. Pure
//   data; imports nothing. `claims` entries may be exact refs or `thm.<prefix>-*` wildcards; `tier`
//   is the grounded tier the gate must grade every named claim at; `oracle` is the checker_id the
//   claims' checking records must cite; `hash` is sha256Hex of the function's source (param-aware).
// Invariant: the hash pins freshness, not correspondence. Exhaustion (for the lattice operations) and
//   differential testing (for the recurrence operations) establish that the math describes the code;
//   the hash only certifies the code is unchanged since that establishment, so the grounding stays
//   true rather than only having been true when grounded. A stale hash names an operation whose
//   grounding no longer provably applies; it is not re-derived here, it is reported.
"use strict";

// the two oracles, by checker_id, matching the checking records in corpora/math/math-data.js.
const EXH = "oracle:check-math-exhaustion";
const DIFF = "oracle:check-math-differential";
const CERTO = "oracle:check-certificate";

const operations = [
  // ---- the grade-lattice operations: grounded at the constitutive proof-floor by exhaustion ----
  {
    op: "meet", file: "kernel/schema/confidence.mjs", fn: "meet",
    claims: ["thm.meet-*", "thm.absorption"], tier: "constitutive", oracle: EXH,
    hash: "31cf127f4b8b4c9ab58b004453d37159b15eba55338245611ee86c99ff8768be",
  },
  {
    op: "join", file: "kernel/schema/confidence.mjs", fn: "join",
    claims: ["thm.join-*", "thm.absorption"], tier: "constitutive", oracle: EXH,
    hash: "891bdb8051a1660f192de00af8c80faa247ca308c805fa7f2498f9b275861fef",
  },
  {
    op: "capByCeiling", file: "kernel/schema/confidence.mjs", fn: "capByCeiling",
    claims: ["thm.mode-incomparable-welldefined", "thm.lattice"], tier: "constitutive", oracle: EXH,
    hash: "d09bed84aa3ed799cbaa09535bde82f31147d384238ad2d660225f77c3db7d16",
  },

  // ---- the earned-grade operations: grounded at the checked tier by differential testing ----
  {
    op: "earnedGrade", file: "kernel/grounding/earned-grade.mjs", fn: "earnedGrade",
    claims: ["thm.earned-recurrence", "thm.settled-not-inherited", "thm.earned-linear", "thm.determinism"],
    tier: "checked", oracle: DIFF,
    hash: "32e08b53cfb591ee4edc05a7d3d7ce5358f187cb45042e8352fb4fdf8e974d71",
  },
  {
    op: "supportDelivery", file: "kernel/grounding/earned-grade.mjs", fn: "supportDelivery",
    claims: ["thm.ungrouped-singleton", "thm.earned-recurrence"], tier: "checked", oracle: DIFF,
    hash: "30be91b4ad1fc17731e18351bc428172676c448074b917af5dd157521d7ff3f7",
  },

  // ---- the crossing operation: grounded at the checked tier by differential testing ----
  {
    op: "compositeGrade", file: "kernel/composition/transfer.mjs", fn: "compositeGrade",
    claims: ["thm.crossing-min", "thm.untyped-floor"], tier: "checked", oracle: DIFF,
    hash: "ac5aa7f6152e5dd871fd2f1128066955aed06e69403c906fb6e65e4365b9fbe3",
  },

  // ---- the certificate seal: grounded at the checked tier by the seal oracle (CERT-2) ----
  {
    op: "certificateSeal", file: "kernel/gate/gate.mjs", fn: "certificateSeal",
    claims: ["thm.certificate-seals-bundle"], tier: "checked", oracle: CERTO,
    hash: "43b995b77af08dec8a1bf082a0530a1a4a968cf74927404506a2ae551ccac6de",
  },
];

// the code files scanned for GROUNDED pointers (the forward drift guard). transfer's and gate's
// pointers are here too, so a renamed or removed claim anywhere breaks the pointer, not only in the
// hashed functions. gate.mjs carries thm.cycle-guard at the guard line, a region rather than a whole
// function, so it is checked by pointer resolution here without a hash entry.
const codeFiles = [
  "kernel/schema/confidence.mjs",
  "kernel/grounding/earned-grade.mjs",
  "kernel/composition/transfer.mjs",
  "kernel/gate/gate.mjs",
];

const EMBED = { operations, codeFiles };

module.exports = { EMBED };
