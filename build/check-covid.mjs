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
import { characterizedGaps, characterization } from "../kernel/analysis/characterized-gaps.mjs";
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
// Prompt 34: the deep extraction. The six lines run several nodes deep, three careful readers weight
// the same evidence, their divergences are first-class tension, and each line's sub-crux is wired,
// several bottoming out in a withheld record.
// =====================================================================================
const specByRef = new Map(C.claims.map((c) => [c.spec.ref, c.spec]));
const has = (ref) => C.refId.has(ref);
const nm = (i) => { for (const [k, v] of C.refId) if (v === i) return k; return String(i).slice(0, 6); };

console.log("\n[D1] the deep extraction deepens the case, it does not duplicate it");
ok(new Set(C.claims.map((c) => c.rec.identity)).size === C.claims.length, `no claim is duplicated across the first pass and the deep extraction (${C.claims.length} unique)`);
// every deep reading attaches under the existing spine (rests on a first-pass ev.* node), not a fresh copy
const restsOn = (toRef) => new Set(C.graph.links.filter((l) => l.link_kind === "supports" && l.to_identity === C.refId.get(toRef)).map((l) => nm(l.from_identity)));
const spineLines = { mkt: "ev.clustering", fcs: "ev.furin-site", lin: "ev.two-lineages", env: "ev.env-samples", def: "ev.defuse" };
for (const [L, spine] of Object.entries(spineLines)) {
  const zo = restsOn(L + ".zo"), ll = restsOn(L + ".ll");
  ok(zo.has(spine) && ll.has(spine), `line ${L}: both readings attach under the existing spine node ${spine} (deepened, not duplicated)`);
}

console.log("\n[D2] the reader-weighting nodes: forum, attributed, carrying the ratio, stated vs reconstructed intact");
const weightings = C.claims.filter((c) => c.spec.node_role === "reader-weighting");
const readers = ["alexander", "vantreuren", "stansifer"];
for (const rd of readers) ok(weightings.some((w) => w.spec.contributor_id === "reader:" + rd), `reader ${rd} has weighting nodes attributed to them`);
ok(weightings.every((w) => w.spec.kind === "forum" && tierOf(earned(w.spec.ref)) !== "settled"), `every reader weighting is a forum claim, none settled (${weightings.length} weightings)`);
ok(weightings.every((w) => w.spec.ratio && (w.spec.mark === "stated" || w.spec.mark === "reconstructed")), "every weighting carries its ratio/strength and a stated-or-reconstructed mark");
// the likelihood ratios the document records are present as reader-weighting nodes
const ratios = weightings.map((w) => w.spec.ratio).join(" | ");
for (const r of ["20,000x", "10,000x", "500x", "20x", "1x"]) ok(ratios.includes(r), `the ${r} likelihood ratio is a reader-weighting node`);
// stated versus reconstructed is preserved per the document (Eric's priors reconstructed; his market weighting stated)
ok(specByRef.get("w.eric.prior-zo").mark === "reconstructed" && specByRef.get("w.eric.mkt").mark === "stated", "stated-versus-reconstructed is preserved (Eric's priors reconstructed, his market weighting stated)");

console.log("\n[D3] reader divergences on shared evidence are wired as first-class tension (contradictions)");
const wids = new Set(weightings.map((w) => w.rec.identity));
const readerDivs = C.graph.links.filter((l) => l.link_kind === "contradicts" && wids.has(l.from_identity) && wids.has(l.to_identity));
ok(readerDivs.length >= 2, `at least two reader-weighting divergences are held as tension (${readerDivs.length}: ${readerDivs.map((l) => nm(l.from_identity) + " vs " + nm(l.to_identity)).join(", ")})`);
ok(has("w.eric.fcs") && has("w.will.fcs") && readerDivs.some((l) => new Set([nm(l.from_identity), nm(l.to_identity)]).has("w.eric.fcs")), "the FCS divergence (Eric 20x LL vs Will wash) is wired");
ok(readerDivs.some((l) => new Set([nm(l.from_identity), nm(l.to_identity)]).has("w.eric.lin")), "the two-lineage divergence (Eric wash/weak-ZO vs Will moderate-LL) is wired");

