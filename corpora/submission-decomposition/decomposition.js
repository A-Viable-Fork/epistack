// Role: the decomposition of the judge-facing spine into typed claims of the competition community.
//   Each entry names a verbatim span of a scoped document and the assertion it carries, typed by
//   register: mechanical (what the repositories do, evidence a named check), evaluative (about the
//   world and the argument, bare at the floor), or constitutive (a definition, referenced to an
//   existing vocabulary claim, never re-authored). Dependence links carry each claim's use of a
//   defined term to that term's vocabulary claim, so a definition's blast radius is computable.
// Contract: exports DOCS (id -> repo-relative path) and CLAIMS (the decomposition rows). Pure data;
//   imports nothing. build/decomposition-build.mjs computes offsets, hashes, records, bundles, and
//   anchor maps from this plus the documents; build/check-decomposition.mjs verifies the whole.
// Invariant: every `span` is a verbatim substring of its document at the recorded content hash; a
//   claim is the smallest span that can be independently true, false, or supported; rhetoric and
//   transitions stay unclaimed. Mechanical spans name only epistack checks that exist and run green;
//   app-side mechanical spans (Knowledge-Game checks) are queued in the phasing ledger, not typed here.
"use strict";

// the scoped documents, at their current pinned text.
const DOCS = {
  "submission-overview": "docs/submission-overview.md",
  "the-climb-of-synthesis": "docs/the-climb-of-synthesis.md",
  "the-asymmetric-weapon": "docs/the-asymmetric-weapon.md",
};

