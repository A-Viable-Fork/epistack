// Role: the shared builder for the densified covid-origins case (Prompt 23a). Builds the covid v3
//   store through the real gate from the pure data in corpora/covid, so the oracle that verifies it
//   (build/check-covid.mjs) and the generator that vendors it for the presentation build the same
//   structure. One store: evidence, contested interpretations, the two conclusions and their priors,
//   and the meta level.
// Contract: buildCovid() -> { tables, claims, refId, state, view, receipt, graph }. Imports the
//   kernel and corpora/covid; pure over the corpus, touching no truth field.
// Invariant: a domain claim grounds to a domain floor; the conclusions rest on shared evidence and
//   their own priors so the crux resolves to the priors. Grades are the kernel's own derivation.
"use strict";
import { createRequire } from "node:module";
import { claimRecord, linkRecord } from "../kernel/schema/records.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { genesis } from "../kernel/store/state.mjs";
import { apply } from "../kernel/store/apply.mjs";
import { storeViewOf } from "../kernel/store/decay.mjs";
import { decide } from "../kernel/gate/gate.mjs";

const require = createRequire(import.meta.url);
const { KINDS, SOURCES } = require("../corpora/covid/tables.js");
const { COVID } = require("../corpora/covid/covid-origins.js");

export function buildCovid() {
  const tables = { sourceTable: makeSourceTable(SOURCES), kindTable: makeKindTable(KINDS) };
  const refId = new Map();
  const claims = COVID.claims.map((spec) => {
    const rec = claimRecord({ kind: spec.kind, statement: spec.statement, source_id: spec.source_id, contributor_id: spec.contributor_id, declared_grade: spec.declared_grade, checking_records: spec.checking_records });
    refId.set(spec.ref, rec.identity);
    return { rec, spec };
  });
  const links = (COVID.links || []).map((l) => linkRecord({ link_kind: l.link_kind, from_identity: refId.get(l.from), to_identity: refId.get(l.to), support_group: l.support_group, source_id: l.source_id, contributor_id: l.contributor_id, declared_grade: l.declared_grade }));
  const entries = claims.map((c) => c.rec);
  const state = apply(genesis(), { entries, links, applied_contribution_hash: COVID.store_id, receipt_reference: COVID.store_id });
  const view = storeViewOf(state, tables);
  const receipt = decide({ hash: COVID.store_id, entries, links }, storeViewOf(genesis(), tables), {});
  const graph = { entries: state.entries, links: state.links, tables };
  return { store_id: COVID.store_id, tables, claims, refId, state, view, receipt, graph };
}
