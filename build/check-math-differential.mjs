// Role: the math kernel's differential-test harness (stage three). Grounds the earned-grade recurrence,
//   contamination, and crossing properties over their unbounded domain by generating random support
//   graphs and confirming the real code agrees with the extracted math (the claim statements) restated
//   independently, over many trials. Agreement over random trials is the checked tier, honestly below a
//   proof; this passing harness is the support that grounds the measurement claims at checked.
// Contract: `node build/check-math-differential.mjs` exits non-zero on any disagreement, printing the
//   failing graph. Deterministic: a seeded generator, so a re-run is byte-identical. Imports the real
//   grounding, crossing, gate, and adoption code.
// Invariant: the reference recomputation is written from the claim statements over the same primitives
//   the code uses (meet, join, capByCeiling), not copied from the code under test, so agreement means
//   the extracted recurrence describes the real code. A disagreement is a finding, reported, not smoothed.
"use strict";
import { earnedGrade, supportDelivery } from "../kernel/grounding/earned-grade.mjs";
import { meet, join, collapse, collapsedRank, capByCeiling } from "../kernel/schema/confidence.mjs";
import { compositeGrade } from "../kernel/composition/transfer.mjs";
import { adoptionOf, crossingStatus } from "./adoption.mjs";
import { decide } from "../kernel/gate/gate.mjs";
import { claimRecord, linkRecord } from "../kernel/schema/records.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { genesis } from "../kernel/store/state.mjs";
import { storeViewOf } from "../kernel/store/decay.mjs";

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-MATH-DIFFERENTIAL: the recurrence, contamination, and crossing properties, over random trials"); console.log(H);

// a seeded LCG so the harness is deterministic (repo determinism discipline).
let seed = 0x9e3779b9;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 0x100000000; };
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const TRIALS = 4000;

const COLL = ["ungraded", "asserted", "supported", "corroborated", "settled"]; // the collapsed line the meet/join run on
const CEILINGS = ["asserted", "supported", "corroborated", "checked", "independently-rechecked", "constitutive"]; // real kind ceilings

// ---- reference recomputations, written from the claim statements over the shared primitives ----
function refSupportDelivery(supports) {
  if (!supports.length) return "asserted"; // support from nothing is nothing
  const groups = new Map();
  let uniq = 0;
  for (const s of supports) {
    const g = s.group == null ? "__singleton_" + uniq++ : s.group; // ungrouped is its own singleton
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(s);
  }
  const groupDelivery = new Map();
  for (const [g, members] of groups) {
    let d = "settled"; // weakest-of within a group
    for (const m of members) d = meet(d, meet(collapse(m.supportEarned), collapse(m.linkGrade)));
    groupDelivery.set(g, d);
  }
  let S = "ungraded"; // strongest-of across groups
  for (const d of groupDelivery.values()) S = join(S, d);
  const eligible = [...groups.keys()].filter((g) => collapsedRank(groupDelivery.get(g)) >= 2);
  let lifted = false;
  const footOf = (members) => { const f = new Set(); for (const m of members) for (const x of m.footprint || []) f.add(x); return f; };
  for (let i = 0; i < eligible.length && !lifted; i++)
    for (let j = i + 1; j < eligible.length && !lifted; j++) {
      const fi = footOf(groups.get(eligible[i])), fj = footOf(groups.get(eligible[j]));
      let disj = true; for (const x of fi) if (fj.has(x)) disj = false;
      if (disj) lifted = true;
    }
  if (lifted) S = join(S, "corroborated"); // the independence lift, no further
  return S;
}
function refEarned({ ceiling, constitutive, checkingRecords, supports }) {
  const S = refSupportDelivery(supports);
  const distinct = (checkingRecords || []).filter((c) => c.independence === "distinct-party");
  const B = constitutive ? "constitutive" : (distinct.length >= 1 ? "checked" : "none");
  const Bsettled = B === "constitutive" || B === "checked";
  if (Bsettled && (collapsedRank(S) >= 3 || supports.length === 0)) return capByCeiling(B, ceiling); // first row: the basis stands
  const sCapped = collapsedRank(S) >= 4 ? "corroborated" : (S === "settled" ? "corroborated" : S); // a settled S becomes corroborated
  return capByCeiling(sCapped, ceiling);
}

function randomSupports() {
  const n = Math.floor(rnd() * 4); // 0..3 supports, including the empty case
  const out = [];
  for (let i = 0; i < n; i++) out.push({
    group: rnd() < 0.5 ? pick(["gA", "gB"]) : null,
    linkGrade: pick(COLL), supportEarned: pick(COLL),
    footprint: rnd() < 0.5 ? ["s1"] : ["s2"],
    linkIdentity: "L" + i + "_" + Math.floor(rnd() * 1e6),
  });
  return out;
}

