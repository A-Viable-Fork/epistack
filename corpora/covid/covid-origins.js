// Role: the densified covid-origins case (Prompt 23a), ingested from the Rootclaim-debate write-up.
//   The evidence pieces ground to their floors; where the write-up separates an observation from its
//   interpretation, the observation is a measurement and the interpretation a contested forum claim.
//   The zoonosis and lab-leak conclusions are a contradicts-linked forum pair, each resting on the
//   SAME shared evidence and on its own explicit prior claims, so the crux computation resolves the
//   contradiction to the priors (the frontier where the two support cones diverge). The divergence
//   meta-claim, the judges' ruling, and the method critique sit in the forum.
// Contract: exports COVID = { store_id, claims:[spec], links:[spec] }; claim/link specs use local
//   refs, resolved by build/covid-build.mjs. Pure data; corpora imports nothing.
// Invariant: the write-up is canonical for what the claims and sides are, never for the grade they
//   earn; the gate computes the grade, and where it disagrees with the proposed mode that is a finding.
"use strict";

const chk = (checker, method_class, method) => ([{ checker_id: checker, method_class, method: method || "peer-reviewed", checked_at_state: "genesis", outcome: "confirms", independence: "distinct-party" }]);
const P = "covid.origins: ";

const claims = [
  // ---- the shared evidence, ground to the measurement floor ----
  { ref: "ev.clustering", kind: "measurement", declared_grade: "checked", source_id: "src:worobey-2022", contributor_id: "study:worobey",
    statement: P + "the 155 December-2019 cases with location data had a median distance of 4.28 km to the Huanan market (P<0.001) against 16.11 km for age-matched controls", checking_records: chk("worobey-audit", "data-audit") },
  { ref: "ev.clustering-robust", kind: "measurement", declared_grade: "checked", source_id: "src:worobey-2022", contributor_id: "study:worobey",
    statement: P + "the market spatial association survived sensitivity analysis: up to 38 (24%) of the closest cases could be removed before losing significance on the center-point test, 98 (63%) on the median test", checking_records: chk("worobey-sens", "data-audit") },
  { ref: "ev.env-samples", kind: "measurement", declared_grade: "checked", source_id: "src:liu-2023", contributor_id: "study:liu",
    statement: P + "of 923 environmental samples from the market, 74 (8.0%) were positive for SARS-CoV-2, and 87.5% (56/64) of inside-market positives came from the wildlife-selling West Zone; all 457 animal samples were negative", checking_records: chk("china-cdc", "data-audit") },
  { ref: "ev.wildlife-dna", kind: "measurement", declared_grade: "checked", source_id: "src:crits-2024", contributor_id: "study:crits",
    statement: P + "all five positive environmental samples from one wildlife stall contained raccoon-dog, bamboo-rat, and civet DNA exceeding human DNA, alongside related animal viruses (an observation of wildlife DNA, not of infected animals)", checking_records: chk("metagenomic", "direct-measurement") },
  { ref: "ev.two-lineages", kind: "measurement", declared_grade: "checked", source_id: "src:pekar-2022", contributor_id: "study:pekar",
    statement: P + "both SARS-CoV-2 lineages A and B are linked to the market: lineage B in market cases and samples, lineage A in a glove sample and in early cases within 2 km of the market (an observation of lineage location, not of two spillovers)", checking_records: chk("lineage-seq", "data-audit") },
  { ref: "ev.furin-site", kind: "measurement", declared_grade: "checked", source_id: "src:segreto-2020", contributor_id: "study:segreto",
    statement: P + "the SARS-CoV-2 polybasic furin cleavage site was created by a precise 12-nucleotide insertion (PRRA) at the S1/S2 junction, and it is the only sarbecovirus of more than 800 known to carry one", checking_records: chk("seq-compare", "data-audit") },
  { ref: "ev.cgg-codons", kind: "measurement", declared_grade: "checked", source_id: "src:romeu-2023", contributor_id: "study:romeu",
    statement: P + "the arginine codon CGG occurs at only 3-5% frequency in sarbecoviruses, so the CGG-CGG pair in the furin insertion is rare, and both codons are over 99.8% conserved across more than 2.3 million genomes", checking_records: chk("codon-count", "data-audit") },
  { ref: "ev.defuse", kind: "measurement", declared_grade: "checked", source_id: "src:defuse-2021", contributor_id: "doc:defuse",
    statement: P + "the 2018 DEFUSE proposal to DARPA, by researchers including WIV collaborators, described inserting human-specific furin cleavage sites into bat SARS-related coronaviruses; it was not funded", checking_records: chk("proposal-text", "data-audit") },
  { ref: "ev.animals-not-tested", kind: "measurement", declared_grade: "checked", source_id: "src:liu-2023", contributor_id: "study:liu",
    statement: P + "no live raccoon dogs, civets, or porcupines were tested for SARS-CoV-2 at the market, the animals having been cleared before sampling began, and the market was sanitized on 1 January 2020 before systematic sampling", checking_records: chk("sampling-record", "data-audit") },
  { ref: "ev.market-sanitized", kind: "measurement", declared_grade: "checked", source_id: "src:worobey-2022", contributor_id: "study:worobey",
    statement: P + "about one million wild mammals on Hubei wildlife farms supplying the market were released, sold, or killed in early 2020 without SARS-CoV-2 testing", checking_records: chk("farm-record", "data-audit") },

  // ---- the contested interpretations, forum claims resting on the measured observations ----
  { ref: "int.wildlife-infected", kind: "forum", declared_grade: "supported", source_id: "src:crits-2024", contributor_id: "interp:infected",
    statement: P + "that infected animals, not infected humans, deposited the market's viral RNA is argued from the wildlife-DNA samples, and is contested" },
  { ref: "int.two-spillovers", kind: "forum", declared_grade: "supported", source_id: "src:weissman-2026", contributor_id: "interp:spillovers",
    statement: P + "that the two lineages record two separate zoonotic spillovers is contested: the Pekar Bayes factor fell from ~60 to ~4.3 after three coding errors, and a further correction may reverse it toward a single introduction" },
  { ref: "int.furin-suboptimal", kind: "forum", declared_grade: "supported", source_id: "src:holmes-2021", contributor_id: "interp:furin",
    statement: P + "the furin site is functionally suboptimal and out-of-frame: natural-origin proponents read this as inconsistent with engineering, lab-leak proponents as consistent with an inexperienced engineer" },
  { ref: "int.ascertainment-bias", kind: "forum", declared_grade: "supported", source_id: "src:weissman-2024", contributor_id: "interp:ascertain",
    statement: P + "that unlinked cases sat closer to the market than linked cases reveals proximity ascertainment bias, so the clustering may reflect where people looked rather than where the virus started (Debarre and Worobey dispute this via commuting patterns)" },
  { ref: "int.bloom", kind: "forum", declared_grade: "asserted", source_id: "src:bloom-2023", contributor_id: "interp:bloom",
    statement: P + "a reanalysis found SARS-CoV-2 abundance correlated most with implausible hosts (fish, cow), so the market-wide metagenomic content is uninformative about which animals were infected (Debarre critiques the ignored spatial-temporal structure)" },
  { ref: "int.centroid", kind: "forum", declared_grade: "asserted", source_id: "src:stoyan-2024", contributor_id: "interp:centroid",
    statement: P + "that a centroid of early cases must be the origin is unproved and the Monte Carlo null was flawed, though under a corrected implementation the market stays within the 95% confidence region (p=0.89)" },

  // ---- the two conclusions, a contradicts-linked forum pair ----
  { ref: "concl.zoonosis", kind: "forum", declared_grade: "corroborated", source_id: "src:acx-2024", contributor_id: "side:miller",
    statement: P + "zoonotic spillover at the market is the more likely origin (Peter Miller's conclusion), resting on the shared evidence read under his priors" },
  { ref: "concl.lableak", kind: "forum", declared_grade: "corroborated", source_id: "src:rootclaim-2024", contributor_id: "side:rootclaim",
    statement: P + "a research-related lab leak is the more likely origin (Rootclaim's conclusion), resting on the same shared evidence read under its priors" },

  // ---- the explicit priors, the nodes the conclusions diverge on ----
  { ref: "prior.miller-zoo", kind: "forum", declared_grade: "asserted", source_id: "src:yong-2024", contributor_id: "prior:miller",
    statement: P + "Miller's prior: a zoonotic pandemic starts in any given year with about 1% probability (one natural pandemic per century), a historical base-rate judgment" },
  { ref: "prior.miller-lableak", kind: "forum", declared_grade: "asserted", source_id: "src:yong-2024", contributor_id: "prior:miller",
    statement: P + "Miller's prior: a lab-leak origin at about 1 in 588 (0.0005 that a lab made such a virus in 2019, times 0.05 that it leaked)" },
  { ref: "prior.rootclaim-hsm", kind: "forum", declared_grade: "asserted", source_id: "src:rootclaim-2024", contributor_id: "prior:rootclaim",
    statement: P + "Rootclaim's prior: the market early cluster is only 2x evidence (near-neutral), since markets repeatedly form early COVID clusters regardless of origin, against Miller's ~10,000x" },
  { ref: "prior.rootclaim-bsl2", kind: "forum", declared_grade: "asserted", source_id: "src:rootclaim-2024", contributor_id: "prior:rootclaim",
    statement: P + "Rootclaim's prior: a researcher working on a SARS-CoV-2-like virus under BSL-2 has about a 15% annual infection probability, and the WIV was planning gain-of-function work under BSL-2" },

  // ---- the meta level: divergence, adjudication, method critique ----
  { ref: "meta.divergence", kind: "forum", declared_grade: "supported", source_id: "src:acx-2024", contributor_id: "meta:divergence",
    statement: P + "six independent Bayesian analyses of the same evidence spanned 23.4 orders of magnitude, from Miller's pro-zoonosis extreme to Rootclaim's pro-lab-leak central estimate, the quantitative form of the crux", checking_records: chk("acx-table", "data-audit") },
  { ref: "meta.no-settlement", kind: "forum", declared_grade: "supported", source_id: "src:acx-2024", contributor_id: "meta:no-settlement",
    statement: P + "a confident origin verdict performs a settlement the evidence does not carry: with a 23-order spread across analysts, the conclusion is prior-driven, not measured" },
  { ref: "meta.judges-ruling", kind: "forum", declared_grade: "asserted", source_id: "src:vantreuren-2024", contributor_id: "meta:judges",
    statement: P + "both judges ruled for zoonosis under their own priors (Van Treuren ~1 in 300, Stansifer ~1 in 3000) while treating the Bayesian calculation as secondary to qualitative reasoning: an expert forum judgment, not a measurement" },
  { ref: "meta.method-critique", kind: "forum", declared_grade: "asserted", source_id: "src:acx-2024", contributor_id: "meta:method",
    statement: P + "the conclusion is highly sensitive to the ordering and independence of the evidence: heroic Bayesian analysis multiplies correlated stages (the Multiple Stage Fallacy), and steelmanning one side compresses its range under adversarial averaging" },
  { ref: "meta.unresolved", kind: "forum", declared_grade: "asserted", source_id: "src:who-sago-2025", contributor_id: "meta:unresolved",
    statement: P + "as of 2025 the origin remains genuinely unresolved: no decisive ancestor virus, records, or engineering signature has emerged, and WHO and the US intelligence community keep all hypotheses on the table" },
];

