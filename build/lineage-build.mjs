// Role: the shared builder for the lineage case (fourth case), modeled on build/covid-build.mjs. Builds
//   the lineage v3 store through the real gate from the pure data in corpora/lineage, so the oracle that
//   verifies it (build/check-lineage.mjs) builds the same structure. One store: the common-law and
//   software parallels, the science/Wikipedia/journalism/accounting principle parallels, the neighborhood
//   map's near-miss systems, and the novelty conjecture the five gaps ground.
// Contract: buildLineage() -> { store_id, tables, claims, refId, state, view, receipt, graph }. Imports
//   the kernel and corpora/lineage; pure over the corpus, touching no truth field.
// Invariant: the reports propose claims; the gate prices them. A claim declaring above what it earns is a
//   reported demotion, the case telling us which parallels are load-bearing. Grades are the gate's own.
"use strict";
import { createRequire } from "node:module";
import { claimRecord, linkRecord } from "../kernel/schema/records.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { genesis } from "../kernel/store/state.mjs";
import { apply } from "../kernel/store/apply.mjs";
import { storeViewOf } from "../kernel/store/decay.mjs";
import { decide } from "../kernel/gate/gate.mjs";

const require = createRequire(import.meta.url);
const { KINDS, SOURCES } = require("../corpora/lineage/tables.js");
const { LINEAGE } = require("../corpora/lineage/lineage.js");

export function buildLineage() {
  const tables = { sourceTable: makeSourceTable(SOURCES), kindTable: makeKindTable(KINDS) };
  const refId = new Map();
  const claims = LINEAGE.claims.map((spec) => {
    const rec = claimRecord({ kind: spec.kind, statement: spec.statement, source_id: spec.source_id, contributor_id: spec.contributor_id, declared_grade: spec.declared_grade, checking_records: spec.checking_records, closing_condition: spec.closing_condition });
    refId.set(spec.ref, rec.identity);
    return { rec, spec };
  });
  const links = (LINEAGE.links || []).map((l) => linkRecord({ link_kind: l.link_kind, from_identity: refId.get(l.from), to_identity: refId.get(l.to), support_group: l.support_group, source_id: l.source_id, contributor_id: l.contributor_id, declared_grade: l.declared_grade }));
  const entries = claims.map((c) => c.rec);
  const state = apply(genesis(), { entries, links, applied_contribution_hash: LINEAGE.store_id, receipt_reference: LINEAGE.store_id });
  const view = storeViewOf(state, tables);
  const receipt = decide({ hash: LINEAGE.store_id, entries, links }, storeViewOf(genesis(), tables), {});
  const graph = { entries: state.entries, links: state.links, tables };
  return { store_id: LINEAGE.store_id, tables, claims, refId, state, view, receipt, graph };
}
