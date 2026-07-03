// Role: the shared builder for the restructured eggs case (Prompt 20). Builds the three domain stores
//   through the real v3 gate and the eggs composite through the composition layer, from the pure data
//   in corpora/eggs. One builder, so the oracle that verifies the case (build/check-eggs.mjs) and the
//   generator that vendors it for the presentation (build/vendor-eggs.mjs) build the SAME structure.
// Contract: buildEggs() -> { tables, domains, idOf, weighs, framing, successor, edges, compStore,
//   profile, COMPOSITE }. Pure over the corpus; imports the kernel, the composition layer, corpora/eggs.
// Invariant: a domain claim grounds to a domain floor, a composite claim grounds by citing across the
//   boundary. The build touches no truth field; grades are the kernel's own derivation.
"use strict";
import { createRequire } from "node:module";
import { claimRecord, linkRecord } from "../kernel/schema/records.mjs";
import { crossDomainClaimRecord } from "../kernel/composition/records.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { genesis } from "../kernel/store/state.mjs";
import { apply } from "../kernel/store/apply.mjs";
import { storeViewOf } from "../kernel/store/decay.mjs";
import { decide } from "../kernel/gate/gate.mjs";
import { hashOf } from "../kernel/schema/canonical.mjs";
import { citeDomainClaim, compositeGrade } from "../kernel/composition/transfer.mjs";
import { ceilingForCitations } from "../kernel/composition/vocabulary.mjs";
import { framingRecord, presuppositionEdge } from "../kernel/composition/framing.mjs";
import { compositeProfile } from "../kernel/composition/profiles.mjs";

const require = createRequire(import.meta.url);
const { KINDS, SOURCES } = require("../corpora/eggs/tables.js");
const { NUTRITION } = require("../corpora/eggs/nutrition.js");
const { ENVIRONMENT } = require("../corpora/eggs/environment.js");
const { ECONOMICS } = require("../corpora/eggs/economics.js");
const { COMPOSITE } = require("../corpora/eggs/composite.js");

const MADE = "2026-07-03T00:00:00Z";

export function buildEggs() {
  const tables = { sourceTable: makeSourceTable(SOURCES), kindTable: makeKindTable(KINDS) };

  // a domain store: claim records keyed by local ref, links resolved, applied to genesis, with the
  // gate receipt and the earned-grade view.
  function buildDomain(domain) {
    const refId = new Map();
    const claims = domain.claims.map((spec) => {
      const rec = claimRecord({ kind: spec.kind, statement: spec.statement, source_id: spec.source_id, contributor_id: spec.contributor_id, declared_grade: spec.declared_grade, checking_records: spec.checking_records, closing_condition: spec.closing_condition });
      refId.set(spec.ref, rec.identity);
      return { rec, spec };
    });
    const links = (domain.links || []).map((l) => linkRecord({ link_kind: l.link_kind, from_identity: refId.get(l.from), to_identity: refId.get(l.to), support_group: l.support_group, source_id: l.source_id, contributor_id: l.contributor_id, declared_grade: l.declared_grade }));
    const entries = claims.map((c) => c.rec);
    const state = apply(genesis(), { entries, links, applied_contribution_hash: domain.store_id, receipt_reference: domain.store_id });
    const view = storeViewOf(state, tables);
    const receipt = decide({ hash: domain.store_id, entries, links }, storeViewOf(genesis(), tables), {});
    return { store_id: domain.store_id, claims, links, refId, state, view, receipt, tables };
  }

  const domains = { "S-nutrition": buildDomain(NUTRITION), "S-environment": buildDomain(ENVIRONMENT), "S-economics": buildDomain(ECONOMICS) };
  const idOf = (store, claim) => domains[store].refId.get(claim);

  // the composite: each weighing cites its domain claims across the boundary and computes its grade.
  const weighs = COMPOSITE.weighings.map((w) => {
    const claim_id = hashOf({ statement: w.statement });
    const cits = w.cites.map((c) => citeDomainClaim(domains[c.store], { citing_claim: claim_id, cited_claim: idOf(c.store, c.claim), role: c.role, made_at: MADE, term_ref: { term_id: c.term, term_version: "1" } }));
    const rec = crossDomainClaimRecord({ statement: w.statement, support: cits.map((x) => x.citation_id), weighting: w.weighting, frame_refs: [COMPOSITE.framing.framing_id] });
    const ceiling = ceilingForCitations(cits);
    const grade = compositeGrade({ ceiling, citations: cits });
    return { spec: w, claim_id, cits, rec, ceiling, grade };
  });

  const framing = framingRecord(COMPOSITE.framing);
  const successor = framingRecord(COMPOSITE.successor);
  const edges = COMPOSITE.presupposes.map((p) => ({ p, edge: presuppositionEdge({ from_store: p.store, from_claim: idOf(p.store, p.claim), to_framing: framing.framing_id }) }));

  const compStore = { store_id: "C-eggs", claims: weighs.map((w) => w.rec), citations: weighs.flatMap((w) => w.cits), edges: edges.map((x) => x.edge), frames: [framing] };
  const sourceStates = Object.fromEntries(Object.values(domains).map((d) => [d.store_id, d.state.state_hash]));
  const profile = compositeProfile(compStore, { sourceStates });

  return { tables, domains, idOf, weighs, framing, successor, edges, compStore, profile, COMPOSITE };
}
