// Role: the local provider behind the management contract. Implements the kernel-level operations over
//   the REAL federation and adoption layer, in process: listKernels/readKernel/readCrossings read the
//   four members and their pins and crossings from buildBottomUp and the adoption layer; adopt pins a
//   shared type-hash and recomputes the crossings it changed; fork derives a child kernel through
//   api/fork.js; cross computes a crossing's native-or-untyped status through the crossing rule. This is
//   the management sibling of api/providers/local-provider.mjs.
// Contract: createLocalManagementProvider() -> { kind, listKernels, readKernel, readCrossings, adopt,
//   fork, cross }. No arguments; it builds the federation itself.
// Invariant: the adoption layer and the crossing rule are the real ones, not a copy. The provider holds
//   session pin-state (so an adopt is visible to a later read) and calls crossingStatus for every
//   status; it computes no status or grade of its own. It lives in build/ because it wraps build-layer
//   federation machinery that api/ may not import; the contract (api/management-api.mjs) stays the
//   membrane, and the check wires the two, exactly as check-client wires the claim contract.
// DEPARTURE: the prompt suggested api/providers/ for this provider; the trust boundary forbids api/
//   importing build/ (the federation and adoption layer), so the provider lives in build/ and the
//   contract it satisfies stays in api/. Same seam, boundary intact.
"use strict";
import { createRequire } from "node:module";
import { adoptionOf, crossingStatus, CASE_IDS } from "./adoption.mjs";
import { buildBottomUp } from "./bottomup-build.mjs";
import { forkKernel } from "../api/fork.js";

const require = createRequire(import.meta.url);
const { COMMON_TYPE_HASHES } = require("../corpora/_shared/common-types.js");

const AUTHOR = "A Viable Fork";
const PROVENANCE = "authored for the epistemic case study competition, 2026";

export function createLocalManagementProvider() {
  const fed = buildBottomUp();

  // session adoption state: a mutable copy of each member's pins, so an adopt is visible to later reads.
  const adoptions = {};
  for (const id of CASE_IDS) adoptions[id] = { caseId: id, pins: Object.assign({}, adoptionOf(id).pins) };

  // a member's ref -> kind map, for resolving a crossing's origin claim to the kind it crosses on.
  const kindByRef = {};
  for (const id of CASE_IDS) {
    const m = fed.members[id];
    const byIdentity = new Map((m.state.entries || []).map((e) => [e.identity, e]));
    kindByRef[id] = {};
    for (const [ref, identity] of m.refId) { const e = byIdentity.get(identity); if (e) kindByRef[id][ref] = e.kind; }
  }

  function kernelObject(id) {
    const m = fed.members[id];
    const kinds = [...m.tables.kindTable.byKind.keys()];
    const local_kinds = kinds.filter((k) => COMMON_TYPE_HASHES[k] === undefined)
      .map((k) => ({ kind: k, ceiling: m.tables.kindTable.byKind.get(k).ceiling }));
    const shared_pins = kinds.filter((k) => COMMON_TYPE_HASHES[k] !== undefined)
      .map((k) => ({ kind: k, hash: adoptions[id].pins[k] }));
    return { id, author: AUTHOR, provenance: PROVENANCE, local_kinds, shared_pins, pins: Object.assign({}, adoptions[id].pins) };
  }

  function listKernels() {
    return CASE_IDS.map((id) => {
      const k = kernelObject(id);
      return { id: k.id, author: k.author, provenance: k.provenance, pins: { kinds: Object.keys(k.pins), count: Object.keys(k.pins).length } };
    });
  }

  function readKernel(kernelId) {
    if (!adoptions[kernelId]) return null;
    return kernelObject(kernelId);
  }

  // every crossing's status recomputed from the session adoptions, so an adopt shows in the read.
  function crossingRow(cx) {
    const originAd = adoptions[cx.from_store], targetAd = adoptions[cx.into_store];
    return { id: cx.id, origin: cx.from_store, target: cx.into_store, kind: cx.kind, status: crossingStatus(cx.kind, originAd, targetAd), note: cx.note };
  }
  function readCrossings(kernelId) {
    let list = fed.crossings.map(crossingRow);
    if (kernelId) list = list.filter((c) => c.origin === kernelId || c.target === kernelId);
    return list;
  }

  // adopt: pin a shared type-hash on a kernel; recompute the crossings it changed; return the receipt.
  function adopt(kernelId, typeHash) {
    const ad = adoptions[kernelId];
    if (!ad) return { operation: "adopt", error: `no such kernel: ${kernelId}` };
    const before = fed.crossings.map(crossingRow);
    if (!Object.values(ad.pins).includes(typeHash)) ad.pins[`adopted:${typeHash.slice(0, 8)}`] = typeHash; // the real pin
    const after = fed.crossings.map(crossingRow);
    const crossings_changed = after
      .map((a, i) => ({ before: before[i], after: a }))
      .filter((p) => p.before.status !== p.after.status)
      .map((p) => ({ crossing: p.after.id, origin: p.after.origin, target: p.after.target, kind: p.after.kind, from: p.before.status, to: p.after.status }));
    return { operation: "adopt", kernel: kernelId, pinned: typeHash, crossings_changed, now_pins: Object.keys(ad.pins).length };
  }

  function fork(kernelId, atPoint) {
    const ad = adoptions[kernelId];
    if (!ad) return { operation: "fork", error: `no such kernel: ${kernelId}` };
    return forkKernel({ id: kernelId, pins: ad.pins }, { atPoint });
  }

  // cross: make a crossing from one kernel's claim into another; report native or untyped via the rule.
  function cross(originKernel, originClaim, targetKernel) {
    const originAd = adoptions[originKernel], targetAd = adoptions[targetKernel];
    if (!originAd || !targetAd) return { operation: "cross", error: "unknown origin or target kernel" };
    const kind = (kindByRef[originKernel] || {})[originClaim];
    if (!kind) return { operation: "cross", error: `origin kernel ${originKernel} has no claim ${originClaim}` };
    const status = crossingStatus(kind, originAd, targetAd);
    return {
      operation: "cross", origin: originKernel, claim: originClaim, target: targetKernel, kind, status,
      grounds: status === "native",
      note: status === "native"
        ? "composes native and lossless: both kernels pin the same type-hash for this kind"
        : "arrives untyped and grounds nothing until the target adopts or forks the type",
    };
  }

  return { kind: "local", listKernels, readKernel, readCrossings, adopt, fork, cross };
}