console.log(`\n[1] thm.earned-recurrence: code earned grade and support delivery equal the extracted recurrence (${TRIALS} trials)`);
{
  let bad = null;
  for (let t = 0; t < TRIALS && !bad; t++) {
    const supports = randomSupports();
    const constitutive = rnd() < 0.15;
    const checkingRecords = rnd() < 0.3 ? [{ independence: "distinct-party" }] : [];
    const ceiling = pick(CEILINGS);
    const code = earnedGrade({ ceiling, constitutive, checkingRecords, supports });
    const refE = refEarned({ ceiling, constitutive, checkingRecords, supports });
    const refS = refSupportDelivery(supports);
    if (code.earned !== refE || code.S !== refS) bad = { supports, constitutive, checkingRecords, ceiling, code, refE, refS };
  }
  ok(!bad, bad ? `disagreement: ${JSON.stringify(bad)}` : `code earned grade and support delivery match the recurrence over ${TRIALS} random graphs`);
}

console.log("\n[2] thm.settled-not-inherited: settled support without an own basis delivers at most corroborated");
{
  let bad = null;
  for (let t = 0; t < TRIALS && !bad; t++) {
    const supports = [{ group: null, linkGrade: "settled", supportEarned: "settled", footprint: ["s1"], linkIdentity: "x" + t }];
    const e = earnedGrade({ ceiling: "constitutive", constitutive: false, checkingRecords: [], supports });
    if (collapsedRank(e.earned) > collapsedRank("corroborated")) bad = e;
  }
  ok(!bad, bad ? `settled inherited through support: ${JSON.stringify(bad)}` : "settledness is not inherited: settled support delivers at most corroborated without an own basis");
}

console.log("\n[3] thm.ungrouped-singleton: two ungrouped supports combine strongest-of, not weakest-of");
{
  let bad = null;
  for (let t = 0; t < TRIALS && !bad; t++) {
    const a = pick(COLL), b = pick(COLL);
    const supports = [
      { group: null, linkGrade: "settled", supportEarned: a, footprint: ["s1"], linkIdentity: "u1_" + t },
      { group: null, linkGrade: "settled", supportEarned: b, footprint: ["s1"], linkIdentity: "u2_" + t },
    ];
    const S = supportDelivery(supports);
    if (S !== join(collapse(a), collapse(b))) bad = { a, b, S, expected: join(collapse(a), collapse(b)) };
  }
  ok(!bad, bad ? `ungrouped supports collected: ${JSON.stringify(bad)}` : "two ungrouped supports combine strongest-of (each its own singleton group), never collected into one");
}

console.log("\n[4] thm.determinism: shuffling support order yields identical earned grades");
{
  let bad = null;
  for (let t = 0; t < 1000 && !bad; t++) {
    const supports = randomSupports().concat(randomSupports());
    const ceiling = pick(CEILINGS);
    const base = earnedGrade({ ceiling, constitutive: false, checkingRecords: [], supports }).earned;
    for (let p = 0; p < 6 && !bad; p++) {
      const shuffled = supports.map((s) => s).sort(() => rnd() - 0.5);
      const g = earnedGrade({ ceiling, constitutive: false, checkingRecords: [], supports: shuffled }).earned;
      if (g !== base) bad = { supports, base, g };
    }
  }
  ok(!bad, bad ? `order-dependent: ${JSON.stringify(bad)}` : "earned grade is invariant under support-order permutation over 1000 graphs, 6 permutations each");
}

console.log("\n[5] thm.contamination-monotone: a group's delivery is the weakest of its members");
{
  let bad = null;
  for (let t = 0; t < TRIALS && !bad; t++) {
    const members = [];
    const k = 1 + Math.floor(rnd() * 3);
    for (let i = 0; i < k; i++) members.push({ group: "g", linkGrade: pick(COLL), supportEarned: pick(COLL), footprint: ["s1"], linkIdentity: "m" + i });
    const S = supportDelivery(members);
    let expect = "settled";
    for (const m of members) expect = meet(expect, meet(collapse(m.supportEarned), collapse(m.linkGrade)));
    if (S !== expect) bad = { members, S, expect };
  }
  ok(!bad, bad ? `not weakest-of: ${JSON.stringify(bad)}` : "a group's delivery is the weakest of its members, so a contested support only lowers the grade");
}

