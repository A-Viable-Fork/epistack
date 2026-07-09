// Role: freeze the migrated corpus into one store snapshot the local provider proposes against. Runs
//   the trellis-to-v3 translator over the two migrated cases and merges in the three densified case
//   stores (covid, the densified LHC legs, and the eggs domain stores) so the propose widget spans all
//   four cases and the register view can ground a case claim on its finer node (a covid prior, the
//   reified LHC shared dependency) through the read contract. Writes vendor/gate/snapshot.json =
//   { state, sources, kinds }. The provider (api/providers/local-provider.mjs) loads this and runs the
//   real gate over it, in Node and in the browser alike.
// Contract: `node build/vendor-snapshot.mjs` writes the snapshot. No arguments.
// Invariant: this changes no case data and no grounding verdict; it serializes the stores the case
//   builders already grounded. Deterministic: the same corpus produces the same bytes. The eggs
//   composite's framing and cross-domain records are not claim entries and are not merged; the eggs
//   domain claim stores are.
"use strict";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { translateTrellis } from "./translate-trellis.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { genesis } from "../kernel/store/state.mjs";
import { apply } from "../kernel/store/apply.mjs";
import { buildCovid } from "./covid-build.mjs";
import { buildLhc } from "./lhc-build.mjs";
import { buildEggs } from "./eggs-build.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const PRIMITIVES = require("../corpora/_primitives/primitives.js").PRIMITIVES;
const BODIES = require("../corpora/_shared/bodies/bodies.js").BODIES;
const LHC = require("../corpora/lhc/lhc-cascade.js").CASE;
const POP = require("../corpora/population/population-pipeline.js").CASE;

// the two migrated cases, via the trellis translator (the store's original core).
const outs = [
  translateTrellis(LHC, { primitives: PRIMITIVES, bodies: BODIES, caseId: "lhc-cascade" }),
  translateTrellis(POP, { primitives: PRIMITIVES, bodies: BODIES, caseId: "population-pipeline" }),
];

// the three densified case builders. Each already drives its store through the gate; here we take the
// already-gated claim and link records (state.entries / state.links) and union them into one snapshot.
const covid = buildCovid();
const lhc = buildLhc();
const eggs = buildEggs();
const eggsDomainStates = Object.values(eggs.domains).map((d) => d.state);
const denseStates = [covid.state, lhc.state, ...eggsDomainStates];
const denseTables = [covid.tables, lhc.tables, eggs.tables];

// entries and links, deduped by identity (union is what apply does anyway).
const claimById = new Map();
const linkById = new Map();
for (const o of outs) {
  for (const c of o.claims) claimById.set(c.identity, c);
  for (const l of o.links) linkById.set(l.identity, l);
}
for (const st of denseStates) {
  for (const e of st.entries) claimById.set(e.identity, e);
  for (const l of (st.links || [])) linkById.set(l.identity, l);
}

// source rows unioned by id; kind rows unioned by kind (the densified cases add derivation/constitutive).
const sourceById = new Map();
for (const o of outs) for (const s of o.sources) sourceById.set(s.source_id, s);
for (const t of denseTables) for (const [, s] of t.sourceTable.byId) sourceById.set(s.source_id, { source_id: s.source_id, source_class: s.source_class, description: s.description });
const sources = [...sourceById.values()].sort((a, b) => (a.source_id < b.source_id ? -1 : a.source_id > b.source_id ? 1 : 0));

const kindByName = new Map();
for (const k of outs[0].kinds) kindByName.set(k.kind, k);
for (const t of denseTables) for (const [kind, row] of t.kindTable.byKind) kindByName.set(kind, { kind, ceiling: row.ceiling });
const kinds = [...kindByName.values()].sort((a, b) => (a.kind < b.kind ? -1 : a.kind > b.kind ? 1 : 0));

const state = apply(genesis(), {
  entries: [...claimById.values()],
  links: [...linkById.values()],
  applied_contribution_hash: "migrated-corpus",
  receipt_reference: "migrated-corpus",
});

const snapshot = { state, sources, kinds };
const dest = join(ROOT, "vendor/gate/snapshot.json");
writeFileSync(dest, JSON.stringify(snapshot));
console.log(`wrote vendor/gate/snapshot.json (${JSON.stringify(snapshot).length} bytes): ${state.entries.length} claims, ${state.links.length} links, ${sources.length} sources, ${kinds.length} kinds, state ${state.state_hash.slice(0, 16)}`);
