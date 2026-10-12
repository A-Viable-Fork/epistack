// Role: the two reference tables (intake data model v3, Section 10) and the source-footprint
//   closure (Design Decision B). The source table and the kind-ceiling table are TRUSTED INPUTS
//   that enter every check; this module holds their shape and the reflexive-transitive closure that
//   corroboration and checker-independence read over source dependencies.
// Contract: makeSourceTable(rows), makeKindTable(rows), makePartyTable(rows); sourceClass, ceilingFor,
//   footprintClosure, partyOf, kindRow, lintSourceTable.
//   Pure, ESM; kernel imports only kernel.
// Invariant: the dependency relation is required acyclic by governance; a cycle nevertheless present
//   is read as one source per strongly connected component (the conservative reading), so the
//   closure never undercounts a footprint. Governing these tables is the model's named trust boundary.
"use strict";
import { isPosition, modeOf } from "./confidence.mjs";
import { READ_DEPTHS } from "./provenance.mjs";
const HEX64 = /^[0-9a-f]{64}$/;

// "ai-audit": an adversarial report by a model, distinct in kind from human testimony; "formal-artifact": a
// compiled proof module or similar, an artifact rather than testimony about one. Both upstreamed from
// A-Viable-Fork/Physics, where they were the hash-tracked divergences D0 and D2 (its upstream/lock.json).
const SOURCE_CLASSES = ["primary-measurement", "peer-reviewed", "preprint", "dataset", "institutional-report", "testimony", "ai-audit", "formal-artifact"];

export function makeSourceTable(rows) {
  const byId = new Map();
  for (const r of rows || []) {
    if (!r.source_id) throw new Error("source row missing source_id");
    if (!SOURCE_CLASSES.includes(r.source_class)) throw new Error(`source ${r.source_id}: bad source_class ${r.source_class}`);
    const row = { source_id: r.source_id, source_class: r.source_class, description: r.description || "", rests_on: (r.rests_on || []).slice() };
    // the landing fields (after Metacomplexity map/sources/*/meta.json): the bytes' hash, the landed files,
    // the original's address and hash, and how deeply the source was read. Kept only when given.
    if (r.sha256 !== undefined) { if (!HEX64.test(r.sha256)) throw new Error(`source ${r.source_id}: sha256 must be 64 lowercase hex`); row.sha256 = r.sha256; }
    if (r.files !== undefined) {
      if (!Array.isArray(r.files) || r.files.some((f) => !f || !f.path || !HEX64.test(f.sha256 || ""))) throw new Error(`source ${r.source_id}: files must be [{ path, sha256, method? }]`);
      row.files = r.files.map((f) => ({ path: f.path, sha256: f.sha256, ...(f.method ? { method: f.method } : {}) }));
    }
    if (r.original !== undefined) row.original = { ...r.original };
    if (r.read_depth !== undefined) { if (!READ_DEPTHS.includes(r.read_depth)) throw new Error(`source ${r.source_id}: bad read_depth ${r.read_depth}`); row.read_depth = r.read_depth; }
    byId.set(r.source_id, row);
  }
  return { byId, classes: SOURCE_CLASSES.slice() };
}
export function sourceClass(table, id) {
  const r = table.byId.get(id);
  return r ? r.source_class : null;
}

export function makeKindTable(rows) {
  const byKind = new Map();
  for (const r of rows || []) {
    if (!r.kind) throw new Error("kind row missing kind");
    if (!isPosition(r.ceiling)) throw new Error(`kind ${r.kind}: bad ceiling ${r.ceiling}`);
    const row = { kind: r.kind, ceiling: r.ceiling, compatibility_rule_id: r.compatibility_rule_id || null };
    // after A-Viable-Fork/PDE kernel/kinds.json and config.json: fields an entry of the kind must carry, fields
    // each of its checking records must carry, and whether agreement across supports may lift it (false for
    // a kind whose sources share a cause, such as surveys of absence by models trained on one corpus).
    for (const f of ["admission_requirements", "checking_record_must_contain"]) {
      if (r[f] === undefined) continue;
      if (!Array.isArray(r[f]) || r[f].some((x) => typeof x !== "string" || !x)) throw new Error(`kind ${r.kind}: ${f} must be an array of field names`);
      row[f] = r[f].slice();
    }
    if (r.liftable_by_convergence !== undefined) {
      if (typeof r.liftable_by_convergence !== "boolean") throw new Error(`kind ${r.kind}: liftable_by_convergence must be true or false`);
      row.liftable_by_convergence = r.liftable_by_convergence;
    }
    byKind.set(r.kind, row);
  }
  return { byKind };
}
export function kindRow(kindTable, kind) {
  return (kindTable && kindTable.byKind.get(kind)) || null;
}
export function ceilingFor(kindTable, kind) {
  const r = kindTable.byKind.get(kind);
  if (!r) return null;
  return { position: r.ceiling, mode: modeOf(r.ceiling) };
}

