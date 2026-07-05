// Role: the reconciliation oracle (Prompt 22, Phase A). Exercises the within-domain crux on the real
//   CVD contradiction from the eggs case (built through the shared eggs builder, not a fixture) and on
//   two synthetic fixtures: a rich pair whose cones share a confounder and diverge below it (a
//   meaningful frontier with a resolved sub-region), and a disjoint pair whose cones share nothing.
//   The register holds the CVD pair with both sides and their grades. The crux is a candidate, not a
//   verdict. Phase B adds the cross-domain crux and the routing.
// Contract: `node build/check-reconcile.mjs` exits non-zero on any failure. Imports the kernel and the
//   shared eggs builder; the corpus is not touched.
// Invariant: pure and deterministic; a re-run is byte-identical. A shallow frontier on the CVD is
//   reported as a finding, not forced into a false frontier, per the honest bound in the module head.
"use strict";
import { claimRecord, linkRecord } from "../kernel/schema/records.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { hashOf } from "../kernel/schema/canonical.mjs";
import { supportCone, withinDomainCrux, disagreements, disagreementRecord, reconcile, crossDomainCrux } from "../kernel/analysis/reconciliation.mjs";
import { createClientApi } from "../api/client-api.mjs";
import { createLocalProvider } from "../api/providers/local-provider.mjs";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildEggs } from "./eggs-build.mjs";

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-RECONCILE (Prompt 22): what a disagreement turns on, computed on read"); console.log(H);

// ---- the real CVD contradiction from the eggs nutrition domain ----
const E = buildEggs();
const nut = E.domains["S-nutrition"];
const graph = { entries: nut.state.entries, links: nut.state.links, tables: E.tables };
const id = (ref) => nut.refId.get(ref);

// =====================================================================================
console.log("\n[A1] the reconciliation register holds the CVD pair as a disagreement record");
const reg = disagreements(graph);
ok(reg.length === 1, `exactly one contradicts-linked disagreement in the nutrition store (got ${reg.length})`);
const cvd = reg[0];
const sides = new Set([cvd.side_a.identity, cvd.side_b.identity]);
ok(sides.has(id("n.cv-null")) && sides.has(id("n.cv-harm")), "the record carries both sides: the population null and the population harm claim");
ok(cvd.side_a.grade === "asserted" && cvd.side_b.grade === "asserted", `the record carries each side's grade (got ${cvd.side_a.grade} / ${cvd.side_b.grade})`);
ok(cvd.record_type === "disagreement" && cvd.crux.candidate === true, "the record marks the crux a candidate, not a verdict");

// =====================================================================================
console.log("\n[A2] the CVD within-domain crux now resolves to the confounding-adjustment choice (Prompt 26)");
const cx = cvd.crux;
ok(cx.kind === "within-domain", "the CVD contradiction routes to the within-domain (cone-walk) crux");
// Prompt 26 reified the confounding-adjustment as an explicit node both cohorts rest on, and gave
// both the shared diabetic agreement and the mechanistic-floor parallel-rise, so the cones are no
// longer empty and the crux resolves rather than sitting shallow at the top.
ok(cx.structurally_disjoint === false && cx.shallow === false, "the cones now share structure: the crux resolves, no longer shallow");
ok(cx.frontier_candidates.includes(id("adj.uscohort")) && cx.frontier_candidates.includes(id("adj.global")), "the divergence frontier is the confounding-adjustment choice (US-cohort vs global/repeated-measures)");
ok(!cx.frontier_candidates.includes(id("n.cv-diabetic")), "the diabetic-interaction claim is not on the frontier: it is not the crux");
ok(cx.resolved_sub_region.includes(id("n.cv-diabetic")), "the diabetic-interaction claim sits in the resolved sub-region: the agreement both camps share");

