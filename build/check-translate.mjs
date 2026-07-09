// Role: the Phase A acceptance oracle for the trellis-to-v3 translator (docs/trellis-to-v3.md). A
//   fragment test over the four shapes the migration must carry, conjunction, disjunction, a cited
//   measurement leaf, and a forum terminal, plus a byte-identical determinism check.
// Contract: `node build/check-translate.mjs` exits non-zero on any failure and prints each check.
//   Imports only the v3 kernel and this module's translator. No corpus is loaded here (Phase B does).
// Invariant: the translator is pure and deterministic; the same fragment produces byte-identical
//   records, and every fragment claim's declared grade is covered by its earned grade.
"use strict";
import { translateTrellis, KIND_TABLE_ROWS } from "./translate-trellis.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { storeViewOf } from "../kernel/store/decay.mjs";
import { genesis } from "../kernel/store/state.mjs";
import { apply } from "../kernel/store/apply.mjs";
import { leqWithinMode } from "../kernel/schema/confidence.mjs";

let fails = 0;
const ok = (cond, msg) => { console.log(`${cond ? "  ok  " : " FAIL "} ${msg}`); if (!cond) fails++; };
const H = "=".repeat(74);

// -- the fragment: one conjunction, one disjunction, a body-ref measurement leaf, a forum terminal --
const bodies = { earth: { id: "earth", name: "Earth", properties: { radius: { value: 6e6, unit: "m", terminal_type: "measurement" } } } };
const primitives = {
  "prim.f": { id: "prim.f", kind: "primitive", label: "a cited standard result", citation: { target: "textbook" } },
};
const FRAG = {
  id: "frag",
  nodes: {
    // conjunction: both children are necessary (weakest-of, one group)
    "frag.conj": { id: "frag.conj", kind: "transformation", label: "A and B", composition: "conjunction", children: ["frag.a", "frag.b"] },
    "frag.a": { id: "frag.a", kind: "transformation", label: "leaf A resting on a measurement", composition: "sequence", children: [], body_refs: ["earth#radius"] },
    "frag.b": { id: "frag.b", kind: "transformation", label: "leaf B resting on a primitive", composition: "sequence", children: ["prim.f"] },
    // disjunction: either child suffices (strongest-of, group per child)
    "frag.disj": { id: "frag.disj", kind: "transformation", label: "C or D", composition: "disjunction", children: ["frag.c", "frag.d"], guard: { assumption_id: "frag.assume", value: true } },
    "frag.c": { id: "frag.c", kind: "transformation", label: "alternative C", composition: "sequence", children: ["prim.f"] },
    "frag.d": { id: "frag.d", kind: "transformation", label: "alternative D", composition: "sequence", children: ["prim.f"] },
    "frag.assume": { id: "frag.assume", kind: "assumption", label: "a perturbable premise" },
    // a forum terminal: an irreducible prior resting on the analysis that priced it, which reaches
    // corroborated through that argument but is capped there, never the settled/measurement tier.
    "frag.forum": { id: "frag.forum", kind: "claim", label: "a priced prior, not a measurement", terminal_type: "irreducible-prior", composition: "sequence", children: ["frag.conj"] },
  },
};

console.log(H); console.log("CHECK-TRANSLATE (Phase A): trellis-to-v3 fragment + determinism"); console.log(H);

const out = translateTrellis(FRAG, { primitives, bodies, caseId: "frag", contributorId: "frag-author" });
const claimByNode = (id) => out.claims.find((c) => c.identity === out.byNode.get(id));
const linksInto = (id) => out.links.filter((l) => l.to_identity === out.byNode.get(id));

// --- A. conjunction: both children fold into ONE support group ---
console.log("\n[A] conjunction -> one weakest-of support group");
{
  const sup = linksInto("frag.conj").filter((l) => l.link_kind === "supports");
  const groups = new Set(sup.map((l) => l.support_group));
  ok(sup.length === 2, `two supports into frag.conj (got ${sup.length})`);
  ok(groups.size === 1 && groups.has("g:frag.conj"), `both in one group g:frag.conj (groups: ${[...groups].join(", ")})`);
}

