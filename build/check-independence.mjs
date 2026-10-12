// Role: the checker-independence oracle. Two distinct-party checking records lift a claim's own basis to
//   independently-rechecked only when both declare a footprint and the two are disjoint; the footprint
//   survives the record builder and a contribution's export and import. Resolved against the tables, a
//   check counts as located only when its cited artifacts resolve, independence is computed from the
//   party table, one authority root is one party, and the strict policy drops unlocated checks.
// Contract: `node build/check-independence.mjs` exits non-zero on any failure. Imports the record
//   builders, the earned-grade rule, and the contribution export and import.
// Invariant: reads and changes nothing; a regression test for compost entry 23, each case fails on the
//   builder and rule as they stood at b778f35.
"use strict";
import { checkingRecord, claimRecord } from "../kernel/schema/records.mjs";
import { ownBasis } from "../kernel/grounding/earned-grade.mjs";
import { exportContribution, importContribution } from "../api/contribution.js";
import { resolveChecks } from "../kernel/grounding/checks.mjs";
import { decide } from "../kernel/gate/gate.mjs";
import { makeKindTable } from "../kernel/schema/tables.mjs";
import { makeSourceTable, makePartyTable } from "../kernel/schema/tables.mjs";

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H + "\nCHECK-INDEPENDENCE: a recheck is independent only on known, disjoint footprints\n" + H);

const chk = (who, footprint) => checkingRecord({ checker_id: who, method_class: "replication", checked_at_state: "s0", outcome: "confirms", independence: "distinct-party", ...(footprint ? { footprint } : {}) });

console.log("\n[1] the builder surfaces the footprint the rule reads");
const a = chk("party-a", ["src:shared", "src:shared"]);
ok(Array.isArray(a.footprint) && a.footprint.length === 1 && a.footprint[0] === "src:shared", "footprint is surfaced on the record, deduplicated");
ok(a.canonical.extensions && Array.isArray(a.canonical.extensions.footprint), "footprint stays in the hashed extensions, so no record's hash moves");
ok(chk("party-x").footprint === undefined, "an undeclared footprint is undefined, not empty");
let threw = false; try { chk("party-y", "src:not-a-list"); } catch { threw = true; }
ok(threw, "a footprint that is not a list of source ids is refused");

console.log("\n[2] own basis over built records");
ok(ownBasis({ checkingRecords: [chk("party-a", ["src:shared"]), chk("party-b", ["src:shared"])] }) === "checked", "two parties checking the same source: checked, not independently-rechecked");
ok(ownBasis({ checkingRecords: [chk("party-a", ["src:one"]), chk("party-b", ["src:two"])] }) === "independently-rechecked", "two parties on disjoint sources: independently-rechecked");
ok(ownBasis({ checkingRecords: [chk("party-a"), chk("party-b")] }) === "checked", "two parties with undeclared footprints: unknown overlaps, so checked");
ok(ownBasis({ checkingRecords: [chk("party-a", ["src:one"]), chk("party-b")] }) === "checked", "one declared and one undeclared footprint: checked");
ok(ownBasis({ checkingRecords: [chk("party-a", ["src:one", "src:two"]), chk("party-b", ["src:two", "src:three"])] }) === "checked", "partly overlapping footprints: checked");
const many = Array.from({ length: 10 }, (_, i) => chk("party-" + i, ["src:shared"]));
ok(ownBasis({ checkingRecords: many }) === "checked", "ten parties on one source: volume does not lift");

console.log("\n[3] the footprint survives export and import");
const claim = claimRecord({ kind: "measurement", statement: "an invented measurement for this oracle", source_id: "src:one", contributor_id: "lab", declared_grade: "independently-rechecked", checking_records: [{ checker_id: "party-a", method_class: "replication", checked_at_state: "s0", outcome: "confirms", independence: "distinct-party", footprint: ["src:one"] }] });
let back = null;
try { back = importContribution(JSON.parse(JSON.stringify(exportContribution({ entries: [claim], links: [] })))); } catch (e) { console.log("      " + e.message); }
ok(back !== null, "a contribution whose checking record carries a footprint imports under its own id");
ok(back && back.entries[0].checking_records[0].hash === claim.checking_records[0].hash, "the rebuilt checking record hashes as the original");
ok(back && JSON.stringify(back.entries[0].checking_records[0].footprint) === JSON.stringify(["src:one"]), "the rebuilt checking record keeps its footprint");

