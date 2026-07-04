// Role: the shared builder for the densified LHC cascade (Prompt 25). Builds the LHC v3 store through
//   the real gate from the pure data in corpora/lhc, so the oracle that verifies it (build/check-lhc.mjs)
//   and the generator that vendors it for the presentation build the same structure. One store: the
//   three legs and their computed quantities, the framework-choice and semiclassical shared dependencies,
//   the meta-claims, and the depends-on wiring the presupposition reading reads.
// Contract: buildLhc() -> { store_id, tables, claims, refId, state, view, receipt, graph, LHC }.
//   Imports the kernel and corpora/lhc; pure over the corpus, touching no truth field. graphWithout(demo)
//   returns the graph with the tagged depends-on edges removed, for the before/after reading.
// Invariant: a computed quantity grounds to its floor; a leg rests on its computed quantities; a
//   premise is a depends-on edge, never support. Grades are the kernel's own derivation.
"use strict";
import { createRequire } from "node:module";
import { claimRecord, linkRecord } from "../kernel/schema/records.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { genesis } from "../kernel/store/state.mjs";
import { apply } from "../kernel/store/apply.mjs";
import { storeViewOf } from "../kernel/store/decay.mjs";
import { decide } from "../kernel/gate/gate.mjs";

const require = createRequire(import.meta.url);
const { KINDS, SOURCES } = require("../corpora/lhc/lhc-tables.js");
const { LHC } = require("../corpora/lhc/lhc-legs.js");

export function buildLhc() {
  const tables = { sourceTable: makeSourceTable(SOURCES), kindTable: makeKindTable(KINDS) };
  const refId = new Map();
  const claims = LHC.claims.map((spec) => {
    const rec = claimRecord({ kind: spec.kind, statement: spec.statement, source_id: spec.source_id, contributor_id: spec.contributor_id, declared_grade: spec.declared_grade, checking_records: spec.checking_records, closing_condition: spec.closing_condition });
    refId.set(spec.ref, rec.identity);
    return { rec, spec };
  });
  const links = (LHC.links || []).map((l) => linkRecord({ link_kind: l.link_kind, from_identity: refId.get(l.from), to_identity: refId.get(l.to), support_group: l.support_group, source_id: l.source_id, contributor_id: l.contributor_id, declared_grade: l.declared_grade }));
  const entries = claims.map((c) => c.rec);
  const state = apply(genesis(), { entries, links, applied_contribution_hash: LHC.store_id, receipt_reference: LHC.store_id });
  const view = storeViewOf(state, tables);
  const receipt = decide({ hash: LHC.store_id, entries, links }, storeViewOf(genesis(), tables), {});
  const graph = { entries: state.entries, links: state.links, tables };

  // the graph with the depends-on edges tagged `demo` removed: the "before reifying" reading. Match by
  // the (from, to) identity pair the tagged specs name, so the reading sees the graph pre-reification.
  const taggedPairs = new Set((LHC.links || []).filter((l) => l.demo === "B-shared").map((l) => refId.get(l.from) + ">" + refId.get(l.to)));
  const graphWithout = () => ({ entries: state.entries, links: state.links.filter((l) => !(l.link_kind === "depends-on" && taggedPairs.has(l.from_identity + ">" + l.to_identity))), tables });

  return { store_id: LHC.store_id, tables, claims, refId, state, view, receipt, graph, graphWithout, LHC };
}