// --- B. disjunction: children spread across per-child groups ---
console.log("\n[B] disjunction -> one strongest-of group per child");
{
  const sup = linksInto("frag.disj").filter((l) => l.link_kind === "supports");
  const groups = new Set(sup.map((l) => l.support_group));
  ok(sup.length === 2, `two supports into frag.disj (got ${sup.length})`);
  ok(groups.size === 2 && groups.has("g:frag.disj/frag.c") && groups.has("g:frag.disj/frag.d"), `two per-child groups (groups: ${[...groups].join(", ")})`);
  const dep = linksInto("frag.disj").filter((l) => l.link_kind === "depends-on");
  ok(dep.length === 1 && dep[0].from_identity === out.byNode.get("frag.assume"), "guard.assumption_id -> one depends-on link (not a support)");
}

// --- C. a cited measurement leaf ---
console.log("\n[C] body_ref -> a measurement leaf with its own basis");
{
  const sup = linksInto("frag.a").filter((l) => l.link_kind === "supports");
  ok(sup.length === 1, `one support into frag.a (got ${sup.length})`);
  const leaf = out.claims.find((c) => c.identity === (sup[0] || {}).from_identity);
  ok(leaf && leaf.kind === "measurement", `leaf kind is measurement (got ${leaf && leaf.kind})`);
  ok(leaf && leaf.declared_grade === "checked", `leaf declared checked (got ${leaf && leaf.declared_grade})`);
  ok(leaf && leaf.checking_records.length === 1 && leaf.checking_records[0].independence === "distinct-party", "leaf carries one distinct-party checking record (its own basis)");
  ok(leaf && /earth#radius = 6000000 m/.test(leaf.statement), `leaf statement carries the measured value as text (no float on the path): "${leaf && leaf.statement}"`);
}

// --- D. a forum terminal ---
console.log("\n[D] forum terminal -> corroborated, no own basis (never the settled tier)");
{
  const f = claimByNode("frag.forum");
  ok(f && f.kind === "forum", `kind is forum (got ${f && f.kind})`);
  ok(f && f.declared_grade === "corroborated", `declared corroborated (got ${f && f.declared_grade})`);
  ok(f && f.checking_records.length === 0, "no checking record: a priced prior does not reach measurement");
}

// --- E. determinism: a second translation is byte-identical ---
console.log("\n[E] determinism: re-translation is byte-identical");
{
  const out2 = translateTrellis(FRAG, { primitives, bodies, caseId: "frag", contributorId: "frag-author" });
  const digest = (o) => o.claims.map((c) => c.hash).join(",") + "|" + o.links.map((l) => l.hash).join(",");
  ok(digest(out) === digest(out2), "two runs produce identical record hashes in identical order");
  ok(out.claims.length === out2.claims.length && out.links.length === out2.links.length, `same counts (${out.claims.length} claims, ${out.links.length} links)`);
}

// --- F. grounding sanity: declared <= earned for every fragment claim (no gap opened) ---
console.log("\n[F] grounding: every declared grade is covered by the earned grade");
{
  const tables = { sourceTable: makeSourceTable(out.sources), kindTable: makeKindTable(out.kinds) };
  let s = genesis();
  s = apply(s, { entries: out.claims, links: out.links, applied_contribution_hash: "frag", receipt_reference: "frag" });
  const view = storeViewOf(s, tables);
  for (const c of out.claims) {
    const e = view.earnedByIdentity.get(c.identity);
    const cmp = leqWithinMode(c.declared_grade, e.earned);
    ok(cmp.comparable && cmp.leq, `${c.kind.padEnd(13)} declared=${c.declared_grade.padEnd(12)} earned=${e.earned}`);
  }
}

console.log("\n" + H);
if (fails === 0) console.log("verified: the trellis-to-schema translation is deterministic and grade-preserving; the same input yields byte-identical records and each node\u0027s earned grade reproduces its terminal floor.");
console.log(fails === 0 ? "check-translate: OK" : `check-translate: ${fails} FAILURE(S)`);
console.log(H);
process.exit(fails === 0 ? 0 : 1);
