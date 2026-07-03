// Role: the composition-layer record types (composition spec, records 1 and 4; grows across the
//   phases). A composite store holds these above the domain kernel: a cross-store citation names a
//   domain claim and copies the grade the domain store held for it, and a composite claim owns a set
//   of citations. Each builder validates the spec's fields, canonicalizes, and hashes, exactly as the
//   domain records do, so a composition record is a v3-shaped record on the same canonical form.
// Contract: citationRecord(raw), compositeClaimRecord(raw). Pure, ESM; kernel imports only kernel.
// Invariant: the boundary is visible in every record. A citation's carried_grade is COPIED from the
//   domain store, never assigned here (the copy happens in transfer.mjs; this only validates it as a
//   grade). Identity is content over the reference itself (which composite claim cites which domain
//   claim in which store), so a re-grade updates carried_grade and cited_state without changing the id.
"use strict";
import { canonicalize, normalizeString, hashOf } from "../schema/canonical.mjs";
import { isPosition } from "../schema/confidence.mjs";

// small private helpers, mirrored from schema/records.mjs (not exported there); kept local so the
// composition records stay self-contained and never reach past the schema they build on.
const req = (v, msg) => { if (v === undefined || v === null || v === "") throw new Error(msg); return v; };
const grade = (v, where) => { if (!isPosition(v)) throw new Error(`${where}: not a confidence-order position: ${JSON.stringify(v)}`); return v; };
function extensionsOf(raw, declaredNames) {
  const ext = Object.assign({}, raw.extensions || {});
  for (const k of Object.keys(raw)) if (k !== "extensions" && !declaredNames.includes(k)) ext[k] = raw[k];
  return ext;
}
function finalize(canonDeclared, extRaw) {
  const node = Object.assign({}, canonDeclared);
  if (Object.keys(extRaw).length) node.extensions = canonicalize(extRaw);
  return { canonical: node, hash: hashOf(node, { pre: true }) };
}

// ---- record 1: the cross-store citation ----
const CITATION_ROLES = ["necessary", "corroborating"];
const CITATION_FIELDS = ["citation_id", "citing_claim", "source_store", "cited_claim", "cited_state", "carried_grade", "role", "made_at"];
export function citationRecord(raw) {
  if (!CITATION_ROLES.includes(raw.role)) throw new Error(`citation: bad role ${raw.role}`);
  const citing_claim = normalizeString(String(req(raw.citing_claim, "citation: citing_claim required")));
  const source_store = normalizeString(String(req(raw.source_store, "citation: source_store required")));
  const cited_claim = normalizeString(String(req(raw.cited_claim, "citation: cited_claim required")));
  // identity is the reference itself: this composite claim, that domain claim, in that store. The
  // state pointer and the carried grade are the mutable value re-derivation updates, not the identity.
  const citation_id = hashOf({ citing_claim, source_store, cited_claim });
  const carried_grade = grade(raw.carried_grade, "citation.carried_grade");
  const declared = {
    citation_id: canonicalize(citation_id),
    citing_claim: canonicalize(citing_claim),
    source_store: canonicalize(source_store),
    cited_claim: canonicalize(cited_claim),
    cited_state: canonicalize(String(req(raw.cited_state, "citation: cited_state required"))),
    carried_grade: canonicalize(carried_grade),
    role: canonicalize(raw.role),
    made_at: canonicalize(normalizeString(String(req(raw.made_at, "citation: made_at required")))),
  };
  const { canonical, hash } = finalize(declared, extensionsOf(raw, CITATION_FIELDS));
  return {
    record_type: "citation", citation_id, citing_claim, source_store, cited_claim,
    cited_state: raw.cited_state, carried_grade, role: raw.role, made_at: raw.made_at, canonical, hash,
  };
}

// ---- record 4 (base): the composite claim ----
// The base composite claim owns a set of citations. Its region names which side of the boundary it
// sits on: floor when it composes commensurable quantities to a domain floor, forum when it weighs
// across domains. Its grade is DERIVED by the record-2 transfer on read (transfer.mjs), never stored,
// the same discipline the domain model applies (grade is a derivation against the current state).
const COMPOSITE_REGIONS = ["floor", "forum"];
const COMPOSITE_CLAIM_FIELDS = ["claim_id", "statement", "region", "support"];
export function compositeClaimRecord(raw) {
  const statement = normalizeString(String(req(raw.statement, "composite claim: statement required")));
  if (!COMPOSITE_REGIONS.includes(raw.region)) throw new Error(`composite claim: bad region ${raw.region}`);
  const claim_id = hashOf({ statement }); // identity within the composite store
  const support = (raw.support || []).map((s) => String(s));
  const declared = {
    claim_id: canonicalize(claim_id),
    statement: canonicalize(statement),
    region: canonicalize(raw.region),
    support: canonicalize(support, "reference"), // citation ids, unordered, deduped
  };
  const { canonical, hash } = finalize(declared, extensionsOf(raw, COMPOSITE_CLAIM_FIELDS));
  return { record_type: "composite-claim", claim_id, statement, region: raw.region, support, canonical, hash };
}
