// Role: the characterized-gaps oracle (Prompt 18). Proves the closing-condition record, the transfer
//   as an ordinary capping support, the gap reading's new category, and the three-way distinction
//   (characterized gap vs bare assertion vs settled), on synthetic fixtures, plus determinism, the
//   gate acceptance of a leap, and the read-contract exposure.
// Contract: `node build/check-characterized-gaps.mjs` exits non-zero on any failure. Imports the v3
//   kernel, the analysis module, and (for exposure) the client contract and the snapshot.
// Invariant: the transfer reuses the support/contamination path; the reading computes no grade. A
//   re-run is byte-identical. No case data changes; the migrated corpus carries no leaps.
"use strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { claimRecord, linkRecord } from "../kernel/schema/records.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { characterizedGaps, characterization } from "../kernel/analysis/characterized-gaps.mjs";
import { decide } from "../kernel/gate/gate.mjs";
import { genesis } from "../kernel/store/state.mjs";
import { storeViewOf } from "../kernel/store/decay.mjs";
import { leqWithinMode } from "../kernel/schema/confidence.mjs";
import { createClientApi } from "../api/client-api.mjs";
import { createLocalProvider } from "../api/providers/local-provider.mjs";

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-CHARACTERIZED-GAPS (Prompt 18): the sorry made mechanical"); console.log(H);

// -- tables: measurement has a floor ceiling (checked); forum tops out at corroborated (open line) --
const kinds = makeKindTable([
  { kind: "measurement", ceiling: "checked" },
  { kind: "forum", ceiling: "corroborated" },
]);
const sources = makeSourceTable([
  { source_id: "src:R", source_class: "primary-measurement", rests_on: [] },
  { source_id: "src:SF", source_class: "primary-measurement", rests_on: [] },
  { source_id: "src:transfer", source_class: "testimony", rests_on: [] },
  { source_id: "src:leap", source_class: "testimony", rests_on: [] },
  { source_id: "src:bare", source_class: "testimony", rests_on: [] },
  { source_id: "src:forum", source_class: "testimony", rests_on: [] },
]);
const tables = { sourceTable: sources, kindTable: kinds };
const chk = (checker) => [{ checker_id: checker, method_class: "direct-measurement", method: "measured", checked_at_state: "genesis", outcome: "confirms", independence: "distinct-party" }];

// R: a measured claim on a NEARBY system (its own basis reaches the floor).
const R = claimRecord({ kind: "measurement", statement: "soil carbon on the regenerative row-crop system, measured directly", source_id: "src:R", contributor_id: "author", declared_grade: "checked", checking_records: chk("cR") });
// L: the LEAP. Empirical, floor ceiling, held by a transfer from R, carrying a closing condition.
const L = claimRecord({
  kind: "measurement", statement: "soil carbon on the regenerative laying-hen system", source_id: "src:leap", contributor_id: "author", declared_grade: "supported",
  closing_condition: { condition_kind: "measurement-on-the-system", target: "an integrated soil-carbon measurement on the regenerative laying-hen system itself", system: "regenerative laying-hen system" },
});
// the transfer: an ordinary supports edge, weak (grade supported), so it caps L at supported.
const transfer = linkRecord({ link_kind: "supports", from_identity: R.identity, to_identity: L.identity, support_group: "g:transfer", source_id: "src:transfer", contributor_id: "author", declared_grade: "supported" });
// B: a bare assertion. Low, no closing condition.
const B = claimRecord({ kind: "measurement", statement: "an unsupported guess about the system", source_id: "src:bare", contributor_id: "author", declared_grade: "asserted" });
// F: a settled forum claim, at its structured-forum ceiling, owing nothing.
const SF = claimRecord({ kind: "measurement", statement: "a measured premise under the forum claim", source_id: "src:SF", contributor_id: "author", declared_grade: "checked", checking_records: chk("cSF") });
const F = claimRecord({ kind: "forum", statement: "a settled judgment, argued to its structured-forum ceiling", source_id: "src:forum", contributor_id: "author", declared_grade: "corroborated" });
const supF = linkRecord({ link_kind: "supports", from_identity: SF.identity, to_identity: F.identity, support_group: "g:forum", source_id: "src:SF", contributor_id: "author", declared_grade: "corroborated" });

const graph = { entries: [R, L, B, SF, F], links: [transfer, supF], tables };

// --- 1. the closing-condition record is on the claim, not in its identity ---
console.log("\n[1] the closing-condition record");
{
  ok(L.closing_condition && L.closing_condition.condition_kind === "measurement-on-the-system", "the leap carries a typed closing condition (measurement-on-the-system)");
  ok(L.closing_condition.target && L.closing_condition.system, "the closing condition names the target and the specific system");
  const L2 = claimRecord({ kind: "measurement", statement: "soil carbon on the regenerative laying-hen system", source_id: "src:leap", contributor_id: "author", declared_grade: "supported" });
  ok(L2.identity === L.identity, "the closing condition does not enter the claim's identity (identity is kind + statement)");
  ok(L2.hash !== L.hash, "but it does enter the claim's record (the hashes differ)");
}

