// Role: the self-kernel store (S-self): epistack's grounded claims about itself, in three registers.
//   Invariant claims (measurement) each cite a math-kernel theorem for why a structural property must
//   hold and a check for that the code holds it, lifted to checked by the gate over a distinct-party
//   checking record; where nothing grounds a property it carries no checking record and floors, a
//   characterized gap. Constitutive claims (declaration) adopt a vocabulary term. Evaluative claims
//   (forum) sit at the floor, contestable. A tagged subset is entrance-surfaced for the org-root door.
// Contract: exports STORE = { store_id, claims, links, entrance }. Pure data; imports nothing. Each
//   claim carries { ref, kind, register, declared_grade, source_id, contributor_id, statement } plus,
//   per register, cites_theorems / cites_checks (invariant), cites_vocab (constitutive), a
//   closing_condition (a floored invariant), and role / entrance_surfaced (an entrance stipulation).
// Invariant: no grade is raised by hand. A grounded invariant carries a distinct-party checking record
//   citing its oracle, which the gate reads to reach checked; a floored invariant carries none and the
//   gate floors it, its gap recorded in docs/sorry-ledger.md. The cites_* fields are resolved by
//   build/check-self.mjs against the math kernel, the oracle suite, and the vocabulary kernel; a
//   dangling citation, an overclaim, or a definitional constitutive claim with no vocabulary entry fails.
"use strict";

// the checking records: the distinct-party oracle evidence the gate reads. The oracle is not the
// claimant, so each is independence "distinct-party"; each is a replication of the property in code.
const chk = (oracle, method) => ({ checker_id: `oracle:${oracle}`, method_class: "replication", method, checked_at_state: "self@stage-zero", outcome: "confirms", independence: "distinct-party" });
const CROSS = chk("check-crossing", "runs the four cases as independent kernels and confirms a same-hash crossing composes native while an unpinned crossing arrives untyped and grounds nothing until a fork restores standing");
const COMP = chk("check-composition", "confirms the cross-store citation copies the domain grade and the composite grade is the min over necessary carried grades capped by the ceiling");
const DIFF = chk("check-math-differential", "differential testing: the code versus the extracted recurrence over thousands of random support graphs");
const CERT = chk("check-certificate", "perturbs each bundled part and confirms the certificate hash moves, and confirms an identical certified assembly reproduces the hash");
const FORKC = chk("check-fork-contest", "confirms a type fork is a hashed departure and a type contest, admitted through the ordinary gate, leaves every prior grade and certificate byte-identical");
const GATE = chk("check-gate", "confirms the gate admits only typed, grounded contributions and computes each earned grade from the attached support and checking records, including withdrawal and supersession");

const author = "author:epistack";

