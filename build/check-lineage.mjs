// Role: the lineage oracle (fourth and fifth cases), modeled on build/check-covid.mjs. Verifies the
//   STRUCTURE and REPORTS the gate's grading, because the demotions are the finding, not a failure to
//   fix. It confirms sources resolve, the conjecture is a declaration on five gaps with no contradicts
//   touching it, the retraction measurement reaches checked, the institutional declarations self-warrant,
//   and the fifth case (net.*) lands as a held-open contest: recentralization-versus-federation present,
//   the crux supported from both sides, the concentration gap a forum weighing with a closing condition,
//   and no net.* claim demoting. Overclaims are findings, not forced through.
// Contract: `node build/check-lineage.mjs` exits non-zero only on a STRUCTURAL failure. Imports the kernel
//   and the shared lineage builder; touches no truth field.
// Invariant: the reports propose claims; the gate decides what they are worth. A declared-above-earned
//   claim is reported as a finding, not forced through, and the corpus is not tuned to erase it.
"use strict";
import { collapsedRank } from "../kernel/schema/confidence.mjs";
import { buildLineage } from "./lineage-build.mjs";

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-LINEAGE (fourth and fifth cases): the kernel's mechanisms run by hand, and the internet's own trust lineage, priced by the gate"); console.log(H);

const C = buildLineage();
const id = (ref) => C.refId.get(ref);
const earned = (ref) => (C.view.earnedByIdentity.get(id(ref)) || { earned: "ungraded" }).earned;
const specOf = (ref) => (C.claims.find((c) => c.spec.ref === ref) || {}).spec;
const gradeRank = (g) => collapsedRank(g === "checked" || g === "independently-rechecked" || g === "constitutive" ? "settled" : g);

// ---------------------------------------------------------------------------------------------
console.log("\n[A] every claim carries provenance that resolves");
const srcIds = new Set(C.tables.sourceTable.byId.keys());
let noProv = 0;
for (const { spec } of C.claims) if (!srcIds.has(spec.source_id)) { noProv++; if (noProv <= 3) console.log(`      unresolved source ${spec.source_id} on ${spec.ref}`); }
ok(noProv === 0, `all ${C.claims.length} claims resolve their source_id to a real SOURCES row`);

// ---------------------------------------------------------------------------------------------
console.log("\n[B] the novelty conjecture is a declaration resting on five independent near-miss gaps");
const conj = specOf("conj.novelty");
ok(conj && conj.kind === "declaration", "the conjecture is a single declaration-kind claim");
ok(conj && conj.declared_grade === "supported", "the conjecture is declared supported, not the corroborated the map self-assigned");
const gapSupports = C.graph.links.filter((l) => l.link_kind === "supports" && l.to_identity === id("conj.novelty"));
const gapGroups = new Set(gapSupports.map((l) => l.support_group));
ok(gapSupports.length === 5, `five gap claims support the conjecture (found ${gapSupports.length})`);
ok(gapGroups.size === 5, `each gap is its own support_group, so convergence is visible (found ${gapGroups.size} groups)`);
ok(conj && conj.closing_condition, "the conjecture carries a closing condition (a demonstration composing all five axes)");

// ---------------------------------------------------------------------------------------------
console.log("\n[C] the novelty conjecture has no counterexample: no contradicts link touches it");
const conjId = id("conj.novelty");
const contradictsConj = C.graph.links.filter((l) => l.link_kind === "contradicts" && (l.from_identity === conjId || l.to_identity === conjId));
ok(contradictsConj.length === 0, "no contradicts link touches the novelty conjecture: the falsification search found no system composing all five axes (the fifth case's own contest is internal to it, not a counterexample to the conjecture)");

// ---------------------------------------------------------------------------------------------
console.log("\n[D] the one genuinely replicated measurement reaches the empirical floor");
ok(earned("sci.retraction-unack") === "checked", `the retraction non-acknowledgment measurement (5.4% acknowledge, independently attested) earns checked (got ${earned("sci.retraction-unack")})`);
// the single-source measurements do not: they are quantified but unreplicated.
const singleSourceMeas = ["cl.citator-error", "cl.override-lag", "sw.transitive-count", "sw.log4shell", "map.scite-fmeasure"];
ok(singleSourceMeas.every((r) => earned(r) === "asserted"), "the single-source measurements (citator error, transitive count, Log4Shell, scite F-measure) ground only to asserted, unreplicated");

// ---------------------------------------------------------------------------------------------
console.log("\n[E] the institutional declarations self-warrant to the declaration floor");
const decls = ["wiki.verifiability", "sci.fixed-free", "jour.two-source", "acct.typed-floors", "wiki.five-pillars"];
ok(decls.every((r) => earned(r) === "constitutive"), "the stated institutional principles (verifiability-not-truth, the Five Pillars, GAAP, CONSORT, the two-source rule) reach the constitutive floor");

