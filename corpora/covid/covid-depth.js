// Role: the deep extraction of the covid-origins debate. It DEEPENS the first-pass case
//   (covid-origins.js) under the existing spine, not replacing it: each line runs several nodes deep
//   (the ZO reading, the LL counter, the counters to those); three careful readers (Alexander, Van
//   Treuren, Stansifer) weight the same evidence as attributed forum nodes carrying the likelihood
//   ratios, stated-versus-reconstructed intact; reader divergences are first-class contradictions; and
//   each line's sub-crux is wired, several bottoming out in a withheld record typed as such.
// Contract: exports COVID_DEPTH = { claims:[spec], links:[spec] }; refs are local, resolved together
//   with covid-origins.js by build/covid-build.mjs. Extra spec fields (reader, ratio, mark,
//   terminal_type) are read by the oracle and the vendor, not by the claim record. Pure data.
// Invariant: the document is canonical for what the claims, weightings, and ratios are, never for the
//   grade the gate grants; each reader's weighting is held as given, and the debate is not adjudicated.
"use strict";

const D = "covid.origins (deep): ";
const X = "src:deep-extraction";
const chk = (checker) => ([{ checker_id: checker, method_class: "data-audit", method: "peer-reviewed", checked_at_state: "genesis", outcome: "confirms", independence: "distinct-party" }]);

// a measurement that grounds to the floor (a checked observation the debate rests on).
const M = (ref, statement, src, contrib, checker) => ({ ref, kind: "measurement", declared_grade: "checked", source_id: src, contributor_id: contrib, statement: D + statement, checking_records: chk(checker) });
// a forum node: an argument-set reading or a counter, held at the grade its support delivers.
const F = (ref, statement, contrib, g) => ({ ref, kind: "forum", declared_grade: g || "asserted", source_id: X, contributor_id: contrib, statement: D + statement });
// a debater's own written observation: a measurement kind carrying the quantitative content, declared
// honestly at the grade the gate prices (no fabricated distinct-party check; the number is the debater's).
const Mp = (ref, statement, contrib) => ({ ref, kind: "measurement", declared_grade: "asserted", source_id: X, contributor_id: contrib, statement: D + statement });
// a reader's weighting of a piece of evidence: forum, attributed to the reader, carrying the strength
// or likelihood ratio the document records and marked stated or reconstructed as the document marks it.
const W = (ref, reader, statement, ratio, stance, mark) => ({ ref, kind: "forum", declared_grade: "asserted", source_id: X, contributor_id: "reader:" + reader, statement: D + statement, reader, ratio, stance, mark, node_role: "reader-weighting" });
// a sub-crux terminal that bottoms out in a withheld record: a measurement that CANNOT currently ground
// because the record is sealed, carrying a closing condition naming the sealed source. A characterized
// gap by construction, and typed withheld-record, a dispute a named sealed source would resolve.
const WH = (ref, statement, sealed) => ({ ref, kind: "measurement", declared_grade: "asserted", source_id: X, contributor_id: "terminal:withheld", statement: D + statement, terminal_type: "withheld-record", closing_condition: { condition_kind: "measurement-on-the-system", target: sealed, system: sealed } });

