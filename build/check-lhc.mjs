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
import { analyzePresupposition, analyzeRobustness } from "../kernel/analysis/robustness.mjs";
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

console.log("\n" + H);
if (fails) { console.log(`check-lhc: ${fails} FAILURE(S)`); process.exit(1); }
console.log("check-lhc: OK (Phase A: legs grounded, premises as characterized dependencies)"); console.log(H);
void analyzePresupposition; void analyzeRobustness;
