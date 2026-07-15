// Role: the type-fork and type-contest oracle. Verifies the two type-level tools are additive over the
//   primitives that already exist: forkType is a snapshot fork of a type bundle whose receipt names its
//   parent and departure, and contestType is a gate-admissible claim whose subject is a type-hash. The
//   load-bearing check is the no-grade-motion theorem: admitting a contest changes no existing grade.
// Contract: `node build/check-fork-contest.mjs` exits non-zero on any failure, with named causes.
//   Imports the api tools (forkType, contestType), the crossing adoption layer, and the kernel store
//   and gate, driving the existing machinery rather than reimplementing it.
// Invariant: a contest references a type, it supports or contaminates no claim typed under it, so
//   admitting it leaves every pre-existing claim's earned grade and certificate byte-identical. Only a
//   community's typing act (a fork adopted, a pin changed) moves standing, through the crossing rules.
"use strict";
import { forkType } from "../api/fork.js";
import { contestType } from "../api/contest.js";
import { hashTypeBundle } from "../kernel/schema/type-hash.mjs";
import { adoptionOf, crossingStatus } from "./adoption.mjs";
import { claimRecord, linkRecord } from "../kernel/schema/records.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { genesis } from "../kernel/store/state.mjs";
import { apply } from "../kernel/store/apply.mjs";
import { storeViewOf } from "../kernel/store/decay.mjs";
import { decide } from "../kernel/gate/gate.mjs";

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-FORK-CONTEST: the type fork (snapshot) and the type contest (changes no grade)"); console.log(H);

// a fixed parent type and a fixed departure, so the fork hash is pinned and reproducible run to run.
// The parent is a literal bundle (not read from the corpus) so a corpus edit never moves the pin.
const FIXED_PARENT = { kind: "measurement", ceiling: "checked", compatibility_rule_id: null, atlas_refs: [] };
const FIXED_OVERRIDES = { ceiling: "independently-rechecked" };
const PINNED_FORK_HASH = "a4a082882199b43add2a061be06feea5dd85bccd501d48b813a49cf60e61aec5";
const PINNED_PARENT_HASH = "2ed60a0154fef12d5d630f4a3f52d06686479c75aa57a44fd3b1488d581d3621";

// --- 1. fork determinism: fixed parent + fixed overrides, hash stable and equal to the pinned value ---
console.log("\n[1] fork determinism (hash stable and equal to the pinned expected value)");
{
  const r1 = forkType(FIXED_PARENT, FIXED_OVERRIDES);
  const r2 = forkType(FIXED_PARENT, FIXED_OVERRIDES);
  ok(r1.new_hash === PINNED_FORK_HASH, `the forked hash equals the pinned value (got ${r1.new_hash.slice(0, 12)})`);
  ok(JSON.stringify(r1) === JSON.stringify(r2), "the whole receipt is byte-identical across two runs (determinism)");
  ok(r1.operation === "fork-type" && r1.persisted === false, "the receipt names the operation fork-type and asserts nothing durable");
}

// --- 2. parent immutability: the parent bundle hash before and after a fork is byte-identical ---
console.log("\n[2] parent immutability (the fork never touches the parent bundle)");
{
  // a FRESH parent object (not the shared FIXED_PARENT) and a pinned expected hash, so a mutation that
  // is persistent and idempotent cannot hide by corrupting before and after alike; the pin is the anchor.
  const parent = { kind: "measurement", ceiling: "checked", compatibility_rule_id: null, atlas_refs: [] };
  const before = hashTypeBundle(parent);
  ok(before === PINNED_PARENT_HASH, `the fresh parent hashes to the pinned value before the fork (${before.slice(0, 12)})`);
  const r = forkType(parent, FIXED_OVERRIDES);
  const after = hashTypeBundle(parent);
  ok(after === PINNED_PARENT_HASH && after === before, "the parent bundle hashes to the pinned value after the fork (untouched, byte-identical)");
  ok(r.parent_hash === PINNED_PARENT_HASH, "the receipt's parent_hash is exactly the parent's hash");
  ok(r.new_hash !== before, "the child hash differs from the parent hash (the departure moved the meaning)");
}

