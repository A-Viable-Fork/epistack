// Role: the adversarial sovereignty test (the chain's iron). Proves the four cases federate as sovereign,
//   independently-authored members joined at the untyped type, by TESTING sovereignty rather than
//   asserting it: the members own separate schemas, standing crosses only through an owned fork (the
//   try-to-cheat step), the shared-hash crossings compose native on real content, and the composite
//   federates the whole. Also reports the transparency status, default on (F6).
// Contract: `node build/check-bottomup.mjs` exits non-zero on any failure. Imports the federation build,
//   the confidence order, the composition transfer, the adoption layer, and the store decay read.
// Invariant: a federation edge that grounds without a fork is a FAILURE; a member that shares a schema
//   with another is a FAILURE. These are the fake-federation the untyped type exists to prevent, so the
//   check hunts them rather than trusting the build.
"use strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildBottomUp } from "./bottomup-build.mjs";
import { compositeGrade } from "../kernel/composition/transfer.mjs";
import { derivedGrade } from "../kernel/store/decay.mjs";
import { adoptionOf } from "./adoption.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-BOTTOMUP (the iron): the four cases federate as sovereign members"); console.log(H);

const fed = buildBottomUp();
const M = fed.members;

// --- 1. the members are genuinely independent (not relabeled regions of one schema) ---
console.log("\n[1] the four members own separate schemas");
{
  const ids = ["lhc", "covid", "eggs", "lineage"];
  // each member owns its own kind-table object; no two share one table reference.
  const tables = ids.map((i) => M[i].tables.kindTable);
  const distinct = new Set(tables).size === ids.length;
  ok(distinct, "each member owns a distinct kind-table object (no two members share one schema by reference)");
  // and the schemas genuinely differ: lhc holds derivation no other holds, lineage holds declaration no
  // other holds, so this cannot be four relabeled regions of one shared kind table.
  const has = (i, k) => M[i].tables.kindTable.byKind.has(k);
  ok(has("lhc", "derivation") && !has("covid", "derivation") && !has("eggs", "derivation") && !has("lineage", "derivation"), "lhc owns 'derivation', which no other member's schema contains");
  ok(has("lineage", "declaration") && !has("lhc", "declaration") && !has("covid", "declaration") && !has("eggs", "declaration"), "lineage owns 'declaration', which no other member's schema contains");
  // each member pins its own hashes (its own adoption), independent of the others.
  ok(ids.every((i) => M[i].adoption.caseId === i), "each member pins its own type-hashes through its own adoption");
  // a member cannot read another's unique schema: lhc's table has no declaration, covid's has no derivation.
  ok(!has("lhc", "declaration") && !has("covid", "derivation"), "no member can reach another's unique kind through its own schema");
}

// --- 2. standing crosses only through an owned fork (the adversarial core) ---
console.log("\n[2] standing crosses only through an owned fork (the try-to-cheat step)");
{
  const untyped = fed.crossings.find((c) => c.id === "x-untyped");
  ok(!!untyped, "the untyped crossing is present (lineage's declaration into covid)");
  const into = M[untyped.into_store], from = M[untyped.from_store];
  ok(!Object.values(into.adoption.pins).includes(from.adoption.pins[untyped.kind]), `the target (${untyped.into_store}) pins no hash equal to the crossed '${untyped.kind}' type`);
  ok(untyped.status === "untyped", `the crossing arrives untyped (got ${untyped.status})`);
  // try to cheat: have the crossed claim ground without a fork. The effective grade is ungraded, and a
  // composite claim resting on it inherits untyped, grounding nothing. There is no unforked path to standing.
  ok(untyped.effective === "ungraded", `without a fork the crossing grounds nothing (effective ${untyped.effective})`);
  const resting = compositeGrade({ ceiling: "settled", citations: [{ role: "necessary", carried_grade: untyped.effective }] });
  ok(resting === "ungraded", `anything in the target resting on the untyped crossing inherits untyped (got ${resting})`);
  // the fork restores standing: the target adopts the type, and the same crossing now grounds.
  ok(untyped.forked && untyped.forked.status === "native", "after the target forks (adopts) the type, the same crossing is native");
  ok(untyped.forked.effective !== "ungraded", `the forked crossing now grounds, carrying its grade (${untyped.forked.effective})`);
  const restingForked = compositeGrade({ ceiling: "settled", citations: [{ role: "necessary", carried_grade: untyped.forked.effective }] });
  ok(restingForked !== "ungraded", `a claim resting on the forked crossing now grounds (got ${restingForked})`);
}

