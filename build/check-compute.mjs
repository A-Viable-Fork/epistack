// Role: the oracle for the transformation store (COMPUTE-1). Verifies the entry shape: every entry
//   carries a non-empty assumptions manifest and a reversibility mark, and every statistics entry
//   emits value-or-flag and consumes values, never a kernel. Runs the covid acceptance test: the
//   Rootclaim aggregation multiplied a factor for choosing the suboptimal RRAR insertion site by a
//   factor for adding the proline, factors the debate itself questioned as possibly one
//   furin-cleavage-site strategy rather than two independent weirdnesses (the suboptimal-PRRAR thread
//   in corpora/covid/covid-depth.js). Feeds both stats entries the same two factors and asserts they
//   disagree: naive-multiply compounds them, dependence-aware refuses. Confirms the no-standing rule
//   holds mechanically on real covid-derived data: no statistics output carries a grade, none returns
//   a kernel.
// Contract: `node build/check-compute.mjs` exits non-zero on any failure, naming it.
// Invariant: additive. Touches no existing kernel operation and no existing corpus; imports
//   kernel/composition/algebra.mjs and corpora/covid/* read-only, through buildCovid(), the same
//   shared builder build/check-covid.mjs uses.
"use strict";
import { createRequire } from "node:module";
import { makeRegister } from "../kernel/compute/transforms.mjs";
import { registerCanonicalPacks } from "../kernel/compute/canonical-packs.mjs";
import { buildCovid } from "./covid-build.mjs";

const require = createRequire(import.meta.url);
const { registerStatsPack } = require("../corpora/compute/stats-pack.js");

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-COMPUTE (COMPUTE-1): the transformation store and the covid acceptance test"); console.log(H);

const registry = makeRegister();
registerCanonicalPacks(registry);
registerStatsPack(registry);

// =====================================================================================
console.log("\n[1] the shape: every entry carries a manifest and a reversibility mark; every statistics entry is value-or-flag over values");
const all = registry.list();
ok(all.length > 0, `the register carries entries (${all.length})`);
for (const e of all) {
  ok(Array.isArray(e.assumptions) && e.assumptions.length > 0, `${e.id}: carries a non-empty assumptions manifest (${e.assumptions.length} assumption${e.assumptions.length === 1 ? "" : "s"})`);
  ok(e.assumptions.every((a) => a.id && a.statement), `${e.id}: every assumption has an id and a statement`);
  ok(e.reversibility === "invertible" || e.reversibility === "lossy", `${e.id}: reversibility is marked (${e.reversibility})`);
}
const statsEntries = registry.list("statistics");
ok(statsEntries.length === 2, `the statistics pack carries 2 entries (found ${statsEntries.length})`);
for (const e of statsEntries) {
  ok(e.emits === "value" || e.emits === "flag", `${e.id}: emits value or flag (got ${e.emits})`);
  ok(e.consumes === "values", `${e.id}: consumes values (got ${e.consumes})`);
}
const graphAlgebraEntries = registry.list("graph").concat(registry.list("algebra"));
ok(graphAlgebraEntries.length === 4, `the canonical packs carry 4 entries (found ${graphAlgebraEntries.length})`);

// =====================================================================================
console.log("\n[2] the covid acceptance test: the RRAR-site and proline factors, fed to both stats entries");
const covid = buildCovid();
const specByRef = new Map(covid.claims.map((c) => [c.spec.ref, c.spec]));
const groundingRefs = ["fcs.will.suboptimal", "fcs.zo.prrarunopt", "fcs.ll.mimic"];
for (const ref of groundingRefs) {
  ok(specByRef.has(ref), `${ref}: the suboptimal-PRRAR grounding node exists in the covid corpus`);
}
if (groundingRefs.every((r) => specByRef.has(r))) {
  console.log("      grounding, read from the covid corpus itself:");
  for (const ref of groundingRefs) console.log(`        ${ref}: ${specByRef.get(ref).statement}`);
}

// the two sub-factors Rootclaim's own engineering argument compounds: choosing the suboptimal RRAR
// site, and adding the proline. Illustrative multipliers standing in for the shape of the argument
// (the corpus documents the debate's own questioning of their independence in qualitative terms, at
// the refs above, not a single separable numeric pair for this exact split); the mechanical point
// under test is the disagreement the two stats entries produce over the identical two factors, not
// the forensic precision of these two specific numbers.
const RRAR_SITE_FACTOR = 3;
const PROLINE_FACTOR = 3;
console.log(`      factors: RRAR-site-choice = ${RRAR_SITE_FACTOR}, proline-addition = ${PROLINE_FACTOR} (illustrative multipliers standing in for Rootclaim's compounded engineering argument)`);

