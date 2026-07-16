// Role: the kernel-algebra oracle (composition spec, "The kernel algebra"). Proves the four claims the
//   algebra rests on: closure (each op's output is a kernel an op accepts again), the governing law (no
//   op raises a grade above what recomputation in its output confirms; compose floors every crossed
//   claim; project never lifts; diff asserts nothing it did not read), the two structural laws
//   (compose associative up to hash; project distributes over compose on intrinsic predicates, with the
//   grade-band boundary characterized), and diff correctness on a constructed pair. Closes with the
//   eggs exhibit: the composite-versus-join diff, the layer's reason to exist.
// Contract: `node build/check-algebra.mjs` exits non-zero on any failure. Imports the kernel algebra
//   and the v3 kernel only, plus build/eggs-build.mjs for the exhibit (build may reach any layer).
// Invariant: a re-run is byte-identical. The governing law is checked independently of the operations
//   via governingLawHolds, so a break in an op cannot hide behind the op's own grade assignment.
"use strict";
import { asKernel, compose, project, diff, governingLawHolds, recomputeGrade } from "../kernel/composition/algebra.mjs";
import { claimRecord, linkRecord } from "../kernel/schema/records.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { makeState, GENESIS_MARKER } from "../kernel/store/state.mjs";
import { buildEggs } from "./eggs-build.mjs";

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
// the governing law, named: on failure it prints the operation and the claim whose assigned grade
// exceeds what recomputation confirms, so a broken operation is caught by name, not by a bare red.
const lawOk = (K, op) => {
  const r = governingLawHolds(K);
  if (!r.ok) console.log(`         governing-law violation in ${op}: claim ${String(r.id).slice(0, 12)} assigned ${r.assigned} but recomputation confirms only ${r.recomputed}`);
  return r.ok;
};
const H = "=".repeat(80);
console.log(H); console.log("CHECK-ALGEBRA: compose, project, diff over kernels, under the governing law"); console.log(H);

// ---- synthetic fixtures: two small typed kernels over a shared basis ----
const sources = makeSourceTable([
  { source_id: "s-a", source_class: "primary-measurement", rests_on: [] },
  { source_id: "s-b", source_class: "dataset", rests_on: [] },
  { source_id: "s-d", source_class: "institutional-report", rests_on: [] },
]);
const kinds = makeKindTable([
  { kind: "measurement", ceiling: "independently-rechecked" },
  { kind: "estimate", ceiling: "corroborated" },
  { kind: "principle", ceiling: "constitutive" },
]);
const tables = { sourceTable: sources, kindTable: kinds };
const chk = (id, cls) => ({ checker_id: id, method_class: cls, method: "audited", checked_at_state: "s0", outcome: "confirms", independence: "distinct-party" });

// A: a rechecked measurement (settled) plus a bare estimate (asserted), the measurement contradicted.
const A1 = claimRecord({ kind: "measurement", statement: "the process yields 0.8 units per input", source_id: "s-a", contributor_id: "lab-a", declared_grade: "independently-rechecked", checking_records: [chk("a1", "replication"), chk("a2", "replication")] });
const A2 = claimRecord({ kind: "estimate", statement: "the program reaches about 4000 units", source_id: "s-b", contributor_id: "lab-b", declared_grade: "asserted" });
const Acontra = claimRecord({ kind: "estimate", statement: "the process yields far less than reported", source_id: "s-b", contributor_id: "lab-b", declared_grade: "asserted" });
const linkContra = linkRecord({ link_kind: "contradicts", from_identity: Acontra.identity, to_identity: A1.identity, source_id: "s-b", contributor_id: "lab-b", declared_grade: "asserted" });
const storeA = { store_id: "S-A", state: makeState({ prior_state_hash: GENESIS_MARKER, entries: [A1, A2, Acontra], links: [linkContra] }), tables };

// B: shares A1 by identity (same kind and statement) at the same standing, plus a principle B holds.
const B1 = claimRecord({ kind: "measurement", statement: "the process yields 0.8 units per input", source_id: "s-a", contributor_id: "lab-a", declared_grade: "independently-rechecked", checking_records: [chk("a1", "replication"), chk("a2", "replication")] });
const B3 = claimRecord({ kind: "principle", statement: "a unit is counted equally regardless of source", source_id: "s-d", contributor_id: "norm", declared_grade: "constitutive" });
const storeB = { store_id: "S-B", state: makeState({ prior_state_hash: GENESIS_MARKER, entries: [B1, B3] }), tables };

const KA = asKernel(storeA), KB = asKernel(storeB);
ok(B1.identity === A1.identity, "the fixtures share one claim by identity (same kind and statement hash the same)");