console.log("\n[D4] each line's sub-crux is wired; the sealed ones are typed withheld-record");
const lines = ["mkt", "fcs", "lin", "tmp", "env", "def"];
for (const L of lines) ok(has(L + ".subcrux") && has(L + ".term"), `line ${L}: the sub-crux and its terminal are wired`);
const withheld = ["mkt.term", "fcs.term", "def.term"];
for (const t of withheld) {
  ok(specByRef.get(t).terminal_type === "withheld-record", `${t} is typed withheld-record (a sealed dataset a named source would resolve)`);
  ok(characterization(C.graph, C.refId.get(t)) === "characterized-gap", `${t} is a characterized gap: it cannot ground because the record is sealed`);
}
// the other terminals bottom out in different types: empirical records that exist, and contested data
ok(characterization(C.graph, C.refId.get("tmp.term")) === "settled" && characterization(C.graph, C.refId.get("env.term")) === "settled", "the temporal and environmental sub-cruxes bottom out in empirical records that exist and ground (not withheld)");
ok(specByRef.get("lin.term").kind === "forum" && tierOf(earned("lin.term")) !== "settled", "the two-lineage sub-crux bottoms out in contested bioinformatics (a forum data-dispute, neither sealed nor settled)");

console.log("\n[D5] the crux computation works at more than one depth, landing on different terminal types");
const topCx = withinDomainCrux(C.graph, zId, llId);
ok(!topCx.shallow && priors.every((p) => new Set(topCx.frontier_candidates).has(id(p))), "the TOP origin crux still resolves to the four priors (the debaters' divergence)");
// the reader-and-weighting divergence is the same structure appearing between the assessors
ok(readerDivs.length >= 2 && has("meta.reader-divergence"), "the top level also carries the reader divergence: the prior structure appearing between the assessors, not only the debaters");
const mkt = withinDomainCrux(C.graph, id("mkt.zo"), id("mkt.ll"));
ok(!mkt.shallow && !mkt.structurally_disjoint && mkt.resolved_sub_region.includes(id("ev.clustering")), "the MARKET line-level crux resolves below the top: shared evidence in the resolved region, the ascertainment-vs-epicenter reading on the frontier");
ok(mkt.frontier_candidates.some((f) => nm(f).startsWith("mkt.ll")) && mkt.frontier_candidates.some((f) => nm(f).startsWith("mkt.zo")), "the market frontier holds both sides' readings (the sub-crux)");
const tmp = withinDomainCrux(C.graph, id("tmp.zo"), id("tmp.ll"));
ok(!tmp.shallow && !tmp.structurally_disjoint, "the TEMPORAL line-level crux also resolves below the top");
// the market sub-crux bottoms out in a withheld gap, the temporal in an empirical record: different terminal types
ok(characterization(C.graph, id("mkt.term")) === "characterized-gap" && characterization(C.graph, id("tmp.term")) === "settled", "the two resolving lines land on different terminal types: market on a withheld record, temporal on an empirical one");

console.log("\n[D6] even-handedness: both origins are argued on every line, and any lean is reported, not silent");
for (const L of lines) {
  const zoRests = restsOn(L + ".zo").size, llRests = restsOn(L + ".ll").size;
  ok(zoRests >= 1 && llRests >= 1, `line ${L}: both the ZO and LL readings rest on evidence (neither side empty: ZO ${zoRests}, LL ${llRests})`);
}
// the aggregate lean, reported and classified, not left silent
let zoTot = 0, llTot = 0;
for (const c of C.claims) { if (/\.zo(\.|$)/.test(c.spec.ref)) zoTot++; if (/\.ll(\.|$)/.test(c.spec.ref)) llTot++; }
console.log(`      FINDING the deep argument set leans ZO (${zoTot} ZO-side nodes to ${llTot} LL-side): a real asymmetry in the sources, since all three readers conclude zoonosis and the extraction develops the ZO rebuttals more; the LL molecular pillar on the FCS line sits in the first-pass spine (ev.furin-site, ev.cgg-codons), so the deep count understates it. Reported, not balanced by invented LL nodes.`);
ok(has("tmp.asymmetry"), "the temporal line's anecdote-versus-serology asymmetry is flagged as a first-class node (a real source asymmetry, not an ingestion gap)");