console.log("\n[6] thm.cycle-guard: a support cycle resolves the in-cycle node to asserted and terminates");
{
  const tables = { sourceTable: makeSourceTable([{ source_id: "s", source_class: "peer-reviewed" }]), kindTable: makeKindTable([{ kind: "forum", ceiling: "corroborated" }]) };
  const c1 = claimRecord({ kind: "forum", statement: "cycle node one", source_id: "s", contributor_id: "t", declared_grade: "asserted" });
  const c2 = claimRecord({ kind: "forum", statement: "cycle node two", source_id: "s", contributor_id: "t", declared_grade: "asserted" });
  const l1 = linkRecord({ link_kind: "supports", from_identity: c1.identity, to_identity: c2.identity, source_id: "s", contributor_id: "t", declared_grade: "corroborated" });
  const l2 = linkRecord({ link_kind: "supports", from_identity: c2.identity, to_identity: c1.identity, source_id: "s", contributor_id: "t", declared_grade: "corroborated" });
  let terminated = true, r = null;
  try { r = decide({ hash: "cyc", entries: [c1, c2], links: [l1, l2] }, storeViewOf(genesis(), tables), {}); } catch (e) { terminated = false; }
  ok(terminated, "the gate terminates on a support cycle (the asserted guard breaks the recursion)");
  if (r) {
    const g = new Map(r.grade_table.map((x) => [x.identity, x.earned_grade]));
    ok(g.get(c1.identity) === "asserted" && g.get(c2.identity) === "asserted", `both in-cycle claims resolve to asserted (got ${g.get(c1.identity)}, ${g.get(c2.identity)})`);
  }
}

console.log("\n[7] thm.earned-linear: a graph with exponentially many paths resolves in linear time (memoized)");
{
  const tables = { sourceTable: makeSourceTable([{ source_id: "s", source_class: "peer-reviewed" }]), kindTable: makeKindTable([{ kind: "forum", ceiling: "corroborated" }]) };
  const D = 26; // 2^26 distinct root-to-floor paths, 2D+2 nodes; a naive resolver would not finish
  const entries = [], links = [], rec = {};
  const node = (lvl, side) => `L${lvl}${side}`;
  for (let lvl = 0; lvl <= D; lvl++) for (const side of ["A", "B"]) {
    const c = claimRecord({ kind: "forum", statement: `diamond ${lvl}${side}`, source_id: "s", contributor_id: "t", declared_grade: "asserted" });
    rec[node(lvl, side)] = c; entries.push(c);
  }
  for (let lvl = 0; lvl < D; lvl++) for (const side of ["A", "B"]) for (const child of ["A", "B"])
    links.push(linkRecord({ link_kind: "supports", from_identity: rec[node(lvl + 1, child)].identity, to_identity: rec[node(lvl, side)].identity, source_id: "s", contributor_id: "t", declared_grade: "corroborated" }));
  const t0 = Date.now();
  const r = decide({ hash: "diamond", entries, links }, storeViewOf(genesis(), tables), {});
  const ms = Date.now() - t0;
  ok(r.decision !== undefined && ms < 2000, `an exponential-path graph (depth ${D}, ${entries.length} nodes) resolves in ${ms} ms, linear not exponential`);
}

console.log("\n[8] thm.crossing-min: a composite grade is min(ceiling, min over necessary carried grades)");
{
  let bad = null;
  for (let t = 0; t < TRIALS && !bad; t++) {
    const ceiling = pick(COLL);
    const citations = [];
    const k = Math.floor(rnd() * 4);
    for (let i = 0; i < k; i++) citations.push({ role: rnd() < 0.7 ? "necessary" : "corroborating", carried_grade: pick(COLL) });
    const code = compositeGrade({ ceiling, citations });
    let fold = "settled";
    for (const c of citations) if (c.role === "necessary") fold = meet(fold, c.carried_grade);
    const ref = meet(ceiling, fold);
    if (code !== ref) bad = { ceiling, citations, code, ref };
  }
  ok(!bad, bad ? `crossing min disagreement: ${JSON.stringify(bad)}` : `the composite grade is min(ceiling, min over necessary carried grades), corroborating citations excluded, over ${TRIALS} trials`);
}

console.log("\n[9] thm.untyped-floor: an unpinned crossing arrives untyped; a same-hash crossing is native; a fork restores standing");
{
  const lhc = adoptionOf("lhc"), covid = adoptionOf("covid");
  ok(crossingStatus("measurement", lhc, covid) === "native", "a shared-hash kind (measurement) crosses lhc to covid native");
  ok(crossingStatus("derivation", lhc, covid) === "untyped", "an lhc-only kind (derivation) arrives untyped at covid, which pins no such hash");
  const forked = { pins: Object.assign({}, covid.pins, { derivation: lhc.pins.derivation }) }; // covid forks, adopting the hash
  ok(crossingStatus("derivation", lhc, forked) === "native", "after covid forks and adopts the hash, the derivation crossing is native: the fork restores standing");
}

console.log("\n" + H);
if (fails === 0) console.log("verified by differential testing: the earned-grade recurrence, contamination, and crossing properties agree with the code over the trials. The checked tier, honestly below a proof.");
console.log(fails === 0 ? "check-math-differential: OK" : `check-math-differential: ${fails} FAILURE(S)`);
console.log(H);
process.exit(fails === 0 ? 0 : 1);