// register: "mechanical" -> new claim, kind measurement, declared supported, evidence -> checking records.
//           "evaluative" -> new claim, kind forum, declared asserted (bare floor).
//           "constitutive" -> NO new claim; anchors to the existing vocabulary claim named by vocab_ref.
// evidence: epistack check paths (verified to exist and run green by the oracle).
// depends_on / vocab_ref: vt.* refs into corpora/vocabulary/vocabulary.js (resolved to claim identities).
const CLAIMS = [
  // ============================== docs/submission-overview.md ==============================
  { ref: "so.c1.eval", doc: "submission-overview", register: "evaluative",
    span: "Reports, reviews, and AI summaries concentrate reasoning into a document; when any part is wrong, the whole document and everyone who trusted it are wrong together.",
    statement: "A synthesis concentrates reasoning into a document, so when any part of it is wrong the whole document and everyone who trusted it are wrong together.",
    depends_on: ["vt.synthesis"] },
  { ref: "so.c1.mech", doc: "submission-overview", register: "mechanical",
    span: "every claim independently typed, hashed, and graded from its own support, so failure is isolable to the claim that failed",
    statement: "In the typed claim graph every claim is independently typed, hashed, and graded from its own support, so a failure is isolable to the claim that failed.",
    evidence: ["build/check-gate.mjs"], depends_on: ["vt.typed-claim-graph", "vt.grounding-rule"] },
  { ref: "so.c1.eggs", doc: "submission-overview", register: "mechanical",
    span: "nutritional epidemiology, walked claim by claim through the gate, sorts into claims that ground to their floors where the evidence supports them, contested weighings held at the forum tier, and honestly characterized gaps, each gap carrying the study that would close it",
    statement: "In the eggs corpus, nutritional epidemiology walked through the gate sorts into claims that ground to their floors, contested weighings held at the forum tier, and characterized gaps each carrying its closing study.",
    evidence: ["build/check-eggs.mjs"], depends_on: ["vt.gate", "vt.forum", "vt.characterized-gap"] },
  { ref: "so.c2.const", doc: "submission-overview", register: "constitutive",
    span: "Knowledge, in this protocol's working definition, is what remains when trust in the producer is turned all the way down",
    vocab_ref: "vt.knowledge" },
  { ref: "so.c2.mech", doc: "submission-overview", register: "mechanical",
    span: "the gate recomputes a claim's standing from its support structure, and who proposed it never enters the computation",
    statement: "The gate recomputes a claim's standing from its support structure, and who proposed it never enters the computation.",
    evidence: ["build/check-gate.mjs"], depends_on: ["vt.gate", "vt.standing", "vt.producer"] },
  { ref: "so.proto.cross", doc: "submission-overview", register: "mechanical",
    span: "an imported claim arrives untyped at the floor and re-earns under local judgment, so shared meaning is exactly shared hash and nothing composes by accident",
    statement: "An imported claim arrives untyped at the floor and re-earns under local judgment, so shared meaning is exactly shared hash and nothing composes by accident.",
    evidence: ["build/check-crossing.mjs", "build/check-type-hash.mjs"], depends_on: ["vt.crossing", "vt.untyped-type", "vt.type-hash"] },
  { ref: "so.proto.exhibits", doc: "submission-overview", register: "mechanical",
    span: "working corpora for the competition's three cases (black holes, eggs, pandemic origins), a mathematics kernel, a vocabulary kernel that defines the submission's own terms as graded claims",
    statement: "The repository carries working corpora for the three cases, a mathematics kernel, and a vocabulary kernel that defines the submission's own terms as graded claims.",
    evidence: ["build/check-lhc.mjs", "build/check-eggs.mjs", "build/check-covid.mjs", "build/check-math.mjs", "build/check-vocabulary.mjs"], depends_on: ["vt.knowledge-kernel"] },
  { ref: "so.c6.mech", doc: "submission-overview", register: "mechanical",
    span: "a market layer that references grades and provably cannot move them",
    statement: "Standing moves only through typing acts, so a market layer references grades and provably cannot move them.",
    evidence: ["build/check-fork-contest.mjs"], depends_on: ["vt.standing", "vt.typing"] },
  { ref: "so.c6.eval", doc: "submission-overview", register: "evaluative",
    span: "penalties trigger on provable fault only, never on being wrong or unpopular",
    statement: "The one financial constraint fixed at protocol level is that penalties trigger on provable fault only, never on being wrong or unpopular.",
    depends_on: ["vt.standing"] },

  // ============================== docs/the-climb-of-synthesis.md ==============================
  { ref: "cos.limit.eval", doc: "the-climb-of-synthesis", register: "evaluative",
    span: "From inside a single view, however good, you cannot tell which parts are the world and which parts are the viewer, because the viewer is woven through every sentence.",
    statement: "From inside a single synthesis you cannot tell which parts are the world and which are the viewer, because the viewer is woven through every sentence.",
    depends_on: ["vt.synthesis", "vt.view"] },
  { ref: "cos.const.knowledge", doc: "the-climb-of-synthesis", register: "constitutive",
    span: "knowledge is the invariant left as the model is attenuated", vocab_ref: "vt.knowledge" },
  { ref: "cos.const.struct", doc: "the-climb-of-synthesis", register: "constitutive",
    span: "It performs the structural half: it attenuates the producer, so a claim's grade recomputes from its cited support without trusting who produced it.",
    vocab_ref: "vt.structural-attenuation" },
  { ref: "cos.const.semantic", doc: "the-climb-of-synthesis", register: "constitutive",
    span: "Judging whether that support is true of the world is the other half, semantic attenuation, which is the community's work and which the protocol makes checkable rather than performs.",
    vocab_ref: "vt.semantic-attenuation" },
  { ref: "cos.gate.mech", doc: "the-climb-of-synthesis", register: "mechanical",
    span: "admitting a contribution only if it holds together with what is already there, and rechecking every declared grade on every change",
    statement: "The gate admits a contribution only if it holds together with what is already there, and rechecks every declared grade on every change.",
    evidence: ["build/check-gate.mjs"], depends_on: ["vt.gate", "vt.declared-grade"] },
  { ref: "cos.untyped.mech", doc: "the-climb-of-synthesis", register: "mechanical",
    span: "Input that arrives untyped is admitted and sits at the floor, grounding nothing, until someone types it and owns the typing.",
    statement: "Input that arrives untyped is admitted and sits at the floor, grounding nothing, until someone types it and owns the typing.",
    evidence: ["build/check-crossing.mjs"], depends_on: ["vt.untyped-type", "vt.typing"] },
  { ref: "cos.producer.mech", doc: "the-climb-of-synthesis", register: "mechanical",
    span: "It checks a claim's structure, never its agent's identity or nature, so a person, an organization, a model, or a pipeline of these are checked exactly the same way.",
    statement: "The gate checks a claim's structure, never its agent's identity or nature, so a person, an organization, a model, or a pipeline are checked exactly the same way.",
    evidence: ["build/check-gate.mjs"], depends_on: ["vt.producer", "vt.agent"] },
  { ref: "cos.ce.lhc", doc: "the-climb-of-synthesis", register: "mechanical",
    span: "until the graph makes the assumption the lines share into an explicit node, and the convergence reprices as one assumption wearing several coats",
    statement: "In the LHC case, making the shared assumption an explicit node reprices the apparent convergence as one assumption wearing several coats.",
    evidence: ["build/check-lhc.mjs", "build/check-demo.mjs"], depends_on: ["vt.measurement"] },
  { ref: "cos.ce.eggs", doc: "the-climb-of-synthesis", register: "mechanical",
    span: "until the frame it presupposes, which population, which health outcome, replacing which other food, is swapped, and the verdict swaps with it while every measurement underneath keeps its grade",
    statement: "In the eggs case, swapping the presupposed frame swaps the verdict while every measurement underneath keeps its grade.",
    evidence: ["build/check-eggs.mjs", "build/check-demo.mjs"], depends_on: ["vt.forum"] },

  // ============================== docs/the-asymmetric-weapon.md (the seam section) ==============================
  { ref: "aw.struct.const", doc: "the-asymmetric-weapon", register: "constitutive",
    span: "The kernel performs **structural attenuation**: it drives trust in the producer to zero with respect to structure, so a claim's grade follows from its cited support by arithmetic anyone can recompute, and who produced it changes nothing.",
    vocab_ref: "vt.structural-attenuation" },
  { ref: "aw.semantic.const", doc: "the-asymmetric-weapon", register: "constitutive",
    span: "What it does not perform is **semantic attenuation**: whether a leaf measurement actually happened, whether a named checker exists, whether claimed independence is real.",
    vocab_ref: "vt.semantic-attenuation" },
  { ref: "aw.recompute.mech", doc: "the-asymmetric-weapon", register: "mechanical",
    span: "a declared grade above what the published structure actually delivers is caught as `GM-ABOVE`, deterministically, by anyone",
    statement: "A declared grade above what the published structure delivers is caught deterministically, as GM-ABOVE, by anyone recomputing.",
    evidence: ["build/check-gate.mjs"], depends_on: ["vt.gate", "vt.declared-grade", "vt.earned-grade"] },
  { ref: "aw.cannot.eval", doc: "the-asymmetric-weapon", register: "evaluative",
    span: "It cannot catch attestation fraud, because the gate checks structure, not correspondence to the world. A checking record is an assertion that a check occurred, and nothing mechanical proves the checker exists or performed anything. A perfect forgery that no one ever re-checks stands.",
    statement: "Recomputation cannot catch attestation fraud, because the gate checks structure and not correspondence to the world, so a perfect forgery that no one re-checks stands.",
    depends_on: ["vt.structural-attenuation", "vt.semantic-attenuation"] },
  { ref: "aw.boundary.eval", doc: "the-asymmetric-weapon", register: "evaluative",
    span: "Any mechanism that tried to perform semantic attenuation at the claim level would have to be a semantic judge inside the kernel, and that judge is three fatal things at once.",
    statement: "Any mechanism that performed semantic attenuation at the claim level would be a semantic judge inside the kernel, which is a reintroduced trusted producer, a fixed Goodhart target, and a centralized fraud surface.",
    depends_on: ["vt.semantic-attenuation", "vt.structural-attenuation"] },
];

module.exports = { DOCS, CLAIMS };
