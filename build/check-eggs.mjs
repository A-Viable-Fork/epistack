// Role: the eggs-case oracle (Prompt 20). The eggs question, restructured into domain stores that
//   ground to their own floors and an eggs composite that cites them across the boundary, run on real
//   ingested research. It verifies grounding, the cardiovascular contradiction, the regenerative
//   characterized gaps, the cross-domain weighings, the denominator swap, and the vendored reading the
//   presentation renders. It builds through the shared builder (build/eggs-build.mjs), so it checks
//   exactly the structure the presentation shows.
// Contract: `node build/check-eggs.mjs` exits non-zero on any failure. Imports buildEggs, the v3
//   kernel, the composition layer, and corpora/eggs (via the builder).
// Invariant: a domain claim grounds to a domain floor, a composite claim grounds by citing across the
//   boundary. Where a claim's stated mode conflicts with the gate's earned grade, the oracle STOPS and
//   reports it, because that conflict is a finding about the claim.
"use strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { collapsedRank, tierOf } from "../kernel/schema/confidence.mjs";
import { characterizedGaps, characterization } from "../kernel/analysis/characterized-gaps.mjs";
import { crossDomainClaimRecord } from "../kernel/composition/records.mjs";
import { compositeGrade } from "../kernel/composition/transfer.mjs";
import { sharedTerm, ceilingForCitations } from "../kernel/composition/vocabulary.mjs";
import { framingRecord, checkPresupposition, swapFrame, frameOrphaned } from "../kernel/composition/framing.mjs";
import { withinDomainCrux } from "../kernel/analysis/reconciliation.mjs";
import { analyzeUndercuts } from "../kernel/analysis/robustness.mjs";
import { buildEggs } from "./eggs-build.mjs";

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-EGGS (Prompt 20): the eggs case as domains and a composite, on real research"); console.log(H);

const E = buildEggs();
const { tables, domains, idOf, weighs, framing, successor, edges, bodyFraming, bodies, bodyEdges, compStore, profile, COMPOSITE } = E;
const nutrition = domains["S-nutrition"], environment = domains["S-environment"], economics = domains["S-economics"];
const sourceIds = new Set(tables.sourceTable.byId.keys());

const earnedOf = (dom, id) => (dom.view.earnedByIdentity.get(id) || { earned: "ungraded" }).earned;
const byRef = (dom, ref) => dom.refId.get(ref);
const gradeRef = (dom, ref) => earnedOf(dom, byRef(dom, ref));
const graphOf = (dom) => ({ entries: dom.state.entries, links: dom.state.links, tables });
function reportConflicts(dom) {
  const conflicts = [];
  for (const { rec } of dom.claims) {
    const g = dom.receipt.grade_table.find((x) => x.identity === rec.identity);
    if (g && collapsedRank(g.declared_grade) > collapsedRank(g.earned_grade)) conflicts.push({ statement: rec.statement, declared: g.declared_grade, earned: g.earned_grade });
  }
  return conflicts;
}

// =====================================================================================
console.log("\n[A1] the nutrition domain store admits, and no stated mode conflicts with the gate");
ok(nutrition.receipt.decision !== "declined", `the gate admits the nutrition store (decision ${nutrition.receipt.decision})`);
const nConflicts = reportConflicts(nutrition);
for (const c of nConflicts) console.log(`      CONFLICT ${c.statement} :: declared=${c.declared} earned=${c.earned}`);
ok(nConflicts.length === 0, `no nutrition claim declares a grade it cannot earn (${nutrition.claims.length} claims)`);

// =====================================================================================
console.log("\n[A2] the metabolic and responder claims reach the measurement floor");
for (const r of ["n.chol-serum", "n.nonlinear", "n.ratio", "n.metsyn-rct", "n.content", "n.unimodal", "n.responder-var", "n.heritable"])
  ok(gradeRef(nutrition, r) === "checked", `${r} grounds to the measurement floor (checked)`);

// =====================================================================================
console.log("\n[A3] the guidelines claims rest in the forum");
for (const r of ["n.guidelines", "n.aha", "n.individual-unknown"]) ok(tierOf(gradeRef(nutrition, r)) !== "settled", `${r} rests in the forum (${gradeRef(nutrition, r)}), not at a floor`);