// =====================================================================================
console.log("\n[1] closure: each operation returns a kernel an operation accepts again");
const c = compose(KA, KB);
const p = project(c, (e) => e.kind === "measurement" || e.kind === "estimate");
const d = diff(KA, KB);
const wellFormed = (K) => K && K.state && Array.isArray(K.state.entries) && K.native instanceof Set && K.grades instanceof Map && typeof K.state.state_hash === "string";
ok(wellFormed(KA) && wellFormed(KB), "asKernel produces well-formed kernels");
ok(wellFormed(c) && wellFormed(p) && wellFormed(d), "compose, project, diff each return a well-formed kernel");
// chain them: the output of one is the input of the next, and the chain stays operable
const chained = diff(project(compose(KA, KB), (e) => e.kind !== "principle"), KA);
ok(wellFormed(chained), "a compose -> project -> diff chain stays operable (closure holds)");

// =====================================================================================
console.log("\n[2] the governing law: no operation raises a grade above what recomputation confirms");
ok(governingLawHolds(KA).ok && governingLawHolds(KB).ok, "the source kernels satisfy the governing law");
// compose floors every crossed claim: B's non-shared claim (the principle) grounds nothing in A.
ok(recomputeGrade(c, B3.identity) === "ungraded", "compose floors the crossed principle to the untyped bottom (grounds nothing)");
ok(!c.native.has(B3.identity), "the crossed claim is not native to the composed kernel");
ok(c.grades.get(B3.identity) === "ungraded", "the composed kernel assigns the crossed claim the bottom, not B's constitutive standing");
ok(governingLawHolds(c).ok, "compose satisfies the governing law");
// project never lifts a restricted grade: every projected grade is the recomputation over the restriction.
let projectNeverLifts = true;
for (const [id, g] of p.grades) if (g !== recomputeGrade(p, id)) projectNeverLifts = false;
ok(projectNeverLifts && governingLawHolds(p).ok, "project assigns exactly the restricted recomputation, never higher");
// a projection that removes a support genuinely lowers the claim it fed: M rests on S through a supports
// link and reaches corroborated; project away S and M falls to asserted. This is the case the deliberate
// break has to manufacture standing against, so the governing law's teeth are exercised here.
const S_sup = claimRecord({ kind: "measurement", statement: "a supporter measurement", source_id: "s-a", contributor_id: "lab-a", declared_grade: "checked", checking_records: [chk("s1", "direct-measurement")] });
const M_sup = claimRecord({ kind: "estimate", statement: "an estimate resting on the supporter", source_id: "s-b", contributor_id: "lab-b", declared_grade: "asserted" });
const supLink = linkRecord({ link_kind: "supports", from_identity: S_sup.identity, to_identity: M_sup.identity, source_id: "s-a", contributor_id: "lab-a", declared_grade: "corroborated" });
const KSup = asKernel({ store_id: "S-sup", state: makeState({ prior_state_hash: GENESIS_MARKER, entries: [S_sup, M_sup], links: [supLink] }), tables });
const pDrop = project(KSup, (e) => e.identity === M_sup.identity);
ok(recomputeGrade(KSup, M_sup.identity) === "corroborated", "with its supporter, M reaches corroborated");
ok(recomputeGrade(pDrop, M_sup.identity) === "asserted", "project away the supporter and M falls to asserted: the restriction lowers the grade");
const pDropLaw = lawOk(pDrop, "project");
ok(pDropLaw && pDrop.grades.get(M_sup.identity) === "asserted", "project assigns the fallen grade, not the original: it cannot retain standing the restricted subgraph dropped");
// diff asserts nothing it did not read: every diff record grounds nothing (bottom), native is empty.
ok(d.native.size === 0, "the diff-kernel holds no native claim: it asserts nothing");
let diffAssertsNothing = true;
for (const [, g] of d.grades) if (g !== "ungraded") diffAssertsNothing = false;
ok(diffAssertsNothing && governingLawHolds(d).ok, "every diff record sits at the bottom: diff reports, it does not assert");

// fuzzed kernel pairs: random op chains, the law checked after every step
console.log("\n[2b] the governing law holds across fuzzed operation chains");
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const pool = [A1, A2, Acontra, B1, B3];
function fuzzKernel(rnd, tag) {
  const picked = pool.filter(() => rnd() < 0.6);
  const entries = picked.length ? picked : [A1];
  const links = entries.some((e) => e.identity === A1.identity) && entries.some((e) => e.identity === Acontra.identity) ? [linkContra] : [];
  return asKernel({ store_id: `F-${tag}`, state: makeState({ prior_state_hash: GENESIS_MARKER, entries, links }), tables });
}
const preds = [(e) => e.kind === "measurement", (e) => e.kind !== "principle", (e) => true, (e, K) => recomputeGrade(K, e.identity) !== "ungraded"];
let fuzzLawHeld = true, fuzzRuns = 0;
const rnd = mulberry32(20260716);
for (let i = 0; i < 300; i++) {
  let K = fuzzKernel(rnd, `a${i}`);
  const steps = 1 + Math.floor(rnd() * 4);
  for (let s = 0; s < steps; s++) {
    const op = Math.floor(rnd() * 3);
    if (op === 0) K = compose(K, fuzzKernel(rnd, `b${i}.${s}`));
    else if (op === 1) K = project(K, preds[Math.floor(rnd() * preds.length)]);
    else K = diff(K, fuzzKernel(rnd, `c${i}.${s}`));
    fuzzRuns++;
    if (!governingLawHolds(K).ok) fuzzLawHeld = false;
  }
}
ok(fuzzLawHeld, `the governing law held after every one of ${fuzzRuns} fuzzed operations`);