const claims = [
  // =====================================================================================
  // LINE 1: the market cluster (HSM). Sub-crux bottoms out in a WITHHELD record.
  // =====================================================================================
  F("mkt.zo", "the market is the genuine origin epicenter: the earliest cases and environmental positives center on the Huanan market's live-wildlife corner", "read:zo", "supported"),
  F("mkt.ll", "the market clustering is an ascertainment artifact of a superspreader event after a prior lab leak and silent community spread", "read:ll", "supported"),
  M("mkt.zo.doubling", "the virus spread within the market at a standard epidemic rate, doubling about every 3.5 days, not the explosive localized burst of a single superspreader event", X, "study:doubling", "doubling-audit"),
  F("mkt.ll.ascertain", "authorities screened market-linked people first following the SARS-1 precedent, so the cluster is self-fulfilling detection bias", "side:ll", "asserted"),
  F("mkt.ll.mahjong", "the southwest environmental clustering reflects the poorly ventilated mahjong room, an enclosed superspreader space, not a wildlife origin", "side:ll", "asserted"),
  F("mkt.zo.eric128", "Eric Stansifer: the LL model needs 128 silent pre-HSM cases; at 5-10% early ascertainment there is at most a 0.14% chance none of the 128 would be detected", "reader:stansifer", "asserted"),
  F("mkt.zo.bethe", "Eric Stansifer: on a Bethe-lattice contact model the zoonotic epidemiological circle is the 600-1200 market residents, the WIV-leak circle is all 12 million of Wuhan", "reader:stansifer", "asserted"),
  F("mkt.will.inconsistent", "Will Van Treuren: the LL mahjong theory relies on complex overdispersed negative-binomial models while LL elsewhere argues complex epidemiological models should be distrusted, an internal inconsistency", "reader:vantreuren", "asserted"),
  W("w.eric.mkt", "stansifer", "Eric Stansifer weights the market location at P(HSM|ZO)/P(HSM|LL) = 20,000x favoring ZO, adjusted to 10,000x", "20,000x->10,000x ZO", "strong-ZO", "stated"),
  W("w.scott.mkt", "alexander", "Scott Alexander weights the market factor at 10,000x favoring ZO, then divides by 4 (opportunity within Wuhan) and 5 (blind outside view) to 500x favoring ZO", "10,000x->500x ZO", "strong-ZO", "stated"),
  W("w.will.mkt", "vantreuren", "Will Van Treuren: conditional on the outbreak occurring in Wuhan, HSM is unambiguously the most likely site of emergence, strong ZO", "strong ZO", "strong-ZO", "stated"),
  F("mkt.subcrux", "the market sub-crux: whether early-case ascertainment protocols missed widespread community transmission, ascertainment bias against genuine origin epicenter", "crux:mkt", "asserted"),
  WH("mkt.term", "the market sub-crux would be resolved by the raw unfiltered patient data and retrospective hospital screening criteria from Wuhan in late 2019, which remain sealed by Chinese authorities", "the sealed raw December-2019 Wuhan case data and retrospective hospital screening criteria"),

  // =====================================================================================
  // LINE 2: the furin cleavage site (FCS). Sub-crux bottoms out in a WITHHELD record.
  // =====================================================================================
  F("fcs.ll", "the furin cleavage site is an engineered insertion: no sarbecovirus has one, the double CGG-CGG codon is human-preferred, and it matches WIV's DEFUSE proposal to insert cleavage sites", "read:ll", "supported"),
  F("fcs.zo", "the furin cleavage site was acquired naturally by recombination: it is common in the broader betacoronaviruses and wild relatives carry proto-cleavage sites at the same junction", "read:zo", "supported"),
  M("fcs.zo.betacommon", "the furin cleavage site is common in the broader Betacoronavirus genus (MERS, HKU1, feline coronaviruses), which recombine frequently", X, "study:beta", "taxon-audit"),
  M("fcs.zo.protofcs", "wild bat viruses RmYN02 and BANAL-116 carry PAAR/PVAR inserts at the exact S1/S2 junction, natural proto-cleavage sites one mutation from functionality", X, "study:proto", "align-audit"),
  F("fcs.zo.ericlag", "Eric Stansifer: the CGG-CGG codon carries the bias of the outside source it recombined from; mutational bias has not yet altered it, so the codon anomaly is mutational lag, not engineering", "reader:stansifer", "asserted"),
  F("fcs.will.suboptimal", "Will Van Treuren: the insertion is slightly out of frame with a suboptimal PRRAR sequence; an optimal engineered pathogen would not be inserted this way, weakening LL", "reader:vantreuren", "asserted"),
  W("w.eric.fcs", "stansifer", "Eric Stansifer assigns the 12-nucleotide furin insertion a Bayes factor of 20x favoring LL", "20x LL", "moderate-LL", "stated"),
  W("w.eric.codon", "stansifer", "Eric Stansifer assigns the CGG-CGG codon argument a Bayes factor of 1x (neutral), explicitly rejecting Rootclaim's 10.68x LL", "1x neutral", "wash", "stated"),
  W("w.will.fcs", "vantreuren", "Will Van Treuren: the taxonomic uniqueness of the FCS depends on the reference class (Subgenus rare, Genus common), a wash on the phylogenetic framing", "wash", "wash", "stated"),
  F("fcs.rootclaim.codon", "Rootclaim assigns the CGG-CGG codon anomaly a 10.68x Bayes factor favoring LL, which Eric Stansifer rejects", "side:rootclaim", "asserted"),
  F("fcs.subcrux", "the FCS sub-crux: natural insertion via viral recombination against artificial genetic engineering, turning on the restriction-site pattern, reading-frame alignment, and codon-usage bias", "crux:fcs", "asserted"),
  WH("fcs.term", "the FCS sub-crux would be resolved by the WIV's unpublished genetic databases, which could prove or disprove the pre-existence of the specific viral backbone and its evolutionary intermediaries", "the sealed WIV unpublished sequencing databases"),

  // =====================================================================================
  // LINE 3: the two lineages (A and B). Sub-crux bottoms out in CONTESTED bioinformatics (not sealed).
  // =====================================================================================
  F("lin.zo", "the two lineages record a double zoonotic spillover: A and B appear simultaneously at the onset near the market, which a single lab introduction would not produce", "read:zo", "supported"),
  F("lin.ll", "Lineage A mutated into B during silent human-to-human spread before the market, and B dominated only because it was present at the HSM superspreader event", "read:ll", "supported"),
  F("lin.ll.intermediates", "scattered intermediate genomes in early patient data show the direct A-to-B evolutionary transition in humans", "side:ll", "asserted"),
  F("lin.zo.autofill", "the claimed intermediate genomes are sequencing-software autofill artifacts (impossible simultaneous T/T and C/C reads), not real mutations", "side:zo", "asserted"),
  F("lin.eric.pekar", "Eric Stansifer: Pekar et al.'s double-spillover simulation uses a Poisson distribution that ignores the clumpy superspreader nature of real transmission, rendering the multiple-spillover conclusion suspect", "reader:stansifer", "asserted"),
  F("lin.eric.lineageA", "Eric Stansifer: the LL theory fails to explain why early Lineage A cases were also clustered near the market if the market was strictly a Lineage B event", "reader:stansifer", "asserted"),
  F("lin.will.transit", "Will Van Treuren: the lack of multiple spillovers along transit routes, trains, and trucks before HSM favors a single introduction (LL)", "reader:vantreuren", "asserted"),
  W("w.eric.lin", "stansifer", "Eric Stansifer weights the two-lineage argument as a wash, with a weak-ZO lean from the unexplained Lineage A clustering", "wash / weak ZO", "wash", "stated"),
  W("w.will.lin", "vantreuren", "Will Van Treuren weights the transmission dynamics as moderate LL, from the absence of transit-route spillovers", "moderate LL", "moderate-LL", "stated"),
  F("lin.subcrux", "the two-lineage sub-crux: multiple zoonotic spillovers against a single spillover with subsequent human mutation, turning directly on whether the intermediate genomes are genuine", "crux:lin", "asserted"),
  F("lin.term", "the two-lineage sub-crux bottoms out in contested bioinformatics: whether the intermediate genomic reads in early databases are genuine biological samples or artifacts of software-autofill logic, a dispute over data interpretation the record has not settled; a later paper (Lv et al 2024) reported intermediate genomes bridging the A-to-B gap, a post-debate entrant into the same contested bioinformatics that does not resolve the debate as it was argued", "terminal:contested", "asserted"),

  // =====================================================================================
  // LINE 4 (NEW): early case data and progenitor reversions. Sub-crux bottoms out in FORMAL clinical
  // records that exist and are decisive (an empirical terminal), and the LL side is thinner in the
  // sources: a real asymmetry (anecdote against serology), reported, not an ingestion lean.
  // =====================================================================================
  F("tmp.ll", "the virus circulated silently in November and early December: Mr Chen (Dec 8, no market link), Connor Reed (November), 92 reported early cases, and progenitor sequences closer to the ancestral virus", "read:ll", "asserted"),
  F("tmp.zo", "the outbreak began explosively at the market in late December with no silent pre-market spread the medical system would have missed", "read:zo", "supported"),
  M("tmp.record", "the observed record of early COVID-19 case-onset dates and hospital admissions in Wuhan through December 2019, the timeline both readings interpret", X, "study:record", "record-audit"),
  F("tmp.ll.cases", "Mr Chen, Connor Reed, and 92 reported cases prove silent pre-market circulation (an anecdotal and media-report line)", "side:ll", "asserted"),
  M("tmp.zo.refute", "the 92 unusual pneumonias were retrospectively negative for COVID-19 on modern assays, and Mr Chen's Dec-8 admission was for dental issues with a Dec-16 nosocomial infection (a clerical backdating error)", X, "study:who", "clinical-audit"),
  M("tmp.zo.doubling256", "at a 3.5-day doubling time, November circulation would have produced about 256 times more January hospitalizations and deaths than were observed", X, "study:epi", "epi-audit"),
  M("tmp.zo.reversions", "the alleged progenitor sequences are random reversions arising months later in distant geographies (e.g. Malaysia), not original Wuhan viral lines", X, "study:phylo", "phylo-audit"),
  W("w.will.tmp", "vantreuren", "Will Van Treuren: retrospective serology of 3,850 blood-bank samples and 640 ILI throat swabs (Sep-Dec 2019 Wuhan) showed zero SARS-CoV-2 seropositivity, immune to ascertainment bias, strong ZO (verification: the underlying records are Chang et al, 32,484 blood donors, and Su et al, 640 ILI PCR swabs; the 3,850 figure has no independent source, pending a read of Van Treuren's decision)", "strong ZO", "strong-ZO", "stated"),
  W("w.eric.tmp", "stansifer", "Eric Stansifer dismisses the Connor Reed anecdote for extreme media selection bias and the absence of any retrospective positive test, strong ZO", "strong ZO", "strong-ZO", "stated"),
  F("tmp.asymmetry", "a structural asymmetry in the sources: the LL early-timeline case rests on anecdote and media reports while the ZO case rests on formal serology and WHO investigation; a real asymmetry in the material, not an ingestion gap", "meta:asymmetry", "asserted"),
  F("tmp.subcrux", "the temporal sub-crux: silent early spread against explosive late spread, turning on the epidemiological doubling time and the serological timeline", "crux:tmp", "supported"),
  M("tmp.term", "the temporal sub-crux is resolved by formal clinical records that exist and are decisive: the retrospective serology of Wuhan blood banks (0 positives in late 2019) and the dental-admission record of Mr Chen", X, "study:serology", "serology-audit"),

  // =====================================================================================
  // LINE 5: raccoon dogs and environmental samples. Sub-crux bottoms out in FORMAL environmental records.
  // =====================================================================================
  F("env.zo", "the environmental samples localize the origin to the southwest wildlife corner: the highest viral concentrations sit at the stalls selling susceptible raccoon dogs", "read:zo", "supported"),
  F("env.ll", "the environmental case is a biased retrospective search: no animal vendors were infected and there is zero correlation between raccoon-dog DNA and SARS-CoV-2 positivity", "read:ll", "supported"),
  M("env.zo.stall", "Eric Stansifer: stall 4:26/28 had 5 of 9 samples positive and stall 6:29 had 5 of 10, the highest concentrations in the southwest wildlife corner, and the drainage exclusively downstream of 6:29 tested positive weeks later", X, "study:env", "swab-audit"),
  F("env.ll.novendors", "no animal vendors were infected and raccoon-dog DNA does not correlate with SARS-CoV-2 positivity in the environmental samples", "side:ll", "asserted"),
  F("env.eric.caged", "Eric Stansifer: DNA non-correlation is expected because caged animals do not mix (only the specific infected cage would correlate), and a primary spillover would likely infect only one vendor, who may have evaded hospitalization", "reader:stansifer", "asserted"),
  W("w.eric.env", "stansifer", "Eric Stansifer weights the environmental and drainage samples concentrated at stall 6:29 as strong ZO", "strong ZO", "strong-ZO", "stated"),
  W("w.eric.envcorr", "stansifer", "Eric Stansifer weights the LL DNA-correlation and vendor-infection arguments as a wash, rejecting their statistical assumptions", "wash", "wash", "stated"),
  F("env.subcrux", "the environmental sub-crux: origin epicenter against sampling bias, turning on the spatial distribution of positive swabs and the DNA correlations", "crux:env", "supported"),
  M("env.term", "the environmental sub-crux is resolved by formal environmental records that exist: the spatial mapping of the market drainage system and the PCR positivity rates of stall 6:29", X, "study:drainage", "drainage-audit"),

  // =====================================================================================
  // LINE 6: DEFUSE, lab records, secret keeping. Sub-crux bottoms out in a WITHHELD record.
  // =====================================================================================
  F("def.ll", "the 2018 DEFUSE proposal is a direct blueprint proving WIV's intent to insert furin cleavage sites into bat coronaviruses, and the absence of matching lab records is a state-sponsored cover-up", "read:ll", "supported"),
  F("def.zo", "there is no evidence DEFUSE was conducted after DARPA rejected it; SARS-CoV-2 has a novel backbone contradicting the proposal's specified backbones, and WIV's role was limited to assays", "read:zo", "supported"),
  F("def.ll.coverup", "the absence of WIV lab records possessing the virus is a state-sponsored cover-up, drawing parallels to Soviet lab-leak cover-ups such as the 1979 Sverdlovsk anthrax release", "side:ll", "asserted"),
  M("def.zo.novelbackbone", "DEFUSE specified using known backbones (WIV1, SHC014) for the insertions, whereas SARS-CoV-2 has a completely novel, previously unidentified backbone, contradicting the proposal's methodology", X, "study:defuse", "grant-audit"),
  F("def.zo.61tasks", "Eric Stansifer: across the DEFUSE tasks, WIV's role was bat sampling, captive-bat vaccine testing, and basic assays; the chimera engineering was designated for UNC, not WIV", "reader:stansifer", "asserted"),
  F("def.eric.secret", "Eric Stansifer assigns a Bayes factor of 1/10 favoring ZO on secret-keeping: a multi-year state conspiracy across dozens of workers and international collaborators is unlikely to hold without a single whistleblower", "reader:stansifer", "asserted"),
  F("def.will.scale", "Will Van Treuren: the historical lab leaks LL cites (0.5-1 kg weapons-grade anthrax at Sverdlovsk, 6,000 litres at Pirbright) were industrial-scale and incomparable to WIV's operations, invalidating the high-prior argument", "reader:vantreuren", "asserted"),
  F("def.will.nobackbone", "Will Van Treuren: both sides agree WIV did not publicly possess a backbone close enough to construct SARS-CoV-2, so the LL theory relies entirely on undisclosed secret databases", "reader:vantreuren", "asserted"),
  W("w.eric.def", "stansifer", "Eric Stansifer weights the secret-keeping conspiracy at a Bayes factor of 1/10 favoring ZO", "1/10 ZO", "strong-ZO", "stated"),
  W("w.will.def", "vantreuren", "Will Van Treuren weights the DEFUSE and lab-capability line as strong ZO, from the incomparable historical scales and the absent public backbone", "strong ZO", "strong-ZO", "stated"),
  F("def.subcrux", "the DEFUSE sub-crux: a documentary blueprint against speculative implementation, turning on the division of labour in the DEFUSE tasks and the absence of a matching viral backbone", "crux:def", "asserted"),
  WH("def.term", "the DEFUSE sub-crux would be resolved by the WIV's sealed internal databases, which LL claims contain the secret backbone and ZO claims never existed", "the sealed WIV internal databases and lab records"),

  // =====================================================================================
  // TOP LEVEL: the three readers' priors and final estimates, and the 23-order divergence between them.
  // =====================================================================================
  W("w.eric.prior-zo", "stansifer", "Eric Stansifer reconstructs a ZO prior of 1/32,000 from the coronavirus emergence rate (1/20yr) times pandemic potential (1/4), severity (1/2), and HSM location (1/200)", "1/32,000 ZO prior", "prior", "reconstructed"),
  W("w.eric.prior-ll", "stansifer", "Eric Stansifer reconstructs an LL prior of 1/17,000 from GoF probability (1/50), annualized (1/1.7), backbone (1/2), success (1/2), and leak (1/50), which slightly favors a lab leak before updates", "1/17,000 LL prior", "prior", "reconstructed"),
  W("w.eric.posterior", "stansifer", "Eric Stansifer's likelihood updates (10,000x ZO on HSM location, 10x ZO on whistleblower absence) push his final posterior to 0.075% for a lab leak, favoring ZO", "0.075% LL posterior", "strong-ZO", "stated"),
  W("w.will.prior", "vantreuren", "Will Van Treuren models a prior odds ratio LL/ZO of 1.7e-3 after Weissman, heavily favoring ZO", "1.7e-3 prior odds", "strong-ZO", "stated"),
  W("w.will.update", "vantreuren", "Will Van Treuren's cumulative product of evidence updates is 2.125, slightly favoring LL", "2.125 update product", "weak-LL", "stated"),
  W("w.will.posterior", "vantreuren", "Will Van Treuren's final posterior odds is 3.6e-3, about a 1 in 300 chance of a lab leak, declaring ZO the winner", "3.6e-3 (1 in 300) LL", "strong-ZO", "stated"),
  W("w.scott.intuitive", "alexander", "Scott Alexander shifted from a 50-50 pre-debate prior to a 90-10 intuitive probability favoring ZO after reviewing the evidence", "90% ZO intuitive", "strong-ZO", "stated"),
  W("w.scott.bayes", "alexander", "Scott Alexander's adjusted Bayesian calculation (10,000x market factor divided by 4 and 5) yields a 95% probability of zoonosis, aligning with his intuition", "95% ZO", "strong-ZO", "stated"),
  F("meta.space-lizard", "Eric Stansifer's fragility warning: collecting 100 observations and computing a Bayes factor for each lets a slightly biased observer reach extreme certainty for an absurd hypothesis (the space-lizard analogy), by selecting anomalous observations while ignoring baseline data", "reader:stansifer", "asserted"),
  F("meta.reader-divergence", "the three careful readers reach final estimates spanning orders of magnitude (Stansifer ~1/1300, Van Treuren ~1/300, Alexander ~1/20 for a lab leak) though all favor zoonosis: the prior structure appearing between the assessors, not only between the debaters", "meta:reader-divergence", "asserted"),

  // =====================================================================================
  // CV-DEPTH-2: the debate's PRIMARY written record merged in. Stated numbers route to F/Mp; a genuine
  // peer-reviewed study routes to M with chk; a later analyst's reconstruction routes to W(mark).
  // =====================================================================================
  // ---- LINE 1: market (Rootclaim's own written market case, plus Stansifer's no-intermediates point) ----
  F("mkt.ll.baserate", "Rootclaim: cold, wet, dense seafood markets are early amplification points, with Singapore and Thailand fishery-port precedents, so the market conditional is a base rate, not a one-in-ten-thousand coincidence", "side:rootclaim", "asserted"),
  F("mkt.ll.cond", "Rootclaim states the probability of a market cluster given zoonosis exceeds 1 percent and given natural spillover is 3 to 5 percent, rejecting the extreme-coincidence framing", "side:rootclaim", "asserted"),
  F("mkt.rootclaim.bayes", "Rootclaim's own market weighting: dividing its conditionals yields a Bayes factor under 5, reduced to about 2x favoring zoonosis after discounting for absent infected-wildlife evidence", "side:rootclaim", "asserted"),
  F("mkt.ll.amplifiers", "Rootclaim: the market's 1,000-plus permanent tenants and pervasive cold, wet surfaces make it an ideal superspreader site regardless of origin, a factor dropped from top-level summaries", "side:rootclaim", "asserted"),
  F("mkt.zo.nointermediates", "Stansifer: the lab-leak model cannot account for the complete absence of intermediate human infections between the WIV and the distant market cluster", "reader:stansifer", "asserted"),

  // ---- LINE 2: FCS (two peer-reviewed observations, Miller's and Rootclaim's written arguments, Deigin's mimic, Stansifer's S2 self-revision) ----
  M("fcs.zo.natural15nt", "a 2004 coronavirus naturally acquired a 15-nucleotide insertion adjacent to its cleavage site, and natural 12 to 15 nt insertions are documented", X, "study:insertions", "insertion-audit"),
  M("fcs.zo.cgg3pct", "SARS-CoV-2 uses CGG for arginine about 3 percent of the time elsewhere in its own genome, and in a documented gain-of-function experiment 0 of 5 inserted arginines used CGG", X, "study:codon2", "codon-audit"),
  F("fcs.zo.frameshift", "Miller: the furin site is a messy frameshift-style insertion typical of natural mechanisms, unlike the clean insertions genetic engineers make", "side:zo", "asserted"),
  F("fcs.zo.prrarunopt", "Miller: PRRAR is suboptimal and functions only via a secondary adjacent genomic twist unpredictable in 2019, and the virus later mutated away from PRRAR, indicating an unoptimized natural acquisition", "side:zo", "asserted"),
  F("fcs.ll.optimized", "Rootclaim: the virus outperformed about 50 tested species for human-cell infection and showed a constant early mutation rate without a host-adaptation burst, read as engineering", "side:rootclaim", "asserted"),
  F("fcs.ll.mimic", "Deigin: engineers studying natural pandemic origins might deliberately insert a suboptimal, natural-looking sequence like PRRAR to avoid engineering hallmarks", "side:rootclaim", "asserted"),
  W("w.eric.fcs.s2", "stansifer", "Stansifer's post-debate reconstruction: the biological Bayes factor for lab leak becomes modest once penalized for the absent expected subsequent S2-subunit amino-acid changes", "modest LL (penalized)", "weak-LL", "reconstructed"),

  // ---- LINE 3: two lineages (Weissman's polytomy critique, distinct from Stansifer's Poisson critique) ----
  F("lin.weissman.polytomy", "Weissman: ascertainment-biased cluster sampling from hospital alerts and contact tracing generates phylogenetic polytomies that Pekar's model misreads as multiple independent spillovers", "reader:weissman", "asserted"),

  // ---- LINE 4: temporal (Chang serology study, Miller's own written doubling model, Rootclaim's timeline, Miller's map omission) ----
  M("tmp.zo.serology32k", "Miller cited Chang et al 2022: a neutralization assay on 32,484 Wuhan blood donors from September to December 2019 found 0 seropositive, a ceiling on pre-December spread", X, "study:chang", "serology-audit"),
  Mp("tmp.zo.doubling394", "Miller's written model: adjusting for time-varying severe-case ascertainment yields a 3.94-day doubling, and back-calculating from about 156,500 January-23 infections places the earliest start at November 15", "side:zo"),
  F("tmp.ll.october", "Rootclaim's written timeline: at a 3.5-day doubling, reaching outbreak levels needs 11.5 doublings, about 5.7 weeks, placing patient zero in late October", "side:rootclaim", "asserted"),
  F("tmp.ll.reedcat", "Rootclaim's defense of Connor Reed: the cat-timeline inconsistency is explained by Reed not noticing how long the cat, not his own, had been ill", "side:rootclaim", "asserted"),
  F("tmp.ll.incidental", "Rootclaim's insulation move: even granting the Mr Chen and 92-pneumonia debunkings were not completed, these anecdotes are incidental to the core Bayesian analysis", "side:rootclaim", "asserted"),
  F("tmp.zo.mapomission", "Miller: the maps used for ascertainment modeling dropped known non-market cases, Wei Guixian (onset Dec 10) and Accountant Chen (onset Dec 16), complicating the ascertainment-bias argument", "side:zo", "asserted"),

  // ---- LINE 5: environmental (two peer-reviewed surveillance studies, Miller's dead-storage counter, Stansifer's deposition mechanism) ----
  M("env.zo.samples", "515 environmental samples were collected immediately after the January 1 2020 closure, and of 60 drains sampled 4 were positive including the drain directly in front of stall 6:29", X, "study:env2", "env2-audit"),
  M("env.ll.animals", "of 457 animal samples across 18 species from the market, 0 tested positive for the virus", X, "study:animals", "animal-audit"),
  F("env.zo.deadstorage", "the negative animal samples are largely irrelevant: most were taken months after closure, primarily from dead animals in cold storage, and a single infected animal suffices to seed the outbreak", "side:zo", "asserted"),
  F("env.eric.deposition", "Stansifer: near-zero human-DNA to viral-RNA correlation is expected because human DNA deposits constantly while viral shedding varies by orders of magnitude over an infection", "reader:stansifer", "asserted"),

  // ---- LINE 6: DEFUSE (Rootclaim's post-debate grievance about the judge's underestimates) ----
  F("def.rootclaim.underest", "Rootclaim's post-debate grievance: the judge underestimated by about 0.02 both the chance a WIV researcher would independently pursue a project of institutional interest and the chance of an unremarked BSL-2 infection", "side:rootclaim", "asserted"),

  // ---- META / method (the LessWrong aggregation critique, procedural admissions, HN reading, Weissman's two reconstructions) ----
  F("meta.fct", "a LessWrong critique of the aggregation method: multiplying unconstrained subjective likelihood ratios across a composite hypothesis, assuming independence, manufactures artificial certainty, the false-confidence and space-lizard failure", "analyst:lesswrong", "asserted"),
  F("meta.selfref", "two procedural admissions: Rootclaim did not investigate Miller's material pre-debate, treating empirical prep as secondary to strategy, and after the unanimous loss revised its own lab-leak posterior upward", "meta:procedural", "asserted"),
  F("meta.eric-conditioning", "a contested reading (Hacker News) notes a possible inconsistency in Stansifer's conditioning: dismissing some market evidence under a first-superspreader presumption while elsewhere avoiding conditioning on the market", "analyst:hn", "asserted"),
  W("w.weissman.cgg", "weissman", "Weissman reconstructs a data-driven Bayes factor of about 7x favoring lab leak for the CGG-CGG sequence, from analogous transcript-switching inserts, replacing arbitrary codon probabilities", "7x LL", "moderate-LL", "reconstructed"),
  W("w.weissman.fattail", "weissman", "Weissman bounds all likelihood ratios with a fat-tailed 3-degree-of-freedom t-distribution prior to prevent extreme values from dominating the posterior, a safeguard against the false-confidence failure", "fat-tailed bound", "method", "reconstructed"),

  // ---- the single coverage-gap note, a standalone forum node mirroring tmp.asymmetry (unwired) ----
  F("meta.live-gap", "certain live-debate exchanges are attested only in secondary summaries with no written primary and no timestamped transcript in the accessible corpus, so they are recorded as a known coverage gap rather than grounded; examples include the live cage-air-gap and multiple-spillover exchange and the step-by-step space-lizard per-observation derivation; and the endonuclease restriction-map fingerprint circulating around the debate is post-debate literature, not argued in the debate, noted here as out of scope", "meta:live-gap", "asserted"),
];

