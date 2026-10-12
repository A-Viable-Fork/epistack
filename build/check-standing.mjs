// Role: the oracle for the records the sibling repositories converged on: receipts verified at offsets in
//   hashed text, standing kept beside the grade (claim class, status, memory, holder), rulings, kills, flags,
//   outbound holds, corrections, and the kind rows that say what a kind admits and whether it lifts.
// Contract: `node build/check-standing.mjs` exits non-zero on any failure. Imports the record builders,
//   the tables, the gate, and the store; every fixture is invented here.
// Invariant: reads and changes nothing. Each case is one the gate or a builder must get right; no field
//   tested here raises a grade.
"use strict";
import { receiptRecord, verifyReceipt } from "../kernel/schema/provenance.mjs";
import { rulingRecord, killRecord, flagRecord, outboundRecord, standingOf } from "../kernel/schema/standing.mjs";
import { claimRecord, linkRecord, supersessionRecord } from "../kernel/schema/records.mjs";
import { makeSourceTable, makeKindTable, makePartyTable } from "../kernel/schema/tables.mjs";
import { hashBytes } from "../kernel/schema/canonical.mjs";
import { decide } from "../kernel/gate/gate.mjs";
import { genesis, makeState } from "../kernel/store/state.mjs";
import { apply } from "../kernel/store/apply.mjs";
import { storeViewOf } from "../kernel/store/decay.mjs";

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const throws = (f) => { try { f(); return false; } catch { return true; } };
const H = "=".repeat(80);
console.log(H + "\nCHECK-STANDING: receipts, standing beside the grade, and the records that act on it\n" + H);

console.log("\n[1] receipts");
const text = "An invented source text. The measured value is seven units, and nothing else is claimed.";
const at = text.indexOf("seven units");
const rc = receiptRecord({ receipt_id: "R1", source_id: "src:one", file: "sources/one.txt", sha256: hashBytes(text), start: at, end: at + "seven units".length, quote: "seven units" });
ok(verifyReceipt(rc, text).ok && verifyReceipt(rc, text).occurrences === 1, "a quote at its offsets in text of its hash verifies, once");
ok(!verifyReceipt(rc, text + " ").ok, "a changed text fails its hash");
const off = receiptRecord({ ...rc, start: at + 1, end: at + 1 + "seven units".length });
ok(verifyReceipt(off, text).reason === "the quote is not at its offsets", "a quote displaced from its offsets fails");
ok(throws(() => receiptRecord({ ...rc, end: at + 3 })), "a quote whose length disagrees with its offsets is refused");
ok(throws(() => receiptRecord({ ...rc, sha256: "XYZ" })), "a malformed sha256 is refused");
ok(rc.canonical.start.$dec === String(at), "offsets travel as exact decimals on the canonical path");

console.log("\n[2] standing fields stay beside the grade, and move no hash");
const base = { kind: "measurement", statement: "an invented measurement", source_id: "src:one", contributor_id: "lab", declared_grade: "asserted" };
const plain = claimRecord(base);
ok(standingOf(plain).claim_class === "truth" && standingOf(plain).status === null, "a claim with no standing fields reads as a truth claim with no status");
ok(throws(() => claimRecord({ ...base, claim_standing: { status: "settled-forever" } })), "an unknown status is refused");
ok(throws(() => claimRecord({ ...base, claim_standing: { claim_class: "opinion" } })), "an unknown claim class is refused");
ok(throws(() => claimRecord({ ...base, claim_standing: { memory: "yes" } })), "memory is true or false");
ok(throws(() => claimRecord({ ...base, claim_standing: { grade: "settled" } })), "only the standing fields live under claim_standing");
ok(claimRecord({ ...base, status: "conjecture" }).identity === plain.identity, "a consumer's own top-level status extension is its own: the kernel neither reads nor refuses it");
ok(claimRecord({ ...base, claim_standing: { status: "open" } }).identity === plain.identity, "identity is unchanged by standing fields (kind and statement only)");

console.log("\n[3] the gate: memory caps, statuses rest on receipts, kinds say what they admit");
const sources = makeSourceTable([{ source_id: "src:one", source_class: "dataset", rests_on: [] }, { source_id: "src:two", source_class: "dataset", rests_on: [] }]);
const kinds = makeKindTable([
  { kind: "measurement", ceiling: "independently-rechecked" },
  { kind: "claim", ceiling: "corroborated" },
  { kind: "absence-survey", ceiling: "corroborated", liftable_by_convergence: false },
  { kind: "protocol", ceiling: "corroborated", admission_requirements: ["protocol_id"], checking_record_must_contain: ["cited_artifacts"] },
  { kind: "norm", ceiling: "constitutive" },
]);
const parties = makePartyTable([
  { party_id: "lab", authority_root: "root:lab" },
  { party_id: "operator", authority_root: "root:op", rules: true },
  { party_id: "agent", authority_root: "root:agent" },
]);
const view = (o = {}) => ({ stateHash: "ST0", earnedByIdentity: new Map(), restatementLinks: [], withdrawnRecords: [], kindOf: new Map(), sourceTable: sources, kindTable: kinds, partyTable: parties, ...o });
const chk = { checker_id: "x", method_class: "replication", checked_at_state: "s0", outcome: "confirms", independence: "distinct-party" };
const rules = (d) => (d.decision_basis || []).filter((r) => r !== "all-checks-clean"); // an accepted decision carries all-checks-clean