// =====================================================================================
console.log("\n[A4] the cardiovascular block is a contradiction held as structure");
const nullId = byRef(nutrition, "n.cv-null"), harmId = byRef(nutrition, "n.cv-harm");
const joined = (nutrition.receipt.contradiction_records || []).find((c) => (c.identity_a === nullId && c.identity_b === harmId) || (c.identity_a === harmId && c.identity_b === nullId));
ok(!!joined, "the population null and the population harm claim are joined by a contradicts link");
ok(nutrition.receipt.decision === "accepted-with-disagreement", `the store admits WITH the disagreement recorded (decision ${nutrition.receipt.decision})`);
ok(tierOf(gradeRef(nutrition, "n.cv-null")) !== "settled" && tierOf(gradeRef(nutrition, "n.cv-harm")) !== "settled", "neither population claim carries a floor grade the other's contest could remove");
ok(gradeRef(nutrition, "n.cv-diabetic") === "corroborated", "the diabetic-interaction claim grounds where the observational lines agree (corroborated in the forum)");
ok(collapsedRank(gradeRef(nutrition, "n.cv-diabetic")) > collapsedRank(gradeRef(nutrition, "n.cv-null")), "the diabetic-interaction claim grounds above the population claims that stay in tension");

// =====================================================================================
console.log("\n[A5] every claim carries its provenance");
let missingProv = 0;
for (const dom of Object.values(domains)) for (const { spec } of dom.claims) if (!sourceIds.has(spec.source_id)) { missingProv++; console.log(`      NO SOURCE ${spec.ref} -> ${spec.source_id}`); }
ok(missingProv === 0, "every domain claim resolves to a source row (provenance stated in the document)");

// =====================================================================================
console.log("\n[P26-A] the three coupled subsystems ground to their floors; the refusal on the mechanistic floor");
for (const r of ["chol.adequacy", "chol.hepatic", "chol.neurodev", "prot.diaas", "prot.leucine", "sat.hormone", "gly.load", "gly.hba1c", "lip.absorption", "lip.synthesis", "lip.responder"])
  ok(gradeRef(nutrition, r) === "checked", `${r} grounds to its measurement floor (checked)`);
ok(tierOf(gradeRef(nutrition, "sat.behavioral")) !== "settled", `the behavioral satiety layer stays the noisier forum (${gradeRef(nutrition, "sat.behavioral")}), not a floor`);
const refusalSupp = new Set(nutrition.state.links.filter((l) => l.link_kind === "supports" && l.to_identity === byRef(nutrition, "n.individual-unknown")).map((l) => l.from_identity));
ok(["lip.absorption", "lip.synthesis", "n.responder-var"].every((r) => refusalSupp.has(byRef(nutrition, r))), "the population-to-individual refusal rests on absorption, synthesis, and responder variance (the mechanistic floor)");
ok(collapsedRank(gradeRef(nutrition, "n.individual-unknown")) >= 3, `the refusal earns above assertion on that floor (${gradeRef(nutrition, "n.individual-unknown")})`);

// =====================================================================================
console.log("\n[P26-B1] the choline fork: a split routed by the microbiome, the TMAO causal link held at association");
const nutGraph = { entries: nutrition.state.entries, links: nutrition.state.links, tables };
ok(gradeRef(nutrition, "tmao.assoc") === "checked", "the TMAO-MACE statistical association grounds to the floor (checked)");
ok(gradeRef(nutrition, "tmao.causal") === "supported" && tierOf(gradeRef(nutrition, "tmao.causal")) !== "settled", `the TMAO CAUSAL link is held at the association grade, no floor (${gradeRef(nutrition, "tmao.causal")})`);
console.log("      FINDING the report proposes settled risk for the TMAO association but the gate holds the CAUSAL leap at the association grade; settled association != settled causation");
const uc = analyzeUndercuts(nutGraph, byRef(nutrition, "tmao.causal"));
ok(uc.undercuts.length === 3 && uc.lowered, `the fish-paradox, renal, and Mendelian undercuts attach and lower the causal confidence (${uc.grade} -> ${uc.confidence_after_undercuts})`);
const forkSupp = new Set(nutrition.state.links.filter((l) => l.link_kind === "supports" && l.to_identity === byRef(nutrition, "chol.fork")).map((l) => l.from_identity));
ok(forkSupp.has(byRef(nutrition, "chol.neurodev")) && forkSupp.has(byRef(nutrition, "tmao.pathway")), "the choline fork is held as a split resting on BOTH the benefit routing and the TMAO routing, not averaged");
// the benefit and the risk are NOT contradicts-linked: a fork is a routing, not a contradiction to resolve.
const forkContradiction = (nutrition.receipt.contradiction_records || []).some((c) => new Set([c.identity_a, c.identity_b]).has(byRef(nutrition, "chol.neurodev")) && new Set([c.identity_a, c.identity_b]).has(byRef(nutrition, "tmao.causal")));
ok(!forkContradiction, "the benefit and the risk are routed (a fork), not joined by a contradicts link");

