// Role: the lineage case reference tables. The lineage case is the claim that the kernel's mechanisms
//   already run, informally and by hand, in mature institutions, and that no existing system composes
//   them all. A source row per cited report/study/document carries its citation as provenance; the kind
//   table gives three ceilings: a measurement floor (checked), a forum band (corroborated), and a
//   declaration floor (constitutive) for stated principles and the novelty conjecture.
// Contract: exports SOURCES (source-table rows) and KINDS (kind-table rows). Pure data; imports nothing.
// Invariant: every claim's source_id resolves here. The four deep-research reports are canonical for
//   what the claims and sources are, never for the grade the gate prices them at.
"use strict";

const KINDS = [
  { kind: "measurement", ceiling: "checked" },
  { kind: "forum", ceiling: "corroborated" },
  { kind: "declaration", ceiling: "constitutive" },
];

const SOURCES = [
  // ---- common law and software (the featured lineage) ----
  { source_id: "src:scotus-stare-decisis", source_class: "institutional-report", description: "US Supreme Court doctrine of stare decisis: precedent as a principle of judicial policy, not a mechanical formula (Kernel Lineage Research Plan)" },
  { source_id: "src:hellyer-2018", source_class: "peer-reviewed", description: "Hellyer, P. (2018), evaluation of Shepard's, KeyCite, and BCite negative-treatment accuracy, Law Library Journal (citator error rates)" },
  { source_id: "src:widiss-2015", source_class: "peer-reviewed", description: "Widiss, D. (2015), 'Shadow Precedents and the Separation of Powers', on legislative-override shadow precedents" },
  { source_id: "src:broughman-2017", source_class: "peer-reviewed", description: "Broughman et al. (2017), differences-in-differences analysis of citation depreciation after judicial overruling vs legislative override" },
  { source_id: "src:georgetown-binding", source_class: "institutional-report", description: "Georgetown Law Library, binding vs persuasive authority (persuasive authority arrives untyped until locally adopted)" },
  { source_id: "src:us-const", source_class: "institutional-report", description: "US Constitution Art. VI (supremacy) and Art. V (amendment): the fixed tier of law and its deliberate redefinition" },
  { source_id: "src:github-ci", source_class: "institutional-report", description: "GitHub Actions CI/CD documentation: admission gates configured by hand, admit-only-if-checks-pass" },
  { source_id: "src:kusari-transitive", source_class: "institutional-report", description: "Kusari, transitive-dependency risk analysis (a build is as strong as its weakest transitive dependency)" },
  { source_id: "src:endor-labs", source_class: "institutional-report", description: "Endor Labs lockfile audit: the average Node.js project carries over 700 transitive dependencies" },
  { source_id: "src:semver-spec", source_class: "institutional-report", description: "Semantic Versioning 2.0.0 specification (semver.org): a fixed-free protocol enforced as a social contract" },
  { source_id: "src:spinellis-powerlaws", source_class: "peer-reviewed", description: "Spinellis, power laws in software dependency networks: the dependency edge means executes, not is-warranted-by" },
  { source_id: "src:snyk-eventstream", source_class: "institutional-report", description: "Snyk and npm incident writeups, event-stream supply-chain compromise via maintainer handover (2018)" },
  { source_id: "src:solarwinds-report", source_class: "institutional-report", description: "SolarWinds SUNBURST incident reports (2020): pre-compilation build injection of a signed backdoor" },
  { source_id: "src:cisa-log4j", source_class: "institutional-report", description: "CISA advisory on Log4Shell (CVE-2021-44228), Apache Log4j remote code execution via a transitive dependency (2021)" },

  // ---- science, Wikipedia, journalism, accounting (the principle lineage) ----
  { source_id: "src:retraction-pubmed", source_class: "peer-reviewed", description: "Continued Use of Retracted Papers: Temporal Trends in Citations in Biomedicine, PubMed 36186715 (7,813 retracted papers, 13,252 post-retraction contexts, 5.4% acknowledge the retraction)" },
  { source_id: "src:retraction-clinical", source_class: "peer-reviewed", description: "The Scientist (2022) / clinical-trial bibliometrics: editorial responses did not slow citation; ~4% of a fraudulent trial's post-retraction citations acknowledged the retraction (independent attestation)" },
  { source_id: "src:equator", source_class: "institutional-report", description: "EQUATOR Network reporting guidelines: CONSORT, PRISMA, STROBE as declaration floors for study reporting" },
  { source_id: "src:wiki-core", source_class: "institutional-report", description: "Wikipedia:Core content policies, 'Verifiability, not truth' (the trust-view cut as an editorial rule)" },
  { source_id: "src:wiki-rsp", source_class: "institutional-report", description: "Wikipedia:Reliable sources/Perennial sources: source-class tiers with escalating mechanical enforcement" },
  { source_id: "src:wiki-pillars", source_class: "institutional-report", description: "Wikipedia:Five pillars: the fixed tier no local consensus can override" },
  { source_id: "src:wiki-forks", source_class: "institutional-report", description: "List of content forks of Wikipedia; the Spanish Fork (2002) and Citizendium (2006) as canonical exits" },
  { source_id: "src:journalism-sourcing", source_class: "institutional-report", description: "SPJ Code of Ethics and NYT/WaPo two-independent-sources standard; circular reporting as fake independence" },
  { source_id: "src:accounting-standards", source_class: "institutional-report", description: "GAAP and IFRS as typed declaration floors; segregation of duties (preparer, authorizer, auditor) as verify-don't-trust" },
  { source_id: "src:rootclaim-nber", source_class: "institutional-report", description: "Rootclaim COVID-origins Bayesian analysis and the Miller-Rootclaim debate; NBER w33428 spatiotemporal reassessment (judges found ~0.3-0.075% lab leak)" },

  // ---- game modding (the branch that mechanized its coordination) ----
  { source_id: "src:mod-bps", source_class: "institutional-report", description: "Data Crystal (TCRF) ROM patch-format reference: BPS delta-encoding over a hash-verified base, aborting against a wrong base ROM (datacrystal.tcrf.net/wiki/Patch)" },
  { source_id: "src:mod-mast", source_class: "institutional-report", description: "xEdit documentation, Managing Mod Files: the MAST subrecord declaring master dependencies and the DATA subrecord pinning the master's byte size against version mismatch (tes5edit.github.io/docs/8-managing-mod-files.html)" },
  { source_id: "src:mod-loot", source_class: "institutional-report", description: "LOOT / libloot sorting-algorithm documentation: a directed acyclic graph over installed plugins from MAST records and a GitHub-hosted masterlist, depth-first cycle detection, and a deterministic topological sort (loot-api.readthedocs.io/en/latest/api/sorting.html)" },
  { source_id: "src:mod-wrye", source_class: "institutional-report", description: "Wrye Bash / BOSS masterlist syntax reference: the Delev and Relev leveled-list tags and the synthesized Bashed Patch (scribd.com/doc/176769307/Master-List; Wrye Bash advanced readme)" },
  { source_id: "src:mod-skse", source_class: "institutional-report", description: "Wrye Bash advanced readme and SKSE/F4SE documentation: script extenders injecting .dll hooks into the host executable to expose functions the vendor never compiled, becoming a new de facto fixed tier (felesnoctis.github.io wrye-bash-docedit advanced readme)" },
  { source_id: "src:mod-xedit-conflict", source_class: "institutional-report", description: "xEdit conflict-detection-and-resolution documentation: the last-writer-wins load-order resolution and the color-coded conflict matrix (override, conflict loser, conflict winner) that renders the composition stack (tes5edit.github.io/docs/5-conflict-detection-and-resolution.html)" },
  { source_id: "src:mod-compat-patch", source_class: "testimony", description: "Nexus Mods permissions discussion: permissionless user-to-user compatibility patching with the source modules held as unedited hard requirements (reddit.com/r/skyrimmods, closed/open permissions thread fdv82r)" },
  { source_id: "src:mod-downgrade", source_class: "testimony", description: "Unofficial Skyrim Special Edition Downgrade Patcher discussion: reverting the local binary to version 1.5.97 to restore the fixed-tier state the extended architecture requires (reddit.com/r/skyrimmods thread qrf0v6)" },
  { source_id: "src:mod-nexus-archive", source_class: "testimony", description: "Nexus Mods 2021 policy discussion: Collections and the replacement of file deletion with archiving to protect load-order dependencies, the Cathedral-over-Parlor decision (reddit.com/r/skyrimmods thread o5bqh3)" },

  // ---- decentralized finance (the adjacent field tested under adversarial attack at scale) ----
  { source_id: "src:defi-slashing", source_class: "institutional-report", description: "Proof-of-stake slashing conditions (Ethereum consensus / Casper FFG specification and comparable staking protocols): an automatic penalty on provably attributable equivocation, coupled to a transferable stake" },
  { source_id: "src:defi-light-client", source_class: "institutional-report", description: "Light-client and state-proof verification (Ethereum light clients; IBC light-client design): verifying state from a state root plus a Merkle inclusion path without running the full system" },
  { source_id: "src:defi-timelock", source_class: "institutional-report", description: "On-chain governance timelocks (Compound Governor and OpenZeppelin TimelockController pattern) and the flash-loan governance attack class: queued execution delaying instantaneously assembled voting power" },
  { source_id: "src:defi-commit-reveal", source_class: "institutional-report", description: "Commit-reveal schemes (ENS registration and sealed-bid auction designs): submitting a hash to timestamp priority before revealing content, defeating front-running of pending submissions" },
  { source_id: "src:defi-ipc", source_class: "institutional-report", description: "Inter-chain communication protocols (the IBC specification and comparable cross-chain messaging): connection and channel handshakes with mutual light-client verification, timeout semantics, and versioned channel upgrades" },
  { source_id: "src:defi-bridge-hacks", source_class: "institutional-report", description: "Cross-chain bridge exploit post-mortems as a class (custodial, multisig, and trusted-relayer bridges): the field's largest recorded losses concentrated at trust-pooling boundaries" },
  { source_id: "src:defi-restaking", source_class: "institutional-report", description: "Restaking and shared-security analyses (EigenLayer-style pooled collateral): correlated-slashing and contagion risk when one stake secures many systems" },
  { source_id: "src:defi-oracle", source_class: "institutional-report", description: "The blockchain oracle problem literature (Chainlink and comparable decentralized-oracle designs): attesting off-system facts into a trustless system via multiple independent attestors, outlier rejection, and staked attestation" },

  // ---- the five-axis neighborhood map ----
  { source_id: "src:mathlib", source_class: "preprint", description: "The Lean Mathematical Library, arXiv:1910.09336; Lean proof assistant (dependent type theory, the compiler as grounding linter)" },
  { source_id: "src:nanopub", source_class: "institutional-report", description: "Nanopublication Guidelines (nanopub.net) and The Anatomy of a Nanopublication (W3C): RDF quads segregating assertion, provenance, publication" },
  { source_id: "src:ceramic", source_class: "institutional-report", description: "Ceramic Network documentation and blog: ComposeDB data models and multi-homed IPFS federation" },
  { source_id: "src:augur", source_class: "preprint", description: "Augur: a Decentralized Oracle and Prediction Market Platform, whitepaper arXiv:1501.01042 (REP dispute bonds and forking universes)" },
  { source_id: "src:kialo", source_class: "institutional-report", description: "Kialo voting documentation: Impact equals Veracity plus Relevance, mechanical aggregation of subjective votes" },
  { source_id: "src:scite-eval", source_class: "peer-reviewed", description: "Evaluating the Accuracy of scite, a Smart Citation Index (independent evaluation; F-measures 0.0 to 0.58 across citation types)" },
  { source_id: "src:novelty-synthesis", source_class: "institutional-report", description: "Falsification and Architectural Lineage synthesis: the five-axis neighborhood map across Lean, Ceramic, OriginTrail, Nanopublications, Augur, Kialo, DeSci Nodes, and Golden Protocol" },
];

module.exports = { KINDS, SOURCES };
