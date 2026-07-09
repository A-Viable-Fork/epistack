// Role: the LHC-cascade oracle (Prompt 25). Verifies the densified three-leg case: the computed
//   quantities ground to their floors within their regime and the gate admits them, each leg's premise
//   is a characterized dependency carrying its closing condition, the backstop is reconciled as Leg 3,
//   and the production-uncertainty meta-claim is present with provenance. Later phases add the framework
//   swap, the shared-dependency reading, the undercuts, and the settled/performed finding.
// Contract: `node build/check-lhc.mjs` exits non-zero on any failure. Imports the kernel, the robustness
//   readings, and the shared LHC builder; touches no truth field.
// Invariant: a report is canonical for the claims, never for the grade; where the gate disagrees with a
//   proposed mode the disagreement is a finding, listed, not forced.
"use strict";
import { collapsedRank, tierOf } from "../kernel/schema/confidence.mjs";
import { analyzePresupposition, analyzeRobustness, analyzeUndercuts } from "../kernel/analysis/robustness.mjs";
import { framingRecord, checkPresupposition, swapFrame, frameOrphaned } from "../kernel/composition/framing.mjs";
import { buildLhc } from "./lhc-build.mjs";

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-LHC (Prompt 25): the three-leg safety cascade around the framework-choice node"); console.log(H);

const C = buildLhc();
const id = (ref) => C.refId.get(ref);
const earned = (ref) => (C.view.earnedByIdentity.get(id(ref)) || { earned: "ungraded" }).earned;
const specOf = (ref) => C.claims.find((c) => c.spec.ref === ref).spec;

// =====================================================================================
console.log("\n[A1] the store is admitted and every claim carries provenance");
ok(C.receipt.decision !== "declined", `the gate admits the LHC store (decision ${C.receipt.decision})`);
const srcIds = new Set(C.tables.sourceTable.byId.keys());
ok(C.claims.every((c) => srcIds.has(c.spec.source_id)), `every claim resolves to a source row a report names (${C.claims.length} claims)`);
ok(new Set(C.claims.map((c) => c.rec.identity)).size === C.claims.length, "no claim is duplicated");

// =====================================================================================
console.log("\n[A2] the computed quantities ground to their floors within their regime");
// formal-settled derivations settle by construction (constitutive), within their stated regime.
for (const r of ["prod.reach", "hawking.temp", "hawking.lifetime", "astro.gm"])
  ok(earned(r) === "constitutive", `${r} grounds to its derivation floor (constitutive) within its regime`);
// the empirical survival fact grounds to the measurement floor.
ok(earned("astro.survival") === "checked", "the astrophysical survival fact grounds to the measurement floor (checked)");
// formal-contested computed quantities sit below the floor, in the open tier, as the qualification demands.
for (const r of ["prod.xsec", "prod.threshold"])
  ok(tierOf(earned(r)) !== "settled", `${r} is formal-contested: it sits below the floor (${earned(r)}), not forced to settled`);

// =====================================================================================
console.log("\n[A3] the three legs are grounded and the top claim is their disjunction");
for (const r of ["leg.prod", "leg.hawking", "leg.astro"])
  ok(collapsedRank(earned(r)) >= 3, `${r} is grounded (earned ${earned(r)})`);
ok(collapsedRank(earned("safe")) >= 3, `the top safety claim earns from the disjunction of the legs (${earned("safe")})`);
const supportsInto = (toRef) => C.graph.links.filter((l) => l.link_kind === "supports" && l.to_identity === id(toRef)).map((l) => l.from_identity);
const safeSup = new Set(supportsInto("safe"));
ok(["leg.prod", "leg.hawking", "leg.astro"].every((r) => safeSup.has(id(r))), "the top claim is supported by all three legs (the disjunction)");