// ---------------------------------------------------------------------------------------------
console.log("\n[F] the gate priced the corpus producer-agnostically: overclaims are findings, not forced through");
const demotions = [];
for (const { spec } of C.claims) { const e = earned(spec.ref); if (gradeRank(e) < gradeRank(spec.declared_grade)) demotions.push({ ref: spec.ref, declared: spec.declared_grade, earned: e }); }
const gmAbove = (C.receipt.findings || []).filter((f) => f.rule_id === "GM-ABOVE");
ok(gmAbove.length === demotions.length, `every demotion is a reported GM-ABOVE finding (${demotions.length} demotions, ${gmAbove.length} findings), none forced through`);
ok(C.receipt.decision === "declined", "the gate declined the contribution as proposed rather than admitting an overclaim: the case is not tuned green");

// ---------------------------------------------------------------------------------------------
console.log("\n[G] the fifth case (the internet trust lineage) lands as a contest the gate holds open");
const netClaims = C.claims.filter((c) => c.spec.ref.startsWith("net."));
ok(netClaims.length >= 25, `the fifth case adds its net.* claims across three acts (found ${netClaims.length})`);
ok(specOf("net.disanalogy") && specOf("net.disanalogy").kind === "declaration", "the disanalogy is a declaration: the mapping holds at the trust-architecture layer and never at the content layer");
const recId = id("net.recentralization"), fedId = id("net.federation-survived");
const contest = C.graph.links.filter((l) => l.link_kind === "contradicts" && ((l.from_identity === fedId && l.to_identity === recId) || (l.from_identity === recId && l.to_identity === fedId)));
ok(contest.length === 1, "the contradicts contest between net.recentralization and net.federation-survived is present, held open by the gate rather than settled");
const cruxId = id("net.crux-metric");
const cruxFrom = new Set(C.graph.links.filter((l) => l.link_kind === "supports" && l.to_identity === cruxId).map((l) => l.from_identity));
ok(cruxFrom.has(recId) && cruxFrom.has(fedId), "net.crux-metric receives support from both sides of the contest: the dispute resolves to the measurement layer");
const netUnresolved = netClaims.filter((c) => !srcIds.has(c.spec.source_id));
ok(netUnresolved.length === 0, `every net.* claim resolves its source (${netClaims.length} claims, ${netUnresolved.length} unresolved)`);
const gapSpec = specOf("net.concentration-gap");
ok(gapSpec && gapSpec.kind === "forum" && gapSpec.closing_condition && gapSpec.closing_condition.condition_kind === "direct-study", "net.concentration-gap is a forum weighing carrying a typed closing condition: the absent cross-layer measure named as what would close it");
// the net.* claims are declared to land at what they earn (measurements at asserted with no distinct-party
// attestation, declarations self-warranting), so zero of them should demote. This is REPORTED, not gated:
// a demotion here is a finding like any other, surfaced in the report below, never a structural failure.
const netDemotions = demotions.filter((d) => d.ref.startsWith("net."));
console.log(`      reported: ${netDemotions.length} net.* demotion(s) (the landed corpus expects zero; a demotion is a finding, not a structural failure)`);

// =============================================================================================
// the honest report: what the gate priced, which the corpus does not tune away.
const dist = {};
for (const { spec } of C.claims) { const e = earned(spec.ref); dist[e] = (dist[e] || 0) + 1; }
console.log("\n" + H);
console.log("THE FINDING (reported, not fixed): the gate's grading of the lineage");
console.log(H);
console.log(`  claims: ${C.claims.length}. earned-grade distribution: ` + Object.entries(dist).sort((a, b) => gradeRank(b[0]) - gradeRank(a[0])).map(([g, n]) => `${n} ${g}`).join(", "));
console.log(`  admitted at declared: ${C.claims.length - demotions.length}. demoted (declared above earned): ${demotions.length}.`);
for (const d of demotions) console.log(`    - ${d.ref}: declared ${d.declared}, earned ${d.earned}`);
console.log("  the load-bearing conjecture, declared supported, earns only " + earned("conj.novelty") + ": it rests on five single-source architectural readings, so its apparent convergence does not lift it, and the gate does not force it through.");
console.log("  weakly grounded parallels: most of the lineage earns asserted, single-source institutional readings; the reports' self-declared checked and corroborated grades were flattery the evidence does not earn.");
console.log("  load-bearing parallels: the retraction measurement (checked, independently replicated) and the institutional declarations (constitutive floor) are where the lineage genuinely grounds.");
console.log(H);

if (fails) { console.log(`\ncheck-lineage: ${fails} FAILURE(S)`); process.exit(1); }
console.log("verified: the kernel prices the lineage producer-agnostically; every claim declaring above what it earns is a reported finding and none is forced through; the conjecture rests on five independent gaps and grounds only as far as its single-source evidence allows.");
console.log(`\ncheck-lineage: OK (${C.claims.length} claims priced by the gate, ${demotions.length} demotions reported, the retraction at checked, the conjecture honestly at ${earned("conj.novelty")})`);
console.log(H);
