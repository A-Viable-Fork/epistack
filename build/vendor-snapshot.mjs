// Role: freeze the migrated corpus into one store snapshot the local provider proposes against. Runs
//   the trellis-to-v3 translator over the real cases, merges them into one store state, and writes
//   vendor/gate/snapshot.json = { state, sources, kinds }. The provider (api/providers/local-
//   provider.mjs) loads this and runs the real gate over it, in Node and in the browser alike.
// Contract: `node build/vendor-snapshot.mjs` writes the snapshot. No arguments.
// Invariant: this changes no case data and no grounding verdict; it serializes what the migration
//   already grounded (docs/trellis-to-v3.md). Deterministic: the same corpus produces the same bytes.
"use strict";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { translateTrellis } from "./translate-trellis.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { genesis } from "../kernel/store/state.mjs";
import { apply } from "../kernel/store/apply.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const PRIMITIVES = require("../corpora/_primitives/primitives.js").PRIMITIVES;
const BODIES = require("../corpora/_shared/bodies/bodies.js").BODIES;
const LHC = require("../corpora/lhc/lhc-cascade.js").CASE;
const POP = require("../corpora/population/population-pipeline.js").CASE;

// translate both cases and merge into one store: union the source rows (by id), share the kind rows.
const outs = [
  translateTrellis(LHC, { primitives: PRIMITIVES, bodies: BODIES, caseId: "lhc-cascade" }),
  translateTrellis(POP, { primitives: PRIMITIVES, bodies: BODIES, caseId: "population-pipeline" }),
];
const sourceById = new Map();
for (const o of outs) for (const s of o.sources) if (!sourceById.has(s.source_id)) sourceById.set(s.source_id, s);
const sources = [...sourceById.values()].sort((a, b) => (a.source_id < b.source_id ? -1 : a.source_id > b.source_id ? 1 : 0));
const kinds = outs[0].kinds; // both translations return the same kind table

// entries and links, deduped by identity (union is what apply does anyway).
const claimById = new Map();
const linkById = new Map();
for (const o of outs) {
  for (const c of o.claims) if (!claimById.has(c.identity)) claimById.set(c.identity, c);
  for (const l of o.links) if (!linkById.has(l.identity)) linkById.set(l.identity, l);
}
const state = apply(genesis(), {
  entries: [...claimById.values()],
  links: [...linkById.values()],
  applied_contribution_hash: "migrated-corpus",
  receipt_reference: "migrated-corpus",
});

const snapshot = { state, sources, kinds };
const dest = join(ROOT, "vendor/gate/snapshot.json");
writeFileSync(dest, JSON.stringify(snapshot));
console.log(`wrote vendor/gate/snapshot.json (${JSON.stringify(snapshot).length} bytes): ${state.entries.length} claims, ${state.links.length} links, ${sources.length} sources, state ${state.state_hash.slice(0, 16)}`);
