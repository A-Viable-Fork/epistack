// Role: the vocabulary kernel oracle (Prompt 50, the fifth exhibit). Verifies the property that keeps the
//   definitions kernel honest: every core term's cited home region actually contains the term, so a
//   definition cannot drift from the document that grounds it, the register-fidelity failure made
//   mechanical. Reference terms, grounding in an external citation, are checked for having a real source.
// Contract: `node build/check-vocabulary.mjs` exits non-zero on any failure, listing the offending terms.
//   Reads corpora/vocabulary/{vocabulary,tables}.js and the home documents under docs/. Deterministic.
// Invariant: the home-region check is string presence of the term at its cited source, the drift guard.
//   A core term whose home does not contain it fails; a reference term with no resolving source fails
//   unless it is explicitly marked ungrounded, which is reported. No leakage term may be authored.
"use strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const { VOCABULARY } = require(join(ROOT, "corpora/vocabulary/vocabulary.js"));
const { KINDS, SOURCES } = require(join(ROOT, "corpora/vocabulary/tables.js"));

const H = "=".repeat(80);
const fails = [];
const fail = (m) => fails.push(m);
console.log(H); console.log("CHECK-VOCABULARY (fifth exhibit): the submission's vocabulary as declarations grounding by adoption"); console.log(H);

const terms = VOCABULARY.terms;
const GRADES = new Set(["c", "s"]);
const CEILING = (KINDS.find((k) => k.kind === "declaration") || {}).ceiling; // constitutive
const sourceIds = new Set(SOURCES.map((s) => s.source_id));
const LEAKAGE = ["hodge decomposition", "betti number", "harmonic part", "topological holes"];
const docCache = new Map();
const docText = (p) => { if (!docCache.has(p)) docCache.set(p, existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), "utf8") : null); return docCache.get(p); };

// [1] structural well-formedness
console.log("\n[1] every entry is a well-formed declaration with a valid tier and grade");
const seenRef = new Set();
for (const e of terms) {
  if (!e.ref || seenRef.has(e.ref)) fail(`duplicate or missing ref: ${e.ref || "(none)"}`); else seenRef.add(e.ref);
  if (e.kind !== "declaration") fail(`${e.ref}: kind must be declaration (a definition is a declaration), got ${e.kind}`);
  if (e.tier !== "core" && e.tier !== "reference") fail(`${e.ref}: tier must be core or reference, got ${e.tier}`);
  if (!GRADES.has(e.declared_grade)) fail(`${e.ref}: declared_grade must be c or s, got ${e.declared_grade}`);
  if (!e.statement || !e.term) fail(`${e.ref}: missing term or statement`);
  if (/—/.test(e.statement || "")) fail(`${e.ref}: em dash in statement`);
}
if (!fails.length) console.log(`      ${terms.length} entries, all declarations, tiers and grades valid, declaration ceiling ${CEILING}`);

// [2] no leakage term is authored
console.log("\n[2] no leakage term became a claim");
for (const e of terms) if (LEAKAGE.includes((e.term || "").toLowerCase())) fail(`leakage term authored: ${e.term}`);
if (!fails.some((m) => m.includes("leakage"))) console.log(`      none of ${LEAKAGE.join(", ")} appears as a term`);

// [3] core terms: the home region contains the term (the drift guard)
console.log("\n[3] every core term's home region actually contains it");
let coreOk = 0, coreN = 0;
for (const e of terms.filter((x) => x.tier === "core")) {
  coreN++;
  if (!e.home) { fail(`${e.ref} (${e.term}): core term without a home region`); continue; }
  const text = docText(e.home);
  if (text == null) { fail(`${e.ref} (${e.term}): home ${e.home} does not exist`); continue; }
  // presence is hyphen/space-insensitive, so a term written "type hash" matches a source that writes "type-hash".
  const norm = (s) => s.toLowerCase().replace(/[-\s]+/g, " ");
  if (!norm(text).includes(norm(e.term))) fail(`${e.ref}: home ${e.home} does not contain the term "${e.term}" (definition drift)`);
  else coreOk++;
}
console.log(`      ${coreOk}/${coreN} core terms found in their home region`);

// [4] reference terms: a real external citation
console.log("\n[4] every reference term grounds in a real external citation");
let refOk = 0, refN = 0, ungrounded = 0;
for (const e of terms.filter((x) => x.tier === "reference")) {
  refN++;
  if (e.ungrounded) { ungrounded++; console.log(`      NOTE ${e.ref} (${e.term}): marked ungrounded, no honest external source`); continue; }
  if (!e.source_id || !sourceIds.has(e.source_id)) fail(`${e.ref} (${e.term}): reference term with no resolving source (${e.source_id || "none"})`);
  else refOk++;
}
console.log(`      ${refOk}/${refN} reference terms carry a resolving citation${ungrounded ? `, ${ungrounded} marked ungrounded` : ""}`);

// [5] overloaded terms carry one entry per sense, each with its own home
console.log("\n[5] overloaded terms carry a distinct sense and home per entry");
const byTerm = new Map();
for (const e of terms) { const k = e.term.toLowerCase(); (byTerm.get(k) || byTerm.set(k, []).get(k)).push(e); }
for (const [term, group] of byTerm) {
  if (group.length < 2) continue;
  const senses = group.map((g) => g.sense).filter(Boolean);
  if (new Set(senses).size !== group.length) fail(`overloaded "${term}": each of the ${group.length} entries must carry a distinct sense`);
  if (new Set(group.map((g) => g.home || g.source_id)).size !== group.length) fail(`overloaded "${term}": each sense must carry its own home region`);
}
const overloaded = [...byTerm.entries()].filter(([, g]) => g.length > 1).map(([t]) => t);
if (!fails.some((m) => m.includes("overloaded"))) console.log(`      overloaded terms in order: ${overloaded.join(", ")}`);

// [6] the two triage corrections that must hold in the data
console.log("\n[6] model leads with the map sense; the AI-agent sense is its own term");
const modelEntries = terms.filter((e) => e.term.toLowerCase() === "model");
if (!modelEntries.length || modelEntries[0].sense !== "representation") fail(`"model" must lead with the representation (map) sense`);
else console.log(`      model leads with the representation sense`);
if (!terms.some((e) => e.term === "LLM")) fail(`the language-model / LLM sense must be authored as its own term, not folded into model`);
else console.log(`      LLM authored as its own term (the AI system as an agent)`);

// ---- report ----
const core = terms.filter((e) => e.tier === "core").length;
const ref = terms.filter((e) => e.tier === "reference").length;
console.log("\n" + H);
if (fails.length) {
  console.error(`check-vocabulary: ${fails.length} FAILURE(S):`);
  for (const f of fails) console.error("  - " + f);
  process.exit(1);
}
console.log(`verified: ${terms.length} terms (${core} core grounding in their home region, ${ref} reference grounding in external citation); every core term's home defines it, no leakage term authored.`);
console.log("check-vocabulary: OK");
console.log(H);
