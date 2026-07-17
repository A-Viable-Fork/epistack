// Role: the per-era trust contracts of the internet lineage (fifth case), as structured data. One row
//   per trust decision per act: the decision, the era's policy for it, who held enforcement, and the
//   documented failure, each row pointing at the net.* claims that ground it. This feeds the coming
//   counterexample-kernel exhibit, which will encode each era as a faithfully NON-CONFORMING kernel and
//   run build/check-conformance.mjs over it, mapping the era's contract-register violations to these
//   documented failures. The loving frame holds throughout: Act 1 was right for its regime.
// Contract: exports CONTRACTS, an array of { era, trust_decision, era_policy, enforcement_holder,
//   documented_failure, claim_refs }. Pure data; imports nothing and is imported by nothing yet (not
//   wired into any build target). The claim_refs are net.* refs resolvable in corpora/lineage/lineage.js.
// Invariant: every claim_ref names a real net.* claim; the table reports the contracts, it prices nothing.
"use strict";

const CONTRACTS = [
  // ---- Act 1: the cooperative regime. Producer trust was the correctly calibrated basis. ----
  {
    era: "Act 1: cooperative regime",
    trust_decision: "sender identity (mail)",
    era_policy: "the MAIL FROM envelope sender declared on trust and intermediate servers relaying by default (the open relay), RFC 821 (1982)",
    enforcement_holder: "the endpoint operators, a small club of accountable institutions",
    documented_failure: "none in regime: a single unsolicited mailing to 393 recipients (1978) was answered by a Defense Communications Agency reprimand, the social sanction sufficing",
    claim_refs: ["net.smtp-noauth", "net.thuerk-1978", "net.well-calibrated"],
  },
  {
    era: "Act 1: cooperative regime",
    trust_decision: "route legitimacy (routing)",
    era_policy: "reachability exchanged with statically configured trusted neighbors (EGP, RFC 904, 1984) and a BGP-1 authentication field defaulting to zero (RFC 1105, 1989)",
    enforcement_holder: "peering operators by mutual acquaintance",
    documented_failure: "none adversarial in regime: the era's defining outage was the accidental 1980 ARPANET collapse, an Interface Message Processor dropping bits, physical rather than malicious",
    claim_refs: ["net.egp-trust", "net.bgp1-auth-zero", "net.arpanet-crash-1980", "net.well-calibrated"],
  },
  {
    era: "Act 1: cooperative regime",
    trust_decision: "name resolution (DNS)",
    era_policy: "a response matched to its query by a 16-bit query identifier over UDP, no cryptographic binding, RFC 1034 and 1035 (1987)",
    enforcement_holder: "cooperative resolver operators",
    documented_failure: "none in regime: Clark's 1988 goal list placed accountability last and omitted network-layer security, a deliberate and correct calibration for the club",
    claim_refs: ["net.dns-txid", "net.clark-priorities", "net.well-calibrated"],
  },

  // ---- Act 2: the regime shift. The same register, unchanged, against a shifted input population. ----
  {
    era: "Act 2: regime shift",
    trust_decision: "sender identity (mail)",
    era_policy: "the same unauthenticated MAIL FROM, now facing an anonymous commercial sender population after the 1992 Act and the 1995 NSFNET decommission",
    enforcement_holder: "none: the social accountability the basis rested on was gone at scale",
    documented_failure: "the Canter and Siegel Perl script posting to over 5,500 newsgroups in about 90 minutes (April 12 1994), the first automated commercial abuse",
    claim_refs: ["net.canter-siegel-1994", "net.regime-shift-policy", "net.host-growth", "net.cost-inversion"],
  },
  {
    era: "Act 2: regime shift",
    trust_decision: "route legitimacy (routing)",
    era_policy: "the same trust-based BGP reachability against a commercialized, faceless backbone",
    enforcement_holder: "none: no authentication field was ever populated",
    documented_failure: "the AS7007 route leak (April 25 1997), deaggregated more-specific prefixes rewritten to AS7007 drawing global traffic into one small network for hours",
    claim_refs: ["net.as7007-1997", "net.cost-inversion"],
  },
  {
    era: "Act 2: regime shift",
    trust_decision: "name resolution (DNS)",
    era_policy: "the same 16-bit query-id matching against adversaries who could predict it",
    enforcement_holder: "none: the resolver trusted any well-formed answer",
    documented_failure: "DNS cache poisoning, documented by Bellovin (circa 1990, released 1995) and Schuba (1993) years before bailiwick checking arrived at CERT CA-1997-22 (1997)",
    claim_refs: ["net.dns-poisoning-known", "net.cost-inversion"],
  },

  // ---- Act 3: reinforcement. Bolt-on patches secured the legacy base, and the price was recentralization. ----
  {
    era: "Act 3: reinforcement",
    trust_decision: "mail authentication",
    era_policy: "bolt-on sender authentication via DNS (SPF, DKIM, DMARC) plus machine-learned spam classification beyond a small operator's reach",
    enforcement_holder: "a few private mailbox providers (Google, Microsoft, Apple)",
    documented_failure: "inbox legitimacy concentrated in a few providers, senders now writing templated B2C mail for the classifier (about 90% of major-provider non-spam volume), self-hosting reduced to soft exclusion",
    claim_refs: ["net.recentralization", "net.mail-share-contested", "net.variety-cost", "net.selfhost-undercut"],
  },
  {
    era: "Act 3: reinforcement",
    trust_decision: "certificate trust (PKI)",
    era_policy: "Certificate Transparency append-only logs (RFC 6962, 2013; browser-required since 2018) plus browser-vendor distrust of misbehaving authorities",
    enforcement_holder: "a few browser vendors, holding discretion over which certificate authorities are trusted",
    documented_failure: "the Comodo RA compromise (March 2011), the DigiNotar breach and bankruptcy (531+ misissued certificates, about 300,000 Iranian Gmail users targeted, bankruptcy September 20 2011), and the Symantec distrust forcing a PKI-business sale (2017 to 2018)",
    claim_refs: ["net.comodo-2011", "net.diginotar-2011", "net.symantec-2017", "net.ct-logs", "net.recentralization"],
  },
  {
    era: "Act 3: reinforcement",
    trust_decision: "reachability (CDN)",
    era_policy: "reachability and denial-of-service absorption via a few global content-delivery and scrubbing networks",
    enforcement_holder: "a few content-delivery networks (Cloudflare, Akamai, Fastly, Amazon)",
    documented_failure: "single-operator logical errors taking large fractions of the web offline: the Fastly outage (June 8 2021) and the Akamai Edge DNS failure (July 22 2021)",
    claim_refs: ["net.fastly-2021", "net.akamai-2021", "net.recentralization"],
  },
  {
    era: "Act 3: reinforcement",
    trust_decision: "route origin (RPKI)",
    era_policy: "Route Origin Validation via the Resource Public Key Infrastructure, the closest the routing layer has come to a structural rebase",
    enforcement_holder: "the regional registries and route-origin authorities, adoption still partial",
    documented_failure: "adoption slowed by legacy-address economics: the ARIN legacy fee cap expired December 31 2023, a disincentive for legacy holders to register and sign",
    claim_refs: ["net.rpki-growth", "net.arin-legacy-friction", "net.federation-survived"],
  },
];

module.exports = { CONTRACTS };
