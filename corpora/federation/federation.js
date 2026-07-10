// Role: the bottom-up federation over the four sovereign members (lhc, covid, eggs, lineage), as pure
//   data. It names the demonstration crossings on real cross-kernel content and the composite weighings
//   that select among members and ground by citing across the untyped boundary. No member schema lives
//   here; each member keeps its own kind table and pins its own type-hashes. This is the federation over
//   the cases, never a merge of them.
// Contract: exports FEDERATION = { store_id, crossings, weighings }. Pure data; imports nothing.
//   crossings and weighings name member claims by their local ref; build/bottomup-build.mjs resolves
//   each ref to an identity through that member's own refId.
// Invariant: a crossing composes native only when both members pin the same type-hash for the crossed
//   kind; a crossing of a kind the target did not adopt arrives untyped and grounds nothing until forked.
//   The data states which behavior each crossing exercises; the kernel and the check enforce it.
"use strict";

const FEDERATION = {
  store_id: "F-bottomup",

  // Step 2: real cross-kernel crossings, one of each behavior, sourced from lineage because its claims
  // are literally about the other kernels' subjects.
  crossings: [
    {
      id: "x-native",
      from_store: "lineage", from_claim: "sci.fake-independence", kind: "forum",
      into_store: "lhc", expect: "native",
      note: "lineage's reified-independence reading crosses into the lhc kernel it is literally about (the replication crisis is the LHC shared-dependency reprice seen in science); both members pin the common forum hash, so it composes native and lossless",
    },
    {
      id: "x-untyped",
      from_store: "lineage", from_claim: "conj.novelty", kind: "declaration",
      into_store: "covid", expect: "untyped", fork_into: "covid",
      note: "lineage's novelty declaration crosses into covid, which pins no declaration hash, so it arrives untyped and grounds nothing until covid forks it into a local kind",
    },
  ],

  // Step 3.4: composite weighings that federate across the members. Each selects the members relevant to
  // its question and grounds by citing their claims across the boundary. Together they select all four.
  weighings: [
    {
      id: "w-reprice",
      statement: "the shared-dependency reprice is not physics-specific: the LHC safety case and the replication crisis are one pattern, an apparent independence that reifies to a single shared dependency",
      cites: [
        { store: "lhc", claim: "robust", role: "necessary" },
        { store: "lineage", claim: "sci.fake-independence", role: "necessary" },
      ],
      weighting: { kind: "priority", ordering: ["lhc:robust", "lineage:sci.fake-independence"], rationale: "the physics leg is the worked reprice; the science leg names the same structure, so the physics claim leads and the lineage reading corroborates the recurrence" },
    },
    {
      id: "w-contested",
      statement: "contested knowledge resolves to a named prior in more than one domain: the covid origins verdict turns on a spillover reading and the eggs weighing turns on a discount-rate choice, the same crux-to-prior structure across two members",
      cites: [
        { store: "covid", claim: "int.two-spillovers", role: "necessary" },
        { store: "eggs", claim: "ec.discount", role: "necessary" },
      ],
      weighting: { kind: "priority", ordering: ["covid:int.two-spillovers", "eggs:ec.discount"], rationale: "each member contributes one contested claim whose standing turns on a prior; neither dominates, the weighing records that the structure recurs" },
    },
  ],
};

module.exports = { FEDERATION };