// the party table (after A-Viable-Fork/PDE kernel/seat/parties.json): who checks and who authors, each with
// the authority they answer to and the sources they are already exposed to. Checker independence is
// computed from it, never taken from a record's own say-so. `rules` marks a party that may issue rulings.
export function makePartyTable(rows) {
  const byId = new Map();
  for (const r of rows || []) {
    if (!r.party_id) throw new Error("party row missing party_id");
    if (!r.authority_root) throw new Error(`party ${r.party_id}: authority_root required`);
    if (byId.has(r.party_id)) throw new Error(`party ${r.party_id}: duplicate`);
    byId.set(r.party_id, { party_id: r.party_id, authority_root: r.authority_root, source_footprint: (r.source_footprint || []).slice().sort(), rules: r.rules === true });
  }
  return { byId };
}
export function partyOf(table, id) {
  return (table && table.byId.get(id)) || null;
}

// the lineage lint over raw source rows (after A-Viable-Fork/Physics build/check-dg-ancestry.mjs): the shapes
// that would let a shared ancestry pass as independence. A dangling rests_on target, a self-loop, a cycle, an
// id registered twice, and one artifact (one sha256, on the row or a landed file) under two ids neither of
// which rests on the other. Returns violations; never throws, so a caller can report them all.
export function lintSourceTable(rows) {
  const out = [];
  const ids = new Map();
  for (const r of rows || []) ids.set(r.source_id, (ids.get(r.source_id) || 0) + 1);
  for (const [id, n] of ids) if (n > 1) out.push({ rule: "duplicate-id", source_id: id, detail: `${n} rows` });
  const restsOn = new Map((rows || []).map((r) => [r.source_id, r.rests_on || []]));
  for (const [id, deps] of restsOn) for (const d of deps) {
    if (d === id) out.push({ rule: "self-loop", source_id: id, detail: id });
    else if (!restsOn.has(d)) out.push({ rule: "dangling", source_id: id, detail: d });
  }
  const state = new Map();
  const visit = (id, path) => {
    if (state.get(id) === "done" || !restsOn.has(id)) return;
    if (state.get(id) === "open") { const cyc = path.slice(path.indexOf(id)); if (cyc.length > 1) out.push({ rule: "cycle", source_id: id, detail: cyc.join(" -> ") }); return; }
    state.set(id, "open");
    for (const d of restsOn.get(id)) if (d !== id) visit(d, [...path, d]);
    state.set(id, "done");
  };
  for (const id of restsOn.keys()) visit(id, [id]);
  const table = { byId: new Map((rows || []).map((r) => [r.source_id, { rests_on: r.rests_on || [] }])) };
  const byHash = new Map();
  for (const r of rows || []) for (const h of new Set([r.sha256, ...((r.files || []).map((f) => f.sha256))].filter(Boolean))) {
    if (!byHash.has(h)) byHash.set(h, []);
    byHash.get(h).push(r.source_id);
  }
  for (const [h, rs] of byHash) for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++)
    if (!footprintClosure(table, [rs[i]]).has(rs[j]) && !footprintClosure(table, [rs[j]]).has(rs[i])) out.push({ rule: "artifact-twice", source_id: rs[i], detail: `${rs[j]} carries the same sha256 ${h.slice(0, 12)}` });
  return out;
}

// the reflexive-transitive closure of a set of source ids over `rests_on`. A cycle is naturally
// absorbed (every member is reachable from every other), which is the one-source-per-SCC reading:
// the footprint is never smaller than the truth, so an intersection can only over-count shared-ness,
// which is the conservative direction the coverage note names.
export function footprintClosure(table, sourceIds) {
  const out = new Set();
  const stack = [...(sourceIds || [])];
  while (stack.length) {
    const id = stack.pop();
    if (out.has(id)) continue;
    out.add(id);
    const row = table.byId.get(id);
    for (const dep of (row && row.rests_on) || []) if (!out.has(dep)) stack.push(dep);
  }
  return out;
}