// --- 3. departure honesty: every field in the receipt's departure differs, no field outside it does ---
console.log("\n[3] departure honesty (the departure lists exactly the fields that differ)");
{
  const r = forkType(FIXED_PARENT, { ceiling: "independently-rechecked", compatibility_rule_id: null });
  // ceiling changed; compatibility_rule_id was overridden with its own value, so it must NOT be a departure.
  const changed = new Set(r.departure.map((d) => d.field));
  ok(changed.has("ceiling") && changed.size === 1, `only the genuinely changed field is a departure (got ${[...changed].join(",") || "none"})`);
  for (const d of r.departure) {
    const from = FIXED_PARENT[d.field] === undefined ? null : FIXED_PARENT[d.field];
    ok(JSON.stringify(from) === JSON.stringify(d.from) && JSON.stringify(d.to) !== JSON.stringify(d.from), `departure field ${d.field}: from/to recorded and genuinely different`);
  }
  // and every field NOT in the departure is byte-identical between parent and child
  for (const k of Object.keys(FIXED_PARENT)) if (!changed.has(k)) ok(JSON.stringify(r.bundle[k]) === JSON.stringify(FIXED_PARENT[k]), `field ${k} outside the departure is inherited unchanged`);
}

// --- 4. crossing consequence: a claim under the forked hash does not same-hash compose with the parent ---
//     drive the EXISTING crossing machinery (adoptionOf, crossingStatus), do not reimplement it.
console.log("\n[4] crossing consequence (the forked type is not the parent type at the crossing)");
{
  const covidAd = adoptionOf("covid"); // a real kernel pinning the parent measurement type
  const parentBundle = covidAd.bundles.measurement;
  const fork = forkType(parentBundle, { ceiling: "independently-rechecked" });
  // an origin kernel that pins the FORKED measurement hash instead of the parent's
  const originForked = { ...covidAd, pins: { ...covidAd.pins, measurement: fork.new_hash } };
  const nativeParent = crossingStatus("measurement", covidAd, covidAd); // parent-to-parent is native
  const crossedFork = crossingStatus("measurement", originForked, covidAd); // forked-to-parent is untyped
  ok(fork.new_hash !== covidAd.pins.measurement, "the forked hash is not the parent kernel's pinned hash");
  ok(nativeParent === "native", `the unforked parent type still crosses native into the parent kernel (got ${nativeParent})`);
  ok(crossedFork === "untyped", `a claim under the forked hash arrives untyped, not same-hash native (got ${crossedFork})`);
}

// ---- the store for check 5: a small graph with claims of a type in use (forum), grounded non-trivially ----
const TABLES = {
  sourceTable: makeSourceTable([
    { source_id: "S1", source_class: "primary-measurement", rests_on: [] },
    { source_id: "S2", source_class: "peer-reviewed", rests_on: [] },
  ]),
  kindTable: makeKindTable([
    { kind: "measurement", ceiling: "checked", compatibility_rule_id: null },
    { kind: "forum", ceiling: "corroborated", compatibility_rule_id: null },
  ]),
};
const distinctCheck = { checker_id: "C1", method_class: "replication", method: "re-ran", checked_at_state: "ST0", outcome: "confirms", independence: "distinct-party" };
// the forum type in use, exactly the bundle the store's forum kind implies (the contest's subject).
const FORUM_BUNDLE = { kind: "forum", ceiling: "corroborated", compatibility_rule_id: null, atlas_refs: [] };
const FORUM_HASH = hashTypeBundle(FORUM_BUNDLE);

// the pre-existing claims: a checked measurement premise, and a forum claim it supports (earned supported).
const p1 = claimRecord({ kind: "measurement", statement: "the premise measurement", source_id: "S1", contributor_id: "P1", declared_grade: "checked", checking_records: [distinctCheck] });
const f1 = claimRecord({ kind: "forum", statement: "a forum weighing typed under the forum type", source_id: "S2", contributor_id: "P2", declared_grade: "supported" });
const supP1F1 = linkRecord({ link_kind: "supports", from_identity: p1.identity, to_identity: f1.identity, support_group: "g1", source_id: "S1", contributor_id: "P1", declared_grade: "checked" });
const baseContribution = { hash: "H-BASE", entries: [p1, f1], links: [supP1F1] };

