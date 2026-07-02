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

// ================= REPORT =================
console.log(`gate kernel: Phase A checked (canonical form, records, confidence order, reference tables).`);
if (fails.length) {
  console.error(`\n${fails.length} assertion(s) failed:`);
  for (const f of fails) console.error("  - " + f);
  process.exit(1);
}
console.log("OK: byte-exact canonical form, no float on the path, records match the spec's fields and allowed values, the confidence order holds.");
process.exit(0);