// =====================================================================================
console.log("\n[3] the two structural laws");
// associativity of compose up to hash (order-independent state hash over identities and native set)
const KC = asKernel({ store_id: "S-C", state: makeState({ prior_state_hash: GENESIS_MARKER, entries: [A2, B3] }), tables });
const left = compose(compose(KA, KB), KC);
const right = compose(KA, compose(KB, KC));
ok(left.state.state_hash === right.state.state_hash, "compose is associative up to hash: (A.B).C and A.(B.C) hash the same");
ok(compose(KA, KB).state.state_hash !== compose(KB, KA).state.state_hash, "compose is not commutative: the host kernel keeps its native set (reported, not a failure)");
// project distributes over compose on an intrinsic (entry-only) predicate
const pk = (e) => e.kind === "measurement";
const lhs = project(compose(KA, KB), pk);
const rhs = compose(project(KA, pk), project(KB, pk));
ok(lhs.state.state_hash === rhs.state.state_hash, "project distributes over compose on an intrinsic predicate (by kind), up to hash");
// the characterized boundary: a grade-dependent predicate does NOT distribute, because compose floors B
const pg = (e, K) => recomputeGrade(K, e.identity) !== "ungraded";
const lg = project(compose(KA, KB), pg);
const rg = compose(project(KA, pg), project(KB, pg));
ok(lg.state.state_hash !== rg.state.state_hash, "characterized boundary: a grade-band predicate does not distribute, because compose floors B's crossed claims (Step 2 of the spec)");

// =====================================================================================
console.log("\n[4] diff correctness on a constructed pair with known differences");
// X: A1 (settled) and A2 (asserted). Y: A1 downgraded (no checks -> its earned falls), A2 dropped, a new
// claim added, and A1 contradicted. diff(X, Y) must report exactly: A2 only in X, the new claim only in
// Y, A1's grade changed, and A1 a contradiction surface. Nothing else.
const A1weak = claimRecord({ kind: "measurement", statement: "the process yields 0.8 units per input", source_id: "s-a", contributor_id: "lab-a", declared_grade: "asserted" });
const Ynew = claimRecord({ kind: "estimate", statement: "a later revision recorded here", source_id: "s-b", contributor_id: "lab-b", declared_grade: "asserted" });
const yContra = linkRecord({ link_kind: "contradicts", from_identity: Ynew.identity, to_identity: A1weak.identity, source_id: "s-b", contributor_id: "lab-b", declared_grade: "asserted" });
const X = asKernel({ store_id: "S-X", state: makeState({ prior_state_hash: GENESIS_MARKER, entries: [A1, A2] }), tables });
const Y = asKernel({ store_id: "S-Y", state: makeState({ prior_state_hash: GENESIS_MARKER, entries: [A1weak, Ynew], links: [yContra] }), tables });
const dxy = diff(X, Y);
ok(dxy.findings.only_in_a.length === 1 && dxy.findings.only_in_a[0] === A2.identity, "diff reports A2 only in X, and nothing else only in X");
ok(dxy.findings.only_in_b.length === 1 && dxy.findings.only_in_b[0] === Ynew.identity, "diff reports the new claim only in Y, and nothing else only in Y");
ok(dxy.findings.grade_changed.length === 1 && dxy.findings.grade_changed[0].id === A1.identity, "diff reports exactly one grade change, on A1");
ok(dxy.findings.grade_changed[0].grade_a === "independently-rechecked" && dxy.findings.grade_changed[0].grade_b === "asserted", "diff carries both grades: A1 falls from independently-rechecked to asserted");
ok(dxy.findings.contradiction_surfaces.length === 1 && dxy.findings.contradiction_surfaces[0].id === A1.identity, "diff reports exactly one contradiction surface: A1, above the floor in X and contradicted in Y");
// nothing spurious: a claim identical in both is not reported
const Xsame = asKernel({ store_id: "S-Xs", state: makeState({ prior_state_hash: GENESIS_MARKER, entries: [A1, A2], links: [] }), tables });
const dsame = diff(X, Xsame);
ok(dsame.findings.only_in_a.length === 0 && dsame.findings.only_in_b.length === 0 && dsame.findings.grade_changed.length === 0 && dsame.findings.contradiction_surfaces.length === 0, "diff of a kernel against its equal reports nothing: it invents no difference");

