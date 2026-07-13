// Role: the densified LHC-safety cascade, ingested from the production and Hawking reports,
//   the omissions survey, and the framework-conditionality report. The safety claim is the disjunction
//   of three legs whose computed quantities ground to their floors within their regime; each leg's
//   framework premise is a characterized dependency (a depends-on edge with its closing condition). The
//   one reified node, the ADD framework choice (dep.add) all three legs depend on, carries three
//   readings: a shared dependency the robustness reading finds, a swappable frame (the framing records
//   below), and the settled/performed gap on the erased antecedent. `demo`-tagged wiring lets a reading
//   show the graph before and after reifying.
// Contract: exports LHC = { store_id, claims, links, framing, successor, presupposes, sharedDeps,
//   undercuts, performedSettling }; refs resolved by build/lhc-build.mjs. Pure data; imports nothing.
// Invariant: a report is canonical for what the claims and sides are, never for the grade they earn;
//   the gate computes the grade, and where it disagrees with a proposed mode that is a listed finding.
"use strict";

const chk = (checker, method_class, method) => ([{ checker_id: checker, method_class, method: method || "peer-reviewed", checked_at_state: "genesis", outcome: "confirms", independence: "distinct-party" }]);
const P = "lhc.safety: ";

const claims = [
  // ---- the top safety claim and the independence claim ----
  { ref: "safe", kind: "forum", declared_grade: "corroborated", source_id: "src:lsag-2008", contributor_id: "lsag",
    statement: P + "the hazard is bounded: LHC collisions present no black-hole danger, argued as the disjunction of three legs (production, Hawking evaporation, and the astrophysical survival backstop)" },
  { ref: "robust", kind: "forum", declared_grade: "asserted", source_id: "src:conditional-robustness", contributor_id: "structure",
    statement: P + "the safety argument is robust because it rests on three independent legs, each an independent check that holds even if the others are weakened (the additive framing the SPC endorsed as 'further layers of safety')" },

  // ---- Leg 1: production (report A) ----
  { ref: "leg.prod", kind: "forum", declared_grade: "corroborated", source_id: "src:production-report", contributor_id: "leg:prod",
    statement: P + "Leg 1 (production): no dangerous black hole is produced at the LHC; production requires a fundamental scale near a TeV, and the accessible window is closed" },
  // formal-settled kinematic reach: a derivation, settled by construction within the ADD regime.
  { ref: "prod.reach", kind: "derivation", declared_grade: "constitutive", source_id: "src:giddings-thomas-2002", contributor_id: "calc:reach",
    statement: P + "the higher-dimensional Schwarzschild radius r_S ~ (M_BH/M_D)^(1/(n+1))/M_D brings production within LHC reach only for M_D <~ sqrt(s)/(3-5) <~ 4.7 TeV; under the standard 4D Planck scale r_S ~ 10^-50 m and production is kinematically impossible" },
  // formal-contested: the geometric cross-section is an O(1)-O(10) estimate (report A Claim 2.1).
  { ref: "prod.xsec", kind: "forum", declared_grade: "asserted", source_id: "src:giddings-thomas-2002", contributor_id: "calc:xsec",
    statement: P + "the geometric production cross-section is sigma ~ pi r_S^2 (an area-law estimate); the literature universally qualifies it as reliable only to O(1)-O(10), so it is formal-contested, not settled" },
  // formal-contested: the semiclassical threshold is convention-dependent (report A Claim 1.2).
  { ref: "prod.threshold", kind: "forum", declared_grade: "asserted", source_id: "src:meade-randall-2008", contributor_id: "calc:threshold",
    statement: P + "the semiclassical production threshold is M_BH >~ 3-5 M_D; the exact numerical threshold is convention-dependent (3 the acknowledged minimum, 5 preferred, 10 conservative), so it is formal-contested" },
  // the >15-orders meta-claim (report A Claim 2.5), a corroborated finding about the literature spread.
  { ref: "prod.uncertainty", kind: "forum", declared_grade: "supported", source_id: "src:production-report", contributor_id: "meta:xsec-spread",
    statement: P + "the combined production cross-section uncertainty spans more than 15 orders of magnitude for one nominal (M_D, n), once YR enhancement, inelasticity, brane tension, string balls, PDF suppression, and near-threshold quantum suppression are compounded", checking_records: chk("xsec-synthesis", "data-audit") },

  // ---- Leg 2: Hawking evaporation (report B) ----
  { ref: "leg.hawking", kind: "forum", declared_grade: "corroborated", source_id: "src:hawking-report", contributor_id: "leg:hawking",
    statement: P + "Leg 2 (Hawking): any black hole produced at the LHC evaporates via Hawking radiation in ~10^-26 to 10^-27 s, far faster than it could accrete, so it is harmless" },
  // formal-settled within the semiclassical regime: the higher-dimensional Hawking temperature.
  { ref: "hawking.temp", kind: "derivation", declared_grade: "constitutive", source_id: "src:argyres-1998", contributor_id: "calc:temp",
    statement: P + "the Hawking temperature of a (4+n)-dimensional Schwarzschild black hole is T_H = (n+1)/(4 pi r_H), from surface gravity kappa = (n+1)/(2 r_H); for M_BH = 5 TeV, M_* = 1 TeV it is ~179-553 GeV (n = 2-6), settled by construction within the semiclassical regime M_BH >> M_*" },
  // formal-settled within the semiclassical regime: the evaporation lifetime.
  { ref: "hawking.lifetime", kind: "derivation", declared_grade: "constitutive", source_id: "src:kanti-2004", contributor_id: "calc:lifetime",
    statement: P + "the evaporation lifetime is tau = C_n M_*^-1 (M_BH/M_*)^((n+3)/(n+1)) from the D-dimensional Stefan-Boltzmann law; for M_BH = 1-10 TeV, M_* = 1 TeV it is ~10^-26 to 10^-23 s (LSAG conservative bound <10^-27 s), settled within the semiclassical regime" },

  // ---- Leg 3: the astrophysical survival backstop, reconciled in (Giddings-Mangano) ----
  { ref: "leg.astro", kind: "forum", declared_grade: "corroborated", source_id: "src:giddings-mangano-2008", contributor_id: "leg:astro",
    statement: P + "Leg 3 (astrophysical backstop): even a stable, non-evaporating black hole is harmless, because cosmic rays have produced such objects and dense stars (white dwarfs, neutron stars) survive to ages of order a gigayear" },
  // the reconciled empirical floor: the survival fact (the existing lhc-cascade observation), a measurement.
  { ref: "astro.survival", kind: "measurement", declared_grade: "checked", source_id: "src:giddings-mangano-2008", contributor_id: "obs:survival",
    statement: P + "white dwarfs and neutron stars survive to observed ages of order a gigayear (the natural experiment the astrophysical-survival cascade reads; the same observation lhc-cascade grounds to the body data)", checking_records: chk("survival-audit", "data-audit") },
  // formal-settled within ADD: the Giddings-Mangano destroy-time exclusion.
  { ref: "astro.gm", kind: "derivation", declared_grade: "constitutive", source_id: "src:giddings-mangano-2008", contributor_id: "calc:gm",
    statement: P + "Giddings-Mangano: a stopped black hole's destruction time integrates to << the body's observed age (a white dwarf consumed in <~ 80 Myr, a neutron star in <~ 50 yr for D <= 7), so survival excludes dangerous accretion above crossover radius R_C >~ 15 Angstrom, a derivation within the ADD accretion model" },

  // ---- the reified framework-choice node, and semiclassical gravity, the shared dependencies ----
  // ADD is a forum choice: no experiment compels adopting it over the standard model, and its own
  // architects concede the cross-framework connection is 'model dependent and in general unknown'.
  { ref: "dep.add", kind: "forum", declared_grade: "asserted", source_id: "src:add-1998", contributor_id: "framework:add",
    statement: P + "TeV-scale gravity via the ADD large-extra-dimensions model (M_Pl^2 = (2 pi R)^n M_D^(n+2)) is realized at LHC energies; adopting ADD over the standard model plus 4D general relativity is a forum choice no experiment compels, motivated only by the hierarchy problem",
    closing_condition: { condition_kind: "measurement-on-the-system", target: "a measurement placing the fundamental scale M_D at or below LHC reach (~4.7 TeV), from a collider, astrophysical, or tabletop probe", system: "the fundamental gravity scale M_D" } },
  { ref: "dep.semiclassical", kind: "forum", declared_grade: "asserted", source_id: "src:calmet-2008", contributor_id: "framework:semiclassical",
    statement: P + "LHC-produced black holes sit in the semiclassical regime (M_BH/M_* >~ 10) where the Hawking calculation and the classical hoop/Bondi analyses are valid; the report flags this doubtful, since LHC production is near threshold at M_BH/M_* ~ 2-5, below the E/M_* >~ 10 requirement, where the object is a non-thermal quantum black hole",
    closing_condition: { condition_kind: "proof", target: "a first-principles quantum-gravity calculation, or a measurement, placing LHC-scale black holes above the semiclassical threshold M_BH/M_* >~ 10", system: "the semiclassical regime at the LHC scale" } },

  // ---- the dangerous branch of the framework choice, graded empirically excluded (Phase B) ----
  // the closing condition on dep.add answered negatively: the measured M_D lies far above LHC reach,
  // so the branch of ADD that would produce dangerous black holes is empirically closed.
  { ref: "add.excluded", kind: "measurement", declared_grade: "checked", source_id: "src:cms-exo-24-028", contributor_id: "obs:exclusion",
    statement: P + "the dangerous ADD branch, M_D ~ 1-3 TeV that would give copious LHC black-hole production, is empirically excluded by convergent independent bounds: direct collider M_D > 5.9-11.2 TeV, semiclassical black holes > 8.4-11.4 TeV, string balls > 9.0-10.7 TeV, astrophysics > 10 TeV; the accessible production window is closed", checking_records: chk("exclusion-audit", "data-audit") },

  // ---- the conditionality meta-claim (framework-conditionality report, Phase B) ----
  { ref: "conditionality", kind: "forum", declared_grade: "asserted", source_id: "src:conditionality-report", contributor_id: "meta:conditionality",
    statement: P + "framework choice, not calculation, dominates: the choice of framework accounts for roughly 85-90% of the total safety-relevant uncertainty, against a 4-5 order within-framework spread; marked honestly, the multiplicity weighting behind the 85-90% figure is itself a forum judgment about prior probabilities, not derivable from first principles" },

  // ---- the performed-settling finding (Phase C): the unconditional public claim held apart from
  //      the conditional structure the within-framework calculations actually establish ----
  { ref: "public.unconditional", kind: "forum", declared_grade: "asserted", source_id: "src:lsag-2008", contributor_id: "perform:lsag",
    statement: P + "the LSAG public framing, 'there is no basis for any conceivable threat from the LHC', presents a conservative within-framework analysis as an unconditional, settled safety proof: it PERFORMS settledness by erasing the antecedent (the abstract omits the framework condition)" },
  { ref: "conditional.structure", kind: "forum", declared_grade: "supported", source_id: "src:conditionality-report", contributor_id: "structure:conditional",
    statement: P + "the actual claim is conditional: no threat IF the ADD framework holds AND Hawking radiation is absent or modified AND the accretion-and-cosmic-ray bound applies; the dropped antecedent is the ADD framework choice, and each conjunct is independently uncertain" },
  { ref: "spc.threelevel", kind: "forum", declared_grade: "supported", source_id: "src:spc-2008", contributor_id: "evidence:spc",
    statement: P + "the CERN SPC's own review acknowledged three increasingly unlikely conditions the argument requires (first, that the fundamental gravity scale lies in LHC range, possible only if extra dimensions with very peculiar properties exist), so the panel that endorsed the safety case recorded the antecedent the public framing drops", checking_records: chk("spc-text", "data-audit") },

  // ---- the empirical-closure meta-claim (Phase C) ----
  { ref: "closure.empirical", kind: "forum", declared_grade: "supported", source_id: "src:conditionality-report", contributor_id: "meta:closure",
    statement: P + "the debate resolved by falsifying the antecedent (the frameworks that would produce dangerous black holes are empirically excluded), NOT by proving the consequent (that black holes are safe): this is empirical closure, not logical; a 100 TeV collider would reopen the window, and the one theoretical-closure route (Lake et al. dimensionally-dependent uncertainty relations, 2023) stays exploratory with few citations" },

  // ---- the undercuts (survey Part B): each attaches to its named leg and lowers its confidence ----
  { ref: "uc.plaga", kind: "forum", declared_grade: "asserted", source_id: "src:plaga-2008", contributor_id: "undercut:plaga",
    statement: P + "Plaga's metastable-black-hole scenario undercuts Leg 3: within the Casadio-Harms microcanonical framework a metastable hole could accrete at the Eddington limit while self-limiting via radiation pressure, evading the cosmic-ray argument; the warping-scale upper limit allows M_c = 1.1e5 kg, above the 1e4 kg catastrophic threshold Casadio ruled out only below it. Credible: a credentialed critique, unrebutted past his v3 (discovery grade: contested)" },
  { ref: "uc.transplanckian", kind: "forum", declared_grade: "asserted", source_id: "src:unruh-2014", contributor_id: "undercut:transplanckian",
    statement: P + "the trans-Planckian problem undercuts Leg 2: Hawking's derivation traces outgoing modes back to trans-Planckian frequencies where effective field theory breaks down, and for a microscopic black hole there is no parametric separation of horizon and Planck scales, so quantum-gravity corrections are plausibly O(1) (discovery grade: established as a genuine problem)" },
  { ref: "uc.vilkovisky", kind: "forum", declared_grade: "asserted", source_id: "src:vilkovisky", contributor_id: "undercut:vilkovisky",
    statement: P + "Vilkovisky's partial-evaporation claim undercuts Leg 2: quantum back-reaction may halt evaporation at about half the mass, leaving a long-lived remnant that could survive to accrete; never refuted in the safety-review literature, only ignored (discovery grade: contested)" },
  { ref: "uc.firewall", kind: "forum", declared_grade: "asserted", source_id: "src:amps-2013", contributor_id: "undercut:firewall",
    statement: P + "the firewall paradox undercuts Leg 2: the AMPS argument shows unitarity, semiclassical effective field theory outside the horizon, and the equivalence principle are mutually inconsistent for an evaporating black hole, revealing a fundamental tension in the semiclassical framework Leg 2 assumes (discovery grade: established as a tension, contested as to resolution)" },
];

