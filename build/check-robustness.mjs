// Role: the robustness analysis oracle (Prompt 13). Phase A runs the four synthetic fixtures, the
//   redundant target, the single-path bottleneck, the correlated-evidence case, and the shared
//   presupposition, and asserts the readings; it also checks the two-closure separation and
//   determinism. Phase B (build/check-robustness runs it too) reads the migrated cases.
// Contract: `node build/check-robustness.mjs` exits non-zero on any failure. Imports the kernel
//   analysis and table builders, and the snapshot for the case readings.
// Invariant: the analysis is pure and deterministic; a re-run is byte-identical. It reads the graph
//   and changes no verdict.
"use strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { analyzeRobustness, analyzePresupposition } from "../kernel/analysis/robustness.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);

// ---- fixture builders: plain records carrying exactly the fields the analysis reads ----
const KINDS = makeKindTable([
  { kind: "measurement", ceiling: "independently-rechecked" },
  { kind: "claim", ceiling: "corroborated" },
  { kind: "transformation", ceiling: "corroborated" },
]);
function graph(entries, links, sourceIds) {
  return { entries, links, tables: { sourceTable: makeSourceTable(sourceIds.map((s) => ({ source_id: s, source_class: "primary-measurement", rests_on: [] }))), kindTable: KINDS } };
}
// a measurement leaf grounds at checked via one distinct-party checking record; a derived node has none.
const leaf = (id) => ({ identity: id, kind: "measurement", checking_records: [{ independence: "distinct-party", footprint: [id + "-src"] }] });
const node = (id, kind) => ({ identity: id, kind: kind || "claim" });
const sup = (from, to, group, source) => ({ link_kind: "supports", identity: "S:" + from + "->" + to, from_identity: from, to_identity: to, support_group: group, declared_grade: "corroborated", source_id: source });
const dep = (from, to) => ({ link_kind: "depends-on", identity: "D:" + from + "->" + to, from_identity: from, to_identity: to, declared_grade: "asserted", source_id: from + "-src" });

console.log(H); console.log("CHECK-ROBUSTNESS (Phase A): the four fixtures + two-closure separation"); console.log(H);

// --- Fixture 1: two independent groups, each reaching a floor -> redundant, no SPOF, no flag ---
console.log("\n[1] two independent support groups reaching a floor: robustness == grade, no SPOF");
{
  const g = graph(
    [leaf("X1"), leaf("X2"), node("T", "claim")],
    [sup("X1", "T", "gA", "X1-src"), sup("X2", "T", "gB", "X2-src")],
    ["X1-src", "X2-src"]);
  const r = analyzeRobustness(g, "T");
  ok(r.grade === "corroborated", `grade corroborated (got ${r.grade})`);
  ok(r.robustness === r.grade && r.fragility.empty, `robustness equals grade, fragility empty (robustness ${r.robustness})`);
  ok(r.single_points_of_failure.length === 0, "no single point of failure");
  ok(r.correlated_evidence_flag === null, "no correlated-evidence flag");
}

// --- Fixture 2: every path runs through one claim -> robustness below grade, that claim named ---
console.log("\n[2] all support paths run through one claim: robustness below grade, the claim named");
{
  const g = graph(
    [leaf("X"), node("M", "transformation"), node("T", "claim")],
    [sup("X", "M", "gM", "X-src"), sup("M", "T", "gT", "X-src")],
    ["X-src"]);
  const r = analyzeRobustness(g, "T");
  ok(r.grade === "corroborated", `grade corroborated (got ${r.grade})`);
  // a support present but delivering nothing (its source removed) drags the claim to the bottom of
  // the order, ungraded, exactly as decay.mjs derives an in-force-false support: the strongest fall.
  ok(r.robustness === "ungraded" && !r.fragility.empty, `robustness falls to ungraded, fragility non-empty (got ${r.robustness})`);
  const named = r.single_points_of_failure.map((s) => s.identity);
  ok(named.includes("X") && named.includes("M"), `the bottleneck claims are named as SPOFs: ${named.join(", ")}`);
  ok(r.correlated_evidence_flag === null, "one group only, so no correlated-evidence flag");
}