// =====================================================================================
console.log("\n[5] the eggs exhibit: composite framing versus the bottom-up join");
const eggs = buildEggs();
const domainIds = ["S-nutrition", "S-environment", "S-economics"];
const domains = domainIds.map((id) => eggs.domains[id]);

// the bottom-up join: the three domain stores unioned under their shared tables. They agreed on one
// schema, so every claim stays native and grounds in its own domain; this is standing that emerged from
// the domains themselves, with no framing imposed.
function joinStores(stores) {
  const entries = [], links = [], seen = new Set();
  for (const s of stores) {
    for (const e of s.state.entries || []) if (!seen.has(e.identity)) { seen.add(e.identity); entries.push(e); }
    for (const l of s.state.links || []) links.push(l);
  }
  return { store_id: `join(${domainIds.join(",")})`, state: makeState({ prior_state_hash: GENESIS_MARKER, entries, links }), tables: stores[0].tables };
}
const J = asKernel(joinStores(domains));
ok(governingLawHolds(J).ok, "the bottom-up join is a lawful kernel");

// the top-down composite view: the same join with the composite's imposed weighings added on top. A
// weighing is a value choice the composite declares; its kind is one no domain pins, so it grounds to
// the floor and lifts no domain claim. The composite copies domain grades through its citations and
// regrades no domain claim, so on the shared skeleton the composite's grading IS the join's.
const weighings = (eggs.compStore.claims || []).map((w) => ({ record_type: "claim", identity: w.claim_id, kind: "weighing", statement: w.statement, source_id: "C-eggs", contributor_id: "P-composite", declared_grade: "ungraded", checking_records: [] }));
const T = asKernel({ store_id: "composite(C-eggs)", state: makeState({ prior_state_hash: GENESIS_MARKER, entries: [...J.state.entries, ...weighings], links: J.state.links }), tables: J.tables });
ok(governingLawHolds(T).ok, "the top-down composite view is a lawful kernel");

// the projections
const measurementFloor = project(J, (e) => typeof e.kind === "string" && e.kind.includes("measurement"));
console.log(`      project(join -> measurement-floor claims): ${measurementFloor.state.entries.length} of ${J.state.entries.length} claims`);
for (const id of domainIds) {
  const dom = eggs.domains[id];
  const domIds = new Set((dom.state.entries || []).map((e) => e.identity));
  const proj = project(J, (e) => domIds.has(e.identity));
  console.log(`      project(join -> ${id}): ${proj.state.entries.length} claims, law ${governingLawHolds(proj).ok ? "holds" : "FAILS"}`);
  ok(proj.state.entries.length === dom.state.entries.length, `project to ${id} recovers exactly that domain's claim count`);
}

// the diff that motivates the layer: top-down composite grading versus bottom-up join
const dEggs = diff(T, J);
console.log("\n      composite-versus-join diff (values versus facts, made computable):");
console.log(`        only in the composite (imposed framing / values): ${dEggs.findings.only_in_a.length}`);
console.log(`        only in the join (facts the framing dropped):      ${dEggs.findings.only_in_b.length}`);
console.log(`        shared facts whose standing the framing moved:     ${dEggs.findings.grade_changed.length}`);
console.log(`        contradiction surfaces (contested yet standing):   ${dEggs.findings.contradiction_surfaces.length}`);
for (const r of dEggs.state.entries) console.log(`          - ${r.statement}`);
ok(dEggs.findings.only_in_a.length === weighings.length, "the diff surfaces exactly the composite's imposed weighings as only-in-composite (the values it adds)");
ok(dEggs.findings.grade_changed.length === 0, "the diff surfaces zero shared-fact grade changes: the framing imposes weighings but moves no domain fact's standing (values do not rewrite facts)");
ok(dEggs.findings.only_in_b.length === 0, "the composite drops no domain fact: every domain claim survives into the composite view");

// =====================================================================================
console.log("\n[6] a re-run is byte-identical");
const digest = () => diff(compose(asKernel(storeA), asKernel(storeB)), asKernel(storeA)).state.state_hash;
ok(digest() === digest(), "two runs of the same op chain produce an identical state hash");

console.log("\n" + H);
if (fails) { console.log(`check-algebra: ${fails} FAILURE(S)`); process.exit(1); }
console.log("verified: the algebra is closed, every operation obeys the governing law (no op raises a grade), compose is associative up to hash and project distributes over it on intrinsic predicates, diff reports exactly the difference, and the eggs composite imposes values without rewriting a single domain fact.");
console.log("check-algebra: OK"); console.log(H);
