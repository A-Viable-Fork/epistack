// Role: the runnable composition demo, now under Node (intake data model v3). The v3 JS gate
//   absorbs the role the retired Python compose-gate held: two uncoordinated contributors' frozen
//   typed output composes mechanically, with no model in the loop, and the gate prices independence
//   across contributors. A reviewer runs `node build/gate-demo.mjs` and reads the receipts in seconds.
// Contract: no arguments; prints the composition report. Imports only the v3 kernel and Node stdlib.
// Invariant: deterministic; the same fixtures produce the same receipts and the same state hashes.
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { claimRecord, linkRecord } from "../kernel/schema/records.mjs";
import { decide } from "../kernel/gate/gate.mjs";
import { genesis } from "../kernel/store/state.mjs";
import { apply } from "../kernel/store/apply.mjs";
import { storeViewOf } from "../kernel/store/decay.mjs";
import { hashOf } from "../kernel/schema/canonical.mjs";

const kinds = makeKindTable([
  { kind: "measurement", ceiling: "independently-rechecked", compatibility_rule_id: "CMP-M" },
  { kind: "claim", ceiling: "corroborated", compatibility_rule_id: "CMP-C" },
]);
const sources = makeSourceTable([
  { source_id: "DS-A", source_class: "primary-measurement", rests_on: [] },
  { source_id: "DS-B", source_class: "peer-reviewed", rests_on: [] },
]);
const tables = { sourceTable: sources, kindTable: kinds };

// the shared target claim, and two premises each checked by a distinct party (so each delivers checked).
const K = claimRecord({ kind: "claim", statement: "the target conclusion", source_id: "DS-A", contributor_id: "incumbent", declared_grade: "corroborated" });
const PA = claimRecord({ kind: "measurement", statement: "premise from vantage A", source_id: "DS-A", contributor_id: "A", declared_grade: "checked", checking_records: [{ checker_id: "cA", method_class: "replication", method: "re-ran", checked_at_state: "g", outcome: "confirms", independence: "distinct-party" }] });
const PB = claimRecord({ kind: "measurement", statement: "premise from vantage B", source_id: "DS-B", contributor_id: "B", declared_grade: "checked", checking_records: [{ checker_id: "cB", method_class: "data-audit", method: "audited", checked_at_state: "g", outcome: "confirms", independence: "distinct-party" }] });
const supA = linkRecord({ link_kind: "supports", from_identity: PA.identity, to_identity: K.identity, support_group: "gA", source_id: "DS-A", contributor_id: "A", declared_grade: "corroborated" });
const supB = linkRecord({ link_kind: "supports", from_identity: PB.identity, to_identity: K.identity, support_group: "gB", source_id: "DS-B", contributor_id: "B", declared_grade: "corroborated" });

const P = (s) => console.log(s);
const line = "=".repeat(70);

function step(state, label, contribution) {
  const receipt = decide(contribution, storeViewOf(state, tables), {});
  P(`\n[${label}]  decision: ${receipt.decision.toUpperCase()}`);
  for (const g of receipt.grade_table) P(`   ${g.identity.slice(0, 10)}  declared=${g.declared_grade}  earned=${g.earned_grade}  (S=${g.S}, B=${g.B})`);
  for (const c of receipt.corroboration_findings) P(`   corroboration on ${c.identity.slice(0, 10)}: ${c.verdict}, effective_count=${c.effective_count}\n     ${c.coverage_note}`);
  const next = receipt.decision === "declined" ? state : apply(state, { entries: contribution.entries, links: contribution.links, contradiction_records: receipt.contradiction_records, corroboration_findings: receipt.corroboration_findings, applied_contribution_hash: contribution.hash, receipt_reference: hashOf(receipt) });
  return next;
}

P(line); P("COMPOSE-GATE (v3, Node): two uncoordinated contributors compose through one gate"); P(line);
let s = genesis();
s = step(s, "contribution A: vantage A supports the conclusion", { hash: "A", entries: [K, PA], links: [supA] });
s = step(s, "contribution B: an independent vantage B supports the same conclusion", { hash: "B", entries: [PB], links: [supB] });
P(`\nThe conclusion earns corroborated because two contributors with disjoint source footprints`);
P(`(DS-A, DS-B) each deliver support: independence raises the delivery, mechanically, no model in the loop.`);
P(`\nfinal store state: ${s.state_hash.slice(0, 16)}...  (${s.entries.length} entries, ${s.links.length} links)`);
