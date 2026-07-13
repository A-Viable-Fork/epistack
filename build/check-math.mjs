// Role: the math kernel oracle (sixth exhibit, in progress). Verifies the kernel is coherent (every
//   adopted kind is in the shared subtree and its pinned hash matches, the tables build, the gate
//   accepts the store) and, from stage zero, that the confidence-order axioms are present as
//   declaration-claims earning the constitutive floor. The scaffolder holds no rules; this is the real
//   enforcer, and it evolves with the kernel: each stage adds the assertions its state earns.
// Contract: `node build/check-math.mjs` exits non-zero on any failure.
// Invariant: the axioms are the given basis, so they ground by adoption at the constitutive floor and
//   carry no support; a later stage grounds the lattice-law and recurrence claims above them.
// Started from scaffolder/new-kernel.mjs and hand-evolved as the kernel gains content.
"use strict";
import { createRequire } from "node:module";
import { hashTypeBundle } from "../kernel/schema/type-hash.mjs";

const require = createRequire(import.meta.url);
const { KINDS, SOURCES, ADOPTED, ADOPTED_HASHES } = require("../corpora/math/tables.js");
const { COMMON_TYPE_HASHES } = require("../corpora/_shared/common-types.js");
const { STORE } = require("../corpora/math/math-data.js");

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-MATH (sixth exhibit, in progress): the math kernel, stage three (grounded)"); console.log(H);

console.log("\n[1] every adopted kind is in the shared subtree and its pinned hash matches");
for (const name of ADOPTED) {
  const shared = COMMON_TYPE_HASHES[name];
  ok(shared !== undefined, `adopts common kind '${name}', which is present in the shared subtree`);
  if (shared !== undefined) {
    ok(ADOPTED_HASHES[name] === shared, `the pinned hash for '${name}' still matches the shared subtree`);
    const row = KINDS.find((k) => k.kind === name);
    ok(!!row && hashTypeBundle({ kind: row.kind, ceiling: row.ceiling, compatibility_rule_id: null, atlas_refs: [] }) === shared, `the '${name}' kind row implies the adopted hash`);
  }
}

console.log("\n[2] the tables build and the gate accepts the store");
let built = null;
try {
  const mod = await import("./math-build.mjs");
  built = mod.buildKernel();
  ok(true, "the kernel builds: source table, kind table, and the store all valid");
} catch (e) {
  ok(false, `the kernel fails to build: ${e.message}`);
}
if (built) {
  ok(built.receipt.decision === "accepted", `the contribution is accepted by the real gate (got ${built.receipt.decision})`);
}

console.log("\n[3] the stage-zero axioms are present as declarations earning the constitutive floor");
if (built) {
  const axioms = STORE.claims.filter((c) => c.ref.startsWith("ax."));
  ok(axioms.length === 3, `three confidence-order axioms are entered (got ${axioms.length})`);
  ok(axioms.every((a) => a.kind === "declaration"), "every axiom is a declaration (the given basis, grounded by adoption)");
  const gradeByIdentity = new Map(built.receipt.grade_table.map((g) => [g.identity, g]));
  for (const a of axioms) {
    const id = built.refId.get(a.ref);
    const g = gradeByIdentity.get(id);
    ok(!!g && g.earned_grade === "constitutive", `${a.ref}: the gate grades it at the constitutive floor (got ${g ? g.earned_grade : "absent"})`);
    ok(!!g && g.S === "asserted", `${a.ref}: it carries no support, so support delivery is bare (got ${g ? g.S : "absent"})`);
  }
}

console.log("\n[4] the stage-three grounding lifts each property by the gate's own computation");
if (built) {
  const props = STORE.claims.filter((c) => c.ref.startsWith("thm."));
  const gradeByIdentity = new Map(built.receipt.grade_table.map((g) => [g.identity, g]));
  const theorems = props.filter((c) => c.kind === "theorem");
  const measurements = props.filter((c) => c.kind === "measurement");
  ok(theorems.length === 9 && measurements.length === 9, `the 18 properties are entered (got ${theorems.length} theorem, ${measurements.length} measurement)`);
  // the lattice theorems: grounded by the axioms (support risen to settled) and the exhaustion proof, at
  // the constitutive proof-floor. the recurrence and crossing measurements: lifted from the asserted
  // floor to the checked tier by the differential-test checking record. no grade is raised by hand; the
  // gate computes each from the attached support and checking records.
  for (const c of theorems) {
    const g = gradeByIdentity.get(built.refId.get(c.ref));
    ok(!!g && g.earned_grade === "constitutive", `${c.ref}: the gate holds it at the constitutive proof-floor (got ${g ? g.earned_grade : "absent"})`);
    ok(!!g && g.S === "settled", `${c.ref}: it now rests on the axioms, so support delivery is settled, not bare (got ${g ? g.S : "absent"})`);
    ok((c.checking_records || []).some((r) => r.checker_id === "oracle:check-math-exhaustion"), `${c.ref}: cites the exhaustion oracle as its proof`);
  }
  for (const c of measurements) {
    const g = gradeByIdentity.get(built.refId.get(c.ref));
    ok(!!g && g.earned_grade === "checked", `${c.ref}: the gate lifts it to the checked tier (got ${g ? g.earned_grade : "absent"})`);
    ok((c.checking_records || []).some((r) => r.checker_id === "oracle:check-math-differential"), `${c.ref}: cites the differential-test harness as its check`);
  }
  ok(STORE.links.length === 19, `the lattice theorems rest on the axioms through ${STORE.links.length} support links`);
}

console.log("\n" + H);
if (fails === 0) console.log("verified: the math kernel grounds its own mathematics. The lattice laws hold the constitutive proof-floor by exhaustion, the recurrence and crossing properties the checked tier by differential testing, each grade computed by the gate over real support.");
console.log(fails === 0 ? "check-math: OK" : `check-math: ${fails} FAILURE(S)`);
console.log(H);
process.exit(fails === 0 ? 0 : 1);