// --- Fixture 3: apparent redundancy across groups but a shared claim -> correlated flag names it ---
console.log("\n[3] apparent redundancy across groups, one shared claim: correlated-evidence flag");
{
  const g = graph(
    [leaf("X"), node("A", "transformation"), node("B", "transformation"), node("T", "claim")],
    [sup("X", "A", "gAX", "X-src"), sup("X", "B", "gBX", "X-src"), sup("A", "T", "gA", "A-src"), sup("B", "T", "gB", "B-src")],
    ["X-src", "A-src", "B-src"]);
  const r = analyzeRobustness(g, "T");
  ok(r.group_count === 2, `two support groups into T (apparent redundancy) (got ${r.group_count})`);
  ok(!r.fragility.empty && r.robustness === "ungraded", `robustness falls below grade despite two groups (robustness ${r.robustness})`);
  ok(r.correlated_evidence_flag && r.correlated_evidence_flag.shared_points.join(",") === "X", `flag names the shared claim X (got ${r.correlated_evidence_flag && r.correlated_evidence_flag.shared_points.join(",")})`);
  const spof = r.single_points_of_failure.map((s) => s.identity);
  ok(spof.includes("X") && !spof.includes("A") && !spof.includes("B"), "X is the single point of failure; A and B alone are not (the other group carries)");
}

// --- Fixture 4: shared presupposition -> a single point of well-formedness failure, distinct ---
console.log("\n[4] shared presupposition: a single point of well-formedness failure, distinct from grounding");
{
  const g = graph(
    [leaf("X"), node("M", "transformation"), node("T", "claim"), node("D1", "claim"), node("D2", "claim"), node("P", "claim")],
    [sup("X", "M", "gM", "X-src"), sup("M", "T", "gT", "X-src"), dep("D1", "T"), dep("D2", "T"), dep("P", "D1"), dep("P", "D2")],
    ["X-src"]);
  const rob = analyzeRobustness(g, "T");
  const pre = analyzePresupposition(g, "T");
  ok(pre.presupposition_closure.join(",") === "D1,D2,P", `presupposition closure is D1,D2,P (got ${pre.presupposition_closure.join(",")})`);
  ok(pre.shared_presuppositions.join(",") === "P", `P is the shared presupposition (got ${pre.shared_presuppositions.join(",")})`);
  const wf = pre.single_points_of_wellformedness_failure.map((s) => s.identity);
  ok(wf.includes("P"), "removing P is a single point of well-formedness failure");
  // the two readings are distinct: P is a well-formedness SPOF but not in the support closure.
  ok(!rob.support_closure.includes("P"), "P is not in the support closure: the presupposition fragility is distinct from the grounding fragility");
  ok(rob.support_closure.slice().sort().join(",") === "M,X", `the grounding SPOFs live in the support closure {M, X} (got ${rob.support_closure.join(",")})`);
}

// --- determinism: a re-run is byte-identical ---
console.log("\n[5] determinism: a re-run is byte-identical");
{
  const g = graph([leaf("X"), node("M", "transformation"), node("T", "claim")], [sup("X", "M", "gM", "X-src"), sup("M", "T", "gT", "X-src")], ["X-src"]);
  const a = JSON.stringify(analyzeRobustness(g, "T")) + JSON.stringify(analyzePresupposition(g, "T"));
  const b = JSON.stringify(analyzeRobustness(g, "T")) + JSON.stringify(analyzePresupposition(g, "T"));
  ok(a === b, "two runs produce identical serialized readings");
}

console.log("\n" + H);
console.log(fails === 0 ? "check-robustness (Phase A): OK" : `check-robustness: ${fails} FAILURE(S)`);
console.log(H);
process.exit(fails === 0 ? 0 : 1);