// =====================================================================================
console.log("\n[A3] a synthetic rich pair: a meaningful frontier and a resolved sub-region");
// two claims contradicting, both resting on a shared confounder that rests on a shared base, each also
// resting on its own divergent evidence. The frontier is the divergent evidence; the resolved
// sub-region is the shared confounder and base, and the base claim falls in the resolved sub-region.
const kinds = makeKindTable([{ kind: "measurement", ceiling: "checked" }, { kind: "forum", ceiling: "corroborated" }]);
const sources = makeSourceTable(["s-base", "s-conf", "s-x", "s-y", "s-a", "s-b"].map((s) => ({ source_id: s, source_class: "peer-reviewed", rests_on: [] })));
const rtab = { sourceTable: sources, kindTable: kinds };
const chk = (c) => [{ checker_id: c, method_class: "data-audit", method: "m", checked_at_state: "genesis", outcome: "confirms", independence: "distinct-party" }];
const mk = (stmt, kind, grade, checks) => claimRecord({ kind, statement: stmt, source_id: "s-" + stmt, contributor_id: "c", declared_grade: grade, checking_records: checks });
const base = claimRecord({ kind: "measurement", statement: "base", source_id: "s-base", contributor_id: "c", declared_grade: "checked", checking_records: chk("kb") });
const conf = claimRecord({ kind: "measurement", statement: "confounder", source_id: "s-conf", contributor_id: "c", declared_grade: "checked", checking_records: chk("kc") });
const xx = claimRecord({ kind: "measurement", statement: "x-evidence", source_id: "s-x", contributor_id: "c", declared_grade: "checked", checking_records: chk("kx") });
const yy = claimRecord({ kind: "measurement", statement: "y-evidence", source_id: "s-y", contributor_id: "c", declared_grade: "checked", checking_records: chk("ky") });
const A = claimRecord({ kind: "forum", statement: "side-A", source_id: "s-a", contributor_id: "c", declared_grade: "asserted" });
const B = claimRecord({ kind: "forum", statement: "side-B", source_id: "s-b", contributor_id: "c", declared_grade: "asserted" });
const sl = (from, to, grp, src) => linkRecord({ link_kind: "supports", from_identity: from.identity, to_identity: to.identity, support_group: grp, source_id: src, contributor_id: "c", declared_grade: "supported" });
const richGraph = {
  entries: [base, conf, xx, yy, A, B],
  links: [
    sl(conf, A, "g1", "s-conf"), sl(xx, A, "g2", "s-x"),   // A rests on the confounder and on x
    sl(conf, B, "g1", "s-conf"), sl(yy, B, "g2", "s-y"),   // B rests on the same confounder and on y
    sl(base, conf, "g3", "s-base"),                          // the confounder rests on the shared base
    linkRecord({ link_kind: "contradicts", from_identity: A.identity, to_identity: B.identity, source_id: "s-a", contributor_id: "c", declared_grade: "asserted" }),
  ],
  tables: rtab,
};
const rc = withinDomainCrux(richGraph, A.identity, B.identity);
ok(!rc.structurally_disjoint && !rc.shallow, "the rich pair is not disjoint: the cones share the confounder and the base");
ok(rc.resolved_sub_region.includes(conf.identity) && rc.resolved_sub_region.includes(base.identity), "the resolved sub-region is the shared confounder and base (the claims the cones agree on)");
ok(rc.frontier_candidates.includes(xx.identity) && rc.frontier_candidates.includes(yy.identity), "the frontier is the divergent evidence each side rests on differently (x and y)");
ok(!rc.frontier_candidates.includes(conf.identity), "the shared confounder is in the resolved sub-region, not on the frontier");

// =====================================================================================
console.log("\n[A4] a synthetic disjoint pair: cones share no structure, crux at the top");
const P = claimRecord({ kind: "forum", statement: "P", source_id: "s-a", contributor_id: "c", declared_grade: "asserted" });
const Q = claimRecord({ kind: "forum", statement: "Q", source_id: "s-b", contributor_id: "c", declared_grade: "asserted" });
const pOnly = claimRecord({ kind: "measurement", statement: "p-eq", source_id: "s-x", contributor_id: "c", declared_grade: "checked", checking_records: chk("kp") });
const qOnly = claimRecord({ kind: "measurement", statement: "q-eq", source_id: "s-y", contributor_id: "c", declared_grade: "checked", checking_records: chk("kq") });
const disjointGraph = {
  entries: [P, Q, pOnly, qOnly],
  links: [
    sl(pOnly, P, "g1", "s-x"), sl(qOnly, Q, "g2", "s-y"), // P and Q each rest on their own evidence, no overlap
    linkRecord({ link_kind: "contradicts", from_identity: P.identity, to_identity: Q.identity, source_id: "s-a", contributor_id: "c", declared_grade: "asserted" }),
  ],
  tables: rtab,
};
const dc = withinDomainCrux(disjointGraph, P.identity, Q.identity);
ok(dc.structurally_disjoint === true && dc.shallow === false, "cones are non-empty but share nothing: structurally disjoint, not shallow");
ok(dc.frontier_candidates.length === 2 && dc.frontier_candidates.includes(P.identity) && dc.frontier_candidates.includes(Q.identity), "the crux is at the top (the contradicting claims), not a false frontier inside a cone");
ok(dc.resolved_sub_region.length === 0, "there is no resolved sub-region: the cones agree on nothing");

