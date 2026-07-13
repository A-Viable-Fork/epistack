// Role: the embed guard for the math kernel (sixth exhibit, stage four). Makes the GROUNDED
//   code-to-kernel pointers mechanical: it reads the kernel code files as text and, for every
//   pointer, verifies the referenced claim resolves in the store, the pointer's stated tier matches
//   the tier the gate grades that claim at, the cited oracle exists and covers the claim, and the
//   described code operation is unchanged since it was grounded (a content hash). It is the drift
//   guard in two directions: a renamed or removed claim breaks the pointer, a changed operation
//   breaks the hash. It never imports the graded operations into its check path; it reads them as
//   text, so the differential independence the grounding rests on is untouched.
// Contract: `node build/check-math-embed.mjs` exits non-zero on any failure, naming the offender.
//   Reads corpora/math/{math-data,embed-manifest}.js and the kernel code files named in the manifest.
// Invariant: the oracles establish correspondence (that the math describes the code), the hash pins
//   freshness (that the code is unchanged since that establishment). A stale hash names the operation
//   whose grounding went stale; it is reported, never silently re-derived.
"use strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { sha256Hex } from "../kernel/schema/sha256.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const { STORE } = require(join(ROOT, "corpora/math/math-data.js"));
const { EMBED } = require(join(ROOT, "corpora/math/embed-manifest.js"));

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-MATH-EMBED (sixth exhibit): the embed guard, code-to-kernel pointers made mechanical"); console.log(H);

// param-aware function extractor: skip the parameter list (which may destructure with braces), then
// brace-match the body. This is the extractor the stored hashes were produced with; using the same
// one is what makes the recomputed hash comparable to the stored hash.
function extractFn(text, name) {
  const re = new RegExp("(?:export\\s+)?function\\s+" + name + "\\s*\\(");
  const m = re.exec(text);
  if (!m) return null;
  let pd = 0, k = text.indexOf("(", m.index);
  for (; k < text.length; k++) { if (text[k] === "(") pd++; else if (text[k] === ")") { pd--; if (pd === 0) { k++; break; } } }
  let depth = 0, j = text.indexOf("{", k);
  for (; j < text.length; j++) { if (text[j] === "{") depth++; else if (text[j] === "}") { depth--; if (depth === 0) { j++; break; } } }
  return text.slice(m.index, j);
}

// the store's claim refs, and resolution for exact refs and `thm.<prefix>-*` wildcard families.
const claimRefs = new Set(STORE.claims.map((c) => c.ref));
const claimByRef = new Map(STORE.claims.map((c) => [c.ref, c]));
const expand = (ref) => ref.endsWith("-*")
  ? [...claimRefs].filter((r) => r.startsWith(ref.slice(0, -1)))
  : (claimRefs.has(ref) ? [ref] : []);
const resolves = (ref) => expand(ref).length > 0;

// each oracle checker_id maps to the build file that is that oracle.
const ORACLE_FILE = {
  "oracle:check-math-exhaustion": "build/check-math-exhaustion.mjs",
  "oracle:check-math-differential": "build/check-math-differential.mjs",
  "oracle:check-certificate": "build/check-certificate.mjs",
};

// read each code file once.
const fileText = new Map();
for (const rel of EMBED.codeFiles) fileText.set(rel, existsSync(join(ROOT, rel)) ? readFileSync(join(ROOT, rel), "utf8") : null);
const textOf = (rel) => fileText.has(rel) ? fileText.get(rel) : (fileText.set(rel, readFileSync(join(ROOT, rel), "utf8")), fileText.get(rel));

// the gate's own grades, so tier claims are checked against the gate, not asserted by the manifest.
let built = null;
try { built = (await import("./math-build.mjs")).buildKernel(); }
catch (e) { ok(false, `the kernel builds so the gate's grades are available: ${e.message}`); }
const gradeByIdentity = built ? new Map(built.receipt.grade_table.map((g) => [g.identity, g])) : new Map();
const gradeOfRef = (ref) => { const g = gradeByIdentity.get(built && built.refId.get(ref)); return g ? g.earned_grade : null; };

