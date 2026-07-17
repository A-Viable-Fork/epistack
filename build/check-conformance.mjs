// Role: the conformance checker. Runs the contract register against an arbitrary foreign kernel and
//   emits a VIOLATION REPORT, not a pass/fail: per fixed invariant, conforms / violates / unverifiable,
//   with evidence. The adopter's self-test before migrating, and the base for the lineage counterexample
//   exhibit. Report, do not reject: a non-conforming kernel is the input whose violations are the output.
// Contract: conformanceReport(kernel, entries) -> structured report; foreignKernel(spec) -> a kernel in
//   the algebra shape { store_id, state, tables, native, grades }, NOT required to be well-formed. The
//   report is register-DRIVEN: its invariant set is exactly parseContractRegister(docs/contract-register.md),
//   so adding a register entry extends it with no edit here. `node build/check-conformance.mjs` exits
//   non-zero only if the mechanism misdiagnoses the two fixtures. Importable without running the harness.
// Invariant: a claim's advertised grade (K.grades) is the kernel's own word; recomputeGrade(K, id) is
//   what its public structure confirms; every mechanical predicate is a function of that gap alone.
"use strict";
import { readFileSync, realpathSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { recomputeGrade, asKernel } from "../kernel/composition/algebra.mjs";
import { leqWithinMode, collapsedRank } from "../kernel/schema/confidence.mjs";
import { claimRecord, linkRecord } from "../kernel/schema/records.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { makeState, GENESIS_MARKER } from "../kernel/store/state.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FLOOR = "ungraded"; // the untyped floor: a crossed or ungrounded claim grounds nothing
const short = (id) => String(id).slice(0, 12);
const isFloor = (g) => collapsedRank(g) <= 0; // only "ungraded" sits at the floor
// advertised strictly exceeds recomputed (or is incomparable, a claimed mode structure does not reach).
const exceeds = (adv, rec) => !leqWithinMode(adv, rec).leq;
const verdictOf = (ev) => ({ verdict: ev.length ? "violates" : "conforms", evidence: ev });

// ---- Step 1: the foreign-kernel interface --------------------------------------------------------
// A foreign kernel is expressed in the algebra's existing shape, the same shape compose/diff consume.
// Unlike asKernel (which re-derives native and grades HONESTLY, erasing any non-conformance), this
// constructor takes the kernel's own possibly-dishonest `native` set and `grades` map verbatim, so a
// kernel can advertise standing its structure does not support. That gap is exactly what the checker
// diagnoses. The checker requires only that the kernel be expressible in the shape, never well-formed.
export function foreignKernel({ store_id, entries = [], links = [], native = [], grades = {}, tables }) {
  const state = makeState({ prior_state_hash: GENESIS_MARKER, entries, links });
  return { store_id, state, tables, native: new Set(native), grades: new Map(Object.entries(grades)) };
}

// ---- Step 2: the register-driven checker ---------------------------------------------------------
// parse the contract register the same way the boundary linter does: each `### CR-x` block with its
// hyphenated fields. The report is built over exactly these entries, in file order.
export function parseContractRegister(md) {
  const entries = [];
  for (const block of md.split(/\n(?=### )/)) {
    const m = block.match(/^### (CR-\S+)/);
    if (!m) continue;
    const field = (name) => { const r = block.match(new RegExp(`^- ${name}: (.+)$`, "m")); return r ? r[1].trim() : null; };
    entries.push({ id: m[1], modality: (field("Modality") || "").toLowerCase(), statement: field("Statement") || "", enforced: field("Enforced by") || "" });
  }
  return entries;
}
const isProseSpecified = (e) => /^prose-specified/i.test(e.enforced.trim());

// The mechanical predicates, keyed by contract-register id. Each takes a foreign kernel and returns a
// per-invariant verdict with evidence. An invariant with no predicate here is reported unverifiable,
// never silently skipped, so adding a register entry surfaces it automatically.
export const PREDICATES = {
  // CR-typed: every claim carries a type, even the untyped type. A claim with no type at all violates.
  "CR-typed": (K) => {
    const ev = [];
    for (const e of K.state.entries || []) {
      if (!e.kind) ev.push({ claim: short(e.identity), statement: e.statement, why: "the claim carries no type, not even the untyped type" });
    }
    return verdictOf(ev);
  },
  // CR-monotone: no claim advertises more standing than its necessary supports carry. The advertised
  // grade must not exceed what recomputation over the kernel's own structure confirms.
  "CR-monotone": (K) => {
    const ev = [];
    for (const e of K.state.entries || []) {
      const adv = K.grades.get(e.identity) ?? FLOOR;
      const rec = recomputeGrade(K, e.identity);
      if (exceeds(adv, rec)) ev.push({ claim: short(e.identity), statement: e.statement, advertised: adv, recomputed: rec, why: "advertised grade exceeds what recomputation over its supports confirms" });
    }
    return verdictOf(ev);
  },
  // CR-untyped-floor: the untyped type grounds nothing. A claim not locally typed (not in native)
  // advertising anything above the floor is laundering standing across the border.
  "CR-untyped-floor": (K) => {
    const ev = [];
    for (const e of K.state.entries || []) {
      if (K.native.has(e.identity)) continue;
      const adv = K.grades.get(e.identity) ?? FLOOR;
      if (!isFloor(adv)) ev.push({ claim: short(e.identity), statement: e.statement, advertised: adv, native: false, why: "a claim not locally typed advertises standing above the floor, so an import grounds without a local fork typing it" });
    }
    return verdictOf(ev);
  },
  // CR-recomputable: standing recomputes from public structure, not an external authority's grant. An
  // earned grade advertised where structure recomputes only the floor came from outside the graph.
  "CR-recomputable": (K) => {
    const ev = [];
    for (const e of K.state.entries || []) {
      const adv = K.grades.get(e.identity) ?? FLOOR;
      const rec = recomputeGrade(K, e.identity);
      if (collapsedRank(adv) >= 2 && collapsedRank(rec) <= 1) ev.push({ claim: short(e.identity), statement: e.statement, advertised: adv, recomputed: rec, why: "an earned grade is advertised that public structure does not recompute; it required an external grant" });
    }
    return verdictOf(ev);
  },
  // CR-shared-hash (the origin-verification correction): native acceptance is a stance, never an
  // obligation. A kernel that natively accepts a carried grade with no local recomputation path to it
  // has inherited standing it cannot re-derive, which the corrected crossing contract forbids as default.
  "CR-shared-hash": (K) => {
    const ev = [];
    let tested = 0;
    for (const e of K.state.entries || []) {
      const carried = e.carried_grade;
      const foreignOrigin = e.origin && e.origin !== K.store_id;
      if (!carried && !foreignOrigin) continue;
      tested++;
      if (!carried) continue;
      const adv = K.grades.get(e.identity) ?? FLOOR;
      const rec = recomputeGrade(K, e.identity);
      if (collapsedRank(adv) >= collapsedRank(carried) && exceeds(carried, rec)) {
        ev.push({ claim: short(e.identity), statement: e.statement, origin: e.origin || null, carried_grade: carried, advertised: adv, recomputed: rec, why: "the kernel natively accepts a carried grade with no local recomputation path to it" });
      }
    }
    const r = verdictOf(ev);
    if (!tested) r.note = "no claim carries a foreign origin or a carried grade; the invariant holds vacuously on this kernel";
    return r;
  },
};

// The report: for each register entry, apply its invariant's test to the foreign kernel. Prose-specified
// entries are named unverifiable-mechanically (for human assessment) rather than skipped. Entries that
// name a mechanical check but have no static-kernel predicate (a property of operations or deployment,
// not the kernel shape) are likewise named unverifiable, never silently passed. The result is structured
// data (kernel id, per-invariant verdict, evidence) so a conformance claim can be carried and contested.
export function conformanceReport(kernel, entries) {
  const invariants = entries.map((e) => {
    if (isProseSpecified(e)) {
      return { invariant: e.id, statement: e.statement, verdict: "unverifiable", reason: "prose-specified in the contract register; no mechanical check exists to apply to a foreign kernel, so this is named for human assessment", evidence: [] };
    }
    const pred = PREDICATES[e.id];
    if (!pred) {
      return { invariant: e.id, statement: e.statement, verdict: "unverifiable", reason: `the register names a mechanical check (${e.enforced}) but this invariant is a property of the kernel's operations or deployment, not its static shape, so it is named for human assessment rather than mechanically applied here`, evidence: [] };
    }
    const r = pred(kernel);
    const out = { invariant: e.id, statement: e.statement, verdict: r.verdict, evidence: r.evidence };
    if (r.note) out.note = r.note;
    return out;
  });
  return { record_type: "conformance-report", kernel_id: kernel.store_id, against: "docs/contract-register.md", invariants };
}

// ---- Step 3: the two fixtures --------------------------------------------------------------------
// shared tables both fixtures type against.
const sources = makeSourceTable([
  { source_id: "s-obs", source_class: "primary-measurement", rests_on: [] },
  { source_id: "s-rep", source_class: "institutional-report", rests_on: [] },
]);
const kinds = makeKindTable([
  { kind: "measurement", ceiling: "independently-rechecked" },
  { kind: "estimate", ceiling: "corroborated" },
]);
const TABLES = { sourceTable: sources, kindTable: kinds };
const twoChecks = [
  { checker_id: "c1", method_class: "replication", method: "audited", checked_at_state: "s0", outcome: "confirms", independence: "distinct-party" },
  { checker_id: "c2", method_class: "replication", method: "audited", checked_at_state: "s0", outcome: "confirms", independence: "distinct-party" },
];

// The CONFORMING fixture (positive control): an honestly-built store. asKernel makes every claim native
// and derives every grade from structure, so advertised equals recomputed everywhere. A rechecked
// measurement grounds a supported estimate; nothing is crossed, nothing carries a foreign grade.
export function conformingKernel() {
  const m = claimRecord({ kind: "measurement", statement: "the observed flux is 3.1 units", source_id: "s-obs", contributor_id: "lab", declared_grade: "independently-rechecked", checking_records: twoChecks });
  const est = claimRecord({ kind: "estimate", statement: "the program reaches about 40 units", source_id: "s-rep", contributor_id: "lab", declared_grade: "asserted" });
  const link = linkRecord({ link_kind: "supports", from_identity: m.identity, to_identity: est.identity, support_group: "g1", source_id: "s-obs", contributor_id: "lab", declared_grade: "independently-rechecked" });
  const store = { store_id: "K-conforming", state: makeState({ prior_state_hash: GENESIS_MARKER, entries: [m, est], links: [link] }), tables: TABLES };
  return asKernel(store);
}

// The NON-CONFORMING fixture: two planted violations. G is granted "corroborated" by authority while
// its structure (no supports, no checks) recomputes only "asserted" -> violates CR-monotone and
// CR-recomputable. U crosses in from a foreign origin carrying "supported" and is admitted above the
// floor without being locally typed -> violates CR-untyped-floor and CR-shared-hash. Both G and U carry
// a valid type, so CR-typed still conforms: the checker discriminates per invariant, not in bulk.
export function nonConformingKernel(overrides = {}) {
  const g = claimRecord({ kind: "estimate", statement: "the program reaches about 40 units", source_id: "s-rep", contributor_id: "authority", declared_grade: "corroborated" });
  const uBase = claimRecord({ kind: "measurement", statement: "an imported measurement of 9.9 units", source_id: "s-obs", contributor_id: "stranger", declared_grade: "supported" });
  const u = { ...uBase, origin: "K-foreign", carried_grade: "supported" };
  const grades = { [g.identity]: "corroborated", [u.identity]: "supported", ...(overrides.grades || {}) };
  const native = overrides.native || [g.identity]; // U is NOT native: it crossed in untyped
  return foreignKernel({ store_id: "K-nonconforming", entries: [g, u], links: [], native, grades, tables: TABLES });
}

// ---- the harness (runs only when invoked directly) -----------------------------------------------
function printReport(report) {
  console.log(`\nconformance report for kernel "${report.kernel_id}" against ${report.against}:`);
  for (const inv of report.invariants) {
    const tag = inv.verdict === "conforms" ? "  conforms   " : inv.verdict === "violates" ? "  VIOLATES   " : "  unverifiable";
    console.log(`  ${tag} ${inv.invariant}: ${inv.statement}`);
    for (const e of inv.evidence) console.log(`                 evidence: ${JSON.stringify(e)}`);
    if (inv.verdict === "unverifiable") console.log(`                 reason: ${inv.reason}`);
    else if (inv.note) console.log(`                 note: ${inv.note}`);
  }
}

function runHarness() {
  let fails = 0;
  const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
  const H = "=".repeat(80);
  console.log(H); console.log("CHECK-CONFORMANCE: the contract register run against a foreign kernel, as a violation report"); console.log(H);

  const md = readFileSync(join(ROOT, "docs/contract-register.md"), "utf8");
  const entries = parseContractRegister(md);
  const mechanical = entries.filter((e) => !isProseSpecified(e) && PREDICATES[e.id]);
  console.log(`\nparsed ${entries.length} contract-register invariants; ${mechanical.length} have a mechanical predicate, the rest are named unverifiable-mechanically`);

  // register-driven coupling [Step 4, part 1]: the report's invariant set is EXACTLY the parsed register.
  const conf = conformanceReport(conformingKernel(), entries);
  ok(conf.invariants.map((i) => i.invariant).join(",") === entries.map((e) => e.id).join(","),
    "the report's invariant set equals the parsed contract register, in file order (the register is the source of what conformance means)");

  console.log("\n[1] the conforming fixture (positive control) reports no violation");
  printReport(conf);
  const confViolations = conf.invariants.filter((i) => i.verdict === "violates");
  ok(confViolations.length === 0, confViolations.length ? `the conforming fixture wrongly reports violations: ${confViolations.map((i) => i.invariant).join(", ")}` : "the conforming fixture conforms on every mechanically-checkable invariant");

  console.log("\n[2] the non-conforming fixture reports its planted violations, named per invariant with evidence");
  const nc = conformanceReport(nonConformingKernel(), entries);
  printReport(nc);
  const verdict = (id) => nc.invariants.find((i) => i.invariant === id).verdict;
  const evidenceOf = (id) => nc.invariants.find((i) => i.invariant === id).evidence;
  ok(verdict("CR-monotone") === "violates" && evidenceOf("CR-monotone").length > 0, "CR-monotone: violates (an authority-granted grade exceeds its recomputation), with evidence");
  ok(verdict("CR-recomputable") === "violates" && evidenceOf("CR-recomputable").length > 0, "CR-recomputable: violates (a grade present with no recomputable support), with evidence");
  ok(verdict("CR-untyped-floor") === "violates" && evidenceOf("CR-untyped-floor").length > 0, "CR-untyped-floor: violates (an untyped import grounds above the floor), with evidence");
  ok(verdict("CR-shared-hash") === "violates" && evidenceOf("CR-shared-hash").length > 0, "CR-shared-hash: violates (a carried grade natively accepted with no recomputation path), with evidence");
  ok(verdict("CR-typed") === "conforms", "CR-typed: conforms (both planted claims carry a type), so the checker discriminates per invariant rather than failing in bulk");
  const violated = nc.invariants.filter((i) => i.verdict === "violates").map((i) => i.invariant);
  ok(violated.length >= 2, `the non-conforming fixture violates at least two invariants: ${violated.join(", ")}`);

  console.log("\n[3] deliberate-break control: fix one violated invariant on the fixture, its verdict flips");
  // make the crossed claim U actually conform on CR-untyped-floor: type it locally (add it to native)
  // and regrade it to what its structure then recomputes. CR-untyped-floor must flip to conforms, while
  // the authority-granted G keeps CR-monotone violating, so the flip is specific to the fixed invariant,
  // not a blanket reset. This bakes the deliberate-break test in permanently as a regression guard.
  const base = nonConformingKernel();
  const gId = [...base.grades.keys()].find((id) => base.grades.get(id) === "corroborated");
  const uId = [...base.grades.keys()].find((id) => id !== gId);
  const uRec = recomputeGrade(nonConformingKernel({ native: [gId, uId] }), uId); // U's honest grade once typed
  const patched = nonConformingKernel({ native: [gId, uId], grades: { [uId]: uRec } });
  const nc2 = conformanceReport(patched, entries);
  const v2 = (id) => nc2.invariants.find((i) => i.invariant === id).verdict;
  ok(v2("CR-untyped-floor") === "conforms", "with U typed locally and regraded to its recomputation, CR-untyped-floor flips violates -> conforms");
  ok(v2("CR-monotone") === "violates", "and CR-monotone still violates (the authority-granted G is untouched), so the flip is specific to the fixed invariant, not a blanket reset");

  console.log("\n[4] register-driven coupling proven: a new register entry extends the report with no code change");
  // simulate adding a contract-register entry by appending one parsed entry; the report gains exactly one
  // invariant, reported unverifiable (no predicate written for it), proving the coupling is to the register
  // data, not to a hardcoded list here.
  const synthetic = { id: "CR-synthetic-demo", modality: "required", statement: "a hypothetical new invariant added to the register", enforced: "build/check-future.mjs" };
  const augmented = conformanceReport(conformingKernel(), [...entries, synthetic]);
  const newRow = augmented.invariants.find((i) => i.invariant === "CR-synthetic-demo");
  ok(augmented.invariants.length === conf.invariants.length + 1 && !!newRow, "appending one register entry adds exactly one report row, with no predicate code written");
  ok(newRow && newRow.verdict === "unverifiable", "the new entry is reported unverifiable-mechanically and named, never silently skipped");

  console.log("\n" + H);
  if (fails === 0) console.log("verified: the checker is register-driven, the conforming fixture is clean, the non-conforming fixture's planted violations are named with evidence, the deliberate-break flips, and a new register entry extends the report with no edit.");
  console.log(fails === 0 ? "check-conformance: OK" : `check-conformance: ${fails} FAILURE(S)`);
  console.log(H);
  process.exit(fails === 0 ? 0 : 1);
}

const invokedDirectly = process.argv[1] && (() => { try { return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url)); } catch { return false; } })();
if (invokedDirectly) runHarness();
