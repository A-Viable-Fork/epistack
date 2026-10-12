// Role: the currency reading over a store (intake data model v3, Section 14): every in-force claim that
//   depends on an input no longer standing, a currency finding per edge. A depends-on edge enters no grade
//   fold, so a dead input fails no grade; this is the separate guarantee that such an edge is never silent.
//   Upstreamed from A-Viable-Fork/Physics build/check-dg-staleness.mjs, which read it over its own corpus.
// Contract: computeCurrency(state) -> [currencyFinding]. Pure, ESM; kernel imports only kernel.
// Invariant: out of force is read from the same records the gate reads (withdrawal, supersession) plus a
//   global kill; an input absent from the store is a finding too, never a pass.
"use strict";
import { inForce } from "./apply.mjs";
import { currencyFinding } from "../schema/records.mjs";
import { isKilled } from "./exclusion.js";

export function computeCurrency(state) {
  const known = new Set((state.entries || []).map((e) => e.identity));
  const byId = new Map((state.entries || []).map((e) => [e.identity, e]));
  const out = [];
  for (const l of state.links || []) {
    if (l.link_kind !== "depends-on" || !inForce(state, l.from_identity)) continue;
    const t = l.to_identity;
    const cause = !known.has(t) ? `absent:${t}` : isKilled(state, t) ? `killed:${t}` : !inForce(state, t) ? `out-of-force:${t}` : null;
    if (cause) out.push(currencyFinding({ entry_identity: l.from_identity, declared_grade: byId.get(l.from_identity).declared_grade, cause }));
  }
  return out;
}
