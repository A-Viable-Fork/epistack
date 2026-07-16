// Role: the self-kernel oracle. Builds S-self through the real gate and verifies epistack's claims about
//   itself ground honestly: every invariant claim's cited math theorem exists in the math kernel and
//   grounds, every cited check exists, every constitutive claim adopts a real vocabulary term, and the
//   gate's computed grade matches the register (invariant grounded to checked or floored with a ledger
//   gap, constitutive to the constitutive floor, evaluative to the forum floor). It fails on a dangling
//   citation, an overclaim (a grade the cited evidence does not support), or a definitional constitutive
//   claim with no vocabulary entry, and it keeps the entrance-surfaced door from overclaiming.
// Contract: `node build/check-self.mjs` exits non-zero on any failure, naming the offender.
// Invariant: no grade is asserted here; the gate computes them and this reads them. A floored invariant
//   is not a failure, it is the honest map, and it must carry a closing condition and a sorry-ledger line.
"use strict";
import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { hashTypeBundle } from "../kernel/schema/type-hash.mjs";
import { buildKernel } from "./self-build.mjs";
import { buildKernel as buildMath } from "./math-build.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const { STORE } = require("../corpora/self/self-data.js");
const { ADOPTED, ADOPTED_HASHES, KINDS } = require("../corpora/self/tables.js");
const { COMMON_TYPE_HASHES } = require("../corpora/_shared/common-types.js");
const { STORE: MATH_STORE } = require("../corpora/math/math-data.js");
const { VOCABULARY } = require("../corpora/vocabulary/vocabulary.js");

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-SELF: the self-kernel, epistack's grounded claims about itself"); console.log(H);

// ---- the math kernel's grades, so a cited theorem is verified to actually ground ----
const math = buildMath();
const mathGrade = new Map(math.receipt.grade_table.map((g) => [g.identity, g.earned_grade]));
const mathRefGrade = (ref) => (math.refId.has(ref) ? mathGrade.get(math.refId.get(ref)) : undefined);
const GROUNDED = new Set(["checked", "independently-rechecked", "corroborated", "constitutive"]);
const vocabRefs = new Set(VOCABULARY.terms.map((t) => t.ref));

// ---- build the self-kernel ----
console.log("\n[1] the self-kernel builds and the gate accepts it");
const built = buildKernel();
ok(built.receipt.decision === "accepted", `the contribution is accepted by the real gate (got ${built.receipt.decision})`);
const earned = new Map(built.receipt.grade_table.map((g) => [g.identity, g.earned_grade]));
const declaredOf = new Map(built.receipt.grade_table.map((g) => [g.identity, g.declared_grade]));
const gradeOf = (ref) => earned.get(built.refId.get(ref));
const specByRef = new Map(STORE.claims.map((c) => [c.ref, c]));

console.log("\n[2] every adopted kind is in the shared subtree and its pinned hash matches");
for (const name of ADOPTED) {
  const shared = COMMON_TYPE_HASHES[name];
  ok(shared !== undefined && ADOPTED_HASHES[name] === shared, `adopts common kind '${name}' at the shared hash`);
  const row = KINDS.find((k) => k.kind === name);
  ok(!!row && hashTypeBundle({ kind: row.kind, ceiling: row.ceiling, compatibility_rule_id: null, atlas_refs: [] }) === shared, `the '${name}' kind row implies the adopted hash`);
}

