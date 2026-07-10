// Role: the agreement gate (kernel config schema, F4). Before the scaffolder publishes the common
//   kinds as a shared subtree, confirm all four cases mean the same thing by each common kind: for
//   every common kind (measurement, forum, declaration), each kernel that uses it must imply the same
//   type-hash from its own tables, and that hash must be the one in corpora/_shared/common-types.js.
// Contract: `node build/check-agreement.mjs` exits 0 if the four agree, 1 with a named divergence
//   report (which kernel, which kind, how the bundle differs). Imports the adoption layer and the
//   shared common-types seed. A kernel that does not use a kind is absent from that kind's set.
// Invariant: this is a gate, not a fixer. A kernel that uses a common kind must imply the shared hash;
//   a divergence is a real finding to reconcile before publishing, reported and never forced equal.
"use strict";
import { createRequire } from "node:module";
import { adoptionOf, CASE_IDS } from "./adoption.mjs";

const require = createRequire(import.meta.url);
const { COMMON_BUNDLES, COMMON_TYPE_HASHES } = require("../corpora/_shared/common-types.js");

const H = "=".repeat(80);
console.log(H); console.log("CHECK-AGREEMENT (the gate): the four cases agree on the common kinds"); console.log(H);

const adoptions = CASE_IDS.map((c) => adoptionOf(c));
const divergences = [];

// how two bundles differ, field by field, for an honest report.
function bundleDiff(got, shared) {
  const keys = [...new Set([...Object.keys(got), ...Object.keys(shared)])].sort();
  const diffs = [];
  for (const k of keys) {
    const a = JSON.stringify(got[k]), b = JSON.stringify(shared[k]);
    if (a !== b) diffs.push(`${k}: ${a} vs shared ${b}`);
  }
  return diffs;
}

for (const kind of Object.keys(COMMON_TYPE_HASHES)) {
  const users = adoptions.filter((a) => a.pins[kind] !== undefined);
  const sharedHash = COMMON_TYPE_HASHES[kind];
  const agree = [];
  for (const a of users) {
    if (a.pins[kind] === sharedHash) { agree.push(a.caseId); continue; }
    divergences.push({ kernel: a.caseId, kind, got: a.pins[kind], diff: bundleDiff(a.bundles[kind], COMMON_BUNDLES[kind]) });
  }
  console.log(`\n[${kind}] used by ${users.length} kernel(s): ${users.map((a) => a.caseId).join(", ")}`);
  console.log(`      ${agree.length}/${users.length} agree with the shared hash ${sharedHash.slice(0, 12)} (${agree.join(", ") || "none"})`);
}

console.log("\n" + H);
if (divergences.length) {
  console.log(`check-agreement: FAIL (${divergences.length} divergence(s)); the shared subtree cannot publish these until reconciled`);
  for (const d of divergences) {
    console.log(`  - ${d.kernel} diverges on '${d.kind}': implies ${d.got.slice(0, 12)}, shared is ${COMMON_TYPE_HASHES[d.kind].slice(0, 12)}`);
    for (const line of d.diff) console.log(`      ${line}`);
  }
  console.log(H);
  process.exit(1);
}
console.log("verified: every case that uses a common kind implies the same type-hash the shared subtree holds, so the commons is coherent and the scaffolder may publish the common kinds as shared.");
console.log("check-agreement: OK");
console.log(H);
process.exit(0);
