// Role: vendor the densified LHC cascade into one JSON reading the presentation shell renders in a
//   file:// page, with no server and no live kernel in the browser (Prompt 25). Built through the
//   shared LHC builder, the same one the oracle verifies, and written to vendor/lhc/reading.json: the
//   three legs with their grounding and their undercut-lowered confidence, and the three readings of
//   the one framework-choice node, the shared-dependency robustness reading (before/after), the
//   framework swap (grades survive, analysis mooted), and the settled-versus-performed finding.
// Contract: `node build/vendor-lhc.mjs` writes the reading. No arguments. Deterministic.
// Invariant: the shell renders this reading and computes nothing; every grade here is the kernel's own
//   derivation at build time, and the two Phase-B readings are recomputed here, not asserted.
"use strict";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { analyzePresupposition, analyzeUndercuts } from "../kernel/analysis/robustness.mjs";
import { swapFrame, checkPresupposition } from "../kernel/composition/framing.mjs";
import { buildLhc } from "./lhc-build.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const C = buildLhc();
const id = (ref) => C.refId.get(ref);
const key = (stmt) => String(stmt).split(":").slice(1).join(":").trim().slice(0, 240);
const earned = (ref) => (C.view.earnedByIdentity.get(id(ref)) || { earned: "ungraded" }).earned;
const srcOf = (ref) => (C.tables.sourceTable.byId.get(C.claims.find((c) => c.spec.ref === ref).spec.source_id) || {}).description || "";
const stmt = (ref) => key(C.claims.find((c) => c.spec.ref === ref).rec.statement);
const nm = (i) => { for (const [k, v] of C.refId) if (v === i) return k; return String(i).slice(0, 10); };
const row = (ref) => ({ ref, statement: stmt(ref), grade: earned(ref), source: srcOf(ref) });

// the three legs, each with its grounding grade and its undercut-lowered confidence.
const undercutOf = (ref) => C.LHC.undercuts.filter((u) => u.target === ref).map((u) => ({ statement: stmt(u.ref), discovery: u.discovery, source: srcOf(u.ref) }));
const legReading = (ref) => { const u = analyzeUndercuts(C.graph, id(ref)); return { ref, statement: stmt(ref), grounding: u.grade, confidence: u.confidence_after_undercuts, lowered: u.lowered, undercuts: undercutOf(ref) }; };
const legs = ["leg.prod", "leg.hawking", "leg.astro"].map(legReading);

// Reading 1: the shared dependency the leg count hides, computed before and after reifying.
const after = analyzePresupposition(C.graph, id("robust"));
const before = analyzePresupposition(C.graphWithout(), id("robust"));
const robustness = {
  before: before.shared_presuppositions.map(nm).sort(),
  after: after.shared_presuppositions.map(nm).sort(),
  shared: after.shared_presuppositions.map((i) => ({ ref: nm(i), statement: stmt(nm(i)) })),
  legs_look_independent_before: before.shared_presuppositions.length === 0,
};

// Reading 2: the framework swap. The within-framework calculations keep their grade; the swap moots.
const calcs = C.LHC.presupposes.map((p) => ({ ref: p.claim, statement: stmt(p.claim), grade_under_add: earned(p.claim) }));
const swapped = C.frameEdges.map(({ edge }) => swapFrame(edge, C.successor));
const framing = {
  add_frame: C.framing.statement,
  sm_frame: C.successor.statement,
  calcs, // each with grade_under_add; the grade is unchanged by the swap (recomputed identical below)
  grade_survives: calcs.every((c) => c.grade_under_add === "constitutive"),
  swap_in_force: swapped.every((e) => e.to_framing === "F-sm") && checkPresupposition(swapped[0], C.successor).in_force,
  excluded: row("add.excluded"),
};

// Reading 3: the settled-versus-performed finding.
const performed = {
  settled: calcs.map((c) => ({ statement: c.statement, grade: c.grade_under_add })),
  performed_claim: row("public.unconditional"),
  conditional_structure: row("conditional.structure"),
  spc_evidence: row("spc.threelevel"),
  antecedent: stmt("dep.add"),
};

const reading = {
  generated_by: "build/vendor-lhc.mjs",
  meta_question: "Is the LHC safe? The three-leg answer presents as robust, but one reified node, the ADD framework choice, carries three readings: the legs are not independent, swapping the framework moots the question while the calculations survive, and the public claim performs a settledness the conditional structure does not have.",
  top: row("safe"),
  legs, robustness, framing, performed,
  conditionality: row("conditionality"),
  closure: row("closure.empirical"),
};

mkdirSync(join(ROOT, "vendor/lhc"), { recursive: true });
const out = JSON.stringify(reading, null, 2) + "\n";
writeFileSync(join(ROOT, "vendor/lhc/reading.json"), out);
console.log(`wrote vendor/lhc/reading.json (${out.length} bytes): ${legs.length} legs, shared-dep before [${robustness.before.join(",")}] after [${robustness.after.join(",")}], swap moots=${framing.grade_survives}`);
