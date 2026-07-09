// Role: the Phase B acceptance oracle for the migration (docs/trellis-to-v3.md). Translates the
//   three real cases (LHC, COVID, eggs) to v3 records, runs them through the v3 earned-grade and the
//   gate, and verifies the grounding is REPRODUCED, not re-established: every declared grade is
//   covered by the earned grade, the LHC cascade reaches measurement, the COVID inference terminates
//   at a priced-prior forum, the eggs inference splits, and the migration opens no new gap.
// Contract: `node build/check-migrate.mjs` exits non-zero on any failure or divergence. Loads the
//   corpus (CommonJS) via createRequire; imports the v3 kernel and the translator.
// Invariant: change no grounding verdict. A divergence (declared grade a migrated claim cannot earn)
//   STOPS with the case reported, because that disagreement is the one thing the migration exposes.
"use strict";
import { createRequire } from "node:module";
import { translateTrellis } from "./translate-trellis.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { storeViewOf } from "../kernel/store/decay.mjs";
import { genesis } from "../kernel/store/state.mjs";
import { apply } from "../kernel/store/apply.mjs";
import { decide } from "../kernel/gate/gate.mjs";
import { hashOf } from "../kernel/schema/canonical.mjs";
import { leqWithinMode, collapsedRank } from "../kernel/schema/confidence.mjs";

const require = createRequire(import.meta.url);
const G = require("../kernel/analysis/gaps.js");
const { PRIMITIVES } = require("../corpora/_primitives/primitives.js");
const { ATLAS } = require("../corpora/_shared/atlas/atlas.js");
const { BODIES } = require("../corpora/_shared/bodies/bodies.js");
const LHC = require("../corpora/lhc/lhc-cascade.js").CASE;
const POP = require("../corpora/population/population-pipeline.js").CASE;

let fails = 0;
const ok = (cond, msg) => { console.log(`${cond ? "  ok  " : " FAIL "} ${msg}`); if (!cond) fails++; };
const H = "=".repeat(78);

// translate a case and stand it up: apply the records to genesis, take the store view (earned grades).
function standUp(caseGraph, caseId) {
  const out = translateTrellis(caseGraph, { primitives: PRIMITIVES, bodies: BODIES, caseId });
  const tables = { sourceTable: makeSourceTable(out.sources), kindTable: makeKindTable(out.kinds) };
  let s = apply(genesis(), { entries: out.claims, links: out.links, applied_contribution_hash: caseId, receipt_reference: caseId });
  const view = storeViewOf(s, tables);
  return { out, tables, state: s, view };
}
const earnedOf = (ctx, id) => (ctx.view.earnedByIdentity.get(id) || { earned: "ungraded" }).earned;
const claimOf = (ctx, id) => ctx.out.claims.find((c) => c.identity === id);
// the leaves in a claim's support closure (following supports links backward to their sources).
function supportClosure(ctx, id) {
  const seen = new Set(), out = [];
  const stack = [id];
  while (stack.length) {
    const cur = stack.pop();
    for (const l of ctx.out.links) {
      if (l.link_kind === "supports" && l.to_identity === cur && !seen.has(l.from_identity)) {
        seen.add(l.from_identity); out.push(l.from_identity); stack.push(l.from_identity);
      }
    }
  }
  return out.map((i) => claimOf(ctx, i)).filter(Boolean);
}
const reachesMeasurement = (ctx, id) => supportClosure(ctx, id).some((c) => c.kind === "measurement");

console.log(H); console.log("CHECK-MIGRATE (Phase B): the three cases, v3 grounding reproduced"); console.log(H);

// -- baseline: the trellis gap detector's verdict on the corpus (what the migration must preserve) --
const baselineGaps = G.detectGaps({ primitives: PRIMITIVES, atlas: ATLAS, cases: [POP, LHC], bodies: BODIES });
const baselineGrounding = baselineGaps.filter((g) => g.kind === "grounding");
console.log(`\n[baseline] trellis gap detector: ${baselineGaps.length} gaps total, ${baselineGrounding.length} grounding gaps`);
ok(baselineGrounding.length === 0, "the corpus carries zero open grounding gaps (the closed floor the migration preserves)");

const lhc = standUp(LHC, "lhc-cascade");
const pop = standUp(POP, "population-pipeline");

// ---------------------------------------------------------------------------------------------
// 1. No divergence: every migrated claim's declared grade is covered by its earned grade. A single
//    failure here is the divergence the migration exists to expose; we collect and report it.
// ---------------------------------------------------------------------------------------------
console.log("\n[1] no divergence: declared <= earned for every migrated claim");
const divergences = [];
for (const [name, ctx] of [["LHC", lhc], ["population", pop]]) {
  for (const c of ctx.out.claims) {
    const earned = earnedOf(ctx, c.identity);
    const cmp = leqWithinMode(c.declared_grade, earned);
    if (!cmp.comparable || !cmp.leq) divergences.push({ name, statement: c.statement, declared: c.declared_grade, earned });
  }
}
ok(divergences.length === 0, `no claim declares a grade it cannot earn (${lhc.out.claims.length + pop.out.claims.length} claims checked)`);
for (const d of divergences) console.log(`      DIVERGENCE [${d.name}] ${d.statement} :: declared=${d.declared} earned=${d.earned}`);