const mem = claimRecord({ ...base, declared_grade: "checked", checking_records: [chk], claim_standing: { memory: true } });
const dm = decide({ hash: "M1", entries: [mem], links: [] }, view({ partyTable: null }));
ok(dm.grade_table[0].earned_grade === "asserted" && dm.decision !== "accepted", "a claim held from memory earns at most asserted, whatever its checks");
const dmOk = decide({ hash: "M2", entries: [claimRecord({ ...base, claim_standing: { memory: true } })], links: [] }, view());
ok(!rules(dmOk).length, "a memory claim declared at asserted is admitted");

ok(rules(decide({ hash: "S1", entries: [claimRecord({ ...base, claim_standing: { status: "established" } })], links: [] }, view())).includes("WF-STATUS-RECEIPT"), "an established status with no receipts is declined");
ok(!rules(decide({ hash: "S2", entries: [claimRecord({ ...base, claim_standing: { status: "established", receipts: ["R1"] } })], links: [] }, view())).length, "an established status on receipts is admitted");
ok(!rules(decide({ hash: "S3", entries: [claimRecord({ ...base, claim_standing: { status: "open" } })], links: [] }, view())).length, "an open status needs no receipt");

const proto = { kind: "protocol", statement: "an invented protocol", source_id: "src:one", contributor_id: "lab", declared_grade: "asserted" };
ok(rules(decide({ hash: "K1", entries: [claimRecord(proto)], links: [] }, view())).includes("WF-ADMISSION"), "a kind's admission requirement, missing, is declined");
ok(rules(decide({ hash: "K2", entries: [claimRecord({ ...proto, protocol_id: "P-1", checking_records: [chk] })], links: [] }, view())).includes("WF-CHECK-FIELDS"), "a check missing a field its kind requires is declined");
ok(!rules(decide({ hash: "K3", entries: [claimRecord({ ...proto, protocol_id: "P-1", checking_records: [{ ...chk, cited_artifacts: ["src:one"] }] })], links: [] }, view())).length, "an entry carrying what its kind requires is admitted");

console.log("\n[4] a kind not liftable by convergence takes no independence lift");
const prem = (id, src) => claimRecord({ kind: "claim", statement: "an invented premise " + id, source_id: src, contributor_id: "lab", declared_grade: "supported" });
const pa = prem("a", "src:one"), pb = prem("b", "src:two");
const earned = new Map([[pa.identity, { earned: "supported", inForce: true }], [pb.identity, { earned: "supported", inForce: true }]]);
const target = (kind) => claimRecord({ kind, statement: "an invented conclusion of kind " + kind, source_id: "src:one", contributor_id: "lab", declared_grade: "supported" });
const sup = (from, to, src, g) => linkRecord({ link_kind: "supports", from_identity: from.identity, to_identity: to.identity, source_id: src, contributor_id: "lab", declared_grade: "supported", support_group: g });
const lift = (kind) => { const t = target(kind); return decide({ hash: "L-" + kind, entries: [t], links: [sup(pa, t, "src:one", "g1"), sup(pb, t, "src:two", "g2")] }, view({ earnedByIdentity: earned })).grade_table[0].earned_grade; };
ok(lift("claim") === "corroborated", "two supports on disjoint sources lift an ordinary kind to corroborated");
ok(lift("absence-survey") === "supported", "the same two supports do not lift a kind whose sources share a cause");

console.log("\n[5] rulings: a rightness claim above asserted needs a ruling by a party that may rule");
const right = (o = {}) => claimRecord({ kind: "norm", statement: "an invented norm", source_id: "src:one", contributor_id: "agent", declared_grade: "constitutive", ...o, claim_standing: { claim_class: "rightness", ...(o.claim_standing || {}) } });
const rn = right();
const ruling = (by) => rulingRecord({ claim_identity: rn.identity, by_party: by, date: "2026-10-12", ruling: "adopted" });
ok(rules(decide({ hash: "R0", entries: [rn], links: [] }, view())).includes("RL-UNRULED"), "no ruling: declined");
ok(rules(decide({ hash: "R1", entries: [rn], links: [], ruling_records: [ruling("agent")] }, view())).includes("RL-UNRULED"), "a ruling by a party that may not rule: declined");
ok(!rules(decide({ hash: "R2", entries: [rn], links: [], ruling_records: [ruling("operator")] }, view())).length, "a ruling by the operator: admitted");
const held = right({ claim_standing: { holder: "someone-else" } });
ok(rules(decide({ hash: "R3", entries: [held], links: [], ruling_records: [rulingRecord({ claim_identity: held.identity, by_party: "operator", date: "2026-10-12", ruling: "adopted" })] }, view())).includes("RL-UNRULED"), "a held claim ruled by someone other than its holder: declined");
ok(!rules(decide({ hash: "R4", entries: [right({ declared_grade: "asserted" })], links: [] }, view())).length, "a rightness claim at asserted is a proposal and needs no ruling");
ok(throws(() => rulingRecord({ claim_identity: "c", by_party: "operator", date: "12 Oct", ruling: "x" })), "a ruling's date is YYYY-MM-DD");