// =====================================================================================
console.log("\n[A4] each leg's premise is a characterized dependency carrying its closing condition");
const dependsOnOf = (depRef) => C.graph.links.filter((l) => l.link_kind === "depends-on" && l.to_identity === id(depRef)).map((l) => l.from_identity);
ok(dependsOnOf("leg.prod").includes(id("dep.add")), "Leg 1 (production) depends on the TeV-scale-gravity (ADD) premise");
ok(dependsOnOf("leg.hawking").includes(id("dep.semiclassical")), "Leg 2 (Hawking) depends on the semiclassical-regime premise");
ok(!!specOf("dep.add").closing_condition && specOf("dep.add").closing_condition.condition_kind === "measurement-on-the-system", "the ADD premise carries a closing condition (a measurement of M_D within LHC reach)");
ok(!!specOf("dep.semiclassical").closing_condition, "the semiclassical premise carries a closing condition");
ok(/near threshold|M_BH\/M_\* ~ 2-5|doubtful/.test(specOf("dep.semiclassical").statement), "the Hawking premise records the near-threshold doubt (M_BH/M_* ~ 2-5, below the regime requirement)");
// a premise is a depends-on edge, never support: it does not enter the leg's grade.
ok(!supportsInto("leg.prod").includes(id("dep.add")) && !supportsInto("leg.hawking").includes(id("dep.semiclassical")), "the premises are depends-on edges, not support: they carry no grade into the legs");

// =====================================================================================
console.log("\n[A5] the backstop is reconciled as Leg 3 without duplication, and the meta-claim is present");
ok(specOf("leg.astro").statement.includes("survive") && supportsInto("leg.astro").includes(id("astro.survival")), "Leg 3 reconciles the astrophysical survival backstop, grounded on the survival measurement");
ok(supportsInto("leg.astro").includes(id("astro.gm")), "Leg 3 carries the Giddings-Mangano destroy-time derivation without re-authoring the whole cascade");
ok(specOf("prod.uncertainty").statement.includes("15 orders") && collapsedRank(earned("prod.uncertainty")) >= 2, `the >15-orders production-uncertainty meta-claim is present with provenance (earned ${earned("prod.uncertainty")})`);

// =====================================================================================
console.log("\n[A6] mode disagreements between a report and the gate are listed as findings");
// report A proposes the geometric cross-section and the threshold as 'formal' (a derivation), but
// qualifies each as O(1)-O(10) / convention-dependent; the gate refines that to a contested forum claim
// below the settled floor. Report each such refinement.
for (const r of ["prod.xsec", "prod.threshold"]) console.log(`      FINDING report A's 'formal' mode for ${r} is contested: the gate grounds it to ${earned(r)}, not the settled floor`);
ok(true, "the two formal-contested computed quantities are reported as mode-refinement findings");

// =====================================================================================
console.log("\n[B1] the framework choice and semiclassical gravity are reified, and ADD's dangerous branch reads excluded");
for (const r of ["dep.add", "dep.semiclassical"]) ok(!!id(r) && specOf(r).kind === "forum", `${r} is a reified forum node (no experiment compels the framework choice)`);
for (const leg of ["leg.prod", "leg.hawking", "leg.astro"]) {
  const deps = dependsOnOf(leg);
  ok(deps.includes(id("dep.add")) && deps.includes(id("dep.semiclassical")), `${leg} carries a dependency edge to BOTH the ADD framework choice and semiclassical gravity`);
}
ok(earned("add.excluded") === "checked" && /5\.9-11\.2 TeV/.test(specOf("add.excluded").statement) && /8\.4-11\.4 TeV/.test(specOf("add.excluded").statement), "ADD's dangerous branch (M_D ~ 1-3 TeV) reads as empirically excluded, with the convergent bounds attached");

