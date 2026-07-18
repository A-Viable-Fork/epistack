// Role: the oracle for the transformation store (COMPUTE-1) and the read-only compute surface
//   (COMPUTE-2). Verifies the entry shape, runs the covid acceptance test (the Rootclaim RRAR-site
//   and proline factors; naive-multiply compounds them, dependence-aware refuses), and confirms the
//   no-standing rule holds both against the register directly and through createClientApi's
//   transforms/describeTransform/runTransform: no statistics output carries a grade, none returns a
//   kernel, no catalog entry carries a run function.
// Contract: `node build/check-compute.mjs` exits non-zero on any failure, naming it.
// Invariant: additive; touches no existing kernel operation or corpus. Assembles the shipping
//   registry (canonical packs plus the demo statistics pack) via kernel/compute/registry.mjs's
//   assembleRegistry (which wraps kernel/compute/transforms.mjs and canonical-packs.mjs), the one
//   module this oracle and api/client-api.mjs both source from.
"use strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { assembleRegistry, defaultRegistry, catalog } from "../kernel/compute/registry.mjs";
import { createClientApi } from "../api/client-api.mjs";
import { createLocalProvider } from "../api/providers/local-provider.mjs";
import { buildCovid } from "./covid-build.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const { registerStatsPack } = require("../corpora/compute/stats-pack.js");

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-COMPUTE (COMPUTE-1/COMPUTE-2): the transformation store, the covid acceptance test, and the read-only compute surface"); console.log(H);

// the shipping registry (COMPUTE-2): kernel/compute/registry.mjs assembles the canonical packs
// legally as a kernel module; this build-layer caller supplies the demo statistics pack, the one
// corpus this oracle is allowed to read directly, since build may import any layer.
const registry = assembleRegistry([registerStatsPack]);

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
console.log("\n[4] the compute surface through the client contract (COMPUTE-2)");
// a provider that overrides transforms/describeTransform/runTransform with the shipping registry
// (canonical packs plus the demo statistics pack), on top of the real gate for propose/read. This is
// exactly the "provider may override the statistics packs" seam api/client-api.mjs names: the bare
// kernel default (kernel/compute/registry.mjs's defaultRegistry()) is canonical-only, since kernel
// cannot import a corpus; a caller that can (this build-layer oracle) supplies the full registry.
const snapshot = JSON.parse(readFileSync(join(ROOT, "vendor", "gate", "snapshot.json"), "utf8"));
const computeProvider = Object.assign({}, createLocalProvider(snapshot), {
  transforms: (pack) => catalog(registry, pack),
  describeTransform: (id) => {
    const entry = registry.get(id);
    if (!entry) return null;
    const { run, ...rest } = entry;
    return rest;
  },
  runTransform: (id, input) => registry.run(id, input),
});
const api = createClientApi(computeProvider);

const apiAll = api.transforms();
ok(apiAll.length === all.length, `api.transforms() returns every registered entry (${apiAll.length})`);
ok(apiAll.every((e) => Array.isArray(e.assumptions) && e.assumptions.length > 0 && (e.reversibility === "invertible" || e.reversibility === "lossy")), "every catalog entry carries a non-empty assumptions manifest and a reversibility mark");
const apiStats = api.transforms("statistics");
ok(apiStats.length === 2, `api.transforms("statistics") filters to the statistics pack (${apiStats.length})`);
const describedNaive = api.describeTransform("statistics.naive-multiply");
ok(!!describedNaive && Array.isArray(describedNaive.assumptions) && describedNaive.assumptions.some((a) => a.id === "independence"), "api.describeTransform returns the entry's manifest");
ok(api.describeTransform("no.such.transform") === null, "api.describeTransform of an unknown id is a clear miss (null), not a throw");
ok([...apiAll, ...apiStats, describedNaive].every((e) => !Object.prototype.hasOwnProperty.call(e, "run")), "no entry from transforms() or describeTransform() carries a run function: the catalog is data");

const apiNaive = api.runTransform("statistics.naive-multiply", [RRAR_SITE_FACTOR, PROLINE_FACTOR]);
const apiDependent = api.runTransform("statistics.dependence-aware", [
  { factor: RRAR_SITE_FACTOR, mechanism: "fcs-strategy" },
  { factor: PROLINE_FACTOR, mechanism: "fcs-strategy" },
]);
ok(apiNaive.value === RRAR_SITE_FACTOR * PROLINE_FACTOR, `runTransform("statistics.naive-multiply", ...) compounds the factors through the contract (${apiNaive.value})`);
ok(apiDependent.refused === true && typeof apiDependent.value === "undefined", "runTransform(\"statistics.dependence-aware\", ...) refuses through the contract, sharing the mechanism");
ok(apiNaive.value !== undefined && apiDependent.value === undefined, "the disagreement survives the contract boundary");
ok(Array.isArray(apiNaive.manifest) && Array.isArray(apiDependent.manifest), "both contract results carry their manifest");
ok(gradeFields.every((f) => !Object.prototype.hasOwnProperty.call(apiNaive, f)) && gradeFields.every((f) => !Object.prototype.hasOwnProperty.call(apiDependent, f)), "neither contract result carries a grade field");

// read-only: the object createClientApi returns exposes no landing method for a compute result, and
// running the same transformation twice has no observable effect beyond the returned value.
ok(typeof api.propose === "function" && typeof api.read === "function" && Object.keys(api).every((k) => !/land|claim|write/i.test(k) || k === "propose"), "the contract's only landing method is propose, unrelated to runTransform");
const apiNaiveAgain = api.runTransform("statistics.naive-multiply", [RRAR_SITE_FACTOR, PROLINE_FACTOR]);
ok(JSON.stringify(apiNaiveAgain) === JSON.stringify(apiNaive) && api.transforms().length === apiAll.length, "running the same transformation twice returns the same result with no accumulation in the registry");

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
console.log("verified: the transformation shape holds (manifest and reversibility required, statistics never returns a kernel or a grade), the covid acceptance test shows naive-multiply and dependence-aware disagreeing on the debate's own RRAR-site-and-proline factors, and the same disagreement survives through the client contract's read-only compute surface (transforms, describeTransform, runTransform).");
console.log("check-compute: OK"); console.log(H);