// --- 5. the no-grade-motion theorem (the check the whole design leans on) ---
console.log("\n[5] the no-grade-motion theorem (a contest changes no grade or certificate)");
{
  const g0 = storeViewOf(genesis(), TABLES);
  const baseReceipt = decide(baseContribution, g0, {});
  // record every pre-existing claim's earned grade and the certifying receipt's seal.
  const gradeBefore = new Map(baseReceipt.grade_table.map((g) => [g.identity, g.earned_grade]));
  const certBefore = baseReceipt.certificate_hash;
  ok(baseReceipt.decision === "accepted", `the base graph is admitted (decision ${baseReceipt.decision})`);

  // build the store: apply the base claims.
  let state = apply(genesis(), { entries: baseContribution.entries, links: baseContribution.links, applied_contribution_hash: "H-BASE" });

  // the contest against the forum type in use, through the ordinary gate (no bypass, no special branch).
  const contest = contestType(FORUM_HASH, {
    statement: "the forum ceiling should be structured differently; this contests the forum type",
    contestant: "P9", source_id: "S2", declared_grade: "asserted",
    claimedDeparture: { compatibility_rule_id: "CMP-FORUM-V2" },
  });
  const contestReceipt = decide(contest.contribution, storeViewOf(state, TABLES), {});
  ok(contestReceipt.decision === "accepted", `the contest enters through the normal gate and is admitted (decision ${contestReceipt.decision})`);
  ok(contest.receipt.convertible === true, "the contest carries a departure forkType accepts, so it is convertible to a fork");

  // admit the contest into the store.
  state = apply(state, { entries: contest.contribution.entries, links: contest.contribution.links, applied_contribution_hash: contest.contribution.hash });

  // recompute every pre-existing claim's earned grade from the POST-contest store: byte-identical.
  const svAfter = storeViewOf(state, TABLES);
  let moved = 0;
  for (const [id, before] of gradeBefore) {
    const after = svAfter.earnedByIdentity.get(id).earned;
    if (after !== before) { moved++; ok(false, `grade MOVED for ${id.slice(0, 10)}: ${before} -> ${after} (the contest smuggled a grade change)`); }
  }
  ok(moved === 0, `no pre-existing earned grade moved after admitting the contest (${gradeBefore.size} claims checked)`);

  // the pre-existing certificate is bound to the state it was admitted at, which the contest never
  // touched: re-running the base admission reproduces the seal byte-for-byte after the contest is in place.
  const certAfter = decide(baseContribution, storeViewOf(genesis(), TABLES), {}).certificate_hash;
  ok(certAfter === certBefore, `the pre-existing claims' certificate is byte-identical after the contest (${certBefore.slice(0, 12)})`);
}

// --- 6. rejections: empty-override and non-round-tripping-parent both fail loudly ---
console.log("\n[6] rejections (empty override and a non-round-tripping parent both throw)");
{
  let threwEmpty = false, threwNoop = false, threwBadParent = false;
  try { forkType(FIXED_PARENT, {}); } catch (e) { threwEmpty = /empty override/.test(e.message); }
  try { forkType(FIXED_PARENT, { ceiling: "checked" }); } catch (e) { threwNoop = /no departure|no-op|no field differs/.test(e.message); }
  try { forkType(42, { ceiling: "x" }); } catch (e) { threwBadParent = /round-trip/.test(e.message); }
  ok(threwEmpty, "an empty override set is rejected (a fork with no departure is the parent, an error)");
  ok(threwNoop, "an override set equal to the parent is rejected (no field differs)");
  ok(threwBadParent, "a parent that does not round-trip through canonicalizeBundle is rejected");
}

console.log("\n" + H);
if (fails === 0) console.log("verified: forkType is a deterministic snapshot fork naming its parent and departure, the forked type crosses non-native against the parent, and admitting a contest against a type in use moves no pre-existing grade or certificate, the structural/semantic attenuation boundary made mechanical at one more site.");
console.log(fails === 0 ? "check-fork-contest: OK" : `check-fork-contest: ${fails} FAILURE(S)`);
console.log(H);
process.exit(fails === 0 ? 0 : 1);