// --- 2. the transfer is a capping support: the leap earns the transfer's grade ---
console.log("\n[2] the transfer caps the leap at its grade (contamination, no new edge kind)");
{
  const view = storeViewOf({ entries: graph.entries, links: graph.links, state_hash: "g" }, tables);
  const eL = view.earnedByIdentity.get(L.identity);
  ok(transfer.link_kind === "supports", "the transfer is an ordinary supports edge, not a new edge kind");
  ok(eL.earned === "supported", `the leap earns supported, capped by the weak transfer (got ${eL.earned})`);
  const cmp = leqWithinMode(L.declared_grade, eL.earned);
  ok(cmp.comparable && cmp.leq, `declared (${L.declared_grade}) is at or below earned (${eL.earned})`);
}

// --- 3. the gap reading lists the leap as a characterized gap, with its closing condition + source ---
console.log("\n[3] the gap reading's new category");
{
  const gaps = characterizedGaps(graph);
  ok(gaps.length === 1 && gaps[0].identity === L.identity, `exactly one characterized gap, the leap (got ${gaps.length})`);
  const g = gaps[0] || {};
  ok(g.category === "characterized-gap" && g.ceiling === "checked" && g.earned_grade === "supported", `listed with its floor ceiling and open-line grade (ceiling ${g.ceiling}, earned ${g.earned_grade})`);
  ok(g.closing_condition && g.closing_condition.condition_kind === "measurement-on-the-system", "carries its closing condition");
  ok((g.transfer_sources || []).length === 1 && g.transfer_sources[0].from_identity === R.identity && g.transfer_sources[0].transfer_grade === "supported", "names its transfer source (R) and the transfer grade");
}

// --- 4. the three-way distinction ---
console.log("\n[4] the three-way distinction: gap vs bare assertion vs settled");
{
  ok(characterization(graph, L.identity) === "characterized-gap", "the leap with a closing condition is a characterized gap");
  ok(characterization(graph, B.identity) === "bare-assertion", "the bare, low claim with no closing condition is a bare assertion, not a gap");
  ok(characterization(graph, F.identity) === "settled", "the forum claim at its structured-forum ceiling owes nothing, not listed");
  ok(characterization(graph, R.identity) === "settled", "the measured claim at its floor owes nothing");
  const listedBare = characterizedGaps(graph).some((g) => g.identity === B.identity);
  const listedForum = characterizedGaps(graph).some((g) => g.identity === F.identity);
  ok(!listedBare && !listedForum, "neither the bare assertion nor the settled forum claim is listed as a characterized gap");
}

// --- 5. the leap passes the gate at its transfer grade ---
console.log("\n[5] the leap passes the gate");
{
  const receipt = decide({ hash: "fixture", entries: graph.entries, links: graph.links }, storeViewOf(genesis(), tables), {});
  ok(receipt.decision === "accepted", `the contribution is accepted (got ${receipt.decision})`);
  const row = (receipt.grade_table || []).find((r) => r.identity === L.identity) || {};
  ok(row.declared_grade === "supported" && row.earned_grade === "supported", `the leap sits at supported, declared at or below earned (declared ${row.declared_grade}, earned ${row.earned_grade})`);
}

// --- 6. determinism: a re-run is byte-identical ---
console.log("\n[6] determinism");
{
  const a = JSON.stringify(characterizedGaps(graph));
  const b = JSON.stringify(characterizedGaps(graph));
  ok(a === b, "two runs of the gap reading produce identical output");
}

// --- 7. the read contract exposes characterized gaps; the corpus is closed, so it reads none ---
console.log("\n[7] the read contract exposes characterized gaps");
{
  const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
  const snapshot = JSON.parse(readFileSync(join(ROOT, "vendor/gate/snapshot.json"), "utf8"));
  const api = createClientApi(createLocalProvider(snapshot));
  ok(typeof api.characterizedGaps === "function", "the contract exposes characterizedGaps, obtained like grounding and robustness");
  const got = api.characterizedGaps({});
  ok(Array.isArray(got) && got.length === 0, `the migrated corpus carries no leaps: it reads zero characterized gaps (got ${got.length})`);
}

console.log("\n" + H);
if (fails === 0) console.log("verified: every characterized leap is capped below the settled tier and carries a typed closing condition.");
console.log(fails === 0 ? "check-characterized-gaps: OK" : `check-characterized-gaps: ${fails} FAILURE(S)`);
console.log(H);
process.exit(fails === 0 ? 0 : 1);
