// Role: the builder for the self-kernel: builds its v3 store through the real gate from the pure data in
//   corpora/self, exactly as build/math-build.mjs builds the math kernel. The gate computes every grade;
//   this adds no rule of its own.
// Contract: buildKernel() -> { store_id, tables, claims, refId, state, view, receipt }. Imports the
//   kernel and corpora/self; pure over the corpus.
// Invariant: grades are the kernel's own derivation. An invariant claim with a distinct-party checking
//   record reaches checked; one with none floors; the builder never lifts a grade.
"use strict";
import { createRequire } from "node:module";
import { claimRecord, linkRecord } from "../kernel/schema/records.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { genesis } from "../kernel/store/state.mjs";
import { apply } from "../kernel/store/apply.mjs";
import { storeViewOf } from "../kernel/store/decay.mjs";
import { decide } from "../kernel/gate/gate.mjs";

const require = createRequire(import.meta.url);
const { KINDS, SOURCES } = require("../corpora/self/tables.js");
const { STORE } = require("../corpora/self/self-data.js");

export function buildKernel() {
  const tables = { sourceTable: makeSourceTable(SOURCES), kindTable: makeKindTable(KINDS) };
  const refId = new Map();
  const claims = STORE.claims.map((spec) => {
    const base = claimRecord({ kind: spec.kind, statement: spec.statement, source_id: spec.source_id, contributor_id: spec.contributor_id, declared_grade: spec.declared_grade, checking_records: spec.checking_records, closing_condition: spec.closing_condition });
    // DEPARTURE (mirrors the Knowledge-Game governance build): the entrance-surfaced claims carry
    // non-standard presentation fields the org-root renderer reads under canonical.extensions (role,
    // entrance_surfaced, url, references, label), the same location the Knowledge-Game snapshot places
    // them. claimRecord forwards only the standard claim fields, so these ride as inert metadata on
    // canonical.extensions: they enter no identity (identity is kind + statement) and no grade
    // computation, changing only what the emitted snapshot serves to a renderer, never any standing.
    const rec = { ...base };
    const extensions = {};
    for (const f of ["role", "entrance_surfaced", "url", "references", "label"]) if (spec[f] !== undefined) extensions[f] = spec[f];
    if (Object.keys(extensions).length > 0) rec.canonical = { ...rec.canonical, extensions };
    refId.set(spec.ref, rec.identity);
    return { rec, spec };
  });
  const links = (STORE.links || []).map((l) => linkRecord({ link_kind: l.link_kind, from_identity: refId.get(l.from), to_identity: refId.get(l.to), support_group: l.support_group, source_id: l.source_id, contributor_id: l.contributor_id, declared_grade: l.declared_grade }));
  const entries = claims.map((c) => c.rec);
  const state = apply(genesis(), { entries, links, applied_contribution_hash: STORE.store_id, receipt_reference: STORE.store_id });
  const view = storeViewOf(state, tables);
  const receipt = decide({ hash: STORE.store_id, entries, links }, storeViewOf(genesis(), tables), {});
  return { store_id: STORE.store_id, tables, claims, refId, state, view, receipt };
}
