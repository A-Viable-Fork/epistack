// Role: vendor the guided path into one JSON reading the presentation shell renders (Prompt 29). The
//   three counterexamples, each a stop with four parts: the fluent reading a good synthesis would give,
//   the protocol's counterexample, the reproducible receipt (recomputed here by the kernel readings,
//   the same the check-demo oracle verifies), and a curated pointer into the exact case region. Built
//   through the three shared case builders, written to vendor/demo/reading.json.
// Contract: `node build/vendor-demo.mjs` writes the reading. No arguments. Deterministic.
// Invariant: the shell renders this reading and computes nothing; every receipt here is the kernel's
//   own derivation at build time, recomputed rather than asserted.
"use strict";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { analyzePresupposition } from "../kernel/analysis/robustness.mjs";
import { withinDomainCrux } from "../kernel/analysis/reconciliation.mjs";
import { swapFrame, checkPresupposition } from "../kernel/composition/framing.mjs";
import { characterizedGaps } from "../kernel/analysis/characterized-gaps.mjs";
import { buildLhc } from "./lhc-build.mjs";
import { buildCovid } from "./covid-build.mjs";
import { buildEggs } from "./eggs-build.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// ---- receipt 1: the LHC apparent-robustness collapse ----
const L = buildLhc();
const lid = (r) => L.refId.get(r);
const lnm = (i) => { for (const [k, v] of L.refId) if (v === i) return k; return String(i).slice(0, 8); };
const lhcAfter = analyzePresupposition(L.graph, lid("robust")).shared_presuppositions.map(lnm).sort();
const lhcBefore = analyzePresupposition(L.graphWithout(), lid("robust")).shared_presuppositions.map(lnm).sort();
const stop_lhc = {
  case: "case-lhc-cascade",
  title: "the LHC apparent-robustness collapse",
  fluent: "The LHC safety argument looks robust: three independent legs (production, Hawking evaporation, the astrophysical backstop), so weakening any one leaves the others standing.",
  counterexample: "The three legs are not independent. They share a physical premise, ADD large extra dimensions and semiclassical gravity, so the apparent robustness is conditional on one framework choice the leg count hides.",
  receipt: {
    what: "run the presupposition reading over the independence claim twice: once without the shared-dependency nodes, once with ADD and semiclassical gravity reified as nodes the three legs depend on",
    before: lhcBefore, after: lhcAfter,
    fires: lhcBefore.length === 0 && lhcAfter.join(",") === "dep.add,dep.semiclassical",
    reads: "before, no shared dependency (the legs read independent); after, ADD and semiclassical gravity are found as a single point of failure across all three legs",
  },
  pointer: { region: "the framework-choice node", nodes: ["dep.add", "dep.semiclassical"], oracle: "node build/check-demo.mjs (receipt 1)" },
};

// ---- receipt 2: the covid crux resolving to the priors ----
const V = buildCovid();
const vid = (r) => V.refId.get(r);
const vnm = (i) => { for (const [k, v] of V.refId) if (v === i) return k; return String(i).slice(0, 8); };
const cx = withinDomainCrux(V.graph, vid("concl.zoonosis"), vid("concl.lableak"));
const priors = ["prior.miller-zoo", "prior.miller-lableak", "prior.rootclaim-hsm", "prior.rootclaim-bsl2"];
const sharedEv = ["ev.clustering", "ev.furin-site", "ev.two-lineages", "ev.env-samples"];
const stop_covid = {
  case: "case-covid-origins",
  title: "the covid crux resolving to the priors",
  fluent: "The covid-origins evidence looks decisive: both camps work from the same evidence, so the origin should be readable off it.",
  counterexample: "The same evidence read through different priors gives a 23-order spread. The disagreement is not in the evidence but at the prior nodes, Miller's market ratio against Rootclaim's inversion, where the two support cones stop sharing.",
  receipt: {
    what: "run the reconciliation crux computation on the zoonosis-versus-lab-leak contradiction on the dense graph",
    frontier: cx.frontier_candidates.map(vnm).sort(),
    resolved_shared: cx.resolved_sub_region.map(vnm).filter((n) => sharedEv.includes(n)).sort(),
    shallow: cx.shallow,
    fires: cx.shallow === false && priors.every((p) => new Set(cx.frontier_candidates).has(vid(p))) && sharedEv.every((e) => cx.resolved_sub_region.includes(vid(e))),
    reads: "the frontier is the four prior nodes, the shared evidence sits in the resolved region, and the split is the priors rather than a shallow top-level split",
  },
  pointer: { region: "the crux and its priors", nodes: priors, oracle: "node build/check-demo.mjs (receipt 2)" },
};

