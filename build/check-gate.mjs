// Role: the v3 gate kernel's oracle (intake data model v3). Runs the acceptance suite phase by
//   phase; the tests are the deliverable as much as the code, because the core is trusted only
//   because it is mechanically checkable. Phase A: the canonical form, the records, the confidence
//   order, the reference tables.
// Contract: `node build/check-gate.mjs`. Exits 0 if every assertion holds, 1 with a report. Imports
//   only kernel v3 modules and Node's standard library.
// Invariant: read-only; asserts determinism (byte-exact canonical forms, no float on the path) and
//   the spec's exact record fields and allowed values.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { canonicalize, encode, hashOf, isExactDecimal } from "../kernel/schema/canonical.mjs";
import * as CONF from "../kernel/schema/confidence.mjs";
import * as R from "../kernel/schema/records.mjs";
import { makeSourceTable, makeKindTable, ceilingFor, footprintClosure } from "../kernel/schema/tables.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); };
const eq = (a, b, msg) => ok(a === b, `${msg} (got ${JSON.stringify(a)} vs ${JSON.stringify(b)})`);
const throws = (fn, msg) => { try { fn(); ok(false, `${msg} (did not throw)`); } catch { ok(true, msg); } };

// ================= PHASE A =================

// --- A.1 same content, different field order + equivalent whitespace -> identical bytes and hash ---
{
  const c1 = R.claimRecord({ kind: "measurement", statement: "  A market cluster.\r\n", source_id: "S1", contributor_id: "P1", declared_grade: "asserted" });
  const c2 = R.claimRecord({ declared_grade: "asserted", contributor_id: "P1", statement: "A market cluster.", source_id: "S1", kind: "measurement" });
  eq(encode(c1.canonical), encode(c2.canonical), "A.1 canonical bytes identical across field order + equivalent whitespace");
  eq(c1.hash, c2.hash, "A.1 hash identical");
  eq(c1.identity, c2.identity, "A.1 identity identical");
  const c3 = R.claimRecord({ kind: "measurement", statement: "A  market cluster.", source_id: "S1", contributor_id: "P1", declared_grade: "asserted" });
  ok(c3.hash !== c1.hash, "A.1 interior whitespace is content: different hash");
}

// --- A.2 array policies: sequence keeps order; reference sorts + dedups; child sorts ---
{
  eq(encode(canonicalize(["c", "a", "b", "a"], "sequence")), encode(["c", "a", "b", "a"]), "A.2 sequence child list preserves authored order");
  eq(encode(canonicalize(["c", "a", "b", "a"], "reference")), encode(["a", "b", "c"]), "A.2 reference list sorts and drops exact duplicates");
  eq(encode(canonicalize(["c", "a", "b", "a"], "child")), encode(["a", "a", "b", "c"]), "A.2 non-sequence child list sorts to canonical order (spec scopes dedup to reference lists)");
}

