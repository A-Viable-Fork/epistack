// Role: the certificate-seal oracle (CERT-1). Confirms the defining property of the derived
//   certificate hash: it is a function of the sealed bundle, changing if and only if a bundled part
//   changes, and reproducing byte-for-byte for an identical certified assembly. This is the
//   differential test for the seal, the pattern the math kernel uses. It also confirms the two design
//   rules that protect the scaling: the seal is computed downstream of grounding (grounding is never
//   read by it and never touched), and expiry is mark-stale by comparison, never an eager re-ground.
// Contract: `node build/check-certificate.mjs`. Exits 0 if every assertion holds, 1 with a report.
//   Imports only kernel v3 modules and Node's standard library.
// Invariant: the certificate hash does not replace verification, it seals it. Correspondence is the
//   gate's computation; the hash guarantees the assembly is the exact one certified, and expires when
//   any bundled part changes. The oracle perturbs each bundled part and confirms the seal moves.
"use strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as R from "../kernel/schema/records.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { decide } from "../kernel/gate/gate.mjs";
import { verifyDecision } from "../kernel/gate/verify.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-CERTIFICATE (CERT-1): the derived seal over the grounded-claim receipt"); console.log(H);

// --- fixtures, modeled on build/check-gate.mjs ---
const KINDS = makeKindTable([
  { kind: "measurement", ceiling: "independently-rechecked", compatibility_rule_id: "CMP-M" },
  { kind: "definition", ceiling: "constitutive", compatibility_rule_id: "CMP-D" },
]);
const SRC = makeSourceTable([
  { source_id: "S1", source_class: "primary-measurement", rests_on: [] },
  { source_id: "S2", source_class: "peer-reviewed", rests_on: [] },
]);
const mkStore = (o = {}) => ({ stateHash: "ST0", earnedByIdentity: new Map(), restatementLinks: [], withdrawnRecords: [], kindOf: new Map(), sourceTable: SRC, kindTable: KINDS, ...o });
const claim = (statement, declared_grade, checking_records) => R.claimRecord({ kind: "measurement", statement, source_id: "S1", contributor_id: "P1", declared_grade, checking_records });
const distinctCheck = { checker_id: "C2", method_class: "replication", method: "re-ran", checked_at_state: "ST0", outcome: "confirms", independence: "distinct-party" };
const otherCheck = { checker_id: "C3", method_class: "derivation-audit", method: "audited", checked_at_state: "ST0", outcome: "confirms", independence: "distinct-party" };
const certOf = (contribution, store, versions = {}) => decide(contribution, store, versions).certificate_hash;

// the base certified assembly: one measurement with a distinct-party check, declared at checked.
const baseClaim = claim("m1", "checked", [distinctCheck]);
const baseContribution = { hash: "H-BASE", entries: [baseClaim], links: [] };
const baseStore = mkStore();
const baseHash = certOf(baseContribution, baseStore);
ok(typeof baseHash === "string" && baseHash.length === 64, `[0] the receipt carries a certificate hash (64-hex sha256), got ${baseHash && baseHash.slice(0, 12)}`);

// --- [1] an identical assembly reproduces the identical seal (the "only if" direction) ---
{
  const again = certOf({ hash: "H-BASE", entries: [claim("m1", "checked", [distinctCheck])], links: [] }, mkStore());
  ok(again === baseHash, "[1] re-certifying the identical assembly reproduces the identical hash");
}

// --- [2] perturb a grade: the declared grade of the claim changes the seal ---
{
  const perturbed = certOf({ hash: "H-BASE", entries: [claim("m1", "supported", [distinctCheck])], links: [] }, mkStore());
  ok(perturbed !== baseHash, "[2] changing a grade (declared_grade) changes the certificate hash");
}

// --- [3] perturb a support: adding a supporting link changes the grade table and the seal ---
{
  const premise = claim("premise", "checked", [distinctCheck]);
  const sup = R.linkRecord({ link_kind: "supports", from_identity: premise.identity, to_identity: baseClaim.identity, support_group: "g", source_id: "S1", contributor_id: "P1", declared_grade: "checked" });
  const store = mkStore({ earnedByIdentity: new Map([[premise.identity, { earned: "supported", inForce: true }]]), kindOf: new Map([[premise.identity, "measurement"]]) });
  const withSupport = certOf({ hash: "H-BASE", entries: [baseClaim], links: [sup] }, store);
  ok(withSupport !== baseHash, "[3] adding a support (a new binding and earned grade) changes the certificate hash");
}