// ---- receipt 3: the eggs framing swaps ----
const E = buildEggs();
const earned = (dom, ref) => (dom.view.earnedByIdentity.get(dom.refId.get(ref)) || { earned: "?" }).earned;
const denomBefore = E.COMPOSITE.presupposes.map((p) => earned(E.domains[p.store], p.claim));
const denomSwapped = E.edges.map(({ edge }) => swapFrame(edge, E.successor));
const denomAfter = E.COMPOSITE.presupposes.map((p) => earned(E.domains[p.store], p.claim));
const diabetic = E.bodies.find((b) => b.framing_id === "F-body-diabetic");
const bodyBefore = E.COMPOSITE.bodyPresupposes.map((p) => earned(E.domains[p.store], p.claim));
const bodySwapped = E.bodyEdges.map(({ edge }) => swapFrame(edge, diabetic));
const bodyAfter = E.COMPOSITE.bodyPresupposes.map((p) => earned(E.domains[p.store], p.claim));
const env = E.domains["S-environment"];
const envGraph = { entries: env.state.entries, links: env.state.links, tables: E.tables };
const regenRefs = ["e.regen-soc", "e.regen-litter"].map((r) => env.refId.get(r));
const gaps = characterizedGaps(envGraph);
const regenAreGaps = regenRefs.every((rid) => gaps.some((g) => g.identity === rid && g.closing_condition && g.closing_condition.target));
const stop_eggs = {
  case: "case-eggs-composite",
  title: "the eggs framing swaps",
  fluent: "The egg verdict looks like a fact: is it healthy, is that farm better, settled by the measurements.",
  counterexample: "The verdict rides on two swappable frames. Swap the accounting denominator or the body being fed and which verdict dominates flips, while every underlying measurement keeps the grade it earned, because the frames are checked-not-graded presupposition edges.",
  receipt: {
    what: "swap the denominator (product-throughput to net-capital) and the which-body node (average adult to diabetic), then read the regenerative soil-carbon claims",
    denominator_grades_intact: denomBefore.join(",") === denomAfter.join(","),
    denominator_reframed: denomSwapped.every((e) => e.to_framing === "F-netcapital") && checkPresupposition(denomSwapped[0], E.successor).in_force,
    body_grades_intact: bodyBefore.join(",") === bodyAfter.join(","),
    body_reframed: bodySwapped.every((e) => e.to_framing === "F-body-diabetic"),
    regenerative_are_characterized_gaps: regenAreGaps,
    fires: denomBefore.join(",") === denomAfter.join(",") && bodyBefore.join(",") === bodyAfter.join(",") && regenAreGaps,
    reads: "each swap reframes the verdict while every measurement's grade holds, and the regenerative claims read as characterized gaps naming what would ground them",
  },
  pointer: { region: "the two framing nodes and the regenerative leaps", nodes: ["F-throughput", "F-body-avgadult", "e.regen-soc", "e.regen-litter"], oracle: "node build/check-demo.mjs (receipt 3)" },
};

const reading = {
  generated_by: "build/vendor-demo.mjs",
  lede: "Three cases where a good synthesis gives the fluent reading and one viewpoint cannot surface the rest, each surfaced by the structure. Each stop is a reproducible receipt: run the oracle and the counterexample fires, or it is a wiring finding.",
  stops: [stop_lhc, stop_covid, stop_eggs],
  // where the walk hands off past the three cases: the two supporting documents that generalize it.
  // effective regions in their own right, one for what the structure enables, one for how it holds under attack.
  handoffs: [
    { title: "Epistemic Uplift", href: "docs/epistemic_uplift.md", what: "what the structure enables and generalizes to: the interfaces a checkable graph unlocks, and each of the competition's named strong examples mapped to a kernel capability" },
    { title: "Adversarial Walkthrough", href: "docs/adversarial_walkthrough.md", what: "how the defense holds under specific attacks: the robustness solution type walked through five concrete attacks, marking what runs today from what is Stage 4" },
  ],
};

mkdirSync(join(ROOT, "vendor/demo"), { recursive: true });
const out = JSON.stringify(reading, null, 2) + "\n";
writeFileSync(join(ROOT, "vendor/demo/reading.json"), out);
console.log(`wrote vendor/demo/reading.json (${out.length} bytes): ${reading.stops.length} stops, all fire = ${reading.stops.every((s) => s.receipt.fires)}`);