// ---- [1] every GROUNDED pointer in the code resolves (the forward drift guard) ----
console.log("\n[1] every GROUNDED pointer in the code files resolves to a claim in the store");
const POINTER_RE = /thm\.[a-z0-9-]+\*?/g;
const found = new Map(); // ref -> [files]
for (const rel of EMBED.codeFiles) {
  const text = textOf(rel);
  if (text == null) { ok(false, `${rel}: code file is missing`); continue; }
  // pointers occur only in GROUNDED comments in these files, so the store-ref tokens are the pointers.
  const refs = new Set((text.match(POINTER_RE) || []));
  for (const ref of refs) {
    found.set(ref, [...(found.get(ref) || []), rel]);
    ok(resolves(ref), `${rel}: pointer ${ref} resolves${ref.endsWith("*") ? ` (${expand(ref).length} claims)` : ""}`);
  }
}
ok(found.size > 0, `pointers were found to check (${found.size} distinct)`);

// ---- [2] the described operations: tier matches, oracle covers, hash is fresh ----
console.log("\n[2] each described operation grounds at its stated tier, oracle, and stored hash");
for (const opRec of EMBED.operations) {
  const { op, file, fn, claims, tier, oracle, hash } = opRec;
  const refs = claims.flatMap(expand);
  // the pointer resolves: every named claim (wildcard-expanded) exists.
  ok(refs.length > 0 && claims.every((c) => resolves(c)), `${op}: its grounding claims resolve (${claims.join(", ")})`);
  // the tier matches: the gate grades each named claim at the stated tier.
  const tierBad = refs.filter((r) => gradeOfRef(r) !== tier);
  ok(built && tierBad.length === 0, `${op}: the gate grades each claim at ${tier}${tierBad.length ? ` (off: ${tierBad.map((r) => `${r}=${gradeOfRef(r)}`).join(", ")})` : ""}`);
  // the oracle exists and covers: the oracle file is present and each claim cites that oracle.
  const oracleFile = ORACLE_FILE[oracle];
  ok(!!oracleFile && existsSync(join(ROOT, oracleFile)), `${op}: its oracle ${oracle} exists (${oracleFile || "unmapped"})`);
  const uncovered = refs.filter((r) => !((claimByRef.get(r).checking_records || []).some((cr) => cr.checker_id === oracle)));
  ok(uncovered.length === 0, `${op}: the oracle covers each claim${uncovered.length ? ` (uncovered: ${uncovered.join(", ")})` : ""}`);
  // the hash is fresh: the operation's current source hashes to the stored hash.
  const text = textOf(file);
  const src = text == null ? null : extractFn(text, fn);
  const cur = src == null ? null : sha256Hex(src);
  ok(cur === hash, `${op}: content hash matches, so ${file}:${fn} is unchanged since grounding${cur && cur !== hash ? ` (stored ${hash.slice(0, 12)}, now ${cur.slice(0, 12)})` : ""}`);
}

// ---- [3] the reverse direction (skipped, noted) ----
console.log("\n[3] reverse-direction completeness");
// The load-bearing guard is the forward direction above: every pointer resolves and every described
// operation's hash is fresh. The reverse (every claim about a code operation is pointed to from its
// file) is skipped here: several claims describe a property of the whole resolution rather than one
// named function (thm.contamination-monotone, thm.mode-incomparable-welldefined) and would need a
// hand-maintained claim-to-region map to check, which is more than the small addition the prompt
// scopes it as. The forward guard already catches the drift that matters: a pointer going stale.
console.log("      skipped by design (see the module note); the forward guard is the load-bearing one");

console.log("\n" + H);
if (fails === 0) console.log("verified: every GROUNDED pointer resolves at its stated tier and oracle, and every described operation's content hash is fresh. The oracles establish correspondence; the hash pins freshness. No code file was imported into the check path.");
console.log(fails === 0 ? "check-math-embed: OK" : `check-math-embed: ${fails} FAILURE(S)`);
console.log(H);
process.exit(fails === 0 ? 0 : 1);
