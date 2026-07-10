// Role: freeze the bottom-up federation into one view the kernel-manager surface reads. Runs the real
//   buildBottomUp() and the adoption layer and writes vendor/federation/federation-view.json: the four
//   members (id, author, provenance, the local kinds versus the shared type-hashes each pins, and a
//   representative claim identity), the crossings between them each marked native or untyped, and the
//   one fork-and-adopt probe (the untyped crossing plus the real native status the adoption layer
//   computes after the target forks the type). Every value is real state from the real machinery.
// Contract: `node build/vendor-federation.mjs` writes the view. No arguments.
// Invariant: this changes no case data and no grounding verdict; it serializes what buildBottomUp and
//   build/adoption already compute. The status_after is the real crossingStatus over the forked
//   adoption, not a described outcome. Deterministic: the same federation produces the same bytes.
"use strict";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { buildBottomUp } from "./bottomup-build.mjs";
import { crossingStatus } from "./adoption.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const { COMMON_TYPE_HASHES } = require("../corpora/_shared/common-types.js");

const AUTHOR = "A Viable Fork";
const PROVENANCE = "authored for the epistemic case study competition, 2026";
const MEMBER_IDS = ["lhc", "covid", "eggs", "lineage"];
// a representative claim per member, named by its local ref, for a live grade read through the contract.
const SAMPLE_REF = { lhc: "robust", covid: "int.two-spillovers", eggs: "ec.discount", lineage: "sci.fake-independence" };

const fed = buildBottomUp();

function statementOf(member, identity) {
  const e = member.state.entries.find((x) => x.identity === identity);
  return e ? e.statement : null;
}

const members = MEMBER_IDS.map((id) => {
  const m = fed.members[id];
  const kinds = [...m.tables.kindTable.byKind.keys()];
  const local_kinds = kinds.filter((k) => COMMON_TYPE_HASHES[k] === undefined)
    .map((k) => ({ kind: k, ceiling: m.tables.kindTable.byKind.get(k).ceiling }));
  const shared_pins = kinds.filter((k) => COMMON_TYPE_HASHES[k] !== undefined)
    .map((k) => ({ kind: k, hash: m.adoption.pins[k] }));
  const sampleId = m.refId.get(SAMPLE_REF[id]) || null;
  return {
    id,
    author: AUTHOR,
    provenance: PROVENANCE,
    local_kinds,
    shared_pins,
    pins: m.adoption.pins,
    sample: sampleId ? { identity: sampleId, statement: statementOf(m, sampleId) } : null,
  };
});

// the crossings the federation build runs, each with the type-hash it crosses on and its real status.
const crossings = fed.crossings.map((cx) => {
  const from = fed.members[cx.from_store], into = fed.members[cx.into_store];
  const hash = from.adoption.pins[cx.kind];
  const out = { id: cx.id, from: cx.from_store, to: cx.into_store, kind: cx.kind, hash, status: cx.status, note: cx.note };
  if (cx.forked) out.status_after_fork = cx.forked.status; // the real adoption-layer status once adopted
  return out;
});

// the fork-and-adopt probe: the untyped crossing, the hash the target would pin, and the real status
// before (untyped) and after (native) as the adoption layer computes them.
const untyped = fed.crossings.find((c) => c.id === "x-untyped");
const fromAd = fed.members[untyped.from_store].adoption;
const intoAd = fed.members[untyped.into_store].adoption;
const forkedAd = { ...intoAd, pins: { ...intoAd.pins, [`${untyped.kind}@${untyped.into_store}-local`]: fromAd.pins[untyped.kind] } };
const adopt = {
  crossing_id: untyped.id,
  from: untyped.from_store,
  to: untyped.into_store,
  kind: untyped.kind,
  hash: fromAd.pins[untyped.kind],
  status_before: crossingStatus(untyped.kind, fromAd, intoAd),      // real: untyped
  status_after: crossingStatus(untyped.kind, fromAd, forkedAd),     // real: native
  note: untyped.note,
};

const view = { author: AUTHOR, members, crossings, adopt };
const dir = join(ROOT, "vendor/federation");
mkdirSync(dir, { recursive: true });
const dest = join(dir, "federation-view.json");
writeFileSync(dest, JSON.stringify(view, null, 2));
console.log(`wrote vendor/federation/federation-view.json: ${members.length} members, ${crossings.length} crossings, adopt ${adopt.from}->${adopt.to} (${adopt.kind}) ${adopt.status_before} -> ${adopt.status_after}`);
