// Role: the local provider behind the management contract, the management sibling of
//   api/providers/local-provider.mjs. Where the claim provider runs the real gate over a claim snapshot,
//   this runs the real adoption logic over a management snapshot: it computes each member's pins live
//   with the real content-addressed hashTypeBundle, decides every crossing native-or-untyped by the
//   crossing rule (a type crosses native exactly when the target pins the source's hash), and adopts,
//   forks, and crosses, each returning a receipt. This is the provider the manager and, later, the MCP
//   producer connector both use.
// Contract: createLocalManagementProvider(snapshot) -> { kind, listKernels, readKernel, readCrossings,
//   adopt, fork, cross }. snapshot = { members:[{id,author,provenance,kinds:[{kind,ceiling}],
//   claims:[{ref,kind}]}], crossings:[{id,from,to,kind,from_claim,note}], common_kinds:[...] }. ESM; api
//   imports kernel (hashTypeBundle) and api (forkKernel), never build or the periphery.
// Invariant: the content-addressing is the real one (kernel/schema/type-hash.mjs), so a pin computed
//   here is byte-identical to what the adoption layer computes; the crossing rule and the bundle shape
//   are the same trivial forms build/adoption.mjs uses, and build/check-management.mjs proves this
//   provider's outputs equal build/adoption's direct outputs, so it is a faithful running of the real
//   logic and not a divergent copy. It computes no grade; grades stay on the claim contract.
"use strict";
import { hashTypeBundle } from "../../kernel/schema/type-hash.mjs";
import { forkKernel } from "../fork.js";

// the type bundle a kind row implies, the same shape build/adoption.mjs uses; the hash of it is the pin.
function kindBundle(row) {
  return { kind: row.kind, ceiling: row.ceiling, compatibility_rule_id: row.compatibility_rule_id != null ? row.compatibility_rule_id : null, atlas_refs: row.atlas_refs != null ? row.atlas_refs : [] };
}
// the crossing rule: a type crosses native exactly when the target pins the source's type-hash.
function statusOf(sourceHash, targetPinValues) { return targetPinValues.indexOf(sourceHash) >= 0 ? "native" : "untyped"; }

export function createLocalManagementProvider(snapshot) {
  const snap = snapshot || {};
  const common = new Set(snap.common_kinds || []);
  const members = {};
  for (const m of snap.members || []) {
    const pins = {};
    for (const row of m.kinds || []) pins[row.kind] = hashTypeBundle(kindBundle(row));
    const kindByRef = {};
    for (const c of m.claims || []) kindByRef[c.ref] = c.kind;
    members[m.id] = { id: m.id, author: m.author, provenance: m.provenance, kinds: m.kinds || [], pins, kindByRef };
  }
  const ids = (snap.members || []).map((m) => m.id);
  const crossings = snap.crossings || [];

  function kernelObject(id) {
    const m = members[id];
    if (!m) return null;
    const local_kinds = m.kinds.filter((r) => !common.has(r.kind)).map((r) => ({ kind: r.kind, ceiling: r.ceiling }));
    const shared_pins = m.kinds.filter((r) => common.has(r.kind)).map((r) => ({ kind: r.kind, hash: m.pins[r.kind] }));
    return { id, author: m.author, provenance: m.provenance, local_kinds, shared_pins, pins: Object.assign({}, m.pins) };
  }

  function listKernels() {
    return ids.map((id) => {
      const k = kernelObject(id);
      return { id: k.id, author: k.author, provenance: k.provenance, pins: { kinds: Object.keys(k.pins), count: Object.keys(k.pins).length } };
    });
  }
  function readKernel(kernelId) { return kernelObject(kernelId); }

  function crossingRow(cx) {
    const from = members[cx.from], to = members[cx.to];
    const status = from && to ? statusOf(from.pins[cx.kind], Object.values(to.pins)) : "untyped";
    return { id: cx.id, origin: cx.from, target: cx.to, kind: cx.kind, status, note: cx.note };
  }
  function readCrossings(kernelId) {
    let list = crossings.map(crossingRow);
    if (kernelId) list = list.filter((c) => c.origin === kernelId || c.target === kernelId);
    return list;
  }

  function adopt(kernelId, typeHash) {
    const m = members[kernelId];
    if (!m) return { operation: "adopt", error: `no such kernel: ${kernelId}` };
    const before = crossings.map(crossingRow);
    if (Object.values(m.pins).indexOf(typeHash) < 0) m.pins[`adopted:${typeHash.slice(0, 8)}`] = typeHash; // the real pin
    const after = crossings.map(crossingRow);
    const crossings_changed = after
      .map((a, i) => ({ before: before[i], after: a }))
      .filter((p) => p.before.status !== p.after.status)
      .map((p) => ({ crossing: p.after.id, origin: p.after.origin, target: p.after.target, kind: p.after.kind, from: p.before.status, to: p.after.status }));
    return { operation: "adopt", kernel: kernelId, pinned: typeHash, crossings_changed, now_pins: Object.keys(m.pins).length };
  }

  function fork(kernelId, atPoint) {
    const m = members[kernelId];
    if (!m) return { operation: "fork", error: `no such kernel: ${kernelId}` };
    return forkKernel({ id: kernelId, pins: m.pins }, { atPoint });
  }

  function cross(originKernel, originClaim, targetKernel) {
    const from = members[originKernel], to = members[targetKernel];
    if (!from || !to) return { operation: "cross", error: "unknown origin or target kernel" };
    const kind = from.kindByRef[originClaim];
    if (!kind) return { operation: "cross", error: `origin kernel ${originKernel} has no claim ${originClaim}` };
    const status = statusOf(from.pins[kind], Object.values(to.pins));
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
