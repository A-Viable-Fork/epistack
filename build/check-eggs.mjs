// Role: the eggs-case oracle (Prompt 20). The eggs question, restructured into domain stores that
//   ground to their own floors and an eggs composite that cites them across the boundary, run on real
//   ingested research. It builds each domain store through the real v3 gate and the composite through
//   the Prompt 19 composition layer, and verifies grounding, the cardiovascular contradiction, the
//   regenerative characterized gaps, the cross-domain weighings, and the denominator swap. Grows
//   across the four phases; Phase A is the domain stores and the nutrition domain.
// Contract: `node build/check-eggs.mjs` exits non-zero on any failure. Loads corpora/eggs (CommonJS)
//   via createRequire; imports the v3 kernel and the composition layer only.
// Invariant: a domain claim grounds to a domain floor, a composite claim grounds by citing across the
//   boundary. Where a claim's stated mode conflicts with the gate's earned grade, the oracle STOPS
//   and reports it, because that conflict is a finding about the claim.
"use strict";
import { createRequire } from "node:module";
import { claimRecord, linkRecord } from "../kernel/schema/records.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { genesis } from "../kernel/store/state.mjs";
import { apply } from "../kernel/store/apply.mjs";
import { storeViewOf } from "../kernel/store/decay.mjs";
import { decide } from "../kernel/gate/gate.mjs";
import { collapsedRank, tierOf } from "../kernel/schema/confidence.mjs";
import { characterizedGaps, characterization } from "../kernel/analysis/characterized-gaps.mjs";

const require = createRequire(import.meta.url);
const { KINDS, SOURCES } = require("../corpora/eggs/tables.js");
const { NUTRITION } = require("../corpora/eggs/nutrition.js");
const { ENVIRONMENT } = require("../corpora/eggs/environment.js");

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-EGGS (Prompt 20): the eggs case as domains and a composite, on real research"); console.log(H);

const tables = { sourceTable: makeSourceTable(SOURCES), kindTable: makeKindTable(KINDS) };
const sourceIds = new Set(SOURCES.map((s) => s.source_id));

// build a domain store from ingested data: claim records keyed by local ref, link records resolved
// ref -> identity, applied to genesis, with the gate receipt and the earned-grade view.
function buildDomain(domain) {
  const refId = new Map();
  const claims = domain.claims.map((spec) => {
    const rec = claimRecord({ kind: spec.kind, statement: spec.statement, source_id: spec.source_id, contributor_id: spec.contributor_id, declared_grade: spec.declared_grade, checking_records: spec.checking_records, closing_condition: spec.closing_condition });
    refId.set(spec.ref, rec.identity);
    return { rec, spec };
  });
  const links = (domain.links || []).map((l) => linkRecord({
    link_kind: l.link_kind, from_identity: refId.get(l.from), to_identity: refId.get(l.to),
    support_group: l.support_group, source_id: l.source_id, contributor_id: l.contributor_id, declared_grade: l.declared_grade,
  }));
  const entries = claims.map((c) => c.rec);
  const state = apply(genesis(), { entries, links, applied_contribution_hash: domain.store_id, receipt_reference: domain.store_id });
  const view = storeViewOf(state, tables);
  const receipt = decide({ hash: domain.store_id, entries, links }, storeViewOf(genesis(), tables), {});
  return { store_id: domain.store_id, claims, links, refId, state, view, receipt, tables };
}
const earnedOf = (dom, id) => (dom.view.earnedByIdentity.get(id) || { earned: "ungraded" }).earned;
const byRef = (dom, ref) => dom.refId.get(ref);
const gradeRef = (dom, ref) => earnedOf(dom, byRef(dom, ref));

// report any conflict between a claim's stated mode (declared_grade) and the gate's earned grade.
function reportConflicts(dom) {
  const conflicts = [];
  for (const { rec } of dom.claims) {
    const cmp = dom.receipt.grade_table.find((g) => g.identity === rec.identity);
    if (cmp && (collapsedRank(cmp.declared_grade) > collapsedRank(cmp.earned_grade))) conflicts.push({ statement: rec.statement, declared: cmp.declared_grade, earned: cmp.earned_grade });
  }
  return conflicts;
}

const nutrition = buildDomain(NUTRITION);

