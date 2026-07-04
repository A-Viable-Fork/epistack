// Role: the covid-origins oracle (Prompt 23a). Verifies the densified covid case: the evidence grounds
//   to its floors, the contested interpretations sit as forum claims, the zoonosis and lab-leak
//   conclusions are a contradicts-linked forum pair each resting on the shared evidence and its own
//   priors, the meta claims are typed forum, and mode disagreements are reported. Phase B runs the
//   crux computation and confirms it resolves to the priors, not a shallow top-level split.
// Contract: `node build/check-covid.mjs` exits non-zero on any failure. Imports the kernel, the
//   reconciliation reading, and the shared covid builder; touches no truth field.
// Invariant: the write-up is canonical for the claims, never for the grade; where the gate disagrees
//   with a proposed mode the disagreement is a finding, listed, not forced.
"use strict";
import { collapsedRank, tierOf } from "../kernel/schema/confidence.mjs";
import { disagreements, withinDomainCrux } from "../kernel/analysis/reconciliation.mjs";
import { buildCovid } from "./covid-build.mjs";

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-COVID (Prompt 23a): the Rootclaim origins debate as a dense claim structure"); console.log(H);

const C = buildCovid();
const id = (ref) => C.refId.get(ref);
const earned = (ref) => (C.view.earnedByIdentity.get(id(ref)) || { earned: "ungraded" }).earned;
const specOf = (ref) => C.claims.find((c) => c.spec.ref === ref).spec;

// =====================================================================================
console.log("\n[A1] the tier-one claims are in the graph, gated, with provenance");
ok(C.receipt.decision !== "declined", `the gate admits the covid store (decision ${C.receipt.decision})`);
const srcIds = new Set(C.tables.sourceTable.byId.keys());
let noProv = 0;
for (const c of C.claims) if (!srcIds.has(c.spec.source_id)) noProv++;
ok(noProv === 0, `every claim resolves to a source row named in the write-up (${C.claims.length} claims)`);
// reconciliation: the dense store is the single representation; no tier-one claim is duplicated, and
// the sparse trellis reconstruction (covid.instance, the prior clustering-to-origin refusal) is
// superseded by it, restated as the no-settlement meta-claim (the priced-prior conclusion, denser).
ok(new Set(C.claims.map((c) => c.rec.identity)).size === C.claims.length, "no tier-one claim is duplicated: the dense store is the single covid representation");

// =====================================================================================
console.log("\n[A2] the evidence grounds to floors; the interpretations sit as contested forum claims");
for (const r of ["ev.clustering", "ev.env-samples", "ev.wildlife-dna", "ev.two-lineages", "ev.furin-site", "ev.cgg-codons", "ev.defuse"])
  ok(earned(r) === "checked", `${r} grounds to the measurement floor (checked)`);
for (const r of ["int.wildlife-infected", "int.two-spillovers", "int.furin-suboptimal", "int.ascertainment-bias"])
  ok(tierOf(earned(r)) !== "settled", `${r} sits in the forum as a contested interpretation (${earned(r)})`);

// =====================================================================================
console.log("\n[A3] the two conclusions are contradicts-linked, each on shared evidence and its priors");
const reg = disagreements(C.graph);
const zId = id("concl.zoonosis"), llId = id("concl.lableak");
const pair = reg.find((d) => new Set([d.side_a.identity, d.side_b.identity]).has(zId) && new Set([d.side_a.identity, d.side_b.identity]).has(llId));
ok(!!pair, "the zoonosis and lab-leak conclusions are a contradicts-linked disagreement");
ok(tierOf(earned("concl.zoonosis")) !== "settled" && tierOf(earned("concl.lableak")) !== "settled", "neither conclusion carries a floor grade the other's contest could remove (both forum)");
// each rests on the shared evidence AND its own priors
const supportsInto = (toRef) => C.graph.links.filter((l) => l.link_kind === "supports" && l.to_identity === id(toRef)).map((l) => l.from_identity);
const zSup = new Set(supportsInto("concl.zoonosis")), llSup = new Set(supportsInto("concl.lableak"));
const shared = ["ev.clustering", "ev.furin-site", "ev.two-lineages", "ev.env-samples"];
ok(shared.every((e) => zSup.has(id(e)) && llSup.has(id(e))), "both conclusions rest on the four shared evidence pieces");
ok(zSup.has(id("prior.miller-zoo")) && zSup.has(id("prior.miller-lableak")) && !llSup.has(id("prior.miller-zoo")), "the zoonosis conclusion rests on Miller's priors, the lab-leak side does not");
ok(llSup.has(id("prior.rootclaim-hsm")) && llSup.has(id("prior.rootclaim-bsl2")) && !zSup.has(id("prior.rootclaim-hsm")), "the lab-leak conclusion rests on Rootclaim's priors, the zoonosis side does not");

