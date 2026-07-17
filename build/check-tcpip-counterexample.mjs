// Role: the TCP/IP counterexample exhibit oracle. Builds the three internet-era kernels (build/
//   tcpip-eras.mjs), runs the register-driven conformance checker over each against the real contract
//   register, and verifies the derivation: the eras hold the composition invariants (protocols are
//   types, a shared RFC is a shared type-bundle) and violate the control invariants (standing granted,
//   not recomputed); the violation profile is constant across Acts 1 and 2 while the outcome inverts;
//   Act 3's rebase-shaped patches (CT, a signed ROA) recompute and conform while the authority grants do
//   not. The disanalogy governs: the kernels model trust DECISIONS, never content. Packets carry no
//   semantics; a claim is an acceptance, a structural trust assertion.
// Contract: `node build/check-tcpip-counterexample.mjs` exits non-zero only on a structural failure.
//   Imports the era kernels, the conformance checker, and the lineage contracts data; reads the
//   contract register and the exhibit doc; touches no truth field.
// Invariant: every stated verdict is the computed verdict. The oracle recomputes each era's report and
//   fails if the doc's verdict tables drift, if a computed violation maps to no documented failure, or
//   if an Act 2 or Act 3 contracts row is reached by no violation.
"use strict";
import { readFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { conformanceReport, parseContractRegister } from "./check-conformance.mjs";
import { act1Kernel, act2Kernel, act3Kernel } from "./tcpip-eras.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const { CONTRACTS } = require(join(ROOT, "corpora/lineage/tcpip-contracts.js"));

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
const short = (id) => String(id).slice(0, 12);
console.log(H); console.log("CHECK-TCPIP-COUNTEREXAMPLE: each internet era as a foreign kernel, its violations mapped to the era's documented failures"); console.log(H);

const entries = parseContractRegister(readFileSync(join(ROOT, "docs/contract-register.md"), "utf8"));
const acts = [
  { name: "Act 1", key: "Act 1", K: act1Kernel() },
  { name: "Act 2", key: "Act 2", K: act2Kernel() },
  { name: "Act 3", key: "Act 3", K: act3Kernel() },
];
for (const a of acts) a.report = conformanceReport(a.K, entries);

// the per-invariant verdict map for an era (only the mechanically-determined invariants carry a verdict).
const verdictMap = (report) => Object.fromEntries(report.invariants.map((i) => [i.invariant, i.verdict]));
// the set of era claims (by key) appearing in any violation's evidence, with which invariants each violated.
function violations(a) {
  const byShort = new Map(a.K.mapping.map((m) => [short(m.identity), m]));
  const out = new Map();
  for (const inv of a.report.invariants) {
    if (inv.verdict !== "violates") continue;
    for (const e of inv.evidence) {
      const m = byShort.get(e.claim);
      if (!m) continue;
      if (!out.has(m.key)) out.set(m.key, { key: m.key, net_refs: m.net_refs, invariants: [] });
      out.get(m.key).invariants.push(inv.invariant);
    }
  }
  return [...out.values()];
}
// the contracts rows a set of net.* refs reaches.
const rowsFor = (netRefs) => CONTRACTS.filter((r) => r.claim_refs.some((ref) => netRefs.includes(ref)));
// which claim (by key) conforms vs violates on a named invariant, for the per-element Act 3 check.
function elementVerdict(a, key, invariant) {
  const m = a.K.mapping.find((x) => x.key === key);
  const inv = a.report.invariants.find((i) => i.invariant === invariant);
  const viol = new Set(inv.evidence.map((e) => e.claim));
  return viol.has(short(m.identity)) ? "violates" : "conforms";
}

// ---- print the three reports (the exhibit output) ------------------------------------------------
for (const a of acts) {
  console.log(`\n--- ${a.name}: ${a.K.store_id} ---`);
  for (const inv of a.report.invariants) {
    if (inv.verdict === "unverifiable") continue;
    console.log(`  ${inv.verdict === "violates" ? "VIOLATES" : "conforms"}  ${inv.invariant}${inv.evidence.length ? `  (${inv.evidence.length} claim(s): ${inv.evidence.map((e) => e.claim).join(", ")})` : ""}`);
  }
  const unver = a.report.invariants.filter((i) => i.verdict === "unverifiable").map((i) => i.invariant);
  console.log(`  unverifiable (analysis in prose, no predicate): ${unver.join(", ")}`);
}

// ---- [1] the composition invariants hold; the control invariants are violated -------------------
console.log("\n[1] the eras hold the composition invariants and violate the control invariants");
for (const a of acts) {
  const v = verdictMap(a.report);
  ok(v["CR-typed"] === "conforms", `${a.name}: conforms CR-typed (protocols are types, both ends implement the same RFC)`);
  ok(v["CR-recomputable"] === "violates" && v["CR-monotone"] === "violates", `${a.name}: violates CR-recomputable and CR-monotone (standing granted, not recomputed)`);
}
// Act 1 and Act 3 confer standing only on native, well-typed acceptances, so they conform on shared-hash.
ok(verdictMap(acts[0].report)["CR-shared-hash"] === "conforms" && verdictMap(acts[0].report)["CR-untyped-floor"] === "conforms", "Act 1: conforms CR-shared-hash and CR-untyped-floor (no crossed standing in the cooperative regime)");

// ---- [2] the violation profile is constant across Acts 1 and 2, plus the border exploit ---------
console.log("\n[2] Act 2 carries Act 1's violations plus CR-untyped-floor (the adversary crosses the same unguarded border)");
const v1 = new Set(Object.entries(verdictMap(acts[0].report)).filter(([, x]) => x === "violates").map(([k]) => k));
const v2 = new Set(Object.entries(verdictMap(acts[1].report)).filter(([, x]) => x === "violates").map(([k]) => k));
ok([...v1].every((x) => v2.has(x)), `Act 2's violation set contains Act 1's (${[...v1].join(", ")})`);
ok(v2.has("CR-untyped-floor"), "Act 2 adds CR-untyped-floor: the spoof crosses in carrying standing, admitted without local typing");
ok(v2.has("CR-shared-hash"), "Act 2 adds CR-shared-hash: the crossed spoof's carried grade is accepted with no recomputation path");

// ---- [3] Act 3: the rebase-shaped patches recompute and conform; the authority grants do not -----
console.log("\n[3] Act 3's CT and signed-ROA elements conform on CR-recomputable while the authority grants violate it");
ok(elementVerdict(acts[2], "act3.ct", "CR-recomputable") === "conforms", "the Certificate Transparency log entry conforms on CR-recomputable (its inclusion recomputes from a public log)");
ok(elementVerdict(acts[2], "act3.rpki-roa", "CR-recomputable") === "conforms", "the signed Route Origin Authorization conforms on CR-recomputable (its origin recomputes against the public RPKI)");
for (const key of ["act3.mail", "act3.ca", "act3.cdn", "act3.rpki-legacy"]) {
  ok(elementVerdict(acts[2], key, "CR-recomputable") === "violates", `${key} violates CR-recomputable (a grade granted by a concentrated authority, not recomputed)`);
}

// ---- [4] every computed violation maps to a documented failure; every Act 2/3 row is reached -----
console.log("\n[4] the violation-to-failure mapping");
console.log("  era claim -> net.* refs -> contracts row (documented failure)");
const reachedByEra = { "Act 2": new Set(), "Act 3": new Set() };
for (const a of acts) {
  for (const vio of violations(a)) {
    const rows = rowsFor(vio.net_refs);
    ok(rows.length > 0, `${a.name} ${vio.key} (violates ${[...new Set(vio.invariants)].join("/")}) maps to a contracts row via ${vio.net_refs.join(", ")}`);
    for (const r of rows) {
      if (reachedByEra[r.era.startsWith("Act 2") ? "Act 2" : r.era.startsWith("Act 3") ? "Act 3" : "x"]) reachedByEra[r.era.startsWith("Act 2") ? "Act 2" : "Act 3"].add(r.trust_decision);
      const tag = r.era.startsWith("Act 1") ? "[none in regime]" : "";
      console.log(`    ${a.name} ${vio.key} -> {${vio.net_refs.join(", ")}} -> "${r.era} / ${r.trust_decision}": ${r.documented_failure.slice(0, 70)}... ${tag}`);
    }
    // Act 1 mapping preserves the none-in-regime annotation
    if (a.name === "Act 1") ok(rows.every((r) => /\bnone\b[a-z ]*\bin regime\b/i.test(r.documented_failure)), `Act 1 ${vio.key} maps to rows annotated none-in-regime (the violation was costless)`);
  }
}
// every Act 2 and Act 3 contracts row is reached by at least one computed violation
for (const era of ["Act 2", "Act 3"]) {
  const rows = CONTRACTS.filter((r) => r.era.startsWith(era));
  for (const r of rows) ok(reachedByEra[era].has(r.trust_decision), `${era} row "${r.trust_decision}" is reached by a computed violation`);
}

// ---- [5] anti-drift: the doc's verdict tables equal the computed verdicts ------------------------
console.log("\n[5] anti-drift: every verdict stated in the exhibit doc equals the computed verdict");
const doc = readFileSync(join(ROOT, "docs/the-tcpip-counterexample.md"), "utf8");
// split into sections by ## heading; a section whose heading names an act carries that act's table.
const sections = doc.split(/\n(?=##\s)/);
let parsedRows = 0;
for (const a of acts) {
  const sec = sections.find((s) => new RegExp(`^##\\s.*\\b${a.name}\\b`, "m").test(s.split("\n")[0]) || new RegExp(`^##\\s.*${a.name}`).test(s));
  ok(!!sec, `the doc has a section for ${a.name}`);
  if (!sec) continue;
  const computed = verdictMap(a.report);
  const rowRe = /^\|\s*(CR-\S+)\s*\|\s*(conforms|violates|unverifiable)\s*\|/gm;
  let m, seen = 0;
  while ((m = rowRe.exec(sec)) !== null) {
    seen++; parsedRows++;
    const [, id, stated] = m;
    ok(computed[id] === stated, `${a.name} table: ${id} stated ${stated}, computed ${computed[id]}`);
  }
  ok(seen >= 5, `${a.name} table lists at least the five mechanical invariants (found ${seen})`);
}
ok(parsedRows >= 15, `the doc's three verdict tables were parsed (${parsedRows} rows total)`);

console.log("\n" + H);
if (fails === 0) console.log("verified: the eras hold composition and violate control; the profile is constant across Acts 1 and 2 with the outcome inverted; Act 3's rebase patches recompute while its grants do not; every violation maps to a documented failure and every Act 2/3 row is reached; the doc's verdict tables match the computation.");
console.log(fails === 0 ? "check-tcpip-counterexample: OK" : `check-tcpip-counterexample: ${fails} FAILURE(S)`);
console.log(H);
process.exit(fails === 0 ? 0 : 1);