// --- [4] perturb a checking record: a different checking record in play changes the seal ---
{
  const perturbed = certOf({ hash: "H-BASE", entries: [claim("m1", "checked", [distinctCheck, otherCheck])], links: [] }, mkStore());
  ok(perturbed !== baseHash, "[4] changing the checking records in play changes the certificate hash");
}

// --- [5] perturb the state: the store state verified against changes the seal ---
{
  const perturbed = certOf(baseContribution, mkStore({ stateHash: "ST1" }));
  ok(perturbed !== baseHash, "[5] changing the store state verified against changes the certificate hash");
}

// --- [6] perturb the ruleset: the ruleset version under which it was decided changes the seal ---
{
  const perturbed = certOf(baseContribution, baseStore, { rulesetVersion: "v3-alt" });
  ok(perturbed !== baseHash, "[6] changing the ruleset version changes the certificate hash");
}

// --- [7] verifyDecision reproduces the certificate; a tampered seal is a named divergence ---
{
  const receipt = decide(baseContribution, baseStore, {});
  const clean = verifyDecision(receipt, baseContribution, baseStore, {});
  ok(clean.result === "match", "[7] verifyDecision reproduces the certificate hash on an honest receipt");
  const tampered = { ...receipt, certificate_hash: "0".repeat(64) };
  const caught = verifyDecision(tampered, baseContribution, baseStore, {});
  ok(caught.result === "mismatch" && caught.first_divergent_field === "certificate_hash",
    `[7] a tampered certificate hash is caught and named (got ${caught.result}/${caught.first_divergent_field})`);
  // restore is implicit: the tampered object is local; the honest receipt is unchanged.
  ok(verifyDecision(receipt, baseContribution, baseStore, {}).result === "match", "[7] the honest receipt still verifies after the tamper test");
}

// --- [8] expiry is mark-stale by comparison, never an eager re-ground ---
{
  // the same certified claim decided against an advanced state seals differently, so a held
  // certificate that no longer reproduces against the new state is detectably stale by one comparison.
  const atST0 = certOf(baseContribution, mkStore({ stateHash: "ST0" }));
  const atST1 = certOf(baseContribution, mkStore({ stateHash: "ST1" }));
  ok(atST0 !== atST1, "[8] a certificate is state-bound, so an advanced state makes the held hash fail to reproduce (mark-stale by comparison)");
  ok(atST0 === baseHash, "[8] and it is stable against the state it was sealed at (no eager re-ground needed to detect staleness, only a compare)");
}

// --- [9] static: the sealed bundle includes exactly the certifying fields, no volatile ones ---
{
  const gateSrc = readFileSync(join(ROOT, "kernel/gate/gate.mjs"), "utf8");
  const m = gateSrc.match(/certificate_hash\s*=\s*hashOf\(\{([\s\S]*?)\}\);/);
  ok(!!m, "[9] the certificate bundle literal is present in gate.mjs");
  const bundle = m ? m[1] : "";
  for (const f of ["ruleset_version", "schema_version", "store_state", "contribution_hash", "grade_table", "binding_table", "checking_records"])
    ok(bundle.includes(f), `[9] the sealed bundle includes the certifying field ${f}`);
  for (const f of ["findings", "decision", "decision_basis", "restatement_closures", "withdrawn_matches", "corroboration_findings", "contradiction_records"])
    ok(!new RegExp("\\b" + f + "\\b").test(bundle), `[9] the sealed bundle excludes the volatile field ${f}`);
}

// --- [10] static: grounding is untouched; the seal is computed downstream, never read into grounding ---
{
  const grounding = readFileSync(join(ROOT, "kernel/grounding/earned-grade.mjs"), "utf8");
  ok(!/certificate/i.test(grounding), "[10] grounding (earned-grade.mjs) never mentions the certificate: the seal is downstream of grounding, never an input to it");
  const gateSrc = readFileSync(join(ROOT, "kernel/gate/gate.mjs"), "utf8");
  ok(gateSrc.indexOf("const gradeTable") < gateSrc.indexOf("certificate_hash = hashOf"),
    "[10] the certificate is computed after the grade table is built, so it reads the grounding result and never feeds it");
}

console.log("\n" + H);
if (fails.length) {
  console.error(`check-certificate: ${fails.length} FAILURE(S):`);
  for (const f of fails) console.error("  - " + f);
  process.exit(1);
}
console.log("verified: the certificate hash is a function of the sealed bundle, changing if and only if a bundled part changes and reproducing for an identical assembly. Grounding is untouched, and expiry is mark-stale by comparison, never an eager re-ground.");
console.log("check-certificate: OK");
console.log(H);
process.exit(0);
