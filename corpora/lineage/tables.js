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

  // ---- the internet trust lineage (fifth case): TCP/IP across three acts ----
  { source_id: "src:rfc-821", source_class: "institutional-report", description: "Postel, J. (August 1982), RFC 821 Simple Mail Transfer Protocol: MAIL FROM declares the envelope sender on trust and intermediate servers relay by default (the open relay), no sender authentication" },
  { source_id: "src:rfc-904", source_class: "institutional-report", description: "Mills, D. (April 1984), RFC 904 Exterior Gateway Protocol formal specification: reachability exchanged with statically configured trusted neighbor gateways (the EGPINITFILE), no cryptographic verification" },
  { source_id: "src:rfc-1105", source_class: "institutional-report", description: "Lougheed, K. and Rekhter, Y. (June 1989), RFC 1105 Border Gateway Protocol (BGP-1): the OPEN message carries an authentication code field whose specified default value is zero (no authentication by default)" },
  { source_id: "src:rfc-1034", source_class: "institutional-report", description: "Mockapetris, P. (November 1987), RFC 1034 and RFC 1035 Domain Names: a response is matched to its query by a 16-bit query identifier carried over UDP, no cryptographic binding of the answer to the question" },
  { source_id: "src:rfc-6962", source_class: "institutional-report", description: "Laurie, B., Langley, A., Kasper, E. (June 2013), RFC 6962 Certificate Transparency: append-only Merkle-tree logs of issued certificates that major browsers require, constraining certificate-authority discretion by public audit" },
  { source_id: "src:rfc-9518", source_class: "institutional-report", description: "Nottingham, M. (December 2023), RFC 9518 Centralization, Decentralization, and Internet Standards: the trust-architecture analysis of centralizing forces and their limits, the layer at which the internet-protocol lineage maps onto a claim graph" },
  { source_id: "src:rfc-789", source_class: "institutional-report", description: "Rosen, E. (July 1981), RFC 789 Vulnerabilities of Network Control Protocols: An Example: the October 27 1980 ARPANET collapse, a hardware fault in one IMP dropping bits and propagating garbled status updates" },
  { source_id: "src:clark-1988", source_class: "peer-reviewed", description: "Clark, D. (1988), 'The Design Philosophy of the DARPA Internet Protocols', ACM SIGCOMM: the ordered goal list with accountability last and network-layer security absent" },
  { source_id: "src:bellovin-1995", source_class: "peer-reviewed", description: "Bellovin, S. (written circa 1990, released 1995), 'Using the Domain Name System for System Break-ins', with Schuba, C. (1993) analysis: sequential-transaction-ID prediction and additional-section cache poisoning in the BIND resolver" },
  { source_id: "src:thuerk-1978", source_class: "institutional-report", description: "The Gary Thuerk (DEC) unsolicited ARPANET mail incident, May 3 1978: 393 recipients and a Defense Communications Agency reprimand as the sufficient sanction (dated incident record)" },
  { source_id: "src:nsfnet-history", source_class: "institutional-report", description: "NSFNET commercialization and decommission record: the Scientific and Advanced-Technology Act of 1992 authorizing commercial backbone traffic and the NSFNET backbone decommission completed April 30 1995" },
  { source_id: "src:hobbes-timeline", source_class: "institutional-report", description: "Hobbes' Internet Timeline (Robert H Zakon) internet host counts: 617,000 in October 1991 rising to 9,472,000 in January 1996" },
  { source_id: "src:morris-record", source_class: "institutional-report", description: "The Morris worm incident record, November 2 1988: a self-replicating program exploiting a finger overflow and rsh/rexec trust relationships, infecting an estimated 6,000 of about 60,000 hosts within a day" },
  { source_id: "src:canter-siegel-record", source_class: "institutional-report", description: "The Canter and Siegel Usenet spam incident record, April 12 1994: a Perl script posting one identical advertisement to over 5,500 newsgroups in about 90 minutes" },
  { source_id: "src:as7007-record", source_class: "institutional-report", description: "The AS7007 route-leak incident record, April 25 1997 (NANOG mail archive Apr 1997; RISKS Digest 19.12): MAI Network Services deaggregated routes to more-specific prefixes rewritten to originate from AS7007, drawing global traffic into one small network for hours" },
  { source_id: "src:comodo-record", source_class: "institutional-report", description: "The Comodo registration-authority compromise, March 2011 (Mozilla Security Blog follow-up): a reseller RA breach yielding misissued certificates for high-value domains, the certificate authority surviving the incident" },
  { source_id: "src:diginotar-record", source_class: "institutional-report", description: "The DigiNotar compromise, 2011: at least 531 misissued certificates including a wildcard used against approximately 300,000 Iranian Gmail users, Dutch government operational control, and bankruptcy declared September 20 2011" },
  { source_id: "src:symantec-record", source_class: "institutional-report", description: "The Symantec certificate-authority distrust, announced September 2017: a browser vendor's phased distrust completed in Chrome 65 and 66 in early 2018, forcing the sale of Symantec's PKI business to DigiCert" },
  { source_id: "src:fastly-record", source_class: "institutional-report", description: "The Fastly CDN global outage, June 8 2021 (vendor postmortem): a latent software bug triggered by a customer configuration returning errors across about 85% of the network, mitigated within roughly an hour" },
  { source_id: "src:akamai-record", source_class: "institutional-report", description: "The Akamai Edge DNS disruption, July 22 2021 (vendor postmortem): a configuration update causing widespread DNS resolution failures across major sites until the mapping update was rolled back" },
  { source_id: "src:arin-legacy", source_class: "institutional-report", description: "ARIN legacy-address policy record (arin.net blog, 2023): the Legacy Registration Services Agreement fee cap expiring December 31 2023, an economic disincentive for legacy holders to register and adopt RPKI" },
  { source_id: "src:apnic-rpki-2025", source_class: "institutional-report", description: "APNIC 2025 RPKI deployment review: continued growth in Route Origin Validation adoption and valid ROA coverage, adoption still partial" },
  { source_id: "src:dmarcguard-2026", source_class: "institutional-report", description: "DMARCguard 2026 email-provider analysis and the Corby-Tuech mailbox study: contested mailbox market-share metrics (send-volume, install, and open rates disagree, open data inflated by Apple Mail Privacy Protection) and templated machine-generated B2C mail reaching about 90% of major-provider non-spam volume" },
];

module.exports = { KINDS, SOURCES };