// =====================================================================================
console.log("\n[A1] the nutrition domain store admits, and no stated mode conflicts with the gate");
ok(nutrition.receipt.decision !== "declined", `the gate admits the nutrition store (decision ${nutrition.receipt.decision})`);
const nConflicts = reportConflicts(nutrition);
for (const c of nConflicts) console.log(`      CONFLICT ${c.statement} :: declared=${c.declared} earned=${c.earned}`);
ok(nConflicts.length === 0, `no nutrition claim declares a grade it cannot earn (${nutrition.claims.length} claims)`);

// =====================================================================================
console.log("\n[A2] the metabolic and responder claims reach the measurement floor");
const floorRefs = ["n.chol-serum", "n.nonlinear", "n.ratio", "n.metsyn-rct", "n.content", "n.unimodal", "n.responder-var", "n.heritable"];
for (const r of floorRefs) ok(tierOf(gradeRef(nutrition, r)) === "settled" && gradeRef(nutrition, r) === "checked", `${r} grounds to the measurement floor (checked)`);

// =====================================================================================
console.log("\n[A3] the guidelines claims rest in the forum");
for (const r of ["n.guidelines", "n.aha", "n.individual-unknown"]) {
  const g = gradeRef(nutrition, r);
  ok(tierOf(g) !== "settled", `${r} rests in the forum (${g}), not at a floor`);
}

// =====================================================================================
console.log("\n[A4] the cardiovascular block is a contradiction held as structure");
const contra = nutrition.receipt.contradiction_records || [];
const nullId = byRef(nutrition, "n.cv-null"), harmId = byRef(nutrition, "n.cv-harm");
const joined = contra.find((c) => (c.identity_a === nullId && c.identity_b === harmId) || (c.identity_a === harmId && c.identity_b === nullId));
ok(!!joined, "the population null and the population harm claim are joined by a contradicts link");
ok(nutrition.receipt.decision === "accepted-with-disagreement", `the store admits WITH the disagreement recorded (decision ${nutrition.receipt.decision})`);
ok(tierOf(gradeRef(nutrition, "n.cv-null")) !== "settled" && tierOf(gradeRef(nutrition, "n.cv-harm")) !== "settled", "neither population claim carries a floor grade the other's contest could remove");
ok(gradeRef(nutrition, "n.cv-diabetic") === "corroborated", "the diabetic-interaction claim grounds where the observational lines agree (corroborated in the forum)");
ok(collapsedRank(gradeRef(nutrition, "n.cv-diabetic")) > collapsedRank(gradeRef(nutrition, "n.cv-null")), "the diabetic-interaction claim grounds above the population claims that stay in tension");

// =====================================================================================
console.log("\n[A5] every claim carries its provenance");
let missingProv = 0;
for (const { spec } of nutrition.claims) if (!sourceIds.has(spec.source_id)) { missingProv++; console.log(`      NO SOURCE ${spec.ref} -> ${spec.source_id}`); }
ok(missingProv === 0, `every nutrition claim resolves to a source row (provenance stated in the document)`);

// the graph a reading operates over: the applied entries and links, plus the tables.
const graphOf = (dom) => ({ entries: dom.state.entries, links: dom.state.links, tables });

const environment = buildDomain(ENVIRONMENT);

// =====================================================================================
console.log("\n[B1] the environment domain store admits, and no stated mode conflicts with the gate");
ok(environment.receipt.decision !== "declined", `the gate admits the environment store (decision ${environment.receipt.decision})`);
const eConflicts = reportConflicts(environment);
for (const c of eConflicts) console.log(`      CONFLICT ${c.statement} :: declared=${c.declared} earned=${c.earned}`);
ok(eConflicts.length === 0, `no environment claim declares a grade it cannot earn (${environment.claims.length} claims)`);

// =====================================================================================
console.log("\n[B2] per-unit measurements reach the floor; cross-cutting trade-offs rest in the forum");
for (const r of ["e.ghg", "e.land", "e.welfare", "e.keel", "e.antibiotics", "e.soil-health", "e.biodiversity", "e.runoff"])
  ok(gradeRef(environment, r) === "checked", `${r} grounds to the measurement floor (checked)`);
for (const r of ["e.trilemma", "e.water-metric", "e.scale"])
  ok(tierOf(gradeRef(environment, r)) !== "settled", `${r} rests in the forum (${gradeRef(environment, r)})`);

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
console.log("\n" + H);
if (fails) { console.log(`check-eggs: ${fails} FAILURE(S)`); process.exit(1); }
console.log("check-eggs: OK"); console.log(H);

// export the domain builder and state for later phases (imported by no oracle; kept for reuse)
export { buildDomain, tables };