// --- A.3 exact-decimal round-trips verbatim; nothing parses a stored value to a float ---
{
  ok(isExactDecimal("1.5") && isExactDecimal("0") && isExactDecimal("-3.25"), "A.3 exact-decimals accepted");
  ok(!isExactDecimal("1.50") && !isExactDecimal("01") && !isExactDecimal("1e3") && !isExactDecimal("-0"), "A.3 non-canonical decimals rejected");
  eq(encode(canonicalize("1.5", "decimal")), "1.5", "A.3 exact-decimal encodes as a bare verbatim token");
  ok(encode(canonicalize("1.5", "decimal")) !== encode(canonicalize("1.5")), "A.3 a decimal 1.5 and the text \"1.5\" are distinct content");
  throws(() => canonicalize("1.50", "decimal"), "A.3 a non-canonical decimal (trailing zero) is rejected, not silently reparsed");
  throws(() => canonicalize(1.5), "A.3 a JS number on the canonical path throws (no float anywhere)");
  // static: no float-parsing call anywhere on the v3 kernel path (the stored-value path). The test
  // oracle itself is excluded: the scan pattern below names those tokens and would self-match.
  const v3 = ["kernel/schema/canonical.mjs", "kernel/schema/confidence.mjs", "kernel/schema/records.mjs", "kernel/schema/tables.mjs"];
  const FLOAT = /\b(parseFloat|parseInt|Number\s*\(|Math\.(round|floor|ceil|trunc))/;
  for (const f of v3) ok(!FLOAT.test(readFileSync(join(ROOT, f), "utf8").replace(/^\/\/.*$/gm, "")), `A.3 no float/number parse in ${f}`);
}

// --- A.4 a check ignores extension-area fields while the hash includes them ---
{
  const base = R.claimRecord({ kind: "measurement", statement: "S", source_id: "S1", contributor_id: "P1", declared_grade: "asserted" });
  const withExt = R.claimRecord({ kind: "measurement", statement: "S", source_id: "S1", contributor_id: "P1", declared_grade: "asserted", note_only: "reader note", debug: { x: "y" } });
  ok(withExt.hash !== base.hash, "A.4 the hash includes extension-area fields");
  ok(withExt.canonical.extensions && encode(withExt.canonical.extensions).includes("note_only"), "A.4 undeclared fields moved into the extension map");
  // a check reads named fields only; declared identity/kind/statement are unaffected by extensions
  eq(withExt.identity, base.identity, "A.4 identity (a checked field) ignores extensions");
  eq(withExt.declared_grade, base.declared_grade, "A.4 declared_grade (a checked field) ignores extensions");
  ok(!("note_only" in withExt) , "A.4 the record view exposes no undeclared field to checks");
}

// --- A.5 every record exists with exactly the spec's fields and allowed values ---
{
  const link = R.linkRecord({ link_kind: "supports", from_identity: "IDa", to_identity: "IDb", support_group: "g1", source_id: "S1", contributor_id: "P1", declared_grade: "corroborated" });
  eq(link.link_kind, "supports", "A.5 link record built");
  ok(link.support_group === "g1", "A.5 support_group present on supports link");
  throws(() => R.linkRecord({ link_kind: "depends-on", from_identity: "a", to_identity: "b", support_group: "g", source_id: "S1", contributor_id: "P1", declared_grade: "asserted" }), "A.5 support_group rejected on non-supports link");
  throws(() => R.linkRecord({ link_kind: "bogus", from_identity: "a", to_identity: "b", source_id: "S1", contributor_id: "P1", declared_grade: "asserted" }), "A.5 bad link_kind rejected");
  throws(() => R.claimRecord({ kind: "measurement", statement: "S", source_id: "S1", contributor_id: "P1", declared_grade: "not-a-grade" }), "A.5 non-position grade rejected");
  R.wellFormednessFinding({ contribution_hash: "H", entry_locator: "0", field_path: "kind", rule_id: "WF-007", expected: "one of the kind table", found: "absent" });
  throws(() => R.wellFormednessFinding({ contribution_hash: "H", entry_locator: "0", field_path: "extensions.x", rule_id: "WF-1" }), "A.5 WF field_path never points into extensions");
  R.referenceBindingRow({ reference_locator: "IDx#to_identity", target_identity: "IDy", resolution: "bound", bound_state: "ST", stored_grade: "checked" });
  throws(() => R.referenceBindingRow({ reference_locator: "L", target_identity: "T", resolution: "bogus" }), "A.5 bad binding resolution rejected");
  const contra = R.contradictionRecord({ identity_a: "A", identity_b: "B", link_identity: "L", grade_a: "checked", grade_b: "asserted", divergence_points: [{ point_identity: "P", present_in: "a-only", group_context: "g1" }] });
  eq(contra.divergence_points.length, 1, "A.5 contradiction record with a divergence point built");
  throws(() => R.contradictionRecord({ identity_a: "A", identity_b: "A", link_identity: "L", grade_a: "asserted", grade_b: "asserted" }), "A.5 contradiction requires two distinct identities");
  const wd = R.withdrawnClaimRecord({ claim_identity: "C", withdrawn_at_state: "ST", withdrawn_by: "H", reason: "superseded by newer data", reinstatement_condition: { condition_kind: "entry-at-grade", target_identity: "C", minimum_grade: "checked" } });
  eq(wd.reinstatement_condition.condition_kind, "entry-at-grade", "A.5 withdrawn record + typed reinstatement condition built");
  throws(() => R.reinstatementCondition({ condition_kind: "entry-at-grade", target_identity: "C" }), "A.5 entry-at-grade requires minimum_grade");
  const corr = R.corroborationFinding({ identity: "C", closure_members: ["C"], support_groups: [], verdict: "disjoint", effective_count: 2, disjoint_footprints: [["S1"], ["S2"]], coverage_note: R.coverageNote("v1") });
  ok(corr.verdict === "disjoint" && corr.coverage_note.includes("invisible to this check"), "A.5 corroboration finding built with mandatory coverage note");
  throws(() => R.corroborationFinding({ identity: "C", verdict: "disjoint", effective_count: 1 }), "A.5 corroboration requires a coverage note");
}

// --- A.6 the confidence order: enumerated lattice, meet/join, floor-collapse, branched settled tier ---
{
  eq(CONF.collapse("checked"), "settled", "A.6 checked collapses to settled");
  eq(CONF.collapse("constitutive"), "settled", "A.6 constitutive collapses to settled");
  eq(CONF.meet("settled", "asserted"), "asserted", "A.6 meet is weakest-of on the collapsed line");
  eq(CONF.join("supported", "corroborated"), "corroborated", "A.6 join is strongest-of on the collapsed line");
  ok(CONF.comparableWithinMode("checked", "independently-rechecked"), "A.6 empirical settled positions are comparable");
  ok(!CONF.comparableWithinMode("constitutive", "checked"), "A.6 constitutive and checked are incomparable across modes");
  ok(CONF.leqWithinMode("checked", "independently-rechecked").leq, "A.6 checked <= independently-rechecked within the empirical axis");
  ok(!CONF.leqWithinMode("independently-rechecked", "checked").leq, "A.6 independently-rechecked is not <= checked");
}

// --- A.7 the reference tables: ceilings with mode, and the source-footprint closure ---
{
  const kinds = makeKindTable([
    { kind: "definition", ceiling: "constitutive", compatibility_rule_id: "CMP-1" },
    { kind: "measurement", ceiling: "independently-rechecked", compatibility_rule_id: "CMP-2" },
    { kind: "forecast", ceiling: "corroborated", compatibility_rule_id: "CMP-3" },
  ]);
  eq(ceilingFor(kinds, "definition").mode, "constitutive", "A.7 definition ceiling is constitutive mode");
  eq(ceilingFor(kinds, "measurement").mode, "empirical", "A.7 measurement ceiling is empirical mode");
  eq(ceilingFor(kinds, "forecast").position, "corroborated", "A.7 forecast ceilings at corroborated");
  const src = makeSourceTable([
    { source_id: "S1", source_class: "primary-measurement", rests_on: [] },
    { source_id: "S2", source_class: "peer-reviewed", rests_on: ["S1"] },
    { source_id: "S3", source_class: "preprint", rests_on: ["S2"] },
  ]);
  const fp = footprintClosure(src, ["S3"]);
  ok(fp.has("S3") && fp.has("S2") && fp.has("S1"), "A.7 footprint closure is reflexive-transitive over rests_on");
}

// ================= PHASE B =================
import { earnedGrade } from "../kernel/grounding/earned-grade.mjs";
import { decide } from "../kernel/gate/gate.mjs";

// --- B.1 the earned-grade rule reproduces all seven cases of Section 9 ---
{
  const emp = "independently-rechecked", con = "constitutive";
  const dp = [{ independence: "distinct-party", footprint: ["c1"] }];
  const eg = (a) => earnedGrade(a);
  eq(eg({ ceiling: emp, checkingRecords: dp, supports: [{ group: "g", linkGrade: "checked", supportEarned: "corroborated", footprint: ["s1"] }] }).earned, "checked", "B.1 case 1: checked basis over corroborated support -> checked");
  eq(eg({ ceiling: emp, checkingRecords: dp, supports: [{ group: "g", linkGrade: "checked", supportEarned: "asserted", footprint: ["s1"] }] }).earned, "asserted", "B.1 case 2: a checking record does not rescue an asserted necessary premise");
  eq(eg({ ceiling: emp, checkingRecords: [], supports: [{ group: "g", linkGrade: emp, supportEarned: "checked", footprint: ["s1"] }] }).earned, "corroborated", "B.1 case 3: settled support, no own basis -> corroborated");
  eq(eg({ ceiling: emp, checkingRecords: [], supports: [{ group: "g", linkGrade: "corroborated", supportEarned: "corroborated", footprint: ["s1"] }] }).earned, "corroborated", "B.1 case 4: corroborated support, no own basis -> corroborated");
  eq(eg({ ceiling: con, constitutive: true, checkingRecords: [], supports: [] }).earned, "constitutive", "B.1 case 5: constitutive kind, no supports -> constitutive");
  eq(eg({ ceiling: emp, checkingRecords: [], supports: [] }).earned, "asserted", "B.1 case 6: nothing and no basis -> asserted");
  eq(eg({ ceiling: emp, checkingRecords: dp, supports: [] }).earned, "checked", "B.1 case 7: a directly checked leaf earns its basis");
}

// --- gate fixtures ---
const KINDS = makeKindTable([
  { kind: "measurement", ceiling: "independently-rechecked", compatibility_rule_id: "CMP-M" },
  { kind: "definition", ceiling: "constitutive", compatibility_rule_id: "CMP-D" },
  { kind: "forecast", ceiling: "corroborated", compatibility_rule_id: "CMP-F" },
]);
const SRC = makeSourceTable([
  { source_id: "S1", source_class: "primary-measurement", rests_on: [] },
  { source_id: "S2", source_class: "peer-reviewed", rests_on: [] },
  { source_id: "S3", source_class: "dataset", rests_on: [] },
]);
const mkStore = (o = {}) => ({ stateHash: "ST0", earnedByIdentity: new Map(), restatementLinks: [], withdrawnRecords: [], kindOf: new Map(), sourceTable: SRC, kindTable: KINDS, ...o });
const claim = (kind, statement, declared_grade, checking_records) => R.claimRecord({ kind, statement, source_id: "S1", contributor_id: "P1", declared_grade, checking_records });
const distinctCheck = { checker_id: "C2", method_class: "replication", method: "re-ran", checked_at_state: "ST0", outcome: "confirms", independence: "distinct-party" };
const selfCheck = { checker_id: "P1", method_class: "replication", method: "self", checked_at_state: "ST0", outcome: "confirms", independence: "self" };

// --- B.2 admit when declared <= earned within mode; decline a settled grade whose mode the basis can't provide ---
{
  const admit = decide({ hash: "H1", entries: [claim("measurement", "m1", "checked", [distinctCheck])], links: [] }, mkStore());
  eq(admit.decision, "accepted", "B.2 measurement with a distinct-party check declaring checked is admitted");
  const below = decide({ hash: "H2", entries: [claim("measurement", "m1", "asserted", [distinctCheck])], links: [] }, mkStore());
  eq(below.decision, "accepted", "B.2 declared below earned is accepted (recorded as declared)");
  const modeMismatch = decide({ hash: "H3", entries: [claim("definition", "d1", "checked", [])], links: [] }, mkStore());
  eq(modeMismatch.decision, "declined", "B.2 a definition declaring the empirical 'checked' is declined (mode its constitutive basis cannot provide)");
  ok(modeMismatch.decision_basis.includes("GM-MODE"), "B.2 decline basis names the mode rule");
}

// --- B.3 self-only checking record earns open; a supported-grade necessary premise cannot reach settled ---
{
  const selfOnly = decide({ hash: "H4", entries: [claim("measurement", "m2", "checked", [selfCheck])], links: [] }, mkStore());
  eq(selfOnly.grade_table[0].earned_grade, "asserted", "B.3 a self-only checking record contributes no basis: earns the open grade");
  eq(selfOnly.decision, "declined", "B.3 declaring settled over a self-only record is declined");

  // a claim with its own distinct-party check but resting on a supported-grade necessary premise
  const c = claim("measurement", "m3", "supported", [distinctCheck]);
  const sup = R.linkRecord({ link_kind: "supports", from_identity: "PREMISE", to_identity: c.identity, support_group: "g1", source_id: "S1", contributor_id: "P1", declared_grade: "checked" });
  const store = mkStore({ earnedByIdentity: new Map([["PREMISE", { earned: "supported", mode: null, inForce: true }]]), kindOf: new Map([["PREMISE", "measurement"]]) });
  const r = decide({ hash: "H5", entries: [c], links: [sup] }, store);
  eq(r.grade_table[0].earned_grade, "supported", "B.3 a supported-grade necessary premise caps the claim at supported: cannot reach settled");
  eq(r.grade_table[0].B, "checked", "B.3 the own basis is real (checked)"); eq(r.grade_table[0].S, "supported", "B.3 but delivery S is only supported");
}

// --- B.4 withdrawn-claim check: reinstatement condition, and the reworded case once a restatement link joins ---
{
  const W = claim("measurement", "claim W", "asserted", []);
  const wrec = R.withdrawnClaimRecord({ claim_identity: W.identity, withdrawn_at_state: "ST0", withdrawn_by: "H0", reason: "retracted", reinstatement_condition: { condition_kind: "entry-at-grade", target_identity: W.identity, minimum_grade: "checked" } });
  const store = mkStore({ withdrawnRecords: [wrec] });

  const fail = decide({ hash: "H6", entries: [claim("measurement", "claim W", "asserted", [])], links: [] }, store);
  eq(fail.decision, "declined", "B.4 reintroduction that fails the reinstatement condition is declined");
  ok(fail.withdrawn_matches[0] && fail.withdrawn_matches[0].satisfaction === "unsatisfied", "B.4 the withdrawn match is unsatisfied");

  const pass = decide({ hash: "H7", entries: [claim("measurement", "claim W", "checked", [distinctCheck])], links: [] }, store);
  eq(pass.withdrawn_matches[0].satisfaction, "satisfied", "B.4 a reintroduction earning the required grade satisfies the condition");
  eq(pass.decision, "accepted", "B.4 and is admitted");

  const W2 = claim("measurement", "claim W, reworded", "asserted", []);
  const noLink = decide({ hash: "H8", entries: [W2], links: [] }, store);
  eq(noLink.withdrawn_matches.length, 0, "B.4 a reworded reintroduction without a restatement link is a stranger to the check");
  const rest = R.linkRecord({ link_kind: "restatement", from_identity: W2.identity, to_identity: W.identity, source_id: "S1", contributor_id: "P1", declared_grade: "asserted" });
  const withLink = decide({ hash: "H9", entries: [W2], links: [rest] }, store);
  ok(withLink.withdrawn_matches.length === 1 && withLink.decision === "declined", "B.4 once a restatement link joins the identities, the reworded reintroduction is caught");
}

// --- B.5 every check emits its typed finding; the receipt carries the required tables ---
{
  const c = claim("measurement", "widely-supported", "corroborated", []);
  const s1 = R.linkRecord({ link_kind: "supports", from_identity: "PA", to_identity: c.identity, support_group: "gA", source_id: "S1", contributor_id: "PX", declared_grade: "corroborated" });
  const s2 = R.linkRecord({ link_kind: "supports", from_identity: "PB", to_identity: c.identity, support_group: "gB", source_id: "S2", contributor_id: "PY", declared_grade: "corroborated" });
  const store = mkStore({ earnedByIdentity: new Map([["PA", { earned: "corroborated", inForce: true }], ["PB", { earned: "corroborated", inForce: true }]]) });
  const r = decide({ hash: "H10", entries: [c], links: [s1, s2] }, store);
  ok(Array.isArray(r.binding_table) && r.binding_table.length === 4, "B.5 receipt carries the binding table");
  ok(r.grade_table[0] && "S" in r.grade_table[0] && "B" in r.grade_table[0], "B.5 the grade table carries S and B");
  ok(r.corroboration_findings.length === 1 && r.corroboration_findings[0].coverage_note.includes("invisible to this check"), "B.5 corroboration finding present with its coverage note");
  eq(r.corroboration_findings[0].verdict, "disjoint", "B.5 two disjoint-footprint contributors read as disjoint corroboration");
  eq(r.grade_table[0].earned_grade, "corroborated", "B.5 independence lifts delivery to corroborated");
  ok(Array.isArray(r.decision_basis) && r.decision_basis.length >= 1, "B.5 the receipt carries the decision basis");
  ok("withdrawn_matches" in r && "restatement_closures" in r, "B.5 receipt carries withdrawn matches and restatement closures");
}

// ================= PHASE C =================
import { genesis, makeState, verifyChain } from "../kernel/store/state.mjs";
import { apply, inForce } from "../kernel/store/apply.mjs";
import { computeDecay, derivedGrade } from "../kernel/store/decay.mjs";

const TABLES = { sourceTable: SRC, kindTable: KINDS };

// --- C.1 apply: union of entries + append of standing records; never edits a stored declared grade ---
{
  const g = genesis();
  const c1 = claim("measurement", "e1", "asserted", []);
  const s1 = apply(g, { entries: [c1], links: [], applied_contribution_hash: "H1", receipt_reference: "R1" });
  ok(s1.entries.length === 1 && s1.prior_state_hash === g.state_hash, "C.1 apply produces a new state by union, chained to its predecessor");
  const c2 = claim("measurement", "e2", "asserted", []);
  const wd = R.withdrawnClaimRecord({ claim_identity: "X", withdrawn_at_state: s1.state_hash, withdrawn_by: "H2", reason: "r", reinstatement_condition: { condition_kind: "entry-of-kind", required_kind: "measurement" } });
  const s2 = apply(s1, { entries: [c2], links: [], withdrawn_records: [wd], applied_contribution_hash: "H2", receipt_reference: "R2" });
  ok(s2.entries.length === 2 && s2.entries.some((e) => e.identity === c1.identity), "C.1 union keeps every prior entry; append adds the standing record");
  eq(s2.withdrawn_records.length, 1, "C.1 the withdrawal record is appended to history");
  // a resubmission of the same identity with a DIFFERENT declared grade never edits the stored grade
  const c1higher = claim("measurement", "e1", "corroborated", []);
  const s3 = apply(s2, { entries: [c1higher], links: [], applied_contribution_hash: "H3", receipt_reference: "R3" });
  eq(s3.entries.find((e) => e.identity === c1.identity).declared_grade, "asserted", "C.1 apply never edits a stored declared grade (existing entry wins on union)");
  eq(s3.entries.length, 2, "C.1 resubmitting an existing identity adds no entry");
}

// --- C.2 supersession adds a pointer; the superseded entry stays and reads as not in force ---
{
  const g = genesis();
  const oldE = claim("measurement", "old", "asserted", []);
  const newE = claim("measurement", "new", "asserted", []);
  const s1 = apply(g, { entries: [oldE, newE], links: [], applied_contribution_hash: "H1", receipt_reference: "R1" });
  ok(inForce(s1, oldE.identity), "C.2 the entry is in force before supersession");
  const sup = R.supersessionRecord({ superseded_identity: oldE.identity, successor_identity: newE.identity, at_state: s1.state_hash, reason: "replaced" });
  const s2 = apply(s1, { entries: [], links: [], supersession_records: [sup], applied_contribution_hash: "H2", receipt_reference: "R2" });
  ok(s2.entries.some((e) => e.identity === oldE.identity), "C.2 the superseded entry stays in the store");
  ok(!inForce(s2, oldE.identity), "C.2 it reads as not in force");
  ok(inForce(s2, newE.identity), "C.2 the successor is in force");
}

// --- C.3 the state hash includes the prior hash; a rewritten past breaks the chain at the first later link ---
{
  const g = genesis();
  const s1 = apply(g, { entries: [claim("measurement", "a", "asserted", [])], links: [], applied_contribution_hash: "H1", receipt_reference: "R1" });
  const s2 = apply(s1, { entries: [claim("measurement", "b", "asserted", [])], links: [], applied_contribution_hash: "H2", receipt_reference: "R2" });
  const s3 = apply(s2, { entries: [claim("measurement", "c", "asserted", [])], links: [], applied_contribution_hash: "H3", receipt_reference: "R3" });
  ok(verifyChain([g, s1, s2, s3]).ok, "C.3 the untampered chain verifies");
  // rewrite s1's past: rebuild it with a grade-changed entry (self-consistent new hash)
  const tampered = makeState({ prior_state_hash: s1.prior_state_hash, applied_contribution_hash: s1.applied_contribution_hash, receipt_reference: s1.receipt_reference, entries: [claim("measurement", "a", "corroborated", [])], links: s1.links, withdrawn_records: s1.withdrawn_records, contradiction_records: s1.contradiction_records, corroboration_findings: s1.corroboration_findings, supersession_records: s1.supersession_records });
  ok(tampered.state_hash !== s1.state_hash, "C.3 altering a past state changes its hash");
  const res = verifyChain([g, tampered, s2, s3]);
  ok(!res.ok && res.firstBreak === 2, "C.3 the break announces itself at the first later link (s2's prior pointer no longer matches)");
}

// --- C.4 a claim whose support is withdrawn surfaces a decay finding; the stored declared grade is unchanged ---
{
  const g = genesis();
  const P = claim("measurement", "premise P", "checked", [distinctCheck]);
  const C = claim("measurement", "claim C", "corroborated", []);
  const supPC = R.linkRecord({ link_kind: "supports", from_identity: P.identity, to_identity: C.identity, support_group: "g", source_id: "S1", contributor_id: "P1", declared_grade: "corroborated" });
  const s0 = apply(g, { entries: [P, C], links: [supPC], applied_contribution_hash: "H1", receipt_reference: "R1" });
  eq(derivedGrade(s0, C.identity, TABLES), "corroborated", "C.4 C derives corroborated while its support stands");
  eq(computeDecay(s0, TABLES).length, 0, "C.4 no decay while the support is in force");
  const wd = R.withdrawnClaimRecord({ claim_identity: P.identity, withdrawn_at_state: s0.state_hash, withdrawn_by: "H2", reason: "retracted", reinstatement_condition: { condition_kind: "entry-of-kind", required_kind: "measurement" } });
  const s1 = apply(s0, { entries: [], links: [], withdrawn_records: [wd], applied_contribution_hash: "H2", receipt_reference: "R2" });
  const decay = computeDecay(s1, TABLES);
  ok(decay.length === 1 && decay[0].entry_identity === C.identity, "C.4 withdrawing the support surfaces a decay finding on C");
  eq(decay[0].current_earned_grade, "ungraded", "C.4 the decay finding carries the fallen current earned grade");
  eq(s1.entries.find((e) => e.identity === C.identity).declared_grade, "corroborated", "C.4 C's stored declared grade is unchanged");
}

// ================= REPORT =================
console.log(`gate kernel: Phases A-C checked (canonical form, records, order, tables; earned-grade, checks, gate; apply, history chain, supersession, decay).`);
if (fails.length) {
  console.error(`\n${fails.length} assertion(s) failed:`);
  for (const f of fails) console.error("  - " + f);
  process.exit(1);
}
console.log("OK: byte-exact canonical form, no float on the path, records match the spec's fields and allowed values, the confidence order holds.");
process.exit(0);
