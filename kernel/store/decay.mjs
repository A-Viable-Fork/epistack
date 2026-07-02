// Role: derived grade and decay (intake data model v3, Section 14). Earned grade is derived, never
//   stored: it is recomputed against the current state. When the recomputed earned grade falls below
//   the declared grade, because a support was withdrawn, superseded, or lowered, the gap is surfaced
//   as a decay finding, never silently corrected. Three moments, none rewrites another: the grade at
//   intake is a fact about a past state fixed in the receipt; the grade at read is a derivation
//   against the current state; the decay finding is their surfaced difference.
// Contract: derivedGrade(state, identity, tables) -> position; computeDecay(state, tables) ->
//   [decayFinding]. Pure, ESM; kernel imports only kernel.
// Invariant: a support that is not in force delivers nothing (ungraded), so removing or superseding
//   a support lowers the derivation without touching any stored declared grade.
"use strict";
import { earnedGrade } from "../grounding/earned-grade.mjs";
import { leqWithinMode } from "../schema/confidence.mjs";
import { ceilingFor, footprintClosure } from "../schema/tables.mjs";
import { inForce } from "./apply.mjs";
import { decayFinding } from "../schema/records.mjs";

// the derived earned grade of an entry against the current state (Section 14). A support not in force
// delivers ungraded; otherwise its own derived grade flows up through the link, capped by link grade.
export function derivedGrade(state, identity, tables, cache = new Map()) {
  if (cache.has(identity)) return cache.get(identity);
  const entry = (state.entries || []).find((e) => e.identity === identity);
  if (!entry) { cache.set(identity, "ungraded"); return "ungraded"; }
  cache.set(identity, "asserted"); // cycle guard
  const supports = (state.links || [])
    .filter((l) => l.link_kind === "supports" && l.to_identity === identity)
    .map((l) => ({
      group: l.support_group, linkGrade: l.declared_grade,
      supportEarned: inForce(state, l.from_identity) ? derivedGrade(state, l.from_identity, tables, cache) : "ungraded",
      footprint: footprintClosure(tables.sourceTable, [l.source_id]),
      linkIdentity: l.identity,
    }));
  const ceil = ceilingFor(tables.kindTable, entry.kind);
  const eg = earnedGrade({ ceiling: ceil ? ceil.position : "asserted", constitutive: !!(ceil && ceil.mode === "constitutive"), checkingRecords: entry.checking_records, supports });
  cache.set(identity, eg.earned);
  return eg.earned;
}

// every in-force claim whose current derived grade fell below its declared grade, with the support
// change named as the cause. The stored declared grade is unchanged; only the difference is surfaced.
export function computeDecay(state, tables) {
  const findings = [];
  const cache = new Map();
  for (const entry of state.entries || []) {
    if (!inForce(state, entry.identity)) continue;
    const earned = derivedGrade(state, entry.identity, tables, cache);
    const cmp = leqWithinMode(entry.declared_grade, earned);
    if (!cmp.comparable || !cmp.leq) {
      const fallen = (state.links || []).find((l) => l.link_kind === "supports" && l.to_identity === entry.identity && !inForce(state, l.from_identity));
      const cause = fallen
        ? { support_link: fallen.identity, support: fallen.from_identity, change: (state.supersession_records || []).some((s) => s.superseded_identity === fallen.from_identity) ? "superseded" : "withdrawn" }
        : { support_link: null, change: "lowered" };
      findings.push(decayFinding({ entry_identity: entry.identity, declared_grade: entry.declared_grade, current_earned_grade: earned, cause: JSON.stringify(cause) }));
    }
  }
  return findings;
}
