// Role: the three-counterexample oracle (Prompt 29). Runs the three flagship receipts on the dense
//   content, each written to fail loudly: the LHC apparent-robustness collapse (before/after reifying
//   the shared dependency), the covid crux resolving to the priors, and the eggs framing swaps leaving
//   the measurements intact with the regenerative claims as characterized gaps. Each receipt's correct
//   firing is its acceptance test; a shallow crux, a moved grade, or a top-level split is a finding.
// Contract: `node build/check-demo.mjs` exits non-zero on any failure. Imports the kernel readings and
//   the three shared case builders; touches no truth field. It reads the graph and asserts what fires.
// Invariant: reads the graph, changes nothing. Every grade here is the kernel's own derivation; the
//   receipts are recomputed, not asserted, so a collapse that did not happen is caught, not forced.
"use strict";
import { analyzePresupposition } from "../kernel/analysis/robustness.mjs";
import { withinDomainCrux } from "../kernel/analysis/reconciliation.mjs";
import { swapFrame, checkPresupposition } from "../kernel/composition/framing.mjs";
import { characterizedGaps } from "../kernel/analysis/characterized-gaps.mjs";
import { buildLhc } from "./lhc-build.mjs";
import { buildCovid } from "./covid-build.mjs";
import { buildEggs } from "./eggs-build.mjs";

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-DEMO (Prompt 29): the three counterexamples, each a reproducible receipt"); console.log(H);

// =====================================================================================
console.log("\n[RECEIPT 1] the LHC apparent-robustness collapse: the shared dependency the leg count hides");
{
  const C = buildLhc();
  const id = (r) => C.refId.get(r);
  const nm = (i) => { for (const [k, v] of C.refId) if (v === i) return k; return String(i).slice(0, 8); };
  const after = analyzePresupposition(C.graph, id("robust"));
  const before = analyzePresupposition(C.graphWithout(), id("robust"));
  const beforeShared = before.shared_presuppositions.map(nm).sort();
  const afterShared = after.shared_presuppositions.map(nm).sort();
  console.log(`      the fluent reading: three independent legs, so the top claim reads robust`);
  console.log(`      BEFORE reifying the shared nodes: shared dependency across the legs = [${beforeShared.join(", ")}]`);
  console.log(`      AFTER  reifying the shared nodes: shared dependency across the legs = [${afterShared.join(", ")}]`);
  ok(beforeShared.length === 0, "without the shared-dependency nodes, the reading finds none: the legs read independent");
  ok(afterShared.join(",") === "dep.add,dep.semiclassical", "with the nodes reified, the reading names ADD and semiclassical gravity as the shared dependency across all three legs");
  ok(beforeShared.join(",") !== afterShared.join(","), "the before-and-after difference is visible: reifying the shared nodes changed the reading (not a collapse that did not happen)");
}

// =====================================================================================
console.log("\n[RECEIPT 2] the covid crux resolving to the priors, not a shallow top-level split");
{
  const C = buildCovid();
  const id = (r) => C.refId.get(r);
  const cx = withinDomainCrux(C.graph, id("concl.zoonosis"), id("concl.lableak"));
  const frontier = new Set(cx.frontier_candidates);
  const priors = ["prior.miller-zoo", "prior.miller-lableak", "prior.rootclaim-hsm", "prior.rootclaim-bsl2"];
  const shared = ["ev.clustering", "ev.furin-site", "ev.two-lineages", "ev.env-samples"];
  console.log(`      the fluent reading: the same evidence, so the origin looks decisive`);
  console.log(`      the crux: ${cx.kind}, shallow ${cx.shallow}; frontier is the priors, resolved region is the shared evidence`);
  ok(cx.kind === "within-domain" && cx.shallow === false, "the crux is not a shallow top-level split: the cones share the evidence and diverge below it");
  ok(priors.every((p) => frontier.has(id(p))), "the divergence frontier is the prior nodes (Miller's ratio against Rootclaim's inversion), not the conclusions");
  ok(shared.every((e) => cx.resolved_sub_region.includes(id(e))), "the shared evidence sits in the resolved region");
  ok(!shared.some((e) => frontier.has(id(e))), "no shared evidence is on the frontier: the split is the priors, not the evidence (so it did not land at the top)");
}

// =====================================================================================
console.log("\n[RECEIPT 3] the eggs framing swaps: reframe the verdict, leave every measurement's grade intact");
{
  const E = buildEggs();
  const nut = E.domains["S-nutrition"], env = E.domains["S-environment"];
  const earned = (dom, ref) => (dom.view.earnedByIdentity.get(dom.refId.get(ref)) || { earned: "?" }).earned;
  console.log(`      the fluent reading: the egg verdict looks like a fact`);

  // swap the denominator, product-throughput -> net-capital.
  const denomBefore = E.COMPOSITE.presupposes.map((p) => earned(E.domains[p.store], p.claim));
  const denomSwapped = E.edges.map(({ edge }) => swapFrame(edge, E.successor));
  const denomAfter = E.COMPOSITE.presupposes.map((p) => earned(E.domains[p.store], p.claim));
  ok(denomBefore.join(",") === denomAfter.join(","), "the denominator swap (product-throughput -> net-capital) leaves every per-unit measurement's grade intact");
  ok(denomSwapped.every((e) => e.to_framing === "F-netcapital") && checkPresupposition(denomSwapped[0], E.successor).in_force, "the denominator edges re-point to net-capital, which checks in force (the verdict reframes)");

  // swap the which-body, average adult -> diabetic.
  const diabetic = E.bodies.find((b) => b.framing_id === "F-body-diabetic");
  const bodyBefore = E.COMPOSITE.bodyPresupposes.map((p) => earned(E.domains[p.store], p.claim));
  const bodySwapped = E.bodyEdges.map(({ edge }) => swapFrame(edge, diabetic));
  const bodyAfter = E.COMPOSITE.bodyPresupposes.map((p) => earned(E.domains[p.store], p.claim));
  ok(bodyBefore.join(",") === bodyAfter.join(","), "the which-body swap (average adult -> diabetic) leaves every subsystem measurement's grade intact");
  ok(bodySwapped.every((e) => e.to_framing === "F-body-diabetic") && /elevated-risk agreement/.test(diabetic.statement), "the body edges re-point to the diabetic, whose frame reframes the cardiovascular effect to elevated-risk agreement");

  // the regenerative soil-carbon claims read as characterized gaps naming what would ground them.
  const graph = { entries: env.state.entries, links: env.state.links, tables: E.tables };
  const gaps = characterizedGaps(graph);
  const regenRefs = ["e.regen-soc", "e.regen-litter"].map((r) => env.refId.get(r));
  const regenGaps = gaps.filter((g) => regenRefs.includes(g.identity || g.node_id) || regenRefs.includes(g.identity));
  const gapIds = new Set(gaps.map((g) => g.identity));
  ok(regenRefs.every((rid) => gapIds.has(rid)), "the regenerative soil-carbon claims read as characterized gaps, not direct measurements");
  ok(gaps.filter((g) => regenRefs.includes(g.identity)).every((g) => g.closing_condition && g.closing_condition.target), "each regenerative gap carries a closing condition naming the measurement that would ground it");
  void regenGaps;
}

console.log("\n" + H);
if (fails) { console.log(`check-demo: ${fails} FAILURE(S)`); process.exit(1); }
console.log("verified: each of the three counterexamples fires on the dense content, recomputed from the graph rather than asserted.");
console.log("check-demo: OK (three counterexamples, each fired on the dense content)"); console.log(H);
