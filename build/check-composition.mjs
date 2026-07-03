// Role: the composition-layer oracle (Prompt 19). Proves the composite store on synthetic fixtures:
//   the cross-store citation copies the domain grade and never assigns it, the grounding transfer
//   folds necessary carried grades under one min with the settled-collapse making it well defined,
//   a forum-band citation carries the forum value through, and staleness is a read that leaves the
//   citation intact. Grows across the phases; Phase A is sections 1 to 6.
// Contract: `node build/check-composition.mjs` exits non-zero on any failure. Imports the v3 kernel
//   and the composition layer only; no case data is touched (the corpus stays closed at zero gaps).
// Invariant: a re-run is byte-identical. Every carried grade is a copy of the domain store's own
//   derivation; the composite computes only the grade of the claim it owns.
"use strict";
import { claimRecord } from "../kernel/schema/records.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { makeState, GENESIS_MARKER } from "../kernel/store/state.mjs";
import { hashOf } from "../kernel/schema/canonical.mjs";
import { leqWithinMode } from "../kernel/schema/confidence.mjs";
import { citationRecord, compositeClaimRecord } from "../kernel/composition/records.mjs";
import { domainGradeOf, citeDomainClaim, compositeGrade, isStale } from "../kernel/composition/transfer.mjs";

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-COMPOSITION (Prompt 19): typed domain stores compose into a composite store"); console.log(H);

// ---- the domain layer: two reference tables and four domain claims at known grades ----
const sources = makeSourceTable([
  { source_id: "s-hlth-a", source_class: "primary-measurement", rests_on: [] },
  { source_id: "s-hlth-b", source_class: "primary-measurement", rests_on: [] },
  { source_id: "s-econ", source_class: "dataset", rests_on: [] },
  { source_id: "s-decl", source_class: "institutional-report", rests_on: [] },
]);
const kinds = makeKindTable([
  { kind: "health-measurement", ceiling: "independently-rechecked" },
  { kind: "econ-measurement", ceiling: "checked" },
  { kind: "principle", ceiling: "constitutive" },
  { kind: "estimate", ceiling: "corroborated" },
]);
const tables = { sourceTable: sources, kindTable: kinds };
const chk = (id, cls) => ({ checker_id: id, method_class: cls, method: "audited", checked_at_state: "s0", outcome: "confirms", independence: "distinct-party" });

// D1: a health measurement rechecked by two distinct parties -> independently-rechecked (settled, empirical)
const D1 = claimRecord({
  kind: "health-measurement", statement: "the intervention adds 0.8 quality-adjusted life years per patient",
  source_id: "s-hlth-a", contributor_id: "lab-h", declared_grade: "independently-rechecked",
  checking_records: [chk("c1", "replication"), chk("c2", "replication")],
});
// D2: an economic measurement audited once -> checked (settled, empirical)
const D2 = claimRecord({
  kind: "econ-measurement", statement: "the intervention costs 12000 dollars per patient",
  source_id: "s-econ", contributor_id: "lab-e", declared_grade: "checked", checking_records: [chk("e1", "data-audit")],
});
// D3: a constitutive principle -> constitutive (settled, constitutive mode: incomparable to empirical)
const D3 = claimRecord({
  kind: "principle", statement: "a life-year is counted equally regardless of whose it is",
  source_id: "s-decl", contributor_id: "norm", declared_grade: "constitutive",
});
// D4: a bare estimate, no basis and no support -> asserted (open, forum band)
const D4 = claimRecord({
  kind: "estimate", statement: "the program will reach about 4000 patients",
  source_id: "s-econ", contributor_id: "lab-e", declared_grade: "asserted",
});

// the domain stores, each a v3 store state at genesis
const storeHealth = { store_id: "S-health", state: makeState({ prior_state_hash: GENESIS_MARKER, entries: [D1] }), tables };
const storeEcon = { store_id: "S-econ", state: makeState({ prior_state_hash: GENESIS_MARKER, entries: [D2, D4] }), tables };
const storeNorm = { store_id: "S-norm", state: makeState({ prior_state_hash: GENESIS_MARKER, entries: [D3] }), tables };

const MADE = "2026-01-01T00:00:00Z";

// =====================================================================================
console.log("\n[1] the cross-store citation copies the domain grade");
const c1 = citeDomainClaim(storeHealth, { citing_claim: "CC-basic", cited_claim: D1.identity, role: "necessary", made_at: MADE });
ok(domainGradeOf(storeHealth.state, D1.identity, tables) === "independently-rechecked", "the domain store derives independently-rechecked for D1");
ok(c1.carried_grade === "independently-rechecked", "the citation carries the domain store's grade, copied");
ok(c1.cited_state === storeHealth.state.state_hash, "the citation names the state it was made against");
ok(c1.source_store === "S-health" && c1.cited_claim === D1.identity, "the citation names the source store and the cited claim");
ok(!!c1.hash && !!c1.citation_id, "the citation is a hashed record with a content identity");
const c1b = citeDomainClaim(storeHealth, { citing_claim: "CC-basic", cited_claim: D1.identity, role: "corroborating", made_at: "2026-02-02T00:00:00Z" });
ok(c1b.citation_id === c1.citation_id, "identity is the reference itself: role/state/grade do not change it");

