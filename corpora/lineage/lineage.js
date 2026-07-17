// Role: the lineage case (fourth and fifth cases), authored from deep-research reports. The fourth case
//   is that the kernel's mechanisms already run by hand in mature institutions (common law, software,
//   science, Wikipedia, journalism, accounting), mechanically in game-modding, and under adversarial
//   attack in decentralized finance, and that no known system composes all five axes. The fifth case
//   (net.*) is the internet's own trust history across three acts, the cooperative regime, the
//   commercialization shift, and reinforcement's recentralization price, landed as a held-open contest.
//   Readings are forum claims; replicated findings are measurements; principles and the conjecture are
//   declarations.
// Contract: exports LINEAGE = { store_id, claims:[spec], links:[spec] }; refs are resolved by
//   build/lineage-build.mjs. Pure data; corpora imports nothing.
// Invariant: the reports are canonical for what the claims and sources are, never for the grade. The
//   gate prices every claim; where a parallel declares above what it earns, the demotion is the finding.
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

  // ================= game modding: the branch that mechanized its coordination (built tools, not just social patterns) =================
  { ref: "mod.mast-edges", kind: "forum", declared_grade: "asserted", source_id: "src:mod-mast", contributor_id: "read:mod-mast",
    statement: P + "Creation Engine plugins declare dependencies in MAST subrecords, explicit support edges hardcoded in the plugin header, with a DATA subrecord pinning the master's byte size against version mismatch, and a severed edge (a declared master absent at initialization) fails hard with an immediate crash rather than degrading silently" },
  { ref: "mod.loot-linter", kind: "forum", declared_grade: "asserted", source_id: "src:mod-loot", contributor_id: "read:mod-loot",
    statement: P + "LOOT is a deployed topological linter over the plugin dependency graph: it builds a vertex per installed plugin, derives edges from MAST records and a crowdsourced masterlist maintained on GitHub, aborts on a detected cycle by depth-first search, and emits a deterministic topological sort, a community-maintained mechanical check with a cycle guard running at ecosystem scale for years" },
  { ref: "mod.bps-hash", kind: "forum", declared_grade: "asserted", source_id: "src:mod-bps", contributor_id: "read:mod-bps",
    statement: P + "BPS patches are delta-encoding over a hash-verified base: the patch carries checksums, verifies the exact required fixed tier is present, and aborts against a wrong base, content-addressed crossing discipline in miniature, the change meaningful only against the named hash and refused elsewhere" },
  { ref: "mod.wrye-compose", kind: "forum", declared_grade: "asserted", source_id: "src:mod-wrye", contributor_id: "read:mod-wrye",
    statement: P + "Wrye Bash performs mechanical composition where composition is well-defined: overlapping leveled lists carry Delev and Relev metadata tags and the tool synthesizes a unified array in a generated Bashed Patch, composition semantics for the reconcilable case executed by a tool rather than an author" },
  { ref: "mod.archive-not-delete", kind: "forum", declared_grade: "asserted", source_id: "src:mod-nexus-archive", contributor_id: "read:mod-archive",
    statement: P + "the Nexus 2021 ruling resolved the Cathedral-versus-Parlor dispute in favor of the dependency graph: authors may archive but not delete, because a deleted file severs every MAST edge that names it, the append-only store discipline reached as a community's constitutional decision, the graph's survival outranking the author's right of withdrawal" },
  { ref: "mod.state-pinning", kind: "forum", declared_grade: "asserted", source_id: "src:mod-downgrade", contributor_id: "read:mod-pinning",
    statement: P + "when a vendor update broke the extended architecture (the Anniversary Edition breaking SKSE and every dependent library), the community's answer was the downgrade patcher, mechanically reverting the binary to the known version 1.5.97, staying at the hash that verifies when the upstream moves, staleness answered by pinning rather than by trusting the update" },
  { ref: "mod.fixed-free-lifecycle", kind: "forum", declared_grade: "asserted", source_id: "src:mod-skse", contributor_id: "read:mod-lifecycle",
    statement: P + "the ecosystems ran the fixed-free line's whole lifecycle: the vendor's fixed tier (the executable and the record parser), renegotiation from below (SKSE injecting .dll hooks to expose functions the vendor never compiled, becoming a new de facto fixed tier others depend on), and wholesale fork of the fixed tier itself (Enderal replacing the worldspace with isolated infrastructure; pokeemerald-expansion decompiling the vendor binary into C source that becomes the new base, with changes made by cloning and compiling rather than patching)" },
  { ref: "mod.third-party-patches", kind: "forum", declared_grade: "asserted", source_id: "src:mod-compat-patch", contributor_id: "read:mod-thirdparty",
    statement: P + "the compatibility-patch convention: unaffiliated third parties assume ownership of the integration layer between two modules, permissionless, published independently, with the source modules held as unedited hard dependencies, an accumulating market of translation artifacts at the boundaries maintained by whoever needs the boundary to work" },

  // validations by contrast: the ecosystems' measured costs confirming choices made here, stated as costs, not gloating.
  { ref: "mod.last-writer-wins", kind: "forum", declared_grade: "asserted", source_id: "src:mod-xedit-conflict", contributor_id: "read:mod-lastwriter",
    statement: P + "the Creation Engine composes conflicting records by load position alone, last writer wins, silently discarding the loser, so composition is order-dependent, and the ecosystem's tooling burden (the sorting infrastructure, the manual patch positioning, the whole conflict-resolution economy) is the standing cost of that order-dependence, paid in community labor for two decades; this kernel's grade composition is order-independent by the lattice algebra, attested by its own determinism property, so that entire order-management economy is the measured cost of the property the algebra removes" },
  { ref: "mod.hard-conflict-fork-line", kind: "forum", declared_grade: "asserted", source_id: "src:mod-xedit-conflict", contributor_id: "read:mod-hardconflict",
    statement: P + "the ecosystems discovered empirically where mechanical composition ends: overlapping spatial records cannot be averaged (a doorway cannot be half-placed, an AI path cannot be half-severed), so tools compose the reconcilable overlaps and human-authored patches resolve the genuine conflicts, the reconcilable-versus-irreconcilable line this design draws between automatic crossing and forking, found by a community through hard failure rather than by design" },
  { ref: "mod.xedit-visibility", kind: "forum", declared_grade: "asserted", source_id: "src:mod-xedit-conflict", contributor_id: "read:mod-xedit",
    statement: P + "xEdit renders the entire composition stack as a color-coded conflict matrix, every override, every silent loser, the final winning value, making the engine's invisible resolution legible to the operator; the gap it fills, that composition semantics executing silently need a visibility surface, is the same gap a reconciliation and standing view fills over a claim graph, noted as a candidate community tool" },

  // ================= decentralized finance: the adjacent field tested under sustained adversarial attack at scale =================
  { ref: "defi.pos-slashing", kind: "forum", declared_grade: "asserted", source_id: "src:defi-slashing", contributor_id: "read:defi-slashing",
    statement: P + "proof-of-stake slashing anticipated event-triggered standing loss: a mechanically verifiable fault, provable equivocation such as double-signing, triggers an automatic penalty, with the field's own hard lesson that slashing on judgment rather than on provable fault becomes a political weapon; it stopped short by coupling the consequence to a transferable token, so the deterrent was financial loss rather than loss of epistemic weight and credibility stayed purchasable, and this design takes the provable-fault trigger and refuses the token" },
  { ref: "defi.light-client", kind: "forum", declared_grade: "asserted", source_id: "src:defi-light-client", contributor_id: "read:defi-light-client",
    statement: P + "light-client verification anticipated the compact passport: a distrusting party verifies a system's state from a state root plus a Merkle inclusion path without running the system; it stopped short at value transfer, verifying balances and transactions rather than grounded claims with grades, and the mechanism generalizes to any content-addressed store, which this kernel is" },
  { ref: "defi.gov-timelock", kind: "forum", declared_grade: "asserted", source_id: "src:defi-timelock", contributor_id: "read:defi-timelock",
    statement: P + "governance time-locks anticipated the dual-purpose lock: queued changes defeat instantaneously assembled voting power (the flash-loan governance attack) and give dissenters an exit window before a change applies; they stopped short by locking token power rather than earned standing, so the lock guarded a purchasable quantity" },
  { ref: "defi.commit-reveal", kind: "forum", declared_grade: "asserted", source_id: "src:defi-commit-reveal", contributor_id: "read:defi-commit-reveal",
    statement: P + "commit-reveal schemes anticipated attribution protection: a submitter timestamps priority with a hash before revealing content, defeating front-running of a pending submission; they stopped short at transaction ordering, and the same move protects claim attribution in any hash-addressed submission path" },
  { ref: "defi.ipc-handshake", kind: "forum", declared_grade: "asserted", source_id: "src:defi-ipc", contributor_id: "read:defi-ipc",
    statement: P + "inter-chain communication protocols anticipated the federation handshake: mutual verification before any traffic, timeout semantics for staleness, and versioned channel upgrades; they stopped short at moving assets between chains rather than standing between communities, and at trusting validator sets rather than recomputable grounding" },

  // demonstrations: deployed failures under real attack, read as measurements that confirm choices made here.
  { ref: "defi.bridge-custody", kind: "measurement", declared_grade: "asserted", source_id: "src:defi-bridge-hacks", contributor_id: "incident:defi-bridge",
    statement: P + "bridge custody failures are a measured demonstration: the field's largest losses concentrated where systems pooled trust at a boundary, a custodian, a multisig, or a trusted relayer, so trust pooled at a boundary is the failure point; this is the component the untyped-floor crossing refuses, since same-hash composes and everything else arrives untyped and re-earns locally, with no bridge operator to capture (single-class incident measurement, no independent replication)" },
  { ref: "defi.restaking-contagion", kind: "measurement", declared_grade: "asserted", source_id: "src:defi-restaking", contributor_id: "incident:defi-restaking",
    statement: P + "restaking contagion is a measured demonstration: the same collateral securing many systems turns one failure into a correlated cascade across all of them, confirming the up-hill cap, that weight transferring across boundaries at full strength is a contagion channel and capping it is the firewall this design chooses in advance (single-class measurement, no independent replication)" },
  { ref: "defi.oracle-problem", kind: "forum", declared_grade: "asserted", source_id: "src:defi-oracle", contributor_id: "read:defi-oracle",
    statement: P + "the oracle problem is a decade of mechanism design on getting off-system facts attested into a trustless system, unresolved and converging on multiple independent attestors, outlier rejection, and staked attestation; it confirms that the attestation seam, where the gate checks structure and the leaves touch the world, is a known hard frontier with real prior art, which is exactly where this design's coordination layer honestly stands" },

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

  // ================= the internet trust lineage (fifth case): TCP/IP across three acts =================
  // Act 1 was right for its regime; nobody's fault; the regime shifted. The measurements land at asserted
  // with no checking records: the draft's cross-reads are same-party (a second model, one operator loop),
  // and the INDEPENDENCE enum's file invariant reserves distinct-party attestation, so nothing reaches
  // checked until a genuinely external party attests. The floor behavior is the demonstration.
  { ref: "net.disanalogy", kind: "declaration", declared_grade: "supported", source_id: "src:rfc-9518", contributor_id: "decl:net-disanalogy",
    statement: P + "the internet-protocol lineage maps onto this kernel at the trust-architecture layer and never at the content layer, because packets carry no semantics while claims do, so grades and cruxes have no packet analog and the parallel is about how trust was accounted, not about routing" },
  { ref: "net.regime-frame", kind: "declaration", declared_grade: "supported", source_id: "src:clark-1988", contributor_id: "decl:net-regime",
    statement: P + "producer trust is regime-conditional, well calibrated where participation is a small accountable club and broken where trusted-looking output is cheap to produce, so a regime shift calls for rebasing the accounting rather than reinforcing the old basis" },

  // Act 1: the cooperative regime, producer trust correctly calibrated.
  { ref: "net.smtp-noauth", kind: "measurement", declared_grade: "asserted", source_id: "src:rfc-821", contributor_id: "read:net-smtp",
    statement: P + "RFC 821 (August 1982) defined SMTP with the MAIL FROM sender declared on trust and intermediate servers relaying by default, making the open relay the standard configuration (protocol fact read from the primary specification)" },
  { ref: "net.egp-trust", kind: "measurement", declared_grade: "asserted", source_id: "src:rfc-904", contributor_id: "read:net-egp",
    statement: P + "RFC 904 (April 1984) specified the Exterior Gateway Protocol to exchange reachability with statically configured trusted neighbor gateways listed in the EGPINITFILE, with no cryptographic verification of a neighbor (protocol fact read from the primary specification)" },
  { ref: "net.bgp1-auth-zero", kind: "measurement", declared_grade: "asserted", source_id: "src:rfc-1105", contributor_id: "read:net-bgp",
    statement: P + "RFC 1105 (June 1989) gave BGP-1 an authentication code field in its OPEN message whose specified default value was zero, so peering sessions established with no authentication by default (protocol fact read from the primary specification)" },
  { ref: "net.dns-txid", kind: "measurement", declared_grade: "asserted", source_id: "src:rfc-1034", contributor_id: "read:net-dns",
    statement: P + "RFC 1034 and 1035 (November 1987) matched a DNS response to its query by a 16-bit query identifier carried over UDP, with no cryptographic binding of the answer to the question (protocol fact read from the primary specification)" },
  { ref: "net.clark-priorities", kind: "measurement", declared_grade: "asserted", source_id: "src:clark-1988", contributor_id: "read:net-clark",
    statement: P + "David Clark's 1988 design-philosophy paper listed the internet's goals in priority order with accountability last and network-layer security absent from the list, a documented record of the regime's deliberate calibration (same-party cross-read, no distinct-party attestation)" },
  { ref: "net.thuerk-1978", kind: "measurement", declared_grade: "asserted", source_id: "src:thuerk-1978", contributor_id: "incident:net-thuerk",
    statement: P + "on May 3 1978 Gary Thuerk of DEC sent unsolicited commercial mail to 393 ARPANET recipients and a Defense Communications Agency reprimand was the sufficient sanction, the era's social accountability working as designed (same-party cross-read, no distinct-party attestation)" },
  { ref: "net.arpanet-crash-1980", kind: "measurement", declared_grade: "asserted", source_id: "src:rfc-789", contributor_id: "incident:net-arpanet",
    statement: P + "on October 27 1980 the ARPANET collapsed when a single Interface Message Processor dropped bits and propagated garbled status updates, the era's defining failure being physical and accidental rather than malicious (same-party cross-read, no distinct-party attestation)" },
  { ref: "net.well-calibrated", kind: "forum", declared_grade: "asserted", source_id: "src:clark-1988", contributor_id: "read:net-wellcalibrated",
    statement: P + "the unauthenticated defaults of Act 1 were the rational design for their regime, because in a small club of accountable institutions the cost of verifying every sender, route, and name exceeded the expected loss from abuse" },

  // Act 2: the regime shift, commercialization and the adversary at scale.
  { ref: "net.morris-1988", kind: "measurement", declared_grade: "asserted", source_id: "src:morris-record", contributor_id: "incident:net-morris",
    statement: P + "on November 2 1988 the Morris worm combined a finger buffer overflow with rsh and rexec trust relationships to infect an estimated 6,000 of about 60,000 hosts within roughly a day (same-party cross-read, no distinct-party attestation)" },
  { ref: "net.canter-siegel-1994", kind: "measurement", declared_grade: "asserted", source_id: "src:canter-siegel-record", contributor_id: "incident:net-canter",
    statement: P + "on April 12 1994 a single Perl script posted the Canter and Siegel advertisement to over 5,500 Usenet newsgroups in about 90 minutes, the first automated commercial abuse of the cooperative posting norm (same-party cross-read, no distinct-party attestation)" },
  { ref: "net.dns-poisoning-known", kind: "measurement", declared_grade: "asserted", source_id: "src:bellovin-1995", contributor_id: "incident:net-dnspoison",
    statement: P + "DNS cache poisoning was documented well before it was patched, Bellovin's analysis written around 1990 and released in 1995 and Schuba's 1993 study describing sequential-transaction-ID prediction and additional-section injection, with bailiwick checking arriving only at CERT advisory CA-1997-22 in 1997 (same-party cross-read, no distinct-party attestation)" },
  { ref: "net.as7007-1997", kind: "measurement", declared_grade: "asserted", source_id: "src:as7007-record", contributor_id: "incident:net-as7007",
    statement: P + "on April 25 1997 MAI Network Services deaggregated routes to more-specific prefixes rewritten to originate from AS7007, and because more-specific routes are preferred the global routing system funneled traffic into one small network for hours (same-party cross-read, no distinct-party attestation)" },
  { ref: "net.regime-shift-policy", kind: "measurement", declared_grade: "asserted", source_id: "src:nsfnet-history", contributor_id: "read:net-policy",
    statement: P + "the Scientific and Advanced-Technology Act of 1992 authorized commercial traffic on the backbone and the NSFNET backbone decommission was completed on April 30 1995, opening the network to a commercial, anonymous endpoint population (same-party cross-read, no distinct-party attestation)" },
  { ref: "net.host-growth", kind: "measurement", declared_grade: "asserted", source_id: "src:hobbes-timeline", contributor_id: "read:net-hostgrowth",
    statement: P + "internet host counts rose from about 617,000 in October 1991 to about 9,472,000 in January 1996, a roughly fifteenfold growth that made the era's social accountability impossible to maintain (same-party cross-read, no distinct-party attestation)" },
  { ref: "net.cost-inversion", kind: "forum", declared_grade: "asserted", source_id: "src:rfc-9518", contributor_id: "read:net-costinversion",
    statement: P + "the regime shift was a cost inversion, the cost of producing trusted-looking traffic decoupling from the cost of being sound, so the adversary entered the threat model at scale and the signal of soundness stopped tracking soundness" },

  // Act 3: reinforcement, and its recentralization price.
  { ref: "net.comodo-2011", kind: "measurement", declared_grade: "asserted", source_id: "src:comodo-record", contributor_id: "incident:net-comodo",
    statement: P + "in March 2011 a compromise of a Comodo registration authority yielded misissued certificates for high-value domains including mail providers, exposing the fragility of delegating validation to resellers, though Comodo itself survived the incident (same-party cross-read, no distinct-party attestation)" },
  { ref: "net.diginotar-2011", kind: "measurement", declared_grade: "asserted", source_id: "src:diginotar-record", contributor_id: "incident:net-diginotar",
    statement: P + "the 2011 DigiNotar compromise produced at least 531 misissued certificates including a wildcard used against approximately 300,000 Iranian Gmail users, and coordinated browser revocation was followed by the certificate authority's bankruptcy on September 20 2011 (same-party cross-read, no distinct-party attestation)" },
  { ref: "net.symantec-2017", kind: "measurement", declared_grade: "asserted", source_id: "src:symantec-record", contributor_id: "incident:net-symantec",
    statement: P + "a single browser vendor's phased distrust of Symantec certificates, announced in September 2017 and completed in Chrome 65 and 66 in early 2018, forced the sale of a top-tier certificate authority's PKI business to DigiCert (same-party cross-read, no distinct-party attestation)" },
  { ref: "net.fastly-2021", kind: "measurement", declared_grade: "asserted", source_id: "src:fastly-record", contributor_id: "incident:net-fastly",
    statement: P + "on June 8 2021 a latent Fastly software bug triggered by a customer configuration returned errors across about 85% of its network and took major sites offline for roughly an hour (vendor postmortem, self-interested source)" },
  { ref: "net.akamai-2021", kind: "measurement", declared_grade: "asserted", source_id: "src:akamai-record", contributor_id: "incident:net-akamai",
    statement: P + "on July 22 2021 an Akamai Edge DNS configuration update caused widespread DNS resolution failures across major sites until the update was rolled back (vendor postmortem, self-interested source)" },
  { ref: "net.ct-logs", kind: "measurement", declared_grade: "asserted", source_id: "src:rfc-6962", contributor_id: "read:net-ctlogs",
    statement: P + "RFC 6962 (2013) defined Certificate Transparency as append-only public logs of issued certificates, and major browsers have required CT since 2018, constraining certificate-authority discretion by public audit rather than by trust (protocol fact read from the primary specification)" },
  { ref: "net.arin-legacy-friction", kind: "measurement", declared_grade: "asserted", source_id: "src:arin-legacy", contributor_id: "read:net-arin",
    statement: P + "ARIN's legacy-address fee cap expired on December 31 2023, so bringing legacy space under a modern agreement became more costly, an economic disincentive that slows RPKI adoption among legacy holders (same-party cross-read, no distinct-party attestation)" },
  { ref: "net.rpki-growth", kind: "measurement", declared_grade: "asserted", source_id: "src:apnic-rpki-2025", contributor_id: "read:net-rpki",
    statement: P + "Route Origin Validation adoption and valid ROA coverage continued to grow through the APNIC 2025 review, a real but still partial rebase of the routing trust layer (same-party cross-read, no distinct-party attestation)" },

  // the contest, landed as structure: reinforcement recentralized, and the counter-weighing that federation survived.
  { ref: "net.recentralization", kind: "forum", declared_grade: "asserted", source_id: "src:rfc-9518", contributor_id: "read:net-recentral",
    statement: P + "reinforcement recentralized the network it was meant to protect, with inbox legitimacy mediated by a few mail providers, certificate-authority trust gated by a few browser vendors, and reachability held by a few content-delivery networks, so the enforcement layer of trust is now privately held" },
  { ref: "net.federation-survived", kind: "forum", declared_grade: "asserted", source_id: "src:rfc-9518", contributor_id: "read:net-federation",
    statement: P + "the patches worked and federation survived, email remaining federated and self-hostable, Certificate Transparency constraining authorities by construction, and RPKI adoption rising, so concentration is a contingent economic outcome rather than a protocol-level capture" },
  { ref: "net.mail-share-contested", kind: "forum", declared_grade: "asserted", source_id: "src:dmarcguard-2026", contributor_id: "read:net-mailshare",
    statement: P + "mailbox market-share measurements are methodology-contested, send-volume, install, and open metrics disagreeing and open-rate data inflated by Apple Mail Privacy Protection, so the degree of mail concentration is a measurement dispute rather than a settled figure" },
  { ref: "net.selfhost-undercut", kind: "forum", declared_grade: "asserted", source_id: "src:rfc-9518", contributor_id: "read:net-selfhost",
    statement: P + "self-hosting mail remains technically possible and deliverability failure is soft exclusion rather than a hard block, so the claim that platforms own the trust layer overstates control of defaults as control of capability" },
  { ref: "net.crux-metric", kind: "forum", declared_grade: "asserted", source_id: "src:rfc-9518", contributor_id: "read:net-crux",
    statement: P + "the recentralization dispute resolves to the measurement layer, recentralization being near-undeniable at the enforcement layer and near-deniable at the protocol layer, so fixing which layer is measured reprices most of the disagreement" },
  { ref: "net.concentration-gap", kind: "forum", declared_grade: "asserted", source_id: "src:rfc-9518", contributor_id: "read:net-concentration",
    statement: P + "no agreed cross-layer measure of trust-enforcement concentration exists, so the recentralization dispute currently prices rhetoric rather than measurements",
    closing_condition: { condition_kind: "direct-study", target: "an agreed cross-layer measure of trust-enforcement concentration spanning the mail, certificate, and routing layers, which would let the recentralization dispute price measurements rather than rhetoric", system: "the internet trust-enforcement layer" } },
  { ref: "net.variety-cost", kind: "forum", declared_grade: "asserted", source_id: "src:dmarcguard-2026", contributor_id: "read:net-variety",
    statement: P + "the controls added to absorb adversarial variety reshaped legitimate production, senders now writing mail for the classifier, with templated machine-generated business-to-consumer mail reaching about 90% of major-provider non-spam volume, so the patch's cost shows up as a rewritten sender population and not only as concentrated enforcement" },
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

  // ===== the fifth case: TCP/IP trust lineage. Each supporting measurement in its own group so convergence is visible. =====
  // Act 1 measurements support the well-calibrated weighing.
  { link_kind: "supports", from: "net.smtp-noauth", to: "net.well-calibrated", support_group: "grp:net-smtp", source_id: "src:rfc-821", contributor_id: "read:net-smtp", declared_grade: "asserted" },
  { link_kind: "supports", from: "net.egp-trust", to: "net.well-calibrated", support_group: "grp:net-egp", source_id: "src:rfc-904", contributor_id: "read:net-egp", declared_grade: "asserted" },
  { link_kind: "supports", from: "net.bgp1-auth-zero", to: "net.well-calibrated", support_group: "grp:net-bgp", source_id: "src:rfc-1105", contributor_id: "read:net-bgp", declared_grade: "asserted" },
  { link_kind: "supports", from: "net.dns-txid", to: "net.well-calibrated", support_group: "grp:net-dns-txid", source_id: "src:rfc-1034", contributor_id: "read:net-dns", declared_grade: "asserted" },
  { link_kind: "supports", from: "net.clark-priorities", to: "net.well-calibrated", support_group: "grp:net-clark", source_id: "src:clark-1988", contributor_id: "read:net-clark", declared_grade: "asserted" },
  { link_kind: "supports", from: "net.thuerk-1978", to: "net.well-calibrated", support_group: "grp:net-thuerk", source_id: "src:thuerk-1978", contributor_id: "incident:net-thuerk", declared_grade: "asserted" },
  { link_kind: "supports", from: "net.arpanet-crash-1980", to: "net.well-calibrated", support_group: "grp:net-arpanet", source_id: "src:rfc-789", contributor_id: "incident:net-arpanet", declared_grade: "asserted" },

  // Act 2 measurements support the cost-inversion weighing.
  { link_kind: "supports", from: "net.morris-1988", to: "net.cost-inversion", support_group: "grp:net-morris", source_id: "src:morris-record", contributor_id: "incident:net-morris", declared_grade: "asserted" },
  { link_kind: "supports", from: "net.canter-siegel-1994", to: "net.cost-inversion", support_group: "grp:net-canter", source_id: "src:canter-siegel-record", contributor_id: "incident:net-canter", declared_grade: "asserted" },
  { link_kind: "supports", from: "net.dns-poisoning-known", to: "net.cost-inversion", support_group: "grp:net-dnspoison", source_id: "src:bellovin-1995", contributor_id: "incident:net-dnspoison", declared_grade: "asserted" },
  { link_kind: "supports", from: "net.as7007-1997", to: "net.cost-inversion", support_group: "grp:net-as7007", source_id: "src:as7007-record", contributor_id: "incident:net-as7007", declared_grade: "asserted" },
  { link_kind: "supports", from: "net.regime-shift-policy", to: "net.cost-inversion", support_group: "grp:net-policy", source_id: "src:nsfnet-history", contributor_id: "read:net-policy", declared_grade: "asserted" },
  { link_kind: "supports", from: "net.host-growth", to: "net.cost-inversion", support_group: "grp:net-hostgrowth", source_id: "src:hobbes-timeline", contributor_id: "read:net-hostgrowth", declared_grade: "asserted" },

  // Act 3 measurements support the recentralization weighing; CT and RPKI support the counter-weighing that federation survived.
  { link_kind: "supports", from: "net.comodo-2011", to: "net.recentralization", support_group: "grp:net-comodo", source_id: "src:comodo-record", contributor_id: "incident:net-comodo", declared_grade: "asserted" },
  { link_kind: "supports", from: "net.diginotar-2011", to: "net.recentralization", support_group: "grp:net-diginotar", source_id: "src:diginotar-record", contributor_id: "incident:net-diginotar", declared_grade: "asserted" },
  { link_kind: "supports", from: "net.symantec-2017", to: "net.recentralization", support_group: "grp:net-symantec", source_id: "src:symantec-record", contributor_id: "incident:net-symantec", declared_grade: "asserted" },
  { link_kind: "supports", from: "net.fastly-2021", to: "net.recentralization", support_group: "grp:net-fastly", source_id: "src:fastly-record", contributor_id: "incident:net-fastly", declared_grade: "asserted" },
  { link_kind: "supports", from: "net.akamai-2021", to: "net.recentralization", support_group: "grp:net-akamai", source_id: "src:akamai-record", contributor_id: "incident:net-akamai", declared_grade: "asserted" },
  { link_kind: "supports", from: "net.arin-legacy-friction", to: "net.recentralization", support_group: "grp:net-arin", source_id: "src:arin-legacy", contributor_id: "read:net-arin", declared_grade: "asserted" },
  { link_kind: "supports", from: "net.mail-share-contested", to: "net.recentralization", support_group: "grp:net-mailshare", source_id: "src:dmarcguard-2026", contributor_id: "read:net-mailshare", declared_grade: "asserted" },
  { link_kind: "supports", from: "net.variety-cost", to: "net.recentralization", support_group: "grp:net-variety", source_id: "src:dmarcguard-2026", contributor_id: "read:net-variety", declared_grade: "asserted" },
  { link_kind: "supports", from: "net.ct-logs", to: "net.federation-survived", support_group: "grp:net-ctlogs", source_id: "src:rfc-6962", contributor_id: "read:net-ctlogs", declared_grade: "asserted" },
  { link_kind: "supports", from: "net.rpki-growth", to: "net.federation-survived", support_group: "grp:net-rpki", source_id: "src:apnic-rpki-2025", contributor_id: "read:net-rpki", declared_grade: "asserted" },

  // the contest itself: federation-survived contradicts recentralization; CT and self-hosting undercut recentralization's reach.
  { link_kind: "contradicts", from: "net.federation-survived", to: "net.recentralization", source_id: "src:rfc-9518", contributor_id: "read:net-federation", declared_grade: "asserted" },
  { link_kind: "undercut", from: "net.ct-logs", to: "net.recentralization", source_id: "src:rfc-6962", contributor_id: "read:net-ctlogs", declared_grade: "asserted" },
  { link_kind: "undercut", from: "net.selfhost-undercut", to: "net.recentralization", source_id: "src:rfc-9518", contributor_id: "read:net-selfhost", declared_grade: "asserted" },

  // both sides of the contest, and the mail-share dispute, support the crux: the dispute resolves to the measurement layer.
  { link_kind: "supports", from: "net.recentralization", to: "net.crux-metric", support_group: "grp:net-crux-recentral", source_id: "src:rfc-9518", contributor_id: "read:net-recentral", declared_grade: "asserted" },
  { link_kind: "supports", from: "net.federation-survived", to: "net.crux-metric", support_group: "grp:net-crux-federation", source_id: "src:rfc-9518", contributor_id: "read:net-federation", declared_grade: "asserted" },
  { link_kind: "supports", from: "net.mail-share-contested", to: "net.crux-metric", support_group: "grp:net-crux-mailshare", source_id: "src:dmarcguard-2026", contributor_id: "read:net-mailshare", declared_grade: "asserted" },
];

const LINEAGE = { store_id: "lineage", claims, links };

module.exports = { LINEAGE };