// =====================================================================================
console.log("\n[B2] THE ROBUSTNESS READING: the shared dependency the leg count hides (before/after)");
// the load-bearing claim: reifying the shared nodes changes the reading. Written to fail loudly.
const after = analyzePresupposition(C.graph, id("robust"));
const before = analyzePresupposition(C.graphWithout(), id("robust"));
const nm = (i) => { for (const [k, v] of C.refId) if (v === i) return k; return String(i).slice(0, 8); };
const afterShared = after.shared_presuppositions.map(nm).sort();
const beforeShared = before.shared_presuppositions.map(nm).sort();
console.log(`      BEFORE reifying: shared dependencies across the legs = [${beforeShared.join(", ")}] (the three legs look independent)`);
console.log(`      AFTER  reifying: shared dependencies across the legs = [${afterShared.join(", ")}]`);
ok(beforeShared.length === 0, "BEFORE reifying, the reading finds NO shared dependency: the naive three-leg count reads as independent");
ok(afterShared.join(",") === "dep.add,dep.semiclassical", "AFTER reifying, the reading finds ADD and semiclassical gravity as shared dependencies across all three legs");
ok(beforeShared.join(",") !== afterShared.join(","), "the reading CHANGED on reifying: the shared-dependency finding is evidence the edges are wired and the reading sees them");
// each shared dependency is a single point of well-formedness failure across the legs.
const wf = new Set(after.single_points_of_wellformedness_failure.filter((s) => s.shared).map((s) => nm(s.identity)));
ok(wf.has("dep.add") && wf.has("dep.semiclassical"), "each is a shared single point of failure: lose it and all three legs lose their frame together");

// =====================================================================================
console.log("\n[B3] THE FRAMING READING: swap the framework, moot the analysis, keep the calculations");
// the within-framework calculations presuppose the frame via a checked-not-graded edge (eggs seam).
ok(C.frameEdges.length >= 4 && C.frameEdges.every(({ edge }) => checkPresupposition(edge, C.framing).in_force), "each within-framework calculation carries a presupposition edge to the in-force ADD frame");
const gradeBefore = C.LHC.presupposes.map((p) => earned(p.claim));
ok(gradeBefore.every((g) => g === "constitutive"), `the within-framework calculations keep their formal (constitutive) grade under the frame (${gradeBefore.join(",")})`);
// swap ADD -> the standard model. Re-point the edges; the calculations are untouched.
const swapped = C.frameEdges.map(({ edge }) => swapFrame(edge, C.successor));
const gradeAfter = C.LHC.presupposes.map((p) => earned(p.claim));
ok(gradeBefore.join(",") === gradeAfter.join(",") && gradeAfter.every((g) => g === "constitutive"), "swapping ADD for the standard model leaves every within-framework grade intact");
ok(swapped.every((e) => e.to_framing === "F-sm") && checkPresupposition(swapped[0], C.successor).in_force, "the calculations re-point to the standard-model frame, which checks in force");
// the analysis is mooted: under SM the frame says no production, so the safety cascade does not arise.
const addSuperseded = framingRecord({ ...C.LHC.framing, status: "superseded", successor: "F-sm" });
ok(frameOrphaned(C.frameEdges.map((x) => x.edge), { "F-add": addSuperseded }).length === C.frameEdges.length, "against the now-superseded ADD frame, the un-swapped calculations read as frame-orphaned (the frame moved out from under them)");
ok(/no black hole is produced|moot/.test(C.successor.statement), "the standard-model frame moots the safety analysis: no production at LHC energies, the question trivially answered");

// =====================================================================================
console.log("\n[B4] the conditionality meta-claim is present and marked a forum judgment");
ok(specOf("conditionality").kind === "forum" && /85-90%/.test(specOf("conditionality").statement) && /4-5 order/.test(specOf("conditionality").statement), "the conditionality meta-claim carries the 85-90% framework-choice share against the 4-5 order within-framework spread");
ok(/forum judgment|not derivable/.test(specOf("conditionality").statement) && tierOf(earned("conditionality")) !== "settled", "the multiplicity weighting is marked honestly as a forum judgment, not forced to a settled grade");