// the shared evidence each conclusion rests on: the four pieces both sides examine. Wired into BOTH
// conclusions so both cones share them (the resolved sub-region); the priors are wired into one side
// each (the divergence frontier the crux resolves to).
const shared = ["ev.clustering", "ev.furin-site", "ev.two-lineages", "ev.env-samples"];
// each shared support edge carries its evidence's own source, so the four cones rest on disjoint
// footprints and the conclusions earn corroborated by independence lift (the top of the forum band).
const evSrc = { "ev.clustering": "src:worobey-2022", "ev.furin-site": "src:segreto-2020", "ev.two-lineages": "src:pekar-2022", "ev.env-samples": "src:liu-2023" };
const supp = (from, to, grp, src) => ({ link_kind: "supports", from, to, support_group: grp, source_id: src, contributor_id: "wire", declared_grade: "supported" });

const links = [
  // the origins contradiction
  { link_kind: "contradicts", from: "concl.zoonosis", to: "concl.lableak", source_id: "src:acx-2024", contributor_id: "wire", declared_grade: "asserted" },
  // both conclusions rest on the same shared evidence (the resolved region)
  ...shared.map((e) => supp(e, "concl.zoonosis", "g:z:" + e, evSrc[e])),
  ...shared.map((e) => supp(e, "concl.lableak", "g:l:" + e, evSrc[e])),
  // each conclusion rests on its own explicit priors (the divergence frontier)
  supp("prior.miller-zoo", "concl.zoonosis", "g:miller-zoo", "src:yong-2024"),
  supp("prior.miller-lableak", "concl.zoonosis", "g:miller-ll", "src:yong-2024"),
  supp("prior.rootclaim-hsm", "concl.lableak", "g:rc-hsm", "src:rootclaim-2024"),
  supp("prior.rootclaim-bsl2", "concl.lableak", "g:rc-bsl2", "src:rootclaim-2024"),
  // interpretations rest on their measured observations (a contested inference from a measured fact)
  supp("ev.wildlife-dna", "int.wildlife-infected", "g:i1", "src:crits-2024"),
  supp("ev.two-lineages", "int.two-spillovers", "g:i2", "src:pekar-2022"),
  supp("ev.furin-site", "int.furin-suboptimal", "g:i3", "src:segreto-2020"),
  supp("ev.clustering", "int.ascertainment-bias", "g:i4", "src:weissman-2024"),
  // a counterargument that contradicts an interpretation (Bloom vs the infected-animals reading)
  { link_kind: "contradicts", from: "int.bloom", to: "int.wildlife-infected", source_id: "src:bloom-2023", contributor_id: "wire", declared_grade: "asserted" },
  // the divergence spread grounds the no-settlement meta-claim
  supp("meta.divergence", "meta.no-settlement", "g:m1", "src:acx-2024"),
];

module.exports = { COVID: { store_id: "S-covid-origins", claims, links } };
