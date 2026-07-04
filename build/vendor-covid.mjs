// Role: vendor the densified covid-origins case into one JSON reading the presentation shell renders
//   in a file:// page, with no server and no live kernel in the browser (Prompt 23a). Built through
//   the shared covid builder, the same one the oracle verifies, and written to vendor/covid/reading.json:
//   the evidence grounded to its floors, the contested interpretations, the origins contradiction with
//   its computed crux resolving to the priors, and the meta level with the 23-order divergence.
// Contract: `node build/vendor-covid.mjs` writes the reading. No arguments. Deterministic.
// Invariant: the shell renders this reading and computes nothing; every grade here is the kernel's own
//   derivation at build time, and the crux is computed on read, marked a candidate.
"use strict";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { disagreements } from "../kernel/analysis/reconciliation.mjs";
import { buildCovid } from "./covid-build.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const C = buildCovid();
const id = (ref) => C.refId.get(ref);
const key = (stmt) => String(stmt).split(":").slice(1).join(":").trim().slice(0, 130);
const earned = (ref) => (C.view.earnedByIdentity.get(id(ref)) || { earned: "ungraded" }).earned;
const stmtOf = (identity) => { const c = C.claims.find((x) => x.rec.identity === identity); return c ? key(c.rec.statement) : identity.slice(0, 10); };
const srcOf = (ref) => (C.tables.sourceTable.byId.get(C.claims.find((c) => c.spec.ref === ref).spec.source_id) || {}).description || "";
const row = (ref) => ({ statement: key(C.claims.find((c) => c.spec.ref === ref).rec.statement), grade: earned(ref), source: srcOf(ref) });

const evidence = ["ev.clustering", "ev.env-samples", "ev.wildlife-dna", "ev.two-lineages", "ev.furin-site", "ev.cgg-codons", "ev.defuse", "ev.animals-not-tested", "ev.market-sanitized"].map(row);
const interpretations = ["int.wildlife-infected", "int.two-spillovers", "int.furin-suboptimal", "int.ascertainment-bias", "int.bloom", "int.centroid"].map(row);
const priors = ["prior.miller-zoo", "prior.miller-lableak", "prior.rootclaim-hsm", "prior.rootclaim-bsl2"].map(row);
const meta = ["meta.divergence", "meta.no-settlement", "meta.judges-ruling", "meta.method-critique", "meta.unresolved"].map(row);

// the origins contradiction with its computed crux, resolving to the priors.
const cvd = disagreements(C.graph).find((d) => new Set([d.side_a.identity, d.side_b.identity]).has(id("concl.zoonosis")));
const contradiction = {
  zoonosis: row("concl.zoonosis"),
  lableak: row("concl.lableak"),
  crux: {
    candidate: cvd.crux.candidate,
    shallow: cvd.crux.shallow,
    frontier: cvd.crux.frontier_candidates.map(stmtOf),   // the priors the conclusions diverge on
    resolved: cvd.crux.resolved_sub_region.map(stmtOf),   // the shared evidence
    note: cvd.crux.note,
  },
};

const reading = {
  generated_by: "build/vendor-covid.mjs",
  meta_question: "Where did SARS-CoV-2 come from? The same evidence, read by six analyses under different priors, spanned 23 orders of magnitude, so the answer is prior-driven.",
  evidence, interpretations, priors, meta, contradiction,
};

mkdirSync(join(ROOT, "vendor/covid"), { recursive: true });
const out = JSON.stringify(reading, null, 2) + "\n";
writeFileSync(join(ROOT, "vendor/covid/reading.json"), out);
console.log(`wrote vendor/covid/reading.json (${out.length} bytes): ${evidence.length} evidence, ${priors.length} priors, crux frontier ${contradiction.crux.frontier.length}`);
