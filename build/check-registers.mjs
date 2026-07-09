// Role: the register drift oracle (register view, phase E). Verifies the structural properties the
//   register-view design names, holding the two registers together so neither silently drifts: every
//   precise section has an accessible counterpart and vice versa, every accessible section carries its
//   source links and its register link and an explicit delta (null or text), every node link resolves
//   to a real node through the read contract under both registers, and every precise_version hash
//   matches its current precise section.
// Contract: `node build/check-registers.mjs`. Exits 0 if the structure holds, 1 with a named report.
//   Reads docs/what-stands-without-trust.md (the precise register), corpora/registers/judges-accessible.js
//   (the accessible register), and vendor/gate/snapshot.json through the real provider/contract.
// Invariant: this verifies STRUCTURE, not FIDELITY. It cannot confirm an accessible reading is true or
//   its delta complete; that stays an authored obligation, listed per section in the `verify` field,
//   which this check surfaces and does NOT discharge. A passed check is scaffolding, not fidelity.
"use strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { createLocalProvider } from "../api/providers/local-provider.mjs";
import { createClientApi } from "../api/client-api.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const H = "=".repeat(80);
const fails = [];
const fail = (m) => fails.push(m);

// ---- the precise register: split the judges doc exactly as the prose module and phase B do ----
let md = readFileSync(join(ROOT, "docs/what-stands-without-trust.md"), "utf8");
md = md.replace(/^\s*---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
const preciseParts = md.split(/\n(?=##\s)/).map((p) => p.trim());
const preciseHashes = preciseParts.map((p) => createHash("sha256").update(p).digest("hex").slice(0, 16));

// ---- the accessible register ----
const { judgesAccessible } = require(join(ROOT, "corpora/registers/judges-accessible.js"));

// ---- the read contract over the frozen snapshot ----
const snap = JSON.parse(readFileSync(join(ROOT, "vendor/gate/snapshot.json"), "utf8"));
const api = createClientApi(createLocalProvider(snap));
function resolves(nodeKey) {
  if (api.read({ identity: nodeKey }).length) return true;
  return api.read({ contains: nodeKey }).length > 0;
}

console.log(H);
console.log("CHECK-REGISTERS (register view): the two registers are held together by structure");
console.log(H);

// [1] section counterpart both ways
console.log("\n[1] every precise section has an accessible counterpart, and the reverse");
if (judgesAccessible.length !== preciseParts.length) {
  fail(`section count mismatch: ${judgesAccessible.length} accessible vs ${preciseParts.length} precise`);
} else {
  console.log(`      ${preciseParts.length} precise sections, ${judgesAccessible.length} accessible, one to one by order`);
}

// [2] source links and register link present
console.log("\n[2] every accessible section carries its source links and its register link");
let linkOk = 0;
for (const s of judgesAccessible) {
  if (!("source_links" in s) || !Array.isArray(s.source_links)) fail(`${s.section_id}: missing source_links array`);
  if (!s.register_link) fail(`${s.section_id}: missing register_link to the precise counterpart`);
  else linkOk++;
}
if (!fails.length) console.log(`      ${linkOk} sections carry a register link and a source-links array`);

// [3] delta explicit (null or string), never omitted
console.log("\n[3] every accessible section carries an explicit delta (null distinguishes deferring nothing)");
let deltaOk = 0;
for (const s of judgesAccessible) {
  if (!("delta" in s)) fail(`${s.section_id}: delta omitted (must be null or text, not absent)`);
  else if (s.delta !== null && typeof s.delta !== "string") fail(`${s.section_id}: delta must be null or a string`);
  else deltaOk++;
}
if (deltaOk === judgesAccessible.length) console.log(`      ${deltaOk} sections set delta explicitly`);

// [4] every node link resolves to a real node under both registers
console.log("\n[4] every case-attached node link resolves to a real node through the read contract");
let nodeOk = 0, nodeCount = 0;
for (const s of judgesAccessible) {
  for (const nl of (s.node_links || [])) {
    nodeCount++;
    if (!nl.node_key || !nl.phrase) fail(`${s.section_id}: a node_link missing phrase or node_key`);
    else if (!resolves(nl.node_key)) fail(`${s.section_id}: node_link "${nl.node_key}" resolves to no live node`);
    else nodeOk++;
  }
}
console.log(`      ${nodeOk}/${nodeCount} node links resolve live; the shell renders them under both registers`);

// [5] precise_version hash matches the current precise section
console.log("\n[5] every precise_version hash matches its current precise section (staleness guard)");
let hashOk = 0;
judgesAccessible.forEach((s, i) => {
  if (s.precise_version !== preciseHashes[i]) fail(`${s.section_id}: precise_version ${s.precise_version} != current ${preciseHashes[i]} (accessible register is stale against an edited precise section)`);
  else hashOk++;
});
if (hashOk === judgesAccessible.length) console.log(`      ${hashOk} sections match their precise source hash`);

// ---- the honesty clause: what this check does NOT verify ----
const verifyCount = judgesAccessible.reduce((n, s) => n + ((s.verify && s.verify.length) || 0), 0);
console.log("\n" + H);
console.log("What this check verifies, and what it does not:");
console.log("  It verifies STRUCTURE: counterpart, links, delta, live grounding, and a fresh hash.");
console.log("  It does NOT verify FIDELITY: that an accessible reading is true or its delta complete.");
console.log(`  That stays an authored obligation, ${verifyCount} spans listed across the sections'`);
console.log("  `verify` fields, which this check surfaces and does not discharge.");
console.log(H);

if (fails.length) {
  console.log(`\ncheck-registers: FAIL (${fails.length})`);
  for (const m of fails) console.log("  - " + m);
  process.exit(1);
}
console.log(`\ncheck-registers: OK (${judgesAccessible.length} sections, structure holds; ${verifyCount} authored-fidelity obligations remain, by design)`);