console.log("\n[3] invariant claims: each citation resolves, and the gate's grade matches the grounding");
const invariants = STORE.claims.filter((c) => c.register === "invariant");
for (const c of invariants) {
  // cited math theorems exist and ground in the math kernel
  for (const t of c.cites_theorems || []) {
    const g = mathRefGrade(t);
    ok(g !== undefined, `${c.ref}: cited math theorem ${t} exists in the math kernel`);
    if (g !== undefined) ok(GROUNDED.has(g), `${c.ref}: cited math theorem ${t} grounds in the math kernel (got ${g})`);
  }
  // cited checks exist as oracle files
  for (const chk of c.cites_checks || []) ok(existsSync(join(ROOT, "build", `${chk}.mjs`)), `${c.ref}: cited check build/${chk}.mjs exists`);
  // the grade: grounded (a checking record) reaches checked; ungrounded floors and needs a gap
  const g = gradeOf(c.ref);
  const grounded = (c.checking_records || []).length > 0;
  if (grounded) {
    ok(g === "checked", `${c.ref}: grounded by a check, the gate lifts it to checked (got ${g})`);
    ok((c.cites_theorems || []).length + (c.cites_checks || []).length > 0, `${c.ref}: a grounded invariant names at least one citation`);
  } else {
    // a floored invariant: no checking record, so it floors, and it must carry a closing condition
    ok(g === "asserted", `${c.ref}: ungrounded, the gate floors it to asserted (got ${g})`);
    ok(!!c.closing_condition, `${c.ref}: a floored invariant carries a closing condition`);
  }
  // no overclaim: the gate's earned grade equals the declared grade (nothing declares above what it earns)
  ok(declaredOf.get(built.refId.get(c.ref)) === g, `${c.ref}: declared grade equals earned grade, no overclaim`);
}
ok(invariants.filter((c) => (c.checking_records || []).length > 0).length === 11, `eleven invariant claims reach checked (got ${invariants.filter((c) => (c.checking_records || []).length > 0).length})`);
ok(invariants.filter((c) => !(c.checking_records || []).length).length === 1, "one invariant claim floors as a characterized gap");

console.log("\n[4] constitutive claims: each adopts a real vocabulary term and grounds at the constitutive floor");
const constitutive = STORE.claims.filter((c) => c.register === "constitutive");
for (const c of constitutive) {
  // the stop-and-report: a definitional constitutive claim with no vocabulary entry fails
  ok((c.cites_vocab || []).length > 0, `${c.ref}: a definitional constitutive claim names a vocabulary term`);
  for (const v of c.cites_vocab || []) ok(vocabRefs.has(v), `${c.ref}: adopted vocabulary term ${v} exists in the vocabulary kernel`);
  ok(gradeOf(c.ref) === "constitutive", `${c.ref}: the gate grades it at the constitutive floor (got ${gradeOf(c.ref)})`);
}

console.log("\n[5] evaluative claims sit at the forum floor and carry no check (an overclaim would lift them)");
const evaluative = STORE.claims.filter((c) => c.register === "evaluative");
for (const c of evaluative) {
  ok(!(c.checking_records || []).length && !(c.cites_checks || []).length, `${c.ref}: an evaluative thesis carries no check citation (a check would overclaim it above the floor)`);
  ok(gradeOf(c.ref) === "asserted", `${c.ref}: the gate holds it at the forum floor, contestable (got ${gradeOf(c.ref)})`);
}

console.log("\n[6] the entrance-surfaced listing does not overclaim");
const ROLES = new Set(["title", "tagline", "status", "link"]);
for (const e of STORE.entrance) {
  ok(ROLES.has(e.role), `entrance listing role '${e.role}' is valid`);
  if (e.role === "title" || e.role === "tagline") {
    const c = specByRef.get(e.claim_ref);
    ok(!!c && c.register === "entrance-stipulation" && gradeOf(e.claim_ref) === "constitutive", `entrance ${e.role} references a constitutive stipulation (${e.claim_ref})`);
  } else if (e.role === "status") {
    const c = specByRef.get(e.references);
    ok(!!c && c.register === "invariant", `entrance status references an invariant claim (${e.references})`);
    ok(!!c && gradeOf(e.references) !== "asserted" && gradeOf(e.references) !== "ungraded", `entrance status ${e.references} references a claim that grounds above the floor (got ${c ? gradeOf(e.references) : "absent"})`);
  } else if (e.role === "link") {
    ok(!!e.url && !!e.label, `entrance link carries a url and a label (${e.label})`);
  }
}

console.log("\n[7] every floored invariant has a sorry-ledger entry with its closing condition");
const ledger = readFileSync(join(ROOT, "docs/sorry-ledger.md"), "utf8");
for (const c of invariants.filter((c) => !(c.checking_records || []).length)) {
  ok(ledger.includes(c.ref), `${c.ref}: the floored invariant is recorded in docs/sorry-ledger.md`);
}

console.log("\n" + H);
if (fails === 0) {
  console.log("verified: the self-kernel grounds epistack's claims about itself through its own gate. Eleven structural");
  console.log("invariants reach checked over cited theorems and checks, one floors as a named gap, the definitions hold");
  console.log("the constitutive floor over the vocabulary kernel, and the theses sit at the forum floor, contestable.");
}
console.log(fails === 0 ? "check-self: OK" : `check-self: ${fails} FAILURE(S)`);
console.log(H);
process.exit(fails === 0 ? 0 : 1);
