// Role: vendor the lineage case (the critique's fourth exhibit) into one JSON reading the presentation
//   shell renders in a file:// page, with no live kernel in the browser. Built through the shared lineage
//   builder, the same one the oracle verifies, and written to vendor/lineage/reading.json: the novelty
//   conjecture and its earned grade, the five independent near-miss gaps that ground it, the institutions
//   where the mechanisms already run by hand, and the demotions the gate priced, which are the finding.
// Contract: `node build/vendor-lineage.mjs` writes the reading. No arguments. Deterministic.
// Invariant: the shell renders this reading and computes nothing; every grade here is the kernel's own
//   derivation at build time. Lighter than the domain cases on purpose: it is an argument about the
//   architecture, not a fourth domain walk. A demotion is reported, never erased.
"use strict";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { collapsedRank } from "../kernel/schema/confidence.mjs";
import { buildLineage } from "./lineage-build.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const C = buildLineage();
const id = (ref) => C.refId.get(ref);
const key = (stmt) => String(stmt).replace(/^lineage:\s*/, "").trim();
const specOf = (ref) => (C.claims.find((c) => c.spec.ref === ref) || {}).spec;
const earned = (ref) => (C.view.earnedByIdentity.get(id(ref)) || { earned: "ungraded" }).earned;
const srcOf = (ref) => { const s = specOf(ref); return s ? (C.tables.sourceTable.byId.get(s.source_id) || {}).description || "" : ""; };
const short = (s, n) => { s = String(s); return s.length > n ? s.slice(0, n - 1) + "…" : s; };
const row = (ref) => ({ statement: short(key(specOf(ref).statement), 240), grade: earned(ref), source: short(srcOf(ref), 140) });

// the settled grades collapse to one rank for the demotion comparison, as the oracle reads them.
const gradeRank = (g) => collapsedRank(g === "checked" || g === "independently-rechecked" || g === "constitutive" ? "settled" : g);

// the load-bearing conjecture and the five near-miss gaps that ground it, each in its own group.
const conjecture = { ...row("conj.novelty"), closing: specOf("conj.novelty").closing_condition.target };
const grounding = [
  { system: "Lean / mathlib", ...row("map.lean-gap") },
  { system: "nanopublications", ...row("map.nanopub-gap") },
  { system: "Ceramic", ...row("map.ceramic-gap") },
  { system: "Augur", ...row("map.augur-gap") },
  { system: "Kialo", ...row("map.kialo-gap") },
];

// the institutions where the kernel's mechanisms already run, informally and by hand.
const institutions = [
  { domain: "Common law", note: "grounding by dependency, its citator as the linter", claims: ["cl.precedent", "cl.citator-linter", "cl.shadow-precedent"].map(row) },
  { domain: "Software dependency graphs", note: "the CI gate, the weakest-support rule, contamination on a bad floor", claims: ["sw.ci-gate", "sw.weakest-support", "sw.contamination"].map(row) },
  { domain: "Science", note: "convergence across independent lines, and the one replicated measurement", claims: ["sci.convergence", "sci.retraction-unack"].map(row) },
  { domain: "Wikipedia", note: "verifiability as a floor, the fork as the exit", claims: ["wiki.verifiability", "wiki.fork-exit"].map(row) },
  { domain: "Journalism and accounting", note: "two-source rule, verify-don't-trust, typed floors", claims: ["jour.two-source", "acct.verify-dont-trust", "acct.typed-floors"].map(row) },
];

// the finding: every claim the gate priced below what it declared, which parallels are load-bearing.
const demotions = C.claims
  .map((c) => ({ ref: c.spec.ref, declared: c.spec.declared_grade, earned: (C.view.earnedByIdentity.get(c.rec.identity) || { earned: "ungraded" }).earned, statement: short(key(c.rec.statement), 160) }))
  .filter((d) => d.declared && gradeRank(d.earned) < gradeRank(d.declared))
  .map((d) => ({ statement: d.statement, declared: d.declared, earned: d.earned }));

const reading = {
  generated_by: "build/vendor-lineage.mjs",
  lede: "The fourth exhibit is an argument about the architecture, not a fourth domain. The kernel's mechanisms already run, informally and by hand, in mature institutions; the novelty is the composition. The conjecture is that no known system composes all five axes for empirical and contested knowledge.",
  axes: ["typed floors", "mechanical grounding", "untyped-type federation", "forkable exit", "a community-set fixed-free line"],
  conjecture,
  grounding,
  institutions,
  demotions,
};

mkdirSync(join(ROOT, "vendor/lineage"), { recursive: true });
const out = JSON.stringify(reading, null, 2) + "\n";
writeFileSync(join(ROOT, "vendor/lineage/reading.json"), out);
console.log(`wrote vendor/lineage/reading.json (${out.length} bytes): conjecture ${conjecture.grade}, ${grounding.length} near-miss gaps, ${institutions.length} institutions, ${demotions.length} demotions`);
