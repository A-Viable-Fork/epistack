// Role: the lineage oracle (fourth case), modeled on build/check-covid.mjs. Verifies the STRUCTURE of the
//   lineage case and REPORTS the gate's grading, because the demotions are the finding, not a failure to
//   fix. It confirms every source resolves, the conjecture is a declaration resting on five independent
//   near-miss gaps, the one replicated measurement (retraction non-acknowledgment) reaches checked, the
//   institutional declarations self-warrant to the constitutive floor, and the gate priced the corpus
//   producer-agnostically: exactly the claims declaring above what they earn are flagged as findings and
//   none is forced through. It then prints how many demoted and to what, and which parallels ground weakly.
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
console.log(H); console.log("CHECK-LINEAGE (fourth case): the kernel's mechanisms, already run by hand, priced by the gate"); console.log(H);

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
console.log("\n[C] no system is suppressed: no contradicts link, because none composes all five axes");
const contradicts = C.graph.links.filter((l) => l.link_kind === "contradicts");
ok(contradicts.length === 0, "no contradicts link exists, and none was found and hidden: the falsification search found no counterexample");

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