// ============================ the invariant claims (measurement) ============================
// each cites a math theorem for why the property holds (cites_theorems, resolved against the math
// kernel) and/or a check for that the code holds it (cites_checks, resolved against the oracle suite);
// the checking record is what the gate reads to lift the claim to checked.
const invariant = [
  { ref: "self.typed", cites_theorems: ["thm.untyped-floor"], cites_checks: ["check-gate", "check-crossing"], checking_records: [GATE, CROSS],
    statement: "INVARIANT: every claim the protocol admits carries a type, and the untyped type is itself a type, so a claim always lands somewhere in a receiving kernel's space, if only as untyped." },
  { ref: "self.monotone", cites_theorems: ["thm.contamination-monotone"], cites_checks: ["check-math-differential"], checking_records: [DIFF],
    statement: "INVARIANT: grounding is monotone in the contamination sense, so a claim never advertises more standing than its necessary supports carry and a contested support can only lower a grade, never raise it." },
  { ref: "self.untyped-floor", cites_theorems: ["thm.untyped-floor"], cites_checks: ["check-crossing"], checking_records: [CROSS],
    statement: "INVARIANT: the untyped type grounds nothing, so an imported claim confers no standing until an owned fork types it locally, which is the laundering guard holding by construction." },
  { ref: "self.crossing-min", cites_theorems: ["thm.crossing-min"], cites_checks: ["check-composition"], checking_records: [COMP],
    statement: "INVARIANT: a cross-kernel crossing takes the minimum, so a composite claim is no more grounded than its weakest necessary cited claim, capped by its ceiling." },
  { ref: "self.typing-acts", cites_theorems: [], cites_checks: ["check-fork-contest", "check-gate"], checking_records: [FORKC, GATE],
    statement: "INVARIANT: standing moves only through typing acts, admission through the gate, a fork adopted, or a pin changed; reading, ranking, viewing, and contesting move no grade." },
  { ref: "self.contest-inert", cites_theorems: [], cites_checks: ["check-fork-contest"], checking_records: [FORKC],
    statement: "INVARIANT: a type contest changes no grade, so admitting a contest against a type in use leaves every prior claim's earned grade and certificate byte-identical." },
  { ref: "self.determinism", cites_theorems: ["thm.determinism"], cites_checks: ["check-math-differential"], checking_records: [DIFF],
    statement: "INVARIANT: the earned grade is a deterministic function of the graph, independent of the order supports or groups are visited, because meet and join are commutative and associative and the memoization is order-independent." },
  { ref: "self.settled-not-inherited", cites_theorems: ["thm.settled-not-inherited"], cites_checks: ["check-math-differential"], checking_records: [DIFF],
    statement: "INVARIANT: settledness is not inherited, so a claim resting on settled support reaches at most corroborated; only the claim's own basis, a distinct-party check or a constitutive kind, reaches the settled tier." },
  { ref: "self.cycle-guard", cites_theorems: ["thm.cycle-guard"], cites_checks: ["check-math-differential"], checking_records: [DIFF],
    statement: "INVARIANT: the earned-grade computation terminates on cyclic support, resolving an in-cycle claim to asserted, because the memoization sets the cache before recursing." },
  { ref: "self.certificate-seal", cites_theorems: ["thm.certificate-seals-bundle"], cites_checks: ["check-certificate"], checking_records: [CERT],
    statement: "INVARIANT: the gate receipt's certificate seals its bundle, so its hash changes if and only if a bundled part (the accepted grades, bindings, checking records, state, ruleset, schema, or contribution) changes, and reproduces for an identical certified assembly." },
  { ref: "self.revocable", cites_theorems: [], cites_checks: ["check-fork-contest", "check-gate"], checking_records: [FORKC, GATE],
    statement: "INVARIANT: standing is forkable and revocable, so captured or poisoned state can be forked away from and misassigned standing can be withdrawn or superseded through the gate." },
  // THE GAP: the protocol asserts claims carry their full history, but no first-class history field or
  // oracle yet verifies a complete traceable chain across crossings and forks. No check grounds it, so it
  // floors, and its gap is recorded in docs/sorry-ledger.md with its closing condition. Do not attach a
  // citation that does not support it to lift its grade; the gap is the honest output.
  { ref: "self.history", cites_theorems: [], cites_checks: [], checking_records: [],
    closing_condition: { condition_kind: "measurement-on-the-system", target: "a first-class history/provenance field in the v3 record (kernel/schema/records.mjs) plus an oracle that verifies every admitted claim carries a complete, traceable history chain of its origin, its crossings, and the forks that retyped it, end to end", system: "the epistack v3 record and gate" },
    statement: "INVARIANT (not yet grounded): every admitted claim carries its full history, its origin, the borders it crossed, and the forks that retyped it, so any crossing is auditable end to end." },
].map((c) => ({ ...c, kind: "measurement", register: "invariant", declared_grade: c.checking_records && c.checking_records.length ? "checked" : "asserted", source_id: "src:self-checks", contributor_id: author }));

// ============================ the constitutive claims (declaration) ============================
// the definitions the invariant and evaluative claims presuppose, each adopting a vocabulary term
// rather than re-authoring it. A definitional constitutive claim with no cites_vocab is a stop-and-report.
const constitutive = [
  { ref: "self.def.knowledge", cites_vocab: ["vt.knowledge"],
    statement: "DEFINITION: knowledge is the invariant left as a claim's model is attenuated, knower-independent warranted standing rather than truth." },
  { ref: "self.def.attenuation", cites_vocab: ["vt.attenuation"],
    statement: "DEFINITION: attenuation is driving a claim's dependence on whoever asserted it down toward a floor where the claim stands without its author." },
  { ref: "self.def.trust-view", cites_vocab: ["vt.trust", "vt.view"],
    statement: "DEFINITION: trust is the grounding that survives as trust in the author is attenuated, the part a second party can check; view is the presentation fitted to a reader, separated from the trust that makes the claim hold." },
  { ref: "self.def.structural-semantic", cites_vocab: ["vt.structural-attenuation", "vt.semantic-attenuation"],
    statement: "DEFINITION: structural attenuation is the kernel's mechanical half, recomputing what a claim rests on; semantic attenuation is the community's half, judging whether the cited support is true of the world, which the kernel makes checkable rather than performs." },
].map((c) => ({ ...c, kind: "declaration", register: "constitutive", declared_grade: "constitutive", source_id: "src:vocabulary", contributor_id: author }));