// =====================================================================================
console.log("\n[A5] pure and deterministic: a re-run is byte-identical");
const digest = () => hashOf({ cvd: JSON.stringify(disagreements(graph)), rich: JSON.stringify(withinDomainCrux(richGraph, A.identity, B.identity)), dis: JSON.stringify(withinDomainCrux(disjointGraph, P.identity, Q.identity)) });
ok(digest() === digest(), "two runs of the crux computation produce an identical digest");
void supportCone; void disagreementRecord;

// =====================================================================================
console.log("\n[B1] the two-kind routing: a within-domain pair walks the cone, a cross-domain weighing names the frame");
// within-domain: the CVD contradicts pair routes to the cone-walk crux.
const wRec = reconcile({ graph, a: id("n.cv-null"), b: id("n.cv-harm") });
ok(wRec.kind === "within-domain" && wRec.crux.reading === "within-domain-crux", "a contradicts pair routes to the within-domain cone-walk crux");
// cross-domain: the which-system weighing routes to the framing-node crux, never through the cone walk.
const wSystem = E.weighs.find((w) => w.spec.ref === "w.system");
const cRec = reconcile({ weighing: wSystem.rec });
ok(cRec.kind === "cross-domain" && cRec.crux.reading === "cross-domain-crux", "a cross-domain weighing routes to the framing-node crux");
ok((cRec.crux.framing_crux || []).length >= 1 && cRec.crux.framing_crux.includes("F-throughput"), "the cross-domain crux is the denominator framing node the weighing rests on");
ok(cRec.crux.framing_crux !== undefined && wRec.crux.frontier_candidates !== undefined && cRec.crux.frontier_candidates === undefined, "neither kind is run through the other's method: no cone frontier on the cross-domain crux");
ok(crossDomainCrux(wSystem.rec).candidate === true, "the cross-domain crux is a candidate: the incommensurable weighing, not a decided verdict");

// =====================================================================================
console.log("\n[B2] the read contract exposes a disagreement with its crux");
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const snapshot = JSON.parse(readFileSync(join(ROOT, "vendor/gate/snapshot.json"), "utf8"));
const api = createClientApi(createLocalProvider(snapshot));
const overSnapshot = api.reconciliations({});
ok(Array.isArray(overSnapshot), "reconciliations() is on the contract, obtained the way grounding and robustness are");
ok(overSnapshot.length === 0, "over the closed migrated snapshot (no contradicts links) it honestly reads none");
// the eggs CVD reconciliation is surfaced in the eggs reading (the composite is not in the snapshot).
const reading = JSON.parse(readFileSync(join(ROOT, "vendor/eggs/reading.json"), "utf8"));
ok(reading.reconciliation && reading.reconciliation.within.kind === "within-domain" && reading.reconciliation.within.shallow === false, "the presentation reading carries the CVD within-domain crux, now resolving to the confounding-adjustment frontier (Prompt 26)");
ok(reading.reconciliation.within.resolved_sub_region !== undefined && reading.reconciliation.within.frontier_candidates.length === 2, "it carries the frontier candidates and the resolved sub-region");
ok(reading.reconciliation.cross.kind === "cross-domain" && (reading.reconciliation.cross.framing_crux || []).length >= 1, "and the cross-domain crux: the which-system weighing's framing node");

// =====================================================================================
console.log("\n" + H);
if (fails) { console.log(`check-reconcile: ${fails} FAILURE(S)`); process.exit(1); }
console.log("check-reconcile: OK"); console.log(H);
