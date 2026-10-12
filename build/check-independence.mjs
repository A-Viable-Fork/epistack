// Role: the checker-independence oracle. Two distinct-party checking records lift a claim's own basis to
//   independently-rechecked only when both declare a footprint and the two are disjoint; the footprint
//   survives the record builder and a contribution's export and import.
// Contract: `node build/check-independence.mjs` exits non-zero on any failure. Imports the record
//   builders, the earned-grade rule, and the contribution export and import.
// Invariant: reads and changes nothing; a regression test for compost entry 23, each case fails on the
//   builder and rule as they stood at b778f35.
"use strict";
import { checkingRecord, claimRecord } from "../kernel/schema/records.mjs";
import { ownBasis } from "../kernel/grounding/earned-grade.mjs";
import { exportContribution, importContribution } from "../api/contribution.js";

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

console.log("\n" + H + "\n" + (fails ? `check-independence: ${fails} FAILURE(S)` : "check-independence: OK") + "\n" + H);
process.exit(fails ? 1 : 0);
