// Role: the lineage case (fourth case), authored from four deep-research reports. The claim is that the
//   kernel's mechanisms already run, informally and by hand, in mature institutions (common law and
//   software dependency graphs; science, Wikipedia, journalism, accounting), and that no known system
//   composes all five axes for empirical and contested knowledge. Architectural readings are forum
//   claims capped at corroborated; quantified findings with a distinct-party replication are
//   measurements; stated institutional principles and the novelty conjecture are declarations. The
//   conjecture rests on the independent near-miss gaps of the neighborhood systems, each its own group.
// Contract: exports LINEAGE = { store_id, claims:[spec], links:[spec] }; refs are resolved by
//   build/lineage-build.mjs. Pure data; corpora imports nothing.
// Invariant: the reports are canonical for what the claims and sources are, never for the grade. The
//   gate prices every claim; where a parallel declares above what it earns, the demotion is the finding,
//   the case honestly reporting which parallels are load-bearing and which were flattery.
"use strict";

// a checking record: only where a genuinely distinct party attests the same quantified finding.
const chk = (checker, method_class, method) => ([{ checker_id: checker, method_class, method: method || "replication", checked_at_state: "genesis", outcome: "confirms", independence: "distinct-party" }]);
const P = "lineage: ";

const claims = [
  // ================= common law: grounding-by-dependency, its linter, its failure modes =================
  { ref: "cl.precedent", kind: "forum", declared_grade: "asserted", source_id: "src:scotus-stare-decisis", contributor_id: "read:commonlaw",
    statement: P + "common law runs grounding-by-dependency: under stare decisis a ruling's authority is inherited through an unbroken chain of cited precedent back to a statute or constitutional floor, a dependency graph built by hand" },
  { ref: "cl.citator-linter", kind: "forum", declared_grade: "asserted", source_id: "src:hellyer-2018", contributor_id: "read:citator",
    statement: P + "legal citators (Shepard's, KeyCite, BCite) are a semantic linter over the precedent graph: they flag whether an upstream precedent remains valid law, editorially maintained by human analysts rather than computed" },
  { ref: "cl.citator-error", kind: "measurement", declared_grade: "asserted", source_id: "src:hellyer-2018", contributor_id: "study:hellyer",
    statement: P + "the citator linter fails often: total failure rate on negative treatment is 33% (Shepard's), 38% (KeyCite), and 72% (BCite), and all three citators agree only 15% of the time (single-study measurement, no independent replication)" },
  { ref: "cl.override-lag", kind: "measurement", declared_grade: "asserted", source_id: "src:broughman-2017", contributor_id: "study:broughman",
    statement: P + "a differences-in-differences analysis finds that after a legislative override, citation to the superseded precedent declines far slower than after a judicial overruling of the same rank (single-study measurement)" },
  { ref: "cl.shadow-precedent", kind: "forum", declared_grade: "corroborated", source_id: "src:widiss-2015", contributor_id: "read:shadow",
    statement: P + "contamination propagates only through active litigation, so overruled or legislatively superseded decisions persist as shadow precedents cited as live, controlling law for years, the legal analog of technical lag" },
  { ref: "cl.persuasive-untyped", kind: "forum", declared_grade: "asserted", source_id: "src:georgetown-binding", contributor_id: "read:persuasive",
    statement: P + "persuasive out-of-jurisdiction authority arrives untyped: it grounds nothing binding until a local court adopts it by analogy, an untyped-type crossing executed socially and by hand, with inconsistent adoption its failure mode" },
  { ref: "cl.fixed-free", kind: "forum", declared_grade: "asserted", source_id: "src:us-const", contributor_id: "read:legal-tiers",
    statement: P + "law keeps a fixed-free line: constitutional and statutory text is the fixed tier, case law the free tier, and only a deliberate communal act (amendment, legislation) redefines the baseline" },

  // ================= software: mechanized tracing, the same failure modes, the honest break =================
  { ref: "sw.ci-gate", kind: "forum", declared_grade: "asserted", source_id: "src:github-ci", contributor_id: "read:cicd",
    statement: P + "CI/CD pipelines are an admission gate, admit-only-if-checks-pass, but the check matrix is configured by hand and can only verify what a developer explicitly codified, so a zero-day or obfuscated payload passes" },
  { ref: "sw.weakest-support", kind: "forum", declared_grade: "asserted", source_id: "src:kusari-transitive", contributor_id: "read:weakest",
    statement: P + "software runs the weakest-necessary-support rule: because every transitive dependency compiles into one runtime, an application is only as secure as its weakest dependency, a vulnerability five layers deep granting the same privileges as first-party code" },
  { ref: "sw.transitive-count", kind: "measurement", declared_grade: "asserted", source_id: "src:endor-labs", contributor_id: "study:endor",
    statement: P + "the average Node.js project pulls in over 700 transitive dependencies, most outside the primary developers' awareness (single-source lockfile audit)" },
  { ref: "sw.log4shell", kind: "measurement", declared_grade: "asserted", source_id: "src:cisa-log4j", contributor_id: "incident:log4shell",
    statement: P + "Log4Shell (2021): a single logging string triggered remote code execution across millions of devices because Log4j sat deep in the transitive dependency trees of thousands of applications (single-incident measurement)" },
  { ref: "sw.solarwinds", kind: "forum", declared_grade: "asserted", source_id: "src:solarwinds-report", contributor_id: "incident:solarwinds",
    statement: P + "SolarWinds SUNBURST (2020): pre-compilation injection into the build pipeline produced a legitimately signed backdoor distributed to thousands of downstream customers, subverting cryptographic trust controls" },
  { ref: "sw.contamination", kind: "forum", declared_grade: "corroborated", source_id: "src:snyk-eventstream", contributor_id: "read:contamination",
    statement: P + "the contamination rule runs live in software: a poisoned upstream node distributes automatically to all downstream dependents, attested across event-stream (2018), SolarWinds (2020), and Log4Shell (2021), and remediation is the same manual technical lag as shadow precedents" },
  { ref: "sw.semver", kind: "forum", declared_grade: "asserted", source_id: "src:semver-spec", contributor_id: "read:semver",
    statement: P + "Semantic Versioning is a fixed-free protocol, but it is a social contract rather than a computed law: developers routinely ship breaking changes as minor or patch bumps, and package managers auto-pull them and silently break downstream builds" },
  { ref: "sw.honest-break", kind: "forum", declared_grade: "asserted", source_id: "src:spinellis-powerlaws", contributor_id: "read:honest-break",
    statement: P + "the honest break: the dependency edge means executes in software and is-warranted-by in law, so the structural isomorphism masks a semantic divide, and dependency networks automate the execution of logic but not the authorization of trust" },

  // ================= science: convergence warrant, exclusion record, the retraction measurement =================
  { ref: "sci.convergence", kind: "forum", declared_grade: "asserted", source_id: "src:retraction-pubmed", contributor_id: "read:convergence",
    statement: P + "science runs the convergence warrant: a single paper is testimony, and only independent replication across distinct methods or populations composes it into knowledge no single measurer is load-bearing for" },
  { ref: "sci.fake-independence", kind: "forum", declared_grade: "asserted", source_id: "src:retraction-pubmed", contributor_id: "read:fake-independence",
    statement: P + "the replication crisis is a failure of graph independence: apparent convergence of hundreds of studies reifies to one shared flawed dependency (a contaminated cell line, a misapplied threshold), which is the LHC shared-dependency reprice seen in science" },
  { ref: "sci.retraction-unack", kind: "measurement", declared_grade: "checked", source_id: "src:retraction-pubmed", contributor_id: "study:retraction",
    statement: P + "the exclusion record fails to propagate: of 13,252 post-retraction citation contexts (7,813 retracted papers, PubMed 1960-2020) only 5.4% acknowledged the retraction, so 94.6% treated the compromised finding as valid, independently attested by a clinical-trial study at about 4%",
    checking_records: chk("clinical-trial-bibliometrics", "replication", "independent-clinical-trial-citation-study") },
  { ref: "sci.fixed-free", kind: "declaration", declared_grade: "supported", source_id: "src:equator", contributor_id: "decl:consort",
    statement: P + "reporting standards are a declaration floor for science: CONSORT, PRISMA, and STROBE fix how trials, reviews, and observational studies must be reported, the fixed grammar of an experiment while study design stays free" },

  // ================= Wikipedia: the trust-view cut, source typing, provenance, the fork, its failure =================
  { ref: "wiki.verifiability", kind: "declaration", declared_grade: "supported", source_id: "src:wiki-core", contributor_id: "decl:wiki-verifiability",
    statement: P + "Wikipedia's 'Verifiability, not truth' is the trust-view cut written as an editorial rule: it decouples the validity of the record from the truth of the claim by offloading the burden to reliable external sources" },
  { ref: "wiki.source-typing", kind: "forum", declared_grade: "asserted", source_id: "src:wiki-rsp", contributor_id: "read:wiki-rsp",
    statement: P + "the Perennial Sources list is source-class typing with escalating mechanical enforcement: generally-reliable through deprecated to blacklisted, where a blacklisted source is a hard block the software refuses to save" },
  { ref: "wiki.provenance", kind: "forum", declared_grade: "asserted", source_id: "src:wiki-core", contributor_id: "read:wiki-provenance",
    statement: P + "Wikipedia's full revision history is provenance and a patch history: every edit logs its author, timestamp, and byte diff, so a vandalized node reverts to the last valid patch, shifting the advantage from attacker to defender" },
  { ref: "wiki.fork-exit", kind: "forum", declared_grade: "asserted", source_id: "src:wiki-forks", contributor_id: "read:wiki-fork",
    statement: P + "the fork is Wikipedia's canonical exit: the CC-BY-SA license encodes the right to fork the whole database, and the 2002 Spanish Fork forced the platform to abandon advertising while Citizendium (2006) forked to test an alternative trust model" },
  { ref: "wiki.no-crux", kind: "forum", declared_grade: "asserted", source_id: "src:wiki-core", contributor_id: "read:wiki-crux",
    statement: P + "Wikipedia computes no mechanical crux resolution: contested claims sit under citation-needed for years and disputes resolve by social exhaustion or administrator page-lock, not by evidence pricing, which is the gap a mechanized crux fills" },
  { ref: "wiki.five-pillars", kind: "declaration", declared_grade: "supported", source_id: "src:wiki-pillars", contributor_id: "decl:wiki-pillars",
    statement: P + "the Five Pillars are Wikipedia's fixed tier: neutral point of view and free content cannot be superseded by any local consensus, while the Manual of Style and naming conventions are the malleable free tier" },

  // ================= journalism and accounting: the miniatures =================
  { ref: "jour.two-source", kind: "declaration", declared_grade: "supported", source_id: "src:journalism-sourcing", contributor_id: "decl:two-source",
    statement: P + "the two-independent-sources rule is a convergence floor in miniature: one human source is testimony, and a contested claim is publishable only when corroborated through a strictly independent evidentiary pathway" },
  { ref: "jour.circular", kind: "forum", declared_grade: "asserted", source_id: "src:journalism-sourcing", contributor_id: "read:circular",
    statement: P + "circular reporting is fake independence in journalism: two sources sharing one briefing or document only look like convergence, the same reified shared dependency the replication crisis exhibits in science" },
  { ref: "acct.verify-dont-trust", kind: "forum", declared_grade: "asserted", source_id: "src:accounting-standards", contributor_id: "read:accounting",
    statement: P + "accounting encodes verify-don't-trust as segregation of duties: the preparer of a ledger cannot authorize the transactions or audit them, so no single actor holds both write access and verification access to the graph" },
  { ref: "acct.typed-floors", kind: "declaration", declared_grade: "supported", source_id: "src:accounting-standards", contributor_id: "decl:gaap",
    statement: P + "GAAP and IFRS are typed declaration floors: by forcing every financial claim into a typed standard for revenue, depreciation, and classification, they let an auditor mechanically verify a ledger across firms and jurisdictions" },

  // ================= the Rootclaim note: lineage-of-the-example, NOT an independent attestation =================
  { ref: "note.rootclaim", kind: "forum", declared_grade: "asserted", source_id: "src:rootclaim-nber", contributor_id: "note:rootclaim",
    statement: P + "a lineage-of-the-example note, not an attestation: Rootclaim's manual Bayesian pricing of the COVID origin (it claimed 14,900:1 for a lab leak; impartial judges found about 0.3-0.075%) is the methodological ancestor of this repository's COVID example, an entirely manual and social implementation of evidence pricing, not an independent instance of an automated crux mechanism" },

  // ================= the neighborhood map: near-miss systems, retyped from the map's self-grades =================
  { ref: "map.lean-grounding", kind: "forum", declared_grade: "asserted", source_id: "src:mathlib", contributor_id: "read:lean",
    statement: P + "Lean and Mathlib are the purest mechanical grounding in the neighborhood: a distrusting party reruns the compiler to recompute a theorem's standing to its axioms, needing no trust in the authoring mathematician" },
  { ref: "map.lean-gap", kind: "forum", declared_grade: "asserted", source_id: "src:mathlib", contributor_id: "read:lean-gap",
    statement: P + "Lean lacks untyped-type federation and cannot hold empirical or contested claims: its top-down regime demands strict integration into one schema with no lossy crossings, and its floor requires axiomatic certainty, so it grounds within formal mathematics only" },
  { ref: "map.nanopub-floors", kind: "forum", declared_grade: "asserted", source_id: "src:nanopub", contributor_id: "read:nanopub",
    statement: P + "Nanopublications enforce a typed epistemic floor: an assertion is not well-formed unless it segregates into RDF quads binding it to an explicit provenance graph and a publication graph" },
  { ref: "map.nanopub-gap", kind: "forum", declared_grade: "asserted", source_id: "src:nanopub", contributor_id: "read:nanopub-gap",
    statement: P + "Nanopublications lack a grounding linter: the network validates RDF structure but leaves epistemic weight to each consumer's heuristics, so a perfectly formatted but factually hollow assertion passes unchallenged" },
  { ref: "map.ceramic-fed", kind: "forum", declared_grade: "asserted", source_id: "src:ceramic", contributor_id: "read:ceramic",
    statement: P + "Ceramic federates untyped and forks by content address: ComposeDB data models and multi-homed IPFS state let disparate parties publish into shared tables and repoint their documents without a central server" },
  { ref: "map.ceramic-gap", kind: "forum", declared_grade: "asserted", source_id: "src:ceramic", contributor_id: "read:ceramic-gap",
    statement: P + "Ceramic lacks mechanical grounding and typed floors: a domain crossing transfers the data perfectly but zero epistemic standing, because the network verifies cryptographic provenance, not whether the document holds verified facts or fabricated noise" },
  { ref: "map.augur-fork", kind: "forum", declared_grade: "asserted", source_id: "src:augur", contributor_id: "read:augur",
    statement: P + "Augur implements a high-stakes forkable exit: a sufficiently disputed market locks the genesis universe and forces staked REP into disjoint child universes, and a token migrated to a false universe loses its value, so legitimate truth can always exit a corrupted center" },
  { ref: "map.augur-gap", kind: "forum", declared_grade: "asserted", source_id: "src:augur", contributor_id: "read:augur-gap",
    statement: P + "Augur grounds economically, not structurally: a distrusting party verifies only the ledger of stakes and slashing, not the claim's factual accuracy, so a rich enough incentive to lie makes the mechanism validate falsehoods flawlessly" },
  { ref: "map.kialo-gap", kind: "forum", declared_grade: "asserted", source_id: "src:kialo", contributor_id: "read:kialo",
    statement: P + "Kialo grounds pseudo-mechanically: its Impact-equals-Veracity-plus-Relevance rule aggregates votes mechanically, but the inputs are subjective human votes, so it computes community consensus rather than structurally recomputable truth" },
  { ref: "map.scite-fmeasure", kind: "measurement", declared_grade: "asserted", source_id: "src:scite-eval", contributor_id: "study:scite",
    statement: P + "machine-learned citation typing is a post-hoc overlay, not a structural floor: an independent evaluation of scite.ai found F-measures ranging from 0.0 to 0.58 across supporting, mentioning, and contrasting classes (single evaluation)" },

  // ================= the novelty conjecture: the load-bearing declaration, narrowed =================
  { ref: "conj.novelty", kind: "declaration", declared_grade: "supported", source_id: "src:novelty-synthesis", contributor_id: "decl:conjecture",
    statement: P + "no known system composes all five axes, typed floors, mechanical grounding, untyped-type federation, forkable exit, and a community-set fixed-free line, for empirical and contested knowledge claims (the narrowing to empirical-and-contested keeps Lean's composition within formal mathematics from refuting it)",
    closing_condition: { condition_kind: "direct-study", target: "a peer-reviewed demonstration or deployed instance of a protocol natively composing all five axes at once for empirical and contested knowledge claims, which would be wired here as a contradicts link and let the gate carry the contest", system: "any single deployed knowledge-kernel system" } },
];

