// Role: the densified LHC-safety cascade (Prompt 25), ingested from the production-leg report (A),
//   the Hawking report (B), the omissions survey, and the framework-conditionality report. The safety
//   claim is the disjunction of three legs; each leg's computed quantities ground to their floors
//   within their regime (formal derivations settle by construction; the empirical bounds and the
//   survival fact ground to measurement), and each leg's framework premise is a characterized
//   dependency carried as a depends-on edge with the measurement that would close it. The one reified
//   node, the ADD framework choice, is a forum claim (dep.add) all three legs depend on: as a shared
//   dependency it makes the independence partial (the presupposition reading finds it), as the
//   presupposed framework it is swappable (the framing records + presupposition edges below), and the
//   gap between its unconditional public framing and its conditional structure is a settled/performed
//   finding. Phase-B/C wiring is tagged `demo` so a reading can show the graph before and after.
// Contract: exports LHC = { store_id, claims:[spec], links:[spec], framing, successor, presupposes,
//   sharedDeps, undercuts }. claim/link specs use local refs, resolved by build/lhc-build.mjs. Pure
//   data; corpora imports nothing.
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
];

module.exports = { LHC: { store_id: "S-lhc-cascade", claims, links } };