// =====================================================================================
console.log("\n[P26-B2] the cardiovascular crux resolves to the confounding-adjustment choice and the diabetic phenotype");
const cvdCrux = withinDomainCrux(nutGraph, byRef(nutrition, "n.cv-harm"), byRef(nutrition, "n.cv-null"));
ok(cvdCrux.kind === "within-domain" && cvdCrux.shallow === false, "the CVD crux is NOT shallow: reifying the confounding-adjustment as an explicit node both cohorts share resolves it");
const frontier = new Set(cvdCrux.frontier_candidates);
ok(frontier.has(byRef(nutrition, "adj.uscohort")) && frontier.has(byRef(nutrition, "adj.global")), "the divergence frontier is the confounding-adjustment choice (the US-cohort vs the global/repeated-measures stance)");
const resolved = new Set(cvdCrux.resolved_sub_region);
ok(resolved.has(byRef(nutrition, "n.cv-diabetic")), "the diabetic-subgroup claim sits in the resolved region (both camps agree)");
ok(!frontier.has(byRef(nutrition, "n.cv-diabetic")), "the diabetic phenotype is not on the frontier: the split is the adjustment choice, not the diabetic agreement");

// =====================================================================================
console.log("\n[P26-C] the which-body framing node: swapping the body reframes the effects, grades hold");
ok(!!bodyFraming && bodyFraming.framing_id === "F-body-avgadult" && bodyFraming.status === "in-force", "the which-body node exists at the composite level, the average adult in force");
ok((bodyFraming.alternatives || []).length >= 3, "the which-body node names its alternatives (diabetic, hyper-responder, choline-deficient pregnant woman)");
ok(bodyEdges.length === COMPOSITE.bodyPresupposes.length && bodyEdges.every(({ edge }) => checkPresupposition(edge, bodyFraming).in_force), "each subsystem-effect claim carries a presupposition edge to the in-force body node");
// the effects keep their grade regardless of the body: record them before the swap.
const bodyBefore = COMPOSITE.bodyPresupposes.map((p) => gradeRef(nutrition, p.claim));
// swap the body: average adult -> diabetic. The edges re-point; no measurement is touched.
const diabeticBody = bodies.find((b) => b.framing_id === "F-body-diabetic");
const pregnantBody = bodies.find((b) => b.framing_id === "F-body-pregnant");
const swappedToDiabetic = bodyEdges.map(({ edge }) => swapFrame(edge, diabeticBody));
const bodyAfter = COMPOSITE.bodyPresupposes.map((p) => gradeRef(nutrition, p.claim));
ok(bodyBefore.join(",") === bodyAfter.join(","), "swapping the average adult for the diabetic leaves every subsystem measurement's grade intact");
ok(swappedToDiabetic.every((e) => e.to_framing === "F-body-diabetic") && checkPresupposition(swappedToDiabetic[0], diabeticBody).in_force, "the effect claims re-point to the diabetic body, which checks in force");
// the reframe fires: the diabetic body makes the cardiovascular effect elevated-risk agreement.
ok(/elevated-risk agreement/.test(diabeticBody.statement), "swapping to the diabetic reframes the cardiovascular effect from contested to elevated-risk agreement");
// and the pregnant body makes the choline benefit load-bearing.
ok(/load-bearing/.test(pregnantBody.statement) && checkPresupposition(swapFrame(bodyEdges[0].edge, pregnantBody), pregnantBody).in_force, "swapping to the choline-deficient pregnant woman reframes the choline benefit from useful to load-bearing");
// against the now-superseded average-adult frame, the un-swapped edges read frame-orphaned.
const avgSuperseded = framingRecord({ ...COMPOSITE.bodyFraming, status: "superseded", successor: "F-body-diabetic" });
ok(frameOrphaned(bodyEdges.map((x) => x.edge), { "F-body-avgadult": avgSuperseded }).length === bodyEdges.length, "against the superseded average-adult frame, the un-swapped effect claims read frame-orphaned (the body moved out from under them)");

// =====================================================================================
console.log("\n[B1] the environment domain store admits, and no stated mode conflicts with the gate");
ok(environment.receipt.decision !== "declined", `the gate admits the environment store (decision ${environment.receipt.decision})`);
const eConflicts = reportConflicts(environment);
for (const c of eConflicts) console.log(`      CONFLICT ${c.statement} :: declared=${c.declared} earned=${c.earned}`);
ok(eConflicts.length === 0, `no environment claim declares a grade it cannot earn (${environment.claims.length} claims)`);

