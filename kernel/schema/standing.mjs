// Role: the standing fields and records the sibling repositories converged on, each kept apart from the
//   grade: who may settle a claim (claim class, after Repo-Infrastructure CLAIMS.md), where it stands in
//   its life (status, after Metacomplexity map/nodes.js and Formalization CONTRACT.md), whether it is
//   held from memory, and the records that act on standing without rewriting a claim: the ruling (after
//   PDE parties.json and Phone's person-held forks), the kill (Metacomplexity kills, PDE foreclosure),
//   the flag (Math_Map mapfill/flags.js) and the outbound hold (Metacomplexity packets, Formalization
//   OUTBOUND.md).
// Contract: STANDING_KEY; standingOf(entry), validateStanding(ext), effectiveCeiling(kindTable, entry), sharedCauseSupports(supports);
//   rulingRecord,
//   killRecord, flagRecord, outboundRecord; CLAIM_CLASSES, STATUSES, OUTBOUND_STATUSES. Pure, ESM;
//   kernel imports only kernel.
// Invariant: these fields never raise a grade. Memory caps a claim at asserted; a status, a class or a
//   holder is read beside the grade and never enters the fold; a ruling is a record of who decided,
//   never an inference that something was decided.
"use strict";
import { canonicalize, hashOf } from "./canonical.mjs";
import { meet } from "./confidence.mjs";
import { ceilingFor } from "./tables.mjs";
import { reinstatementCondition } from "./records.mjs";

// who may settle a claim of each class: truth by evidence, rightness by the person who holds it,
// expression by its author, utility by a check.
export const CLAIM_CLASSES = ["truth", "rightness", "expression", "utility"];
// where a claim stands in its life. established, dead and constrained each rest on receipts.
export const STATUSES = ["open", "believed", "established", "dead", "constrained"];
export const RECEIPTED_STATUSES = ["established", "dead", "constrained"];
export const OUTBOUND_STATUSES = ["held", "ready", "sent"];
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const req = (v, msg) => { if (v === undefined || v === null || v === "") throw new Error(msg); return v; };
const ids = (v, where) => {
  if (v === undefined) return [];
  if (!Array.isArray(v) || v.some((x) => typeof x !== "string" || !x)) throw new Error(`${where} must be an array of ids`);
  return [...new Set(v)].sort();
};

// a claim's standing lives under one extension key, `claim_standing`, in its hashed extensions: extensions are
// a consumer's free namespace (A-Viable-Fork/Physics already keeps its own `status` there), so the kernel
// claims one name and reads only that. Adding it moves no existing hash.
export const STANDING_KEY = "claim_standing";
const FIELDS = ["claim_class", "status", "memory", "holder", "receipts"];
function standingExt(entry) {
  const x = (entry && entry.canonical && entry.canonical.extensions) || (entry && entry.extensions) || {};
  return x[STANDING_KEY] || {};
}
export function validateStanding(ext) {
  const st = ext[STANDING_KEY];
  if (st === undefined) return;
  if (!st || typeof st !== "object" || Array.isArray(st)) throw new Error(`claim: ${STANDING_KEY} must be an object`);
  for (const k of Object.keys(st)) if (!FIELDS.includes(k)) throw new Error(`claim: ${STANDING_KEY}.${k} is not a standing field (${FIELDS.join(", ")})`);
  if (st.claim_class !== undefined && !CLAIM_CLASSES.includes(st.claim_class)) throw new Error(`claim: bad claim_class ${st.claim_class}`);
  if (st.status !== undefined && !STATUSES.includes(st.status)) throw new Error(`claim: bad status ${st.status}`);
  if (st.memory !== undefined && typeof st.memory !== "boolean") throw new Error("claim: memory must be true or false");
  if (st.holder !== undefined && (typeof st.holder !== "string" || !st.holder)) throw new Error("claim: holder must be a party id");
  ids(st.receipts, "claim: receipts");
}
export function standingOf(entry) {
  const x = standingExt(entry);
  return {
    claim_class: x.claim_class || "truth",
    status: x.status || null,
    memory: x.memory === true,
    holder: x.holder || null,
    receipts: Array.isArray(x.receipts) ? x.receipts.slice() : [],
  };
}