// ============================ the evaluative claims (forum, at the floor) ============================
// the theses, contestable, their grounding absent by design: they await a community's semantic judgment,
// exactly as the submission overview's evaluative claims do.
const evaluative = [
  { ref: "self.thesis.synthesis",
    statement: "THESIS: synthesis concentrates what a kernel distributes, one shared typed schema lets uncoordinated investigations accrete onto a single, auditable map, so the composition is the contribution." },
  { ref: "self.thesis.minimal-periphery",
    statement: "THESIS: a minimal periphery is a choice, not a limitation, because keeping the fallible surface thin is what lets the trusted core stay small enough to check." },
  { ref: "self.thesis.minimum-constitution",
    statement: "THESIS: the submission's real question is the right minimum constitution, the smallest required tier that still makes federation possible and no smaller." },
].map((c) => ({ ...c, kind: "forum", register: "evaluative", declared_grade: "asserted", source_id: "src:self-theses", contributor_id: author }));

// ============================ the entrance stipulations (declaration, constitutive) ============================
// the title and tagline the org-root door renders as adopted stipulations, not definitions, so they are
// exempt from the cites_vocab rule; they carry a role the renderer reads and are tagged entrance_surfaced.
const entranceClaims = [
  { ref: "self.entrance.title", role: "title", entrance_surfaced: true,
    statement: "EpiStack" },
  { ref: "self.entrance.tagline", role: "tagline", entrance_surfaced: true, revisable: true,
    statement: "a typed claim-graph epistemic protocol: one shared schema on which uncoordinated investigations compose into a single, auditable map" },
].map((c) => ({ ...c, kind: "declaration", register: "entrance-stipulation", declared_grade: "constitutive", source_id: "src:self-theses", contributor_id: author }));

const claims = [...invariant, ...constitutive, ...evaluative, ...entranceClaims];

// ============================ the dependence links (depends-on, inert to grading) ============================
// an invariant or thesis that uses a defined term in its defined sense carries a dependence link to the
// definition, as the decomposition established. depends-on is not a support, so it enters no grade fold.
const dep = (from, to) => ({ link_kind: "depends-on", from, to, source_id: "src:vocabulary", contributor_id: author, declared_grade: "asserted" });
const links = [
  dep("self.monotone", "self.def.attenuation"),
  dep("self.untyped-floor", "self.def.attenuation"),
  dep("self.crossing-min", "self.def.attenuation"),
  dep("self.typing-acts", "self.def.attenuation"),
  dep("self.contest-inert", "self.def.structural-semantic"),
  dep("self.typed", "self.def.trust-view"),
  dep("self.thesis.synthesis", "self.def.knowledge"),
  dep("self.thesis.minimal-periphery", "self.def.trust-view"),
];

// ============================ the entrance-surfaced listing ============================
// the org-root renderer reads these: title and tagline (adopted stipulations, above), one or two status
// entries each referencing a grounded invariant claim so the door carries that claim's computed standing,
// and the link entries. A status must reference an invariant that grounds above the floor.
const entrance = [
  { role: "title", claim_ref: "self.entrance.title" },
  { role: "tagline", claim_ref: "self.entrance.tagline" },
  { role: "status", references: "self.untyped-floor" },
  { role: "status", references: "self.monotone" },
  { role: "link", url: "https://github.com/A-Viable-Fork/epistack", label: "repository" },
  { role: "link", url: "https://github.com/A-Viable-Fork/epistack/blob/main/docs/submission-overview.md", label: "submission overview" },
  { role: "link", url: "https://a-viable-fork.github.io/Knowledge-Game/", label: "the app" },
];

const STORE = { store_id: "S-self", claims, links, entrance };

module.exports = { STORE };