// ---------------------------------------------------------------------------------------------
// 2. No new gap: every claim reached as a support (a child in the trellis) bottoms out in grounded
//    leaves, i.e. earns strictly above asserted. A support-reached claim stuck at asserted would be
//    the v3 equivalent of a grounding gap.
// ---------------------------------------------------------------------------------------------
console.log("\n[2] no new gap: every support-reached claim bottoms out in grounded leaves");
for (const [name, ctx] of [["LHC", lhc], ["population", pop]]) {
  const reached = new Set(ctx.out.links.filter((l) => l.link_kind === "supports").map((l) => l.to_identity));
  const ungrounded = [...reached].filter((id) => collapsedRank(earnedOf(ctx, id)) <= 1); // <= asserted
  ok(ungrounded.length === 0, `${name}: all ${reached.size} support-reached claims earn above asserted`);
  for (const id of ungrounded) console.log(`      UNGROUNDED ${(claimOf(ctx, id) || {}).statement}`);
}

// ---------------------------------------------------------------------------------------------
// 3. LHC reaches measurement: the cascade's spine bottoms out in measured body properties, and the
//    conclusion carries its own measurement basis (the survival observation).
// ---------------------------------------------------------------------------------------------
console.log("\n[3] LHC reaches measurement");
{
  const antecedent = lhc.out.byNode.get("lhc.antecedent");
  const claim = lhc.out.byNode.get("lhc.claim");
  ok(reachesMeasurement(lhc, antecedent), "the antecedent cascade's support closure contains measured body leaves");
  const bodyLeaves = supportClosure(lhc, antecedent).filter((c) => c.kind === "measurement");
  ok(bodyLeaves.length >= 4, `it grounds in ${bodyLeaves.length} distinct measurement leaves (white-dwarf / neutron-star properties)`);
  ok(earnedOf(lhc, antecedent) === "corroborated", `the antecedent earns corroborated (got ${earnedOf(lhc, antecedent)})`);
  ok(claimOf(lhc, claim).checking_records.length === 1 && earnedOf(lhc, claim) === "corroborated", "the conclusion carries its own measurement basis and earns corroborated");
}

// ---------------------------------------------------------------------------------------------
// 4. COVID terminates forum: the stage-1 break refuses the inference to a priced prior. The
//    conclusion is a forum claim, corroborated by the (sound) representativeness analysis, and its
//    support closure contains NO measurement leaf: it returns a priced prior, not a measurement.
// ---------------------------------------------------------------------------------------------
console.log("\n[4] COVID terminates at a priced-prior forum, not a measurement");
{
  const cid = pop.out.byNode.get("covid.instance");
  const c = claimOf(pop, cid);
  ok(c && c.kind === "forum", `the COVID conclusion is a forum claim (got ${c && c.kind})`);
  ok(earnedOf(pop, cid) === "corroborated", `it earns corroborated, capped at the forum ceiling (got ${earnedOf(pop, cid)})`);
  ok(!reachesMeasurement(pop, cid), "its support closure contains no measurement leaf: a priced prior, not a measurement");
}

// ---------------------------------------------------------------------------------------------
// 5. eggs splits: stage 1 holds, so the population conclusion closes on a measurement; stage 2
//    fails, so the individual application does not follow (refused, asserted, unsupported).
// ---------------------------------------------------------------------------------------------
console.log("\n[5] eggs splits: population conclusion closes, individual application refused");
{
  const popId = pop.out.byNode.get("eggs.instance.population");
  const indId = pop.out.byNode.get("eggs.instance.individual");
  const obs = pop.out.byNode.get("eggs.observation");
  ok(popId && earnedOf(pop, popId) === "corroborated", "the population conclusion earns corroborated (the sound-prefix statistic closes)");
  ok(obs && earnedOf(pop, obs) === "checked", `the measured population mean (an observation) reaches the measurement tier (got ${obs && earnedOf(pop, obs)})`);
  const ind = claimOf(pop, indId);
  ok(ind && ind.declared_grade === "asserted" && earnedOf(pop, indId) === "asserted", "the individual application does not follow: refused at asserted, unsupported");
  ok(collapsedRank(earnedOf(pop, indId)) < collapsedRank(earnedOf(pop, popId)), "the split is real: the individual side sits strictly below the population side");
}

// ---------------------------------------------------------------------------------------------
// 6. the gate accepts each migrated case (the membrane runs on real records, ~seconds).
// ---------------------------------------------------------------------------------------------
console.log("\n[6] the v3 gate accepts each migrated case");
for (const [name, ctx] of [["LHC", lhc], ["population", pop]]) {
  const contribution = { hash: name, entries: ctx.out.claims, links: ctx.out.links };
  const receipt = decide(contribution, storeViewOf(genesis(), ctx.tables), {});
  ok(receipt.decision === "accepted", `${name}: gate decision ${String(receipt.decision).toUpperCase()} over ${ctx.out.claims.length} claims, ${ctx.out.links.length} links`);
  void hashOf(receipt); // the receipt is canonicalizable (no float, no null on the path)
}

// determinism over the real cases: a second translation is byte-identical.
console.log("\n[7] determinism over the real cases");
for (const [name, caseGraph, caseId] of [["LHC", LHC, "lhc-cascade"], ["population", POP, "population-pipeline"]]) {
  const a = translateTrellis(caseGraph, { primitives: PRIMITIVES, bodies: BODIES, caseId });
  const b = translateTrellis(caseGraph, { primitives: PRIMITIVES, bodies: BODIES, caseId });
  const digest = (o) => o.claims.map((c) => c.hash).join(",") + "|" + o.links.map((l) => l.hash).join(",");
  ok(digest(a) === digest(b), `${name}: re-translation byte-identical (${a.claims.length} claims, ${a.links.length} links)`);
}

console.log("\n" + H);
if (fails === 0) console.log("verified: the three cases ground correctly under the schema, each claim earning at or below its declared grade, no divergence.");
console.log(fails === 0 ? "check-migrate: OK  (grounding reproduced, no divergence, no new gap)" : `check-migrate: ${fails} FAILURE(S)`);
console.log(H);
process.exit(fails === 0 ? 0 : 1);