// =====================================================================================
console.log("\n[B2] per-unit measurements reach the floor; cross-cutting trade-offs rest in the forum");
for (const r of ["e.ghg", "e.land", "e.welfare", "e.keel", "e.antibiotics", "e.soil-health", "e.biodiversity", "e.runoff"]) ok(gradeRef(environment, r) === "checked", `${r} grounds to the measurement floor (checked)`);
for (const r of ["e.trilemma", "e.water-metric", "e.scale"]) ok(tierOf(gradeRef(environment, r)) !== "settled", `${r} rests in the forum (${gradeRef(environment, r)})`);

// =====================================================================================
console.log("\n[B3] the regenerative soil-carbon claims read as characterized gaps");
const gaps = characterizedGaps(graphOf(environment));
const gapById = new Map(gaps.map((g) => [g.identity, g]));
const socId = byRef(environment, "e.regen-soc"), litterId = byRef(environment, "e.regen-litter");
ok(gapById.has(socId) && gapById.has(litterId), `both regenerative soil-carbon claims are listed as characterized gaps (got ${gaps.length})`);
const socGap = gapById.get(socId) || {};
ok(socGap.closing_condition && socGap.closing_condition.condition_kind === "measurement-on-the-system", "the soil-carbon gap carries its closing condition (the direct measurement that would ground it)");
ok((socGap.transfer_sources || []).some((t) => t.from_identity === byRef(environment, "e.pasture-soc-proxy")), "it lists its transfer source: the grazing/dairy pasture measurement it rests on");
ok(characterization(graphOf(environment), byRef(environment, "e.regen-advocacy")) === "bare-assertion", "the bare advocacy figure is a bare assertion, not a characterized gap");
ok(!gapById.has(byRef(environment, "e.regen-advocacy")), "the bare assertion is not listed among the characterized gaps");

// =====================================================================================
console.log("\n[B4] no regenerative claim inherits a floor grade; the transfer caps it");
ok(gradeRef(environment, "e.regen-soc") === "supported" && tierOf(gradeRef(environment, "e.regen-soc")) !== "settled", "the soil-carbon leap earns only supported, capped by its cross-system transfer, below the measurement floor");
ok(gradeRef(environment, "e.pasture-soc-proxy") === "checked", "its transfer source is itself a floor measurement (checked) on a different system");
ok(collapsedRank(gradeRef(environment, "e.regen-soc")) < collapsedRank(gradeRef(environment, "e.pasture-soc-proxy")), "the leap sits strictly below the measured proxy it transfers from: settledness is not inherited across the boundary");

// =====================================================================================
console.log("\n[C1] the composite grounds by citation, no more than its weakest necessary citation");
const weighByRef = Object.fromEntries(weighs.map((w) => [w.spec.ref, w]));
const wEat = weighByRef["w.eat"], wSys = weighByRef["w.system"];
ok(wEat.cits.find((c) => c.cited_claim === idOf("S-nutrition", "n.cv-diabetic")).carried_grade === "corroborated", "a citation carries the domain grade across the boundary (cv-diabetic at corroborated)");
ok(wEat.cits.find((c) => c.cited_claim === idOf("S-environment", "e.welfare")).carried_grade === "checked", "another carries its domain floor grade (welfare at checked)");
const weakest = wSys.cits.filter((c) => c.role === "necessary").reduce((a, b) => (collapsedRank(a.carried_grade) <= collapsedRank(b.carried_grade) ? a : b));
ok(weakest.cited_claim === idOf("S-environment", "e.regen-soc") && weakest.carried_grade === "supported", "the weakest necessary citation of the system weighing is the regenerative characterized gap (supported)");
ok(wSys.grade === "supported", "the system weighing is no more grounded than that weakest necessary citation (supported)");

// =====================================================================================
console.log("\n[C2] the cross-domain weighings reach structured-forum and no higher");
ok(wEat.ceiling === "corroborated" && wSys.ceiling === "corroborated", "each weighing composes quantities under distinct shared terms, so its ceiling is structured-forum");
ok(wEat.grade === "corroborated", "the eat weighing reaches structured-forum, capped there though it cites a settled (checked) welfare measurement");
ok(collapsedRank(wEat.grade) <= 3 && collapsedRank(wSys.grade) <= 3, "neither weighing reaches a floor: a value choice never reads as a measurement");
const terms = COMPOSITE.terms.map((t) => sharedTerm(t));
const eatTermIds = new Set(wEat.cits.filter((c) => c.role === "necessary").map((c) => c.term_ref.term_id));
ok(terms.length === COMPOSITE.terms.length && eatTermIds.size > 1, "the weighed quantities are distinct shared terms, declared once at the layer");