// ---- support links: the disjunction, and each leg's computed grounding ----
const supp = (from, to, grp, src, grade) => ({ link_kind: "supports", from, to, support_group: grp, source_id: src, contributor_id: "wire", declared_grade: grade || "corroborated" });
// ---- depends-on links: {from: presupposed, to: dependent}. Phase-A own premises + the independence
//      claim over the three legs. Phase-B cross edges (tagged demo:"B-shared") complete the sharing. ----
const dep = (presupposed, dependent, demo) => ({ link_kind: "depends-on", from: presupposed, to: dependent, source_id: "src:conditionality-report", contributor_id: "wire", declared_grade: "asserted", demo });

const links = [
  // the disjunction: each leg supports the top claim in its own group, with its own report as source,
  // so the three groups have disjoint footprints and the top claim earns corroborated by independence
  // lift (the naive three-leg redundancy the robustness reading will probe).
  supp("leg.prod", "safe", "g:leg-prod", "src:production-report"),
  supp("leg.hawking", "safe", "g:leg-hawking", "src:hawking-report"),
  supp("leg.astro", "safe", "g:leg-astro", "src:giddings-mangano-2008"),
  // each leg's computed grounding, each support in its own group (across groups strongest-of, so a
  // contested estimate does not drag the settled derivation down).
  supp("prod.reach", "leg.prod", "g:prod-reach", "src:giddings-thomas-2002"),
  supp("prod.xsec", "leg.prod", "g:prod-xsec", "src:giddings-thomas-2002", "asserted"),
  supp("prod.threshold", "leg.prod", "g:prod-thr", "src:meade-randall-2008", "asserted"),
  supp("hawking.temp", "leg.hawking", "g:hawk-temp", "src:argyres-1998"),
  supp("hawking.lifetime", "leg.hawking", "g:hawk-life", "src:kanti-2004"),
  supp("astro.survival", "leg.astro", "g:astro-surv", "src:giddings-mangano-2008"),
  supp("astro.gm", "leg.astro", "g:astro-gm", "src:giddings-mangano-2008"),
  // the empirical closure of the dangerous branch corroborates that no dangerous BH is produced.
  supp("add.excluded", "leg.prod", "g:prod-excl", "src:cms-exo-24-028"),

  // Phase A: each leg's OWN framework premise as a characterized dependency (a depends-on edge).
  dep("dep.add", "leg.prod"),
  dep("dep.semiclassical", "leg.hawking"),
  // the independence claim presupposes all three legs (to assert their independence, all three must be
  // coherent frames); its presupposition reading is where the shared dependency will surface.
  dep("leg.prod", "robust"),
  dep("leg.hawking", "robust"),
  dep("leg.astro", "robust"),

  // Phase B: reify the sharing. All three legs depend on BOTH the ADD framework choice and semiclassical
  // gravity (survey C1, C2). These edges are what turn the apparent independence partial; a reading over
  // the graph without them (the `demo` filter) is the "before", with them the "after".
  dep("dep.add", "leg.hawking", "B-shared"),
  dep("dep.add", "leg.astro", "B-shared"),
  dep("dep.semiclassical", "leg.prod", "B-shared"),
  dep("dep.semiclassical", "leg.astro", "B-shared"),

  // Phase C: the performed-settling finding. The SPC three-level acknowledgment grounds the conditional
  // structure, which names (depends-on) the ADD antecedent and contradicts the erasing public claim.
  supp("spc.threelevel", "conditional.structure", "g:spc", "src:spc-2008", "supported"),
  { link_kind: "contradicts", from: "conditional.structure", to: "public.unconditional", source_id: "src:conditionality-report", contributor_id: "wire", declared_grade: "asserted" },
  dep("dep.add", "conditional.structure"),
  // the empirical closure rests on the empirical exclusion of the dangerous branch.
  supp("add.excluded", "closure.empirical", "g:closure", "src:cms-exo-24-028", "supported"),

  // Phase C: the undercuts. An undercut attacks the leg's grounding; it enters no grade fold, and the
  // undercut reading lowers the confidence the leg transmits. The link grade carries the discovery grade
  // (established -> supported, contested -> asserted).
  { link_kind: "undercut", from: "uc.plaga", to: "leg.astro", source_id: "src:plaga-2008", contributor_id: "wire", declared_grade: "supported" },
  { link_kind: "undercut", from: "uc.transplanckian", to: "leg.hawking", source_id: "src:unruh-2014", contributor_id: "wire", declared_grade: "supported" },
  { link_kind: "undercut", from: "uc.vilkovisky", to: "leg.hawking", source_id: "src:vilkovisky", contributor_id: "wire", declared_grade: "asserted" },
  { link_kind: "undercut", from: "uc.firewall", to: "leg.hawking", source_id: "src:amps-2013", contributor_id: "wire", declared_grade: "asserted" },
];