// =====================================================================================
console.log("\n[2] carried_grade is copied, not assigned; the composite owns no domain claim");
const ccBasic = compositeClaimRecord({ statement: "the intervention is worth funding on health grounds", region: "floor", support: [c1.citation_id] });
ok(ccBasic.claim_id !== D1.identity, "the composite claim is a distinct claim, not the domain claim it cites");
// mutate the domain store: D1 withdrawn (a new state where D1 is absent). The citation is a copy,
// so its carried_grade does not move with the domain store; only re-derivation would update it.
const storeHealth2 = { store_id: "S-health", state: makeState({ prior_state_hash: storeHealth.state.state_hash, entries: [] }), tables };
ok(domainGradeOf(storeHealth2.state, D1.identity, tables) === "ungraded", "the domain store now derives ungraded for the withdrawn D1");
ok(c1.carried_grade === "independently-rechecked", "the citation's carried_grade is unchanged: it is a copy, not a live read");

// =====================================================================================
console.log("\n[3] the transfer: min of carried grades, settled-collapse making it well defined");
const cD1 = citeDomainClaim(storeHealth, { citing_claim: "CC-cross", cited_claim: D1.identity, role: "necessary", made_at: MADE });
const cD3 = citeDomainClaim(storeNorm, { citing_claim: "CC-cross", cited_claim: D3.identity, role: "necessary", made_at: MADE });
ok(cD1.carried_grade === "independently-rechecked" && cD3.carried_grade === "constitutive", "two settled citations, one empirical and one constitutive");
ok(leqWithinMode(cD1.carried_grade, cD3.carried_grade).comparable === false, "the two settled grades are incomparable within their modes: a naive min is undefined");
const gCross = compositeGrade({ ceiling: "settled", citations: [cD1, cD3] });
ok(gCross === "settled", "the composite grade is settled: the settled-collapse makes the min well defined across the tier");

// =====================================================================================
console.log("\n[4] a forum-band citation carries the forum value through the min");
const cD2 = citeDomainClaim(storeEcon, { citing_claim: "CC-forum", cited_claim: D2.identity, role: "necessary", made_at: MADE });
const cD4 = citeDomainClaim(storeEcon, { citing_claim: "CC-forum", cited_claim: D4.identity, role: "necessary", made_at: MADE });
ok(cD2.carried_grade === "checked" && cD4.carried_grade === "asserted", "one settled citation (checked) and one forum-band citation (asserted)");
ok(compositeGrade({ ceiling: "settled", citations: [cD2, cD4] }) === "asserted", "the composite takes the forum value: forum sits below floor on the scale");
ok(compositeGrade({ ceiling: "settled", citations: [cD2] }) === "settled", "citing only the settled claim, the composite reaches the floor");

// corroborating citations are visible but absent from the computation
const cD4corr = citeDomainClaim(storeEcon, { citing_claim: "CC-corr", cited_claim: D4.identity, role: "corroborating", made_at: MADE });
ok(compositeGrade({ ceiling: "settled", citations: [cD2, cD4corr] }) === "settled", "a corroborating forum citation does not drag the grade down");

// =====================================================================================
console.log("\n[5] staleness is a read that leaves the citation intact");
const cStale = citeDomainClaim(storeEcon, { citing_claim: "CC-stale", cited_claim: D2.identity, role: "necessary", made_at: MADE });
const beforeHash = cStale.hash, beforeGrade = cStale.carried_grade;
const Dnew = claimRecord({ kind: "estimate", statement: "a later revision recorded here", source_id: "s-econ", contributor_id: "lab-e", declared_grade: "asserted" });
const storeEcon2State = makeState({ prior_state_hash: storeEcon.state.state_hash, entries: [D2, D4, Dnew] });
ok(!isStale(cStale, storeEcon.state.state_hash), "against the state it was made on, the citation is current");
ok(isStale(cStale, storeEcon2State.state_hash), "against the advanced store state, the citation reads as stale");
ok(cStale.hash === beforeHash && cStale.carried_grade === beforeGrade, "staleness changed nothing about the citation record");

// =====================================================================================
console.log("\n[6] a re-run is byte-identical");
function buildDigest() {
  const sH = { store_id: "S-health", state: makeState({ prior_state_hash: GENESIS_MARKER, entries: [D1] }), tables };
  const sE = { store_id: "S-econ", state: makeState({ prior_state_hash: GENESIS_MARKER, entries: [D2, D4] }), tables };
  const sN = { store_id: "S-norm", state: makeState({ prior_state_hash: GENESIS_MARKER, entries: [D3] }), tables };
  const a = citeDomainClaim(sH, { citing_claim: "CC", cited_claim: D1.identity, role: "necessary", made_at: MADE });
  const b = citeDomainClaim(sN, { citing_claim: "CC", cited_claim: D3.identity, role: "necessary", made_at: MADE });
  const e = citeDomainClaim(sE, { citing_claim: "CC", cited_claim: D2.identity, role: "necessary", made_at: MADE });
  const f = citeDomainClaim(sE, { citing_claim: "CC", cited_claim: D4.identity, role: "necessary", made_at: MADE });
  const cc = compositeClaimRecord({ statement: "digest composite", region: "forum", support: [a.citation_id, b.citation_id, e.citation_id, f.citation_id] });
  return hashOf({
    hashes: [a.hash, b.hash, e.hash, f.hash, cc.hash],
    grades: [compositeGrade({ ceiling: "settled", citations: [a, b] }), compositeGrade({ ceiling: "settled", citations: [e, f] })],
  });
}
ok(buildDigest() === buildDigest(), "two runs of the fixture build produce an identical digest");

// =====================================================================================
console.log("\n" + H);
if (fails) { console.log(`check-composition: ${fails} FAILURE(S)`); process.exit(1); }
console.log("check-composition: OK"); console.log(H);
