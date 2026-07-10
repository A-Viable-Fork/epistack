// Role: the thin adoption layer. Reads the four cases' existing kind tables (no corpus edit) and, for
//   each, produces the type bundles its kinds imply and their hashes, so each kernel declares as data
//   which type-hashes it pins. A common kind (measurement, forum, declaration) resolves to the shared
//   hash in corpora/_shared/common-types.js; a kind unique to one kernel (lhc's derivation) holds its
//   own hash no other kernel pins. Also decides, from two kernels' pins, whether a crossing is native.
// Contract: kindBundle(row), adoptionOf(caseId) -> { caseId, pins, bundles, mismatches }, CASE_IDS,
//   crossingStatus(originKind, originAdoption, targetAdoption) -> "native" | "untyped". ESM, build
//   layer (may reach kernel and corpora); reuses kernel/schema/type-hash.mjs for the hash.
// Invariant: the bundle shape matches common-types.js exactly, so a case's measurement bundle is
//   byte-identical to the shared one and hashes to the same value; a mismatch means the case meant
//   something different by a common kind and is reported, never forced equal. This reads the live tables
//   and computes hashes over them; it defines no new type.
"use strict";
import { createRequire } from "node:module";
import { hashTypeBundle } from "../kernel/schema/type-hash.mjs";

const require = createRequire(import.meta.url);
const { COMMON_TYPE_HASHES } = require("../corpora/_shared/common-types.js");

// the four cases' kind-table rows, read as-is from their existing corpora.
const CASE_KINDS = {
  lhc: require("../corpora/lhc/lhc-tables.js").KINDS,
  covid: require("../corpora/covid/tables.js").KINDS,
  eggs: require("../corpora/eggs/tables.js").KINDS,
  lineage: require("../corpora/lineage/tables.js").KINDS,
};
export const CASE_IDS = Object.keys(CASE_KINDS);

// the type bundle a kind-table row implies: the kind plus the apparatus that gives it meaning. The
// shape is fixed (matching common-types.js) so a common kind hashes to the shared value.
export function kindBundle(row) {
  return {
    kind: row.kind,
    ceiling: row.ceiling,
    compatibility_rule_id: row.compatibility_rule_id != null ? row.compatibility_rule_id : null,
    atlas_refs: row.atlas_refs != null ? row.atlas_refs : [],
  };
}

// a kernel's adoption: for each kind it uses, the bundle and its hash. A common kind whose hash does
// not match the shared one is a mismatch (the two kernels meant different things by it), surfaced here.
export function adoptionOf(caseId) {
  const rows = CASE_KINDS[caseId];
  if (!rows) throw new Error(`adoption: unknown case ${caseId}`);
  const pins = {}, bundles = {}, mismatches = [];
  for (const row of rows) {
    const bundle = kindBundle(row);
    const hash = hashTypeBundle(bundle);
    bundles[row.kind] = bundle;
    pins[row.kind] = hash;
    const shared = COMMON_TYPE_HASHES[row.kind];
    if (shared !== undefined && shared !== hash) mismatches.push({ caseId, kind: row.kind, shared, got: hash });
  }
  return { caseId, pins, bundles, mismatches };
}

// the crossing decision, keyed on hash adoption rather than on the store boundary: a claim whose origin
// kind resolves to a type-hash the target kernel also pins crosses native (both mean the same type);
// otherwise it arrives untyped (the target pinned no such type and grounds nothing until it forks one).
export function crossingStatus(originKind, originAdoption, targetAdoption) {
  const originHash = originAdoption.pins[originKind];
  if (originHash === undefined) throw new Error(`crossing: origin does not pin kind ${originKind}`);
  const targetPins = Object.values(targetAdoption.pins);
  return targetPins.includes(originHash) ? "native" : "untyped";
}
