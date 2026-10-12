// Role: the governance-hash (docs/coordination-layer-spec.md, Federation): the one named hash over a
//   community's canonical parameter record, its durable content-addressed identity. A kernel_id is a human
//   label over this hash, as a kind name is a label over a type-hash. Upstreamed from
//   A-Viable-Fork/Knowledge-Game api/governance-hash.js, which computed it app-side as a DEPARTURE until
//   the specified upstream implementation existed.
// Contract: canonicalParameterRecord(config, pinnedTypeHashes) -> the record hashed; governanceHash(config,
//   pinnedTypeHashes) -> hex sha256 through the kernel's canonical hash. Pure; imports only the kernel's
//   canonical form. Browser-safe ESM.
// Invariant: the record holds governance parameters only. kernel_id, frame, fetch_locations and
//   contribution_target are labels and transport hints and never move the hash. An absent parameter is
//   the honest "unspecified" (or an empty map), never silently omitted. Numeric fields pass as exact-decimal
//   strings: the canonical form refuses a JS number rather than truncate it.
"use strict";
import { hashOf } from "../kernel/schema/canonical.mjs";

export function canonicalParameterRecord(config, pinnedTypeHashes) {
  const c = config || {};
  return {
    pinned_type_hashes: pinnedTypeHashes || {},
    identity_thresholds: c.identity_thresholds || {},
    standing_economy: c.standing_economy || {},
    // the order a client shows claims in when no objective is chosen; a community parameter, since a feed
    // order is a choice of what is seen first.
    null_objective_order: c.null_objective_order || "unspecified",
    corpus_content_license: c.corpus_content_license || "unspecified",
  };
}

export function governanceHash(config, pinnedTypeHashes) {
  return hashOf(canonicalParameterRecord(config, pinnedTypeHashes));
}