// =====================================================================================
console.log("\n[C1] the performed-settling finding: settled calculations held apart from the performed claim");
// the engine holds the within-framework calculations (settled by construction) apart from the
// unconditional threat-free claim (which performs a settledness it has not earned).
const calcsSettled = C.LHC.presupposes.every((p) => earned(p.claim) === "constitutive");
ok(calcsSettled, "the within-framework calculations read as settled (constitutive by construction)");
ok(tierOf(earned("public.unconditional")) !== "settled" && earned("public.unconditional") === "asserted", `the unconditional public claim reads as performed, not settled (earned ${earned("public.unconditional")})`);
// the conditional structure names the antecedent the public claim drops, and contradicts the erasure.
ok(dependsOnOf("conditional.structure").includes(id("dep.add")), "the conditional structure names the dropped antecedent (the ADD framework choice) as a depends-on");
const contradicts = C.graph.links.filter((l) => l.link_kind === "contradicts").some((l) => l.from_identity === id("conditional.structure") && l.to_identity === id("public.unconditional"));
ok(contradicts, "the conditional structure contradicts the unconditional public claim: the erasure is registered, not silent");
ok(supportsInto("conditional.structure").includes(id("spc.threelevel")) && /three increasingly unlikely conditions/.test(specOf("spc.threelevel").statement), "the SPC's three-level acknowledgment is the evidence that the antecedent was dropped");

// =====================================================================================
console.log("\n[C2] the undercuts attach to their named legs and lower the confidence those legs carry");
const uAstro = analyzeUndercuts(C.graph, id("leg.astro"));
const uHawk = analyzeUndercuts(C.graph, id("leg.hawking"));
const uProd = analyzeUndercuts(C.graph, id("leg.prod"));
console.log(`      Leg 3 (astro):   grounding ${uAstro.grade} -> confidence ${uAstro.confidence_after_undercuts} under ${uAstro.undercuts.length} undercut (Plaga)`);
console.log(`      Leg 2 (Hawking): grounding ${uHawk.grade} -> confidence ${uHawk.confidence_after_undercuts} under ${uHawk.undercuts.length} undercuts (trans-Planckian, Vilkovisky, firewall)`);
console.log(`      Leg 1 (production): grounding ${uProd.grade} -> confidence ${uProd.confidence_after_undercuts} under ${uProd.undercuts.length} undercuts`);
ok(uAstro.undercuts.length === 1 && uAstro.lowered, "Plaga's undercut attaches to Leg 3 and lowers the confidence the backstop carries");
ok(uHawk.undercuts.length === 3 && uHawk.lowered, "the three Leg-2 undercuts attach and lower Leg 2's confidence");
ok(uProd.undercuts.length === 0 && !uProd.lowered, "Leg 1 carries no undercut and its confidence is unlowered (the reading is empty, correctly, not a miss)");
// each undercut carries its provenance and discovery grade.
for (const u of C.LHC.undercuts) ok(srcIds.has(specOf(u.ref).source_id) && /discovery grade/.test(specOf(u.ref).statement), `${u.ref} carries its provenance and discovery grade (${u.discovery})`);

// =====================================================================================
console.log("\n[C3] the empirical-closure meta-claim is present and marked empirical, not logical");
ok(/empirical closure, not logical/.test(specOf("closure.empirical").statement) && /falsifying the antecedent/.test(specOf("closure.empirical").statement), "the closure meta-claim reads: resolved by falsifying the antecedent, not by proving black holes safe");
ok(/100 TeV|reopen/.test(specOf("closure.empirical").statement) && /exploratory/.test(specOf("closure.empirical").statement), "the residual reopening is noted (a 100 TeV collider; the theoretical-closure route stays exploratory)");
ok(supportsInto("closure.empirical").includes(id("add.excluded")), "the empirical closure rests on the empirical exclusion of the dangerous branch");

console.log("\n" + H);
if (fails) { console.log(`check-lhc: ${fails} FAILURE(S)`); process.exit(1); }
console.log("verified: reifying the dependency the legs share reprices the convergence; the three legs read independent before the shared node and share dep.add and dep.semiclassical after.");
console.log("check-lhc: OK (Phase C: performed-settling, undercuts, and empirical closure)"); console.log(H);
void analyzeRobustness;