console.log("\n[4] resolved against the source and party tables");
const sources = makeSourceTable([
  { source_id: "src:one", source_class: "dataset", rests_on: [] },
  { source_id: "src:two", source_class: "dataset", rests_on: [] },
  { source_id: "src:derived", source_class: "peer-reviewed", rests_on: ["src:one"] },
]);
const parties = makePartyTable([
  { party_id: "lab", authority_root: "root:lab", source_footprint: [] },
  { party_id: "party-a", authority_root: "root:a", source_footprint: [] },
  { party_id: "party-b", authority_root: "root:b", source_footprint: [] },
  { party_id: "party-a2", authority_root: "root:a", source_footprint: [] },
  { party_id: "party-near", authority_root: "root:near", source_footprint: ["src:one"] },
  { party_id: "lab-exposed", authority_root: "root:lab2", source_footprint: ["src:one"] },
]);
const cite = (who, cited, independence = "distinct-party") => checkingRecord({ checker_id: who, method_class: "replication", checked_at_state: "s0", outcome: "confirms", independence, cited_artifacts: cited });
const basis = (checks, partyTable = parties, contributorId = "lab") => ownBasis({ checkingRecords: resolveChecks(checks, { contributorId, sourceTable: sources, partyTable }) });
ok(basis([cite("party-a", ["src:one"]), cite("party-b", ["src:two"])]) === "independently-rechecked", "two parties under different roots on disjoint located artifacts: independently-rechecked");
ok(basis([cite("party-a", ["src:one"]), cite("party-a2", ["src:two"])]) === "checked", "two checkers under one authority root are one party: checked");
ok(basis([cite("party-a", ["src:one"]), cite("party-b", ["src:derived"])]) === "checked", "an artifact resting on the other's source closes to an overlap: checked");
ok(basis([cite("party-a", ["src:one"]), cite("party-b", ["src:missing"])]) === "checked", "an artifact absent from the source table is unlocated and cannot lift");
ok(basis([cite("lab", ["src:one"]), cite("party-b", ["src:two"])]) === "checked", "the author checking their own claim is self, whatever it declares");
ok(basis([cite("party-x", ["src:one"]), cite("party-b", ["src:two"])]) === "checked", "a checker missing from the party table is not distinct");
ok(basis([cite("party-near", ["src:two"]), cite("party-b", ["src:two"])], parties, "lab-exposed") === "checked", "a checker exposed to the author's sources is self");
ok(basis([cite("party-a", ["src:one"], "self"), cite("party-b", ["src:two"], "self")]) === "independently-rechecked", "with a party table the declared independence is ignored, both ways");
ok(basis([cite("party-a", ["src:one"], "self"), cite("party-b", ["src:two"], "self")], null) === "none", "without a party table the declared independence stands");
const r = resolveChecks([cite("party-a", ["src:missing"])], { contributorId: "lab", sourceTable: sources, partyTable: parties })[0];
ok(r.located === false && r.footprint === undefined && r.independence_basis === "computed", "an unlocated check carries no footprint and says how its independence was set");
const strict = (checks) => ownBasis({ checkingRecords: resolveChecks(checks, { contributorId: "lab", sourceTable: sources, partyTable: parties }).filter((c) => c.located) });
ok(strict([cite("party-a", [])]) === "none" && basis([cite("party-a", [])]) === "checked", "strict policy: an unlocated check grants nothing; default: it still grants checked");

console.log("\n[5] the gate reads resolved checks and reports them");
const kinds = makeKindTable([{ kind: "measurement", ceiling: "independently-rechecked" }]);
const view = (o = {}) => ({ stateHash: "ST0", earnedByIdentity: new Map(), restatementLinks: [], withdrawnRecords: [], kindOf: new Map(), sourceTable: sources, kindTable: kinds, partyTable: parties, ...o });
const m = (checks) => claimRecord({ kind: "measurement", statement: "an invented gate measurement", source_id: "src:one", contributor_id: "lab", declared_grade: "independently-rechecked", checking_records: checks });
const raw = (who, cited) => ({ checker_id: who, method_class: "replication", checked_at_state: "s0", outcome: "confirms", independence: "distinct-party", cited_artifacts: cited });
const good = decide({ hash: "G1", entries: [m([raw("party-a", ["src:one"]), raw("party-b", ["src:two"])])], links: [] }, view());
ok(good.grade_table[0].earned_grade === "independently-rechecked" && !good.decision_basis.includes("GM-ABOVE"), "the gate earns independently-rechecked for two computed-independent, located checks");
const sameRoot = decide({ hash: "G2", entries: [m([raw("party-a", ["src:one"]), raw("party-a2", ["src:two"])])], links: [] }, view());
ok(sameRoot.grade_table[0].earned_grade === "checked" && sameRoot.decision_basis.includes("GM-ABOVE"), "one authority root: the gate earns checked and declines the declared lift");
ok(good.check_table.length === 2 && good.check_table.every((r) => r.located && r.independence_basis === "computed"), "the decision carries a check table: located, and how independence was set");
const unloc = decide({ hash: "G3", entries: [m([raw("party-a", [])])], links: [] }, view({ strictFabrication: true }));
ok(unloc.grade_table[0].earned_grade !== "checked" && unloc.check_table[0].located === false, "strict policy at the gate: an unlocated check earns no checked basis");

console.log("\n" + H + "\n" + (fails ? `check-independence: ${fails} FAILURE(S)` : "check-independence: OK") + "\n" + H);
process.exit(fails ? 1 : 0);