// --- 3. the shared-hash crossing composes native and lossless on real content ---
console.log("\n[3] the shared-hash crossing composes native");
{
  const nat = fed.crossings.find((c) => c.id === "x-native");
  ok(!!nat, "the native crossing is present (lineage's reified-independence reading into lhc)");
  const from = M[nat.from_store], into = M[nat.into_store];
  ok(from.adoption.pins[nat.kind] === into.adoption.pins[nat.kind], `both members pin the same '${nat.kind}' type-hash`);
  ok(nat.status === "native", `the crossing is native (got ${nat.status})`);
  const originGrade = derivedGrade(from.state, nat.cited, from.tables);
  ok(nat.citation.carried_grade === originGrade && nat.effective === originGrade, `the crossed claim carries its grade losslessly (origin ${originGrade}, effective ${nat.effective})`);
}

// --- 4. the composite selects members and the whole federates ---
console.log("\n[4] the composite selects members and the whole federates");
{
  const selects = fed.composite.selects;
  ok(["lhc", "covid", "eggs", "lineage"].every((m) => selects.includes(m)), `the composite selects among all four members (selects ${selects.join(", ")})`);
  for (const w of fed.composite.weighs) {
    // each weighing selects a member subset per question and grounds by citing across the boundary.
    ok(w.members.length >= 2, `${w.spec.id}: selects ${w.members.length} members (${w.members.join(", ")})`);
    const crossesBoundary = w.cits.every((c) => ["lhc", "covid", "eggs", "lineage"].includes(c.source_store) && c.citing_claim === w.claim_id);
    ok(crossesBoundary, `${w.spec.id}: every citation crosses the boundary from a member into the composite claim`);
    ok(w.crossStatuses.every((s) => s === "native"), `${w.spec.id}: its common-kind citations cross native`);
    ok(typeof w.grade === "string" && w.grade !== "ungraded", `${w.spec.id}: the composite claim grounds (grade ${w.grade})`);
  }
}

// --- Step 4: transparency status, default on. A report, not a gate; transparency of form, not content. ---
console.log("\n[transparency] the inherited discipline, default on (a report, not a gate)");
{
  const t = fed.transparency;
  console.log(`      default: ${t.default}`);
  console.log(`      boundary: ${t.boundary}`);
  // a published, checkable fact of FORM: each member and the federation carry an oracle (document typed,
  // checked). This verifies transparency of form, not that the types are honest, which stays authored.
  for (const m of ["lhc", "covid", "eggs", "lineage"]) {
    const hasOracle = existsSync(join(ROOT, `build/check-${m}.mjs`));
    console.log(`      member ${m}: discipline_active=${t.members[m].discipline_active}, oracle=${hasOracle}`);
    ok(t.members[m].discipline_active === true, `member ${m} runs the inherited discipline (default on)`);
    ok(hasOracle, `member ${m} carries an oracle (transparency of form is a checkable fact)`);
  }
  ok(existsSync(join(ROOT, "build/check-bottomup.mjs")), "the federation carries its own oracle (this check)");
  console.log(`      federation ${t.federation.store_id}: discipline_active=${t.federation.discipline_active}`);
}

// --- honesty: the members' own gate decisions, reported not hidden ---
console.log("\n[note] each member's own as-proposed gate decision (reported, not a federation gate)");
for (const [m, r] of Object.entries(fed.receipts)) console.log(`      ${m}: ${r ? r.decision : "n/a"}${m === "lineage" ? " (the lineage case's own honest state from its authored demotions; sovereignty is unaffected)" : ""}`);

console.log("\n" + H);
if (fails === 0) console.log("verified: the four members are sovereign, each owning its schema; standing crosses only through an owned fork so no member's authority reaches another; and the shared-hash crossings compose native, so the federation is real and the generated-kernel claim holds.");
console.log(fails === 0 ? "check-bottomup: OK" : `check-bottomup: ${fails} FAILURE(S)`);
console.log(H);
process.exit(fails === 0 ? 0 : 1);