// =====================================================================================
console.log("\n[A4] the meta level is present and typed forum");
for (const r of ["meta.divergence", "meta.no-settlement", "meta.judges-ruling", "meta.method-critique", "meta.unresolved"])
  ok(specOf(r).kind === "forum" && tierOf(earned(r)) !== "settled", `${r} is a forum claim (${earned(r)})`);
ok(supportsInto("meta.no-settlement").includes(id("meta.divergence")), "the 23-order divergence grounds the no-settlement meta-claim");

// =====================================================================================
console.log("\n[A5] mode disagreements between the write-up and the gate are listed as findings");
// the write-up marks the evidence "formal"; where it separates an observation from its interpretation
// the gate refines that single mode into a floor observation plus a contested forum interpretation.
const splits = [["ev.wildlife-dna", "int.wildlife-infected"], ["ev.two-lineages", "int.two-spillovers"], ["ev.furin-site", "int.furin-suboptimal"]];
const findings = splits.filter(([obs, intp]) => tierOf(earned(obs)) === "settled" && tierOf(earned(intp)) !== "settled");
for (const [obs, intp] of findings) console.log(`      FINDING the write-up's single 'formal' mode splits: ${obs} grounds to the floor, ${intp} is contested forum`);
ok(findings.length === splits.length, `every observation/interpretation split is reported as a mode-refinement finding (${findings.length})`);
// no claim declares a grade the gate cannot confirm (a forced disagreement would stop here)
const forced = C.claims.filter((c) => { const g = C.receipt.grade_table.find((x) => x.identity === c.rec.identity); return g && collapsedRank(g.declared_grade) > collapsedRank(g.earned_grade); });
for (const c of forced) console.log(`      CONFLICT ${c.spec.ref} declared ${c.spec.declared_grade} > earned`);
ok(forced.length === 0, "no claim is forced above what the gate grants it");

// =====================================================================================
console.log("\n[B] the crux of the origins contradiction resolves to the priors");
const crux = withinDomainCrux(C.graph, zId, llId).kind === "within-domain" ? withinDomainCrux(C.graph, zId, llId) : null;
const cx = withinDomainCrux(C.graph, zId, llId);
ok(cx.structurally_disjoint === false && cx.shallow === false, "the contradiction is not shallow: the cones share the evidence and diverge at the priors");
const frontier = new Set(cx.frontier_candidates);
const priors = ["prior.miller-zoo", "prior.miller-lableak", "prior.rootclaim-hsm", "prior.rootclaim-bsl2"];
ok(priors.every((p) => frontier.has(id(p))), "the divergence frontier is exactly the four prior claims (the crux resolves to the priors)");
ok(shared.every((e) => cx.resolved_sub_region.includes(id(e))), "the shared evidence sits in the resolved sub-region");
ok(!shared.some((e) => frontier.has(id(e))), "no shared evidence is on the frontier: the split is the priors, not the evidence");

// =====================================================================================
console.log("\n" + H);
if (fails) { console.log(`check-covid: ${fails} FAILURE(S)`); process.exit(1); }
console.log("check-covid: OK"); console.log(H);
void crux;