console.log("\n[6] kills, flags and the store");
ok(throws(() => killRecord({ killed_identity: "a", by_identity: "b", scope: "global" })), "a kill rests on at least one receipt");
const kill = killRecord({ killed_identity: pa.identity, by_identity: "barrier", scope: "global", receipts: ["R1"], reinstatement_condition: { condition_kind: "entry-of-kind", required_kind: "measurement" } });
const g0 = genesis();
ok(makeState({ prior_state_hash: g0.prior_state_hash }).state_hash === g0.state_hash, "a store with no standing records hashes as it always did");
const s1 = apply(g0, { entries: [pa, pb], links: [], applied_contribution_hash: "C1" });
const s2 = apply(s1, { kill_records: [kill], applied_contribution_hash: "C2" });
ok(s2.state_hash !== s1.state_hash && s2.kill_records.length === 1, "a kill enters the store and changes its hash");
ok(apply(s2, { kill_records: [kill], applied_contribution_hash: "C3" }) === s2, "the same kill applied again changes nothing");
const tables = { sourceTable: sources, kindTable: kinds };
// premises with a basis of their own (a distinct-party check each), so each lends supported to the target
const based = (id, src) => claimRecord({ kind: "measurement", statement: "an invented checked premise " + id, source_id: src, contributor_id: "lab", declared_grade: "checked", checking_records: [chk] });
const qa = based("a", "src:one"), qb = based("b", "src:two");
const t = target("claim");
const links = [sup(qa, t, "src:one", "g1"), sup(qb, t, "src:two", "g2")];
const sBase = apply(g0, { entries: [qa, qb, t], links, applied_contribution_hash: "C4" });
const grade = (state) => storeViewOf(state, tables).earnedByIdentity.get(t.identity).earned;
ok(grade(sBase) === "corroborated", "baseline: two checked premises on disjoint sources lift the target to corroborated");
const killQa = killRecord({ killed_identity: qa.identity, by_identity: "barrier", scope: "global", receipts: ["R1"] });
const scopedQb = killRecord({ killed_identity: qb.identity, by_identity: "barrier", scope: "relativizing techniques", receipts: ["R1"] });
const sKilled = apply(sBase, { kill_records: [killQa, scopedQb], applied_contribution_hash: "C5" });
ok(grade(sKilled) === "supported", "a globally killed premise delivers no support; the scoped kill withholds nothing");
const sFlagged = apply(sKilled, { flag_records: [flagRecord({ target_identity: qb.identity, by: "audit", reason: "the source misquotes its own table" })], applied_contribution_hash: "C6" });
ok(!["supported", "corroborated"].includes(grade(sFlagged)), "a flagged premise is withheld from support too");
const v2 = storeViewOf(sFlagged, tables);
ok(v2.earnedByIdentity.get(qb.identity).inForce, "a flag withholds; it never takes the entry out of the store or out of force");

console.log("\n[7] corrections and outbound holds");
ok(throws(() => supersessionRecord({ superseded_identity: "same", successor_identity: "same", at_state: "s" })), "a successor with the superseded claim's identity is refused");
const corr = supersessionRecord({ superseded_identity: "old", successor_identity: "new", at_state: "s", reason: "misread table", prior_finding: "audit A-3", receipts: ["R2", "R1", "R2"] });
ok(corr.prior_finding === "audit A-3" && corr.receipts.join() === "R1,R2", "a correction names its finding and its receipts");
const a = "a".repeat(64), b = "b".repeat(64);
ok(throws(() => outboundRecord({ outbound_id: "O1", destination: "upstream", artifact_sha256: a, status: "ready" })), "an outbound item is not ready without a sign-off");
ok(throws(() => outboundRecord({ outbound_id: "O1", destination: "upstream", artifact_sha256: a, status: "sent", signed_off_by: "operator", sent_sha256: b })), "what is sent must be what was signed off");
ok(outboundRecord({ outbound_id: "O1", destination: "upstream", artifact_sha256: a, status: "held" }).status === "held", "an outbound item starts held");

console.log("\n" + H + "\n" + (fails ? `check-standing: ${fails} FAILURE(S)` : "check-standing: OK") + "\n" + H);
process.exit(fails ? 1 : 0);