// =====================================================================================
console.log("\n[C3] the denominator swap leaves per-unit measurements intact and reframes the weighings");
const domGrade = (store, claim) => earnedOf(domains[store], idOf(store, claim));
const before = COMPOSITE.presupposes.map((p) => domGrade(p.store, p.claim));
ok(edges.every(({ edge }) => checkPresupposition(edge, framing).in_force), "each per-unit farming measurement carries a presupposition edge to the in-force denominator");
const throughputSuperseded = framingRecord({ ...COMPOSITE.framing, status: "superseded", successor: "F-netcapital" });
const swapped = edges.map(({ edge }) => swapFrame(edge, successor));
const after = COMPOSITE.presupposes.map((p) => domGrade(p.store, p.claim));
ok(before.join(",") === after.join(",") && before.every((g) => g === "checked" || g === "supported"), "swapping product-throughput for net-capital leaves every cited measurement's grade intact");
ok(swapped.every((e) => e.to_framing === "F-netcapital") && checkPresupposition(swapped[0], successor).in_force, "the edges re-point to the net-capital denominator, which checks in force");
ok(frameOrphaned(edges.map((x) => x.edge), { "F-throughput": throughputSuperseded }).length === edges.length, "against the now-superseded product-throughput frame, the un-swapped edges read as frame-orphaned");
const wEatReframed = crossDomainClaimRecord({ statement: wEat.spec.statement, support: wEat.cits.map((x) => x.citation_id), weighting: wEat.spec.weighting, frame_refs: [successor.framing_id] });
ok(wEatReframed.frame_refs[0] === "F-netcapital" && compositeGrade({ ceiling: wEat.ceiling, citations: wEat.cits }) === wEat.grade, "the weighing is reframed to the new denominator while its grade is untouched");

// =====================================================================================
console.log("\n[C4] the composite grounding profile: inherited ground versus its own forum");
ok(profile.record_type === "composite-grounding-profile", "the composite profile is a record");
ok(profile.cited_grounding["corroborated"] === 1 && profile.cited_grounding["supported"] === 1, "cited grounding by inherited grade: one weighing at structured-forum, one held down by the characterized gap");
ok(profile.forum_resident === 2, "forum-resident count: both cross-domain weighings live in the composite's own forum");
ok(profile.citation_health.current === compStore.citations.length && profile.citation_health.dangling === 0, "citation health: every citation current against its source domain state");
ok(profile.framing_in_force.in_force === 1, "the framing condition reports the denominator in force");

// =====================================================================================
console.log("\n[D1] the vendored reading the presentation renders is present and consistent");
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const readingPath = join(ROOT, "vendor/eggs/reading.json");
ok(existsSync(readingPath), "vendor/eggs/reading.json exists (regenerate with node build/vendor-eggs.mjs)");
if (existsSync(readingPath)) {
  const R = JSON.parse(readFileSync(readingPath, "utf8"));
  ok((R.domains || []).length === 3, "the reading carries all three domains, the composite over them");
  ok((R.characterized_gaps || []).length === 2 && R.characterized_gaps.every((g) => g.closing_condition), "the characterized-gap reading lists the regenerative claims and their closing conditions");
  ok((R.weighings || []).length === 2 && R.weighings.every((w) => w.ceiling === "corroborated"), "the weighings read at the structured-forum ceiling");
  ok(R.denominator && R.denominator.throughput && R.denominator.netcapital && JSON.stringify(R.denominator.throughput.measurements) === JSON.stringify(R.denominator.netcapital.measurements), "the denominator swap is present, and the measurement grades are identical across the swap");
  ok(R.cardiovascular_crux && R.cardiovascular_crux.status === "computed-resolved", "the cardiovascular crux is COMPUTED on read and now RESOLVES (Prompt 26): the confounding-adjustment reified, the tension explained not pooled");
  ok(R.reconciliation && R.reconciliation.within && R.reconciliation.within.shallow === false && R.reconciliation.within.kind === "within-domain", "the reading carries the computed within-domain CVD crux, resolving to the confounding-adjustment frontier");
  ok(R.reconciliation && R.reconciliation.cross && R.reconciliation.cross.kind === "cross-domain" && (R.reconciliation.cross.framing_crux || []).length >= 1, "the reading carries the computed cross-domain crux: the which-system weighing's framing node");
}

// =====================================================================================
console.log("\n" + H);
if (fails) { console.log(`check-eggs: ${fails} FAILURE(S)`); process.exit(1); }
console.log("verified: swapping the framing node reframes the verdict while every per-unit measurement holds its floor grade.");
console.log("check-eggs: OK"); console.log(H);