// the ceiling the earned-grade rule caps at: the kind's, and asserted for a claim held from memory.
export function effectiveCeiling(kindTable, entry) {
  const ceil = ceilingFor(kindTable, entry.kind);
  const position = ceil ? ceil.position : "asserted";
  if (!standingOf(entry).memory) return { position, constitutive: !!(ceil && ceil.mode === "constitutive") };
  return { position: meet(position, "asserted"), constitutive: false };
}

// a kind not liftable by convergence reads its supports as sharing one cause: each carries the union of all
// their footprints, so no two are disjoint and the earned-grade rule's independence lift never applies.
// Expressed as data, so the grounded rule itself (kernel/grounding/earned-grade.mjs) is unchanged.
export function sharedCauseSupports(supports) {
  const all = new Set();
  for (const s of supports) for (const x of s.footprint || []) all.add(x);
  return supports.map((s) => ({ ...s, footprint: new Set(all) }));
}

function sealed(record) {
  const canonical = canonicalize(record);
  return { ...record, canonical, hash: hashOf(canonical, { pre: true }) };
}

// a ruling: the named party decided the claim, on the date. Whether the party may rule is the party
// table's to say (`rules: true`), and the gate checks it.
export function rulingRecord(raw) {
  const date = req(raw.date, "ruling: date required");
  if (!DATE.test(date)) throw new Error("ruling: date must be YYYY-MM-DD");
  return sealed({
    record_type: "ruling",
    claim_identity: req(raw.claim_identity, "ruling: claim_identity required"),
    by_party: req(raw.by_party, "ruling: by_party required"),
    date,
    ruling: req(raw.ruling, "ruling: what was ruled is required"),
  });
}

// a kill: a result that kills a claim, within a scope, on receipts. A kill scoped "global" takes the claim
// out of force; a narrower scope is kept and read, and leaves force alone. The reinstatement condition is
// the withdrawn record's, so a kill names what would bring the claim back.
export function killRecord(raw) {
  const scope = req(raw.scope, "kill: scope required (\"global\" or the scope the kill holds in)");
  const rec = {
    record_type: "kill",
    killed_identity: req(raw.killed_identity, "kill: killed_identity required"),
    by_identity: req(raw.by_identity, "kill: by_identity (the killing result) required"),
    scope,
    receipts: ids(raw.receipts, "kill: receipts"),
  };
  if (!rec.receipts.length) throw new Error("kill: a kill rests on at least one receipt");
  if (raw.reinstatement_condition !== undefined) rec.reinstatement_condition = reinstatementCondition(raw.reinstatement_condition);
  return sealed(rec);
}

// a flag withholds an entry from support until it is corrected; it never rewrites the entry.
export function flagRecord(raw) {
  return sealed({
    record_type: "flag",
    target_identity: req(raw.target_identity, "flag: target_identity required"),
    by: req(raw.by, "flag: by required"),
    reason: req(raw.reason, "flag: reason required"),
    receipts: ids(raw.receipts, "flag: receipts"),
  });
}

// an outbound item: held until a person signs it off, and frozen at its hash once sent.
export function outboundRecord(raw) {
  if (!OUTBOUND_STATUSES.includes(raw.status)) throw new Error(`outbound: bad status ${raw.status}`);
  const artifact = req(raw.artifact_sha256, "outbound: artifact_sha256 required");
  const rec = {
    record_type: "outbound",
    outbound_id: req(raw.outbound_id, "outbound: outbound_id required"),
    destination: req(raw.destination, "outbound: destination required"),
    artifact_sha256: artifact,
    status: raw.status,
  };
  if (raw.status !== "held") rec.signed_off_by = req(raw.signed_off_by, `outbound: ${raw.status} requires signed_off_by`);
  if (raw.status === "sent") {
    rec.sent_sha256 = req(raw.sent_sha256, "outbound: sent requires sent_sha256");
    if (rec.sent_sha256 !== artifact) throw new Error("outbound: what was sent must be the artifact signed off (sent_sha256 = artifact_sha256)");
  }
  return sealed(rec);
}

// the force a store's standing records take away: a flagged entry or a globally killed one delivers no
// support. Scoped kills are reported, never folded.
export function withheldIdentities(state) {
  const out = new Set();
  for (const f of (state && state.flag_records) || []) out.add(f.target_identity);
  for (const k of (state && state.kill_records) || []) if (k.scope === "global") out.add(k.killed_identity);
  return out;
}