const naive = registry.run("statistics.naive-multiply", [RRAR_SITE_FACTOR, PROLINE_FACTOR]);
const dependent = registry.run("statistics.dependence-aware", [
  { factor: RRAR_SITE_FACTOR, mechanism: "fcs-strategy" },
  { factor: PROLINE_FACTOR, mechanism: "fcs-strategy" },
]);

console.log("\n      side by side, the covid lesson as a mechanical disagreement:");
console.log(`        naive-multiply       (assumes independence): ${JSON.stringify(naive)}`);
console.log(`        dependence-aware  (refuses undeclared independence): ${JSON.stringify(dependent)}`);

ok(typeof naive.value === "number" && naive.value === RRAR_SITE_FACTOR * PROLINE_FACTOR, `naive-multiply compounds the two factors into a product (${naive.value})`);
ok(dependent.refused === true && typeof dependent.value === "undefined", `dependence-aware refuses to compound the two factors, sharing the "fcs-strategy" mechanism (reason: ${dependent.reason})`);
ok(naive.value !== undefined && dependent.value === undefined, "the two results disagree: one is a compounded product, one is a refusal");
ok(Array.isArray(naive.manifest) && naive.manifest.some((a) => a.id === "independence"), "naive-multiply's result carries its own manifest (independence)");
ok(Array.isArray(dependent.manifest) && dependent.manifest.some((a) => a.id === "declared-dependence"), "dependence-aware's result carries its own manifest (declared-dependence)");
const naiveEntry = registry.get("statistics.naive-multiply");
ok(naiveEntry.reversibility === "lossy", "statistics.naive-multiply is marked lossy");
ok(naiveEntry.assumptions.some((a) => a.id === "independence"), "statistics.naive-multiply declares the independence assumption");
ok(!Object.prototype.hasOwnProperty.call(dependent, "value"), "dependence-aware did not emit the product (refused instead)");

// =====================================================================================
console.log("\n[3] the no-standing rule holds mechanically on real covid-derived data");
const gradeFields = ["grade", "declared_grade", "earned"];
ok(gradeFields.every((f) => !Object.prototype.hasOwnProperty.call(naive, f)), "naive-multiply's output carries no grade field");
ok(gradeFields.every((f) => !Object.prototype.hasOwnProperty.call(dependent, f)), "dependence-aware's output carries no grade field");
for (const e of statsEntries) {
  ok(e.emits !== "kernel", `${e.id}: never emits a kernel`);
}

// =====================================================================================
console.log("\n[optional] the codon-factor divergence: three readers, three values, on one sub-question (printed, not gated)");
// the real corpus-cited Bayes factors for the CGG-CGG codon anomaly: Stansifer's own number (w.eric.
// codon, "1x neutral"), Weissman's reconstruction (w.weissman.cgg, "7x LL"), and Rootclaim's own
// figure Stansifer explicitly rejects (fcs.rootclaim.codon, "10.68x LL").
const codonFactors = [
  { reader: "Stansifer", ref: "w.eric.codon", factor: 1 },
  { reader: "Weissman", ref: "w.weissman.cgg", factor: 7 },
  { reader: "Rootclaim", ref: "fcs.rootclaim.codon", factor: 10.68 },
];
for (const { reader, ref, factor } of codonFactors) {
  const present = specByRef.has(ref);
  const naiveOne = registry.run("statistics.naive-multiply", [factor]);
  console.log(`        ${reader} (${ref}${present ? "" : ", MISSING FROM CORPUS"}): factor ${factor}x -> naive-multiply(${factor}) = ${naiveOne.value}`);
}

console.log("\n" + H);
if (fails) { console.log(`check-compute: ${fails} FAILURE(S)`); process.exit(1); }
console.log("verified: the transformation shape holds (manifest and reversibility required, statistics never returns a kernel or a grade), and the covid acceptance test shows naive-multiply and dependence-aware disagreeing on the debate's own RRAR-site-and-proline factors.");
console.log("check-compute: OK"); console.log(H);