// ---- the framework-choice node read as a swappable frame (Phase B, the eggs-denominator seam) ----
// the within-framework calculations presuppose a framework the same way the eggs per-unit measurements
// presuppose the denominator: a checked-not-graded edge. Swapping ADD for the standard model re-points
// the edges and moots the safety analysis (no production under SM+GR), while every calculation keeps
// the formal grade it earned within its regime.
const framing = {
  framing_id: "F-add", status: "in-force",
  statement: "the framework is ADD large extra dimensions with M_D near a TeV: the fundamental scale is lowered, so the higher-dimensional Schwarzschild radius brings black-hole production into LHC reach and the three-leg safety cascade activates",
  alternatives: ["the standard model plus 4D general relativity (no production)", "Randall-Sundrum warped geometry (marginal)", "universal extra dimensions or DGP (no production)"],
};
const successor = {
  framing_id: "F-sm", status: "in-force",
  statement: "the framework is the standard model plus 4D general relativity: the production threshold is ~10^19 GeV, fifteen orders above LHC energy, so no black hole is produced at the LHC and the entire safety analysis is moot, trivially answered",
  alternatives: ["ADD large extra dimensions (production possible)", "Randall-Sundrum warped geometry (marginal)"],
};
// the within-framework calculations that presuppose the framework choice (each keeps its formal grade).
const presupposes = [
  { store: "S-lhc-cascade", claim: "prod.reach" },
  { store: "S-lhc-cascade", claim: "hawking.temp" },
  { store: "S-lhc-cascade", claim: "hawking.lifetime" },
  { store: "S-lhc-cascade", claim: "astro.gm" },
];
// the two reified shared dependencies (the depends-on nodes) and the reading targets, named for the oracle.
const sharedDeps = ["dep.add", "dep.semiclassical"];

// the undercuts and the legs they target, with the discovery grade the survey assigns each (Phase C).
const undercuts = [
  { ref: "uc.plaga", target: "leg.astro", discovery: "contested (credible, unrebutted past v3)" },
  { ref: "uc.transplanckian", target: "leg.hawking", discovery: "established" },
  { ref: "uc.vilkovisky", target: "leg.hawking", discovery: "contested" },
  { ref: "uc.firewall", target: "leg.hawking", discovery: "established as a tension" },
];

// the performed-settling pair: the within-framework calculations read settled, the unconditional public
// claim reads performed, and the antecedent it drops is named.
const performedSettling = { settled: presupposes.map((p) => p.claim), performed: "public.unconditional", conditional: "conditional.structure", antecedent: "dep.add" };

module.exports = { LHC: { store_id: "S-lhc-cascade", claims, links, framing, successor, presupposes, sharedDeps, undercuts, performedSettling } };
