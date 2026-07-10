// Role: freeze the raw federation facts the management provider runs over into one snapshot, the
//   management sibling of vendor/gate/snapshot.json. It writes the kind rows each member declares, the
//   crossings between members and the claim each crosses, and the common-kind names, all read from the
//   real buildBottomUp and the adoption layer. It writes no computed pin or status: the provider computes
//   those live with the real hashTypeBundle and the crossing rule, exactly as the claim provider computes
//   grades live from the claim snapshot.
// Contract: `node build/vendor-management.mjs` writes vendor/management/management-snapshot.json. No args.
// Invariant: raw facts only (kind rows, crossings, common kinds), never answers; the answers (pins,
//   statuses) are the provider's live computation. Deterministic: the same federation, the same bytes.
"use strict";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { buildBottomUp } from "./bottomup-build.mjs";
import { CASE_IDS } from "./adoption.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const { COMMON_TYPE_HASHES } = require("../corpora/_shared/common-types.js");

const AUTHOR = "A Viable Fork";
const PROVENANCE = "authored for the epistemic case study competition, 2026";
// a representative claim per member, for the manager's live grade read through the claim contract.
const SAMPLE_REF = { lhc: "robust", covid: "int.two-spillovers", eggs: "ec.discount", lineage: "sci.fake-independence" };

const fed = buildBottomUp();

// the crossings, and the claims each crosses (so the provider can resolve a crossing's origin claim to
// the kind it crosses on for cross()).
const crossings = fed.crossings.map((cx) => ({ id: cx.id, from: cx.from_store, to: cx.into_store, kind: cx.kind, from_claim: cx.from_claim, note: cx.note }));

const members = CASE_IDS.map((id) => {
  const m = fed.members[id];
  const kinds = [...m.tables.kindTable.byKind.entries()].map(([kind, row]) => ({ kind, ceiling: row.ceiling }));
  // the claims this member exposes for crossing: the source claims of any crossing from it, with kind.
  const byIdentity = new Map((m.state.entries || []).map((e) => [e.identity, e]));
  const refKind = (ref) => { const identity = m.refId.get(ref); const e = identity && byIdentity.get(identity); return e ? e.kind : null; };
  const claimRefs = [...new Set(crossings.filter((c) => c.from === id).map((c) => c.from_claim))];
  const claims = claimRefs.map((ref) => ({ ref, kind: refKind(ref) })).filter((c) => c.kind);
  const sampleId = m.refId.get(SAMPLE_REF[id]);
  const sampleEntry = sampleId && byIdentity.get(sampleId);
  const sample = sampleEntry ? { identity: sampleId, statement: sampleEntry.statement } : null;
  return { id, author: AUTHOR, provenance: PROVENANCE, kinds, claims, sample };
});

const snapshot = { members, crossings, common_kinds: Object.keys(COMMON_TYPE_HASHES) };
const dir = join(ROOT, "vendor/management");
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "management-snapshot.json"), JSON.stringify(snapshot, null, 2));
console.log(`wrote vendor/management/management-snapshot.json: ${members.length} members, ${crossings.length} crossings, common kinds ${snapshot.common_kinds.join("+")}`);