const links = [
  // the shadow-precedent reading rests on the diff-in-diff measurement, giving it independent support.
  { link_kind: "supports", from: "cl.override-lag", to: "cl.shadow-precedent", support_group: "grp:override-lag", source_id: "src:broughman-2017", contributor_id: "study:broughman", declared_grade: "asserted" },
  // the contamination reading is attested by two distinct incidents in two distinct groups.
  { link_kind: "supports", from: "sw.log4shell", to: "sw.contamination", support_group: "grp:log4shell", source_id: "src:cisa-log4j", contributor_id: "incident:log4shell", declared_grade: "asserted" },
  { link_kind: "supports", from: "sw.solarwinds", to: "sw.contamination", support_group: "grp:solarwinds", source_id: "src:solarwinds-report", contributor_id: "incident:solarwinds", declared_grade: "asserted" },
  // the honest break sharpens the precedent-grounding parallel (the isomorphism it qualifies).
  { link_kind: "refines", from: "sw.honest-break", to: "cl.precedent", source_id: "src:spinellis-powerlaws", contributor_id: "read:honest-break", declared_grade: "asserted" },
  // circular reporting and fake independence are the same failure sharpened across domains.
  { link_kind: "refines", from: "jour.circular", to: "sci.fake-independence", source_id: "src:journalism-sourcing", contributor_id: "read:circular", declared_grade: "asserted" },

  // the five independent near-miss gaps ground the conjecture, each in its own group so convergence is visible.
  { link_kind: "supports", from: "map.lean-gap", to: "conj.novelty", support_group: "grp:lean-federation-gap", source_id: "src:mathlib", contributor_id: "read:lean-gap", declared_grade: "asserted" },
  { link_kind: "supports", from: "map.nanopub-gap", to: "conj.novelty", support_group: "grp:nanopub-linter-gap", source_id: "src:nanopub", contributor_id: "read:nanopub-gap", declared_grade: "asserted" },
  { link_kind: "supports", from: "map.ceramic-gap", to: "conj.novelty", support_group: "grp:ceramic-grounding-gap", source_id: "src:ceramic", contributor_id: "read:ceramic-gap", declared_grade: "asserted" },
  { link_kind: "supports", from: "map.augur-gap", to: "conj.novelty", support_group: "grp:augur-economic-gap", source_id: "src:augur", contributor_id: "read:augur-gap", declared_grade: "asserted" },
  { link_kind: "supports", from: "map.kialo-gap", to: "conj.novelty", support_group: "grp:kialo-heuristic-gap", source_id: "src:kialo", contributor_id: "read:kialo", declared_grade: "asserted" },
];

const LINEAGE = { store_id: "lineage", claims, links };

module.exports = { LINEAGE };
