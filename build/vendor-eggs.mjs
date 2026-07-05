// Role: vendor the restructured eggs case into one JSON reading the presentation shell renders in a
//   file:// page, with no server and no live kernel in the browser. It builds the case through the
//   shared builder (the same one the oracle verifies) and writes vendor/eggs/reading.json: the three
//   domains grounded to their floors, the cardiovascular contradiction, the regenerative characterized
//   gaps with their closing conditions, the two weighings at structured-forum, and the denominator in
//   both framings so the swap is exercisable. The reading is a build artifact, regenerated, never edited.
// Contract: `node build/vendor-eggs.mjs` writes the reading. No arguments. Deterministic.
// Invariant: the shell renders this reading and computes nothing; every grade here is the kernel's own
//   derivation at build time. The cardiovascular crux is marked specified-not-built, shown not resolved.
"use strict";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { characterizedGaps } from "../kernel/analysis/characterized-gaps.mjs";
import { domainProfile } from "../kernel/composition/profiles.mjs";
import { disagreements, reconcile } from "../kernel/analysis/reconciliation.mjs";
import { analyzeUndercuts } from "../kernel/analysis/robustness.mjs";
import { buildEggs } from "./eggs-build.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const E = buildEggs();
const { tables, domains, idOf, weighs } = E;
const key = (stmt) => String(stmt).split(":").slice(1).join(":").trim().slice(0, 90);
const earnedOf = (dom, id) => (dom.view.earnedByIdentity.get(id) || { earned: "ungraded" }).earned;
const specByRef = (dom, ref) => dom.claims.find((c) => c.spec.ref === ref);
const gradeRef = (dom, ref) => earnedOf(dom, dom.refId.get(ref));

// each domain: its floor and forum counts, and its claims with their grade and the source citation.
const domainReadings = Object.values(domains).map((dom) => {
  const prof = domainProfile(dom);
  return {
    store_id: dom.store_id,
    floor_count: Object.values(prof.floor_distribution).reduce((a, b) => a + b, 0),
    forum_count: Object.values(prof.forum_distribution).reduce((a, b) => a + b, 0),
    claims: dom.claims.map((c) => ({ statement: key(c.rec.statement), grade: earnedOf(dom, c.rec.identity), source: (tables.sourceTable.byId.get(c.spec.source_id) || {}).description || c.spec.source_id })),
  };
});

// the cardiovascular contradiction, held as structure.
const nut = domains["S-nutrition"];
const cardiovascular = {
  null_claim: { statement: key(specByRef(nut, "n.cv-null").rec.statement), grade: gradeRef(nut, "n.cv-null") },
  harm_claim: { statement: key(specByRef(nut, "n.cv-harm").rec.statement), grade: gradeRef(nut, "n.cv-harm") },
  diabetic_claim: { statement: key(specByRef(nut, "n.cv-diabetic").rec.statement), grade: gradeRef(nut, "n.cv-diabetic") },
};

// the regenerative characterized gaps with their closing conditions and transfer sources.
const env = domains["S-environment"];
const graph = { entries: env.state.entries, links: env.state.links, tables };
const idStmt = (id) => { const e = env.state.entries.find((x) => x.identity === id); return e ? key(e.statement) : id.slice(0, 10); };
const characterized_gaps = characterizedGaps(graph).map((g) => ({
  statement: key(g.statement), ceiling: g.ceiling, earned_grade: g.earned_grade,
  closing_condition: g.closing_condition,
  transfer_source: (g.transfer_sources || []).map((t) => ({ statement: idStmt(t.from_identity), transfer_grade: t.transfer_grade })),
}));

// the two weighings at structured-forum, each with its cited domain claims and their carried grades.
const claimStmt = (store, id) => { const d = domains[store]; const c = d.claims.find((x) => x.rec.identity === id); return c ? key(c.rec.statement) : id.slice(0, 10); };
const weighings = weighs.map((w) => ({
  statement: key(w.spec.statement), ceiling: w.ceiling, grade: w.grade,
  rationale: w.spec.weighting.rationale,
  cites: w.cits.map((c) => ({ statement: claimStmt(c.source_store, c.cited_claim), domain: c.source_store, carried_grade: c.carried_grade, role: c.role, term: c.term_ref ? c.term_ref.term_id : null })),
}));

// the denominator in both framings: the measurements are identical across the swap; the frame label moves.
const measurements = E.COMPOSITE.presupposes.map((p) => ({ statement: claimStmt(p.store, idOf(p.store, p.claim)), grade: earnedOf(domains[p.store], idOf(p.store, p.claim)) }));
const denominator = {
  throughput: { frame: E.framing.statement, alternatives: E.framing.alternatives, measurements },
  netcapital: { frame: E.successor.statement, alternatives: E.successor.alternatives, measurements },
};