// ---- links: the argument sets attach under the existing spine; the readings contradict per line;
// the reader weightings support the side they favor; reader divergences on shared evidence are
// first-class contradictions; each sub-crux bottoms out (depends-on) in its terminal. ----
const supp = (from, to, grp) => ({ link_kind: "supports", from, to, support_group: grp, source_id: X, contributor_id: "wire", declared_grade: "supported" });
const contra = (from, to) => ({ link_kind: "contradicts", from, to, source_id: X, contributor_id: "wire", declared_grade: "asserted" });
const dep = (from, to) => ({ link_kind: "depends-on", from, to, source_id: X, contributor_id: "wire", declared_grade: "asserted" });

const links = [
  // ---------- LINE 1: market ----------
  contra("mkt.zo", "mkt.ll"),
  supp("ev.clustering", "mkt.zo", "g:mkt:z:clust"), supp("ev.clustering", "mkt.ll", "g:mkt:l:clust"), // the spine both readings share
  supp("mkt.zo.doubling", "mkt.zo", "g:mkt:z:doub"), supp("mkt.zo.eric128", "mkt.zo", "g:mkt:z:e128"), supp("mkt.zo.bethe", "mkt.zo", "g:mkt:z:bethe"),
  supp("mkt.ll.ascertain", "mkt.ll", "g:mkt:l:asc"), supp("mkt.ll.mahjong", "mkt.ll", "g:mkt:l:mah"),
  contra("mkt.will.inconsistent", "mkt.ll.mahjong"), // Will's counter to the LL mahjong model
  supp("w.eric.mkt", "mkt.zo", "g:mkt:z:we"), supp("w.scott.mkt", "mkt.zo", "g:mkt:z:ws"), supp("w.will.mkt", "mkt.zo", "g:mkt:z:ww"),
  dep("mkt.subcrux", "mkt.term"), // the sub-crux bottoms out in the withheld record
  supp("mkt.zo.eric128", "mkt.subcrux", "g:mkt:sc"),

  // ---------- LINE 2: FCS ----------
  contra("fcs.zo", "fcs.ll"),
  supp("ev.furin-site", "fcs.ll", "g:fcs:l:site"), supp("ev.furin-site", "fcs.zo", "g:fcs:z:site"), // the spine
  supp("ev.cgg-codons", "fcs.ll", "g:fcs:l:codon"),
  supp("fcs.zo.betacommon", "fcs.zo", "g:fcs:z:beta"), supp("fcs.zo.protofcs", "fcs.zo", "g:fcs:z:proto"), supp("fcs.zo.ericlag", "fcs.zo", "g:fcs:z:lag"),
  supp("fcs.will.suboptimal", "fcs.zo", "g:fcs:z:sub"),
  supp("w.eric.fcs", "fcs.ll", "g:fcs:l:we"), supp("w.eric.codon", "fcs.zo", "g:fcs:z:wec"), supp("w.will.fcs", "fcs.zo", "g:fcs:z:ww"),
  contra("w.eric.codon", "fcs.rootclaim.codon"), // Eric's 1x rejects Rootclaim's 10.68x LL
  contra("w.eric.fcs", "w.will.fcs"),             // reader divergence: Eric 20x LL vs Will wash
  dep("fcs.subcrux", "fcs.term"),
  supp("fcs.zo.protofcs", "fcs.subcrux", "g:fcs:sc"),

  // ---------- LINE 3: two lineages ----------
  contra("lin.zo", "lin.ll"),
  supp("ev.two-lineages", "lin.zo", "g:lin:z:two"), supp("ev.two-lineages", "lin.ll", "g:lin:l:two"), // the spine
  supp("lin.zo.autofill", "lin.zo", "g:lin:z:auto"), supp("lin.eric.lineageA", "lin.zo", "g:lin:z:la"),
  supp("lin.ll.intermediates", "lin.ll", "g:lin:l:int"), supp("lin.will.transit", "lin.ll", "g:lin:l:trans"),
  supp("lin.eric.pekar", "lin.subcrux", "g:lin:sc"),
  supp("w.eric.lin", "lin.zo", "g:lin:z:we"), supp("w.will.lin", "lin.ll", "g:lin:l:ww"),
  contra("w.eric.lin", "w.will.lin"),             // reader divergence: Eric wash/weak-ZO vs Will moderate-LL
  dep("lin.subcrux", "lin.term"),

  // ---------- LINE 4: early case data. Both readings share the observed case record (the spine), and
  // the sub-crux bottoms out in a formal clinical record that EXISTS and is decisive (an empirical
  // terminal that grounds), the contrast to the market and FCS lines' withheld records. ----------
  contra("tmp.zo", "tmp.ll"),
  supp("tmp.record", "tmp.zo", "g:tmp:z:rec"), supp("tmp.record", "tmp.ll", "g:tmp:l:rec"), // the spine both readings share
  supp("tmp.zo.refute", "tmp.zo", "g:tmp:z:ref"), supp("tmp.zo.doubling256", "tmp.zo", "g:tmp:z:d256"), supp("tmp.zo.reversions", "tmp.zo", "g:tmp:z:rev"),
  supp("tmp.term", "tmp.zo", "g:tmp:z:term"), // the decisive formal serology, an empirical terminal that grounds, in the ZO cone
  supp("tmp.ll.cases", "tmp.ll", "g:tmp:l:cases"),
  supp("w.will.tmp", "tmp.zo", "g:tmp:z:ww"), supp("w.eric.tmp", "tmp.zo", "g:tmp:z:we"),
  supp("tmp.term", "tmp.subcrux", "g:tmp:sc"), // the sub-crux rests on the decisive formal record (it grounds)
  supp("tmp.zo.refute", "tmp.subcrux", "g:tmp:sc2"),

  // ---------- LINE 5: raccoon dogs / environmental (empirical terminal) ----------
  contra("env.zo", "env.ll"),
  supp("ev.env-samples", "env.zo", "g:env:z:samp"), supp("ev.env-samples", "env.ll", "g:env:l:samp"), // the spine
  supp("env.zo.stall", "env.zo", "g:env:z:stall"), supp("env.eric.caged", "env.zo", "g:env:z:caged"),
  supp("env.ll.novendors", "env.ll", "g:env:l:nov"),
  supp("w.eric.env", "env.zo", "g:env:z:we"), supp("w.eric.envcorr", "env.zo", "g:env:z:wec"),
  supp("env.term", "env.subcrux", "g:env:sc"),

  // ---------- LINE 6: DEFUSE (withheld terminal) ----------
  contra("def.zo", "def.ll"),
  supp("ev.defuse", "def.ll", "g:def:l:proposal"), supp("ev.defuse", "def.zo", "g:def:z:proposal"), // the spine
  supp("def.ll.coverup", "def.ll", "g:def:l:cov"),
  supp("def.zo.novelbackbone", "def.zo", "g:def:z:back"), supp("def.zo.61tasks", "def.zo", "g:def:z:61"), supp("def.eric.secret", "def.zo", "g:def:z:sec"),
  supp("w.eric.def", "def.zo", "g:def:z:we"), supp("w.will.def", "def.zo", "g:def:z:ww"), supp("def.will.scale", "def.zo", "g:def:z:scale"), supp("def.will.nobackbone", "def.zo", "g:def:z:nob"),
  dep("def.subcrux", "def.term"),
  supp("def.zo.novelbackbone", "def.subcrux", "g:def:sc"),

  // ---------- TOP LEVEL: the readers' priors, posteriors, and the divergence between them ----------
  supp("w.eric.prior-zo", "w.eric.posterior", "g:top:e:pz"), supp("w.eric.prior-ll", "w.eric.posterior", "g:top:e:pl"),
  supp("w.will.prior", "w.will.posterior", "g:top:w:pr"), supp("w.will.update", "w.will.posterior", "g:top:w:up"),
  supp("w.scott.intuitive", "w.scott.bayes", "g:top:s:int"),
  // the three readers' final posteriors ground the reader-divergence meta-claim (the spread between assessors)
  supp("w.eric.posterior", "meta.reader-divergence", "g:top:rd:e"), supp("w.will.posterior", "meta.reader-divergence", "g:top:rd:w"), supp("w.scott.bayes", "meta.reader-divergence", "g:top:rd:s"),
  // the reader divergence is a second face of the same 23-order divergence the first pass recorded
  supp("meta.reader-divergence", "meta.no-settlement", "g:top:rd:ns"),
  supp("meta.space-lizard", "meta.method-critique", "g:top:sl"),

  // ---------- CV-DEPTH-2: the primary written record ----------
  // LINE 1: market
  supp("mkt.ll.baserate", "mkt.ll", "g:mkt:l:baserate"), supp("mkt.ll.cond", "mkt.ll", "g:mkt:l:cond"),
  supp("mkt.rootclaim.bayes", "mkt.ll", "g:mkt:l:bayes"), supp("mkt.ll.amplifiers", "mkt.ll", "g:mkt:l:ampl"),
  supp("mkt.zo.nointermediates", "mkt.zo", "g:mkt:z:noint"),
  contra("mkt.rootclaim.bayes", "w.scott.mkt"), // the debaters' own 2x ZO against Alexander's 500x ZO: same direction, orders apart
  // LINE 2: FCS
  supp("fcs.zo.natural15nt", "fcs.zo", "g:fcs:z:nat15"), supp("fcs.zo.cgg3pct", "fcs.zo", "g:fcs:z:cgg3"),
  supp("fcs.zo.frameshift", "fcs.zo", "g:fcs:z:frame"), supp("fcs.zo.prrarunopt", "fcs.zo", "g:fcs:z:prrar"),
  supp("fcs.ll.optimized", "fcs.ll", "g:fcs:l:opt"), supp("fcs.ll.mimic", "fcs.ll", "g:fcs:l:mimic"),
  supp("w.eric.fcs.s2", "fcs.zo", "g:fcs:z:s2"), // Stansifer revising himself, not a reader divergence
  contra("fcs.ll.mimic", "fcs.will.suboptimal"), contra("fcs.ll.mimic", "fcs.zo.prrarunopt"),
  // LINE 3: two lineages
  supp("lin.weissman.polytomy", "lin.ll", "g:lin:l:poly"),
  // LINE 4: temporal
  supp("tmp.zo.serology32k", "tmp.zo", "g:tmp:z:sero"), supp("tmp.zo.serology32k", "tmp.subcrux", "g:tmp:sc:sero"),
  supp("tmp.zo.doubling394", "tmp.zo", "g:tmp:z:d394"),
  supp("tmp.ll.october", "tmp.ll", "g:tmp:l:oct"), supp("tmp.ll.reedcat", "tmp.ll", "g:tmp:l:reed"), supp("tmp.ll.incidental", "tmp.ll", "g:tmp:l:incid"),
  supp("tmp.zo.mapomission", "tmp.zo", "g:tmp:z:map"), contra("tmp.zo.mapomission", "mkt.ll.ascertain"),
  // LINE 5: environmental
  supp("env.zo.samples", "env.zo", "g:env:z:samp2"), supp("env.ll.animals", "env.ll", "g:env:l:anim"),
  supp("env.zo.deadstorage", "env.zo", "g:env:z:dead"), contra("env.zo.deadstorage", "env.ll.animals"),
  supp("env.eric.deposition", "env.zo", "g:env:z:depos"),
  // LINE 6: DEFUSE
  supp("def.rootclaim.underest", "def.ll", "g:def:l:underest"), contra("def.rootclaim.underest", "def.eric.secret"),
  // META / method
  supp("meta.fct", "meta.method-critique", "g:meta:fct"), supp("meta.selfref", "meta.method-critique", "g:meta:selfref"),
  supp("meta.eric-conditioning", "meta.method-critique", "g:meta:econd"),
  supp("w.weissman.cgg", "fcs.ll", "g:fcs:l:wcgg"), contra("w.weissman.cgg", "w.eric.codon"), // Weissman 7x LL against Stansifer 1x neutral, a reader divergence
  supp("w.weissman.fattail", "meta.method-critique", "g:meta:fattail"),
];

module.exports = { COVID_DEPTH: { claims, links } };