console.log("\n[D7] the gap count rises as the case densifies, and every new gap is a real termination");
const gaps = characterizedGaps(C.graph);
ok(gaps.length === withheld.length, `the case now carries ${gaps.length} characterized gaps, up from none in the first pass (the deepening surfacing real terminations)`);
ok(gaps.every((g) => specByRef.get(nm(g.identity)) && specByRef.get(nm(g.identity)).terminal_type === "withheld-record"), "every new gap is a withheld-record terminal: a real termination in a named sealed dataset, not a hole in the ingestion");
ok(gaps.every((g) => g.closing_condition && g.closing_condition.target), "every gap names the sealed record that would close it (the closing condition)");

// =====================================================================================
console.log("\n[D8] no reconstructed number leaks into a measurement or a debate-attributed forum node");
const marked = C.claims.filter((c) => c.spec.mark);
// (a) every marked-reconstructed node is a forum reader-weighting attributed to a reader
const recon = marked.filter((c) => c.spec.mark === "reconstructed");
ok(recon.every((c) => c.spec.kind === "forum" && c.spec.node_role === "reader-weighting" && /^reader:/.test(c.spec.contributor_id)),
   `every reconstructed node is a forum reader-weighting attributed to a reader (${recon.length})`);
// (b) no measurement carries a mark at all (measurements are never reconstructed)
ok(C.claims.every((c) => !(c.spec.kind === "measurement" && c.spec.mark)), "no measurement node carries a reconstructed/stated mark");
// (c) no debate-side or reading node is marked reconstructed
const sideRe = /^(side|read):/;
ok(C.claims.every((c) => !(sideRe.test(c.spec.contributor_id) && c.spec.mark === "reconstructed")), "no debate-side or reading node is marked reconstructed");
// (d) the dropped reconstruction and the post-debate literature do not appear in any measurement or debate-side forum node
const sentinels = ["14,900", "7,578", "BsmBI", "BsaI"];
const leaked = C.claims.filter((c) => (c.spec.kind === "measurement" || sideRe.test(c.spec.contributor_id)) && sentinels.some((s) => c.spec.statement.includes(s)));
ok(leaked.length === 0, `no dropped-reconstruction or post-debate-literature sentinel appears in a measurement or debate-side node (${leaked.map((c)=>c.spec.ref).join(", ") || "none"})`);

console.log("\n[D8e] each landed reconstruction's signature phrase appears in exactly one claim: its own node");
// a copy-relabel of a reconstruction's text into a debate node makes the phrase appear twice, tripping this.
const sigs = [["transcript-switching", "w.weissman.cgg"], ["fat-tailed", "w.weissman.fattail"], ["penalized for the absent", "w.eric.fcs.s2"]];
for (const [phrase, ref] of sigs) {
  const hits = C.claims.filter((c) => c.spec.statement.includes(phrase));
  ok(hits.length === 1 && hits[0].spec.ref === ref, `the "${phrase}" reconstruction signature appears only in ${ref} (${hits.map((h) => h.spec.ref).join(", ") || "none"})`);
}

// =====================================================================================
console.log("\n" + H);
if (fails) { console.log(`check-covid: ${fails} FAILURE(S)`); process.exit(1); }
console.log("verified: the origins crux resolves to the four priors at more than one depth, terminating in withheld-record gaps carried as characterized leaps.");
console.log("check-covid: OK"); console.log(H);
void crux;