// the reconciliation reading (Prompt 22): the CVD contradiction's computed within-domain crux, and the
// which-system weighing's cross-domain framing crux. The crux is computed on read and marked a candidate.
const nutGraph = { entries: nut.state.entries, links: nut.state.links, tables };
const nutStmt = (id) => claimStmt("S-nutrition", id);
const cvdRec = disagreements(nutGraph)[0];
const within = {
  kind: cvdRec.kind,
  side_a: { statement: nutStmt(cvdRec.side_a.identity), grade: cvdRec.side_a.grade },
  side_b: { statement: nutStmt(cvdRec.side_b.identity), grade: cvdRec.side_b.grade },
  structurally_disjoint: cvdRec.crux.structurally_disjoint,
  shallow: cvdRec.crux.shallow,
  frontier_candidates: cvdRec.crux.frontier_candidates.map(nutStmt),
  resolved_sub_region: cvdRec.crux.resolved_sub_region.map(nutStmt),
  candidate: cvdRec.crux.candidate,
  note: cvdRec.crux.note,
};
const wSystem = weighs.find((w) => w.spec.ref === "w.system");
const crossRec = reconcile({ weighing: wSystem.rec });
const cross = {
  kind: crossRec.kind,
  statement: key(wSystem.spec.statement),
  framing_crux: crossRec.crux.framing_crux, // the denominator framing node(s) the weighing rests on
  weighting_rationale: wSystem.spec.weighting.rationale,
  candidate: crossRec.crux.candidate,
  note: crossRec.crux.note,
};

// move 2, the choline fork: the same choline grounds the benefit and feeds the TMAO risk; the causal
// leap is held at the association grade and lowered by its undercuts (fish paradox, renal, Mendelian).
const uc = analyzeUndercuts(nutGraph, nut.refId.get("tmao.causal"));
const choline_fork = {
  fork: { statement: key(specByRef(nut, "chol.fork").rec.statement), grade: gradeRef(nut, "chol.fork") },
  benefit: ["chol.neurodev", "chol.hepatic"].map((r) => ({ statement: key(specByRef(nut, r).rec.statement), grade: gradeRef(nut, r) })),
  tmao_pathway: { statement: key(specByRef(nut, "tmao.pathway").rec.statement), grade: gradeRef(nut, "tmao.pathway") },
  tmao_association: { statement: key(specByRef(nut, "tmao.assoc").rec.statement), grade: gradeRef(nut, "tmao.assoc") },
  tmao_causal: { statement: key(specByRef(nut, "tmao.causal").rec.statement), grounding: uc.grade, confidence_after_undercuts: uc.confidence_after_undercuts, lowered: uc.lowered },
  undercuts: ["uc.fishparadox", "uc.renal", "uc.mendelian"].map((r) => ({ statement: key(specByRef(nut, r).rec.statement) })),
  finding: "the report proposes settled risk for the TMAO association, but the gate holds the causal leap at the association grade: settled association is not settled causation.",
};

// move 4, the which-body framing: the effects keep their grade across the body swap; the frame moves.
const bodyMeasurements = E.COMPOSITE.bodyPresupposes.map((p) => ({ statement: claimStmt(p.store, idOf(p.store, p.claim)), grade: earnedOf(domains[p.store], idOf(p.store, p.claim)) }));
const body_framing = {
  in_force: { frame: E.bodyFraming.statement, alternatives: E.bodyFraming.alternatives },
  bodies: E.bodies.map((b) => ({ framing_id: b.framing_id, frame: b.statement })),
  measurements: bodyMeasurements, // identical whichever body is in force
};

const reading = {
  generated_by: "build/vendor-eggs.mjs",
  meta_question: "Should you eat eggs, and which farming system is better? A composite over a nutrition, an environment, and an economics domain, now carrying four structural moves.",
  four_moves: [
    "the denominator reframe on the environment side (product-throughput vs net-capital)",
    "the choline good-versus-bad fork (one nutrient, two routings, held as a split)",
    "the cardiovascular crux (harm vs null, resolving to the confounding-adjustment choice)",
    "the which-body framing on the nutrition side (the assumed body, swappable)",
  ],
  domains: domainReadings,
  cardiovascular,
  choline_fork,
  body_framing,
  characterized_gaps,
  weighings,
  denominator,
  profile: E.profile,
  reconciliation: { within, cross },
  cardiovascular_crux: { status: within.shallow ? "computed-shallow" : "computed-resolved", note: "The cardiovascular crux is COMPUTED on read. With Prompt 26 the confounding-adjustment is reified as an explicit node both cohorts rest on (the US-cohort single-FFQ stance versus the global repeated-measures stance), and the diabetic agreement and the mechanistic-floor parallel-rise are the shared support both camps accept. The within-domain cone walk now resolves: the divergence frontier is the confounding-adjustment choice, and the diabetic-subgroup claim sits in the resolved region. The disagreement is explained without pooling the hazard ratios into an average." },
};

mkdirSync(join(ROOT, "vendor/eggs"), { recursive: true });
const out = JSON.stringify(reading, null, 2) + "\n";
writeFileSync(join(ROOT, "vendor/eggs/reading.json"), out);
console.log(`wrote vendor/eggs/reading.json (${out.length} bytes): ${domainReadings.length} domains, ${characterized_gaps.length} characterized gaps, ${weighings.length} weighings`);
