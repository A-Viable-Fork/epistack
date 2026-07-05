// Role: the atlas oracle (Prompt 27). Enforces the two registers' distinct admission tests over the
//   real case stores. The transformation basis is admitted solo on type-correctness: the terminal type
//   is one of the real types and the signature is clean, with an existing exemplar node. The
//   discrimination patterns are admitted in pairs on a real departure: at least two existing clones,
//   each departure a node-id that resolves in its case store. A pending entry is defined, not admitted.
// Contract: `node build/check-atlas.mjs` exits non-zero on any failure. Imports the kernel case
//   builders and the atlas; touches no truth field. Resolves every (store, node) against the built cases.
// Invariant: honesty. A basis entry admits only with an existing exemplar; a discriminator only with
//   two existing clones; the rest are reported pending, never counted as present.
"use strict";
import { createRequire } from "node:module";
import { buildLhc } from "./lhc-build.mjs";
import { buildCovid } from "./covid-build.mjs";
import { buildEggs } from "./eggs-build.mjs";

const require = createRequire(import.meta.url);
const { BASIS, DISCRIMINATORS } = require("../corpora/_shared/atlas/atlas.js");

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-ATLAS (Prompt 27): the two registers and their distinct admission tests"); console.log(H);

const lhc = buildLhc();
const covid = buildCovid();
const eggs = buildEggs();

// resolve a (store, node) reference against the built case stores: a claim ref, a framing id, or a weighing ref.
function nodeExists(store, node) {
  if (store === "S-lhc-cascade") return lhc.refId.has(node) || (lhc.framing && lhc.framing.framing_id === node) || (lhc.successor && lhc.successor.framing_id === node);
  if (store === "S-covid-origins") return covid.refId.has(node);
  if (store === "S-nutrition") return eggs.domains["S-nutrition"].refId.has(node);
  if (store === "S-environment") return eggs.domains["S-environment"].refId.has(node);
  if (store === "C-eggs") return (eggs.framing && eggs.framing.framing_id === node) || (eggs.successor && eggs.successor.framing_id === node) || (eggs.bodyFraming && eggs.bodyFraming.framing_id === node) || (eggs.bodies || []).some((b) => b.framing_id === node) || (eggs.weighs || []).some((w) => w.spec.ref === node);
  return false;
}
const TYPES = ["measurement", "structured-forum", "irreducible-by-choice prior", "withheld-record", "constitutive", "derivation"];

// =====================================================================================
console.log("\n[A] the two-register contract: both registers are present and non-empty");
ok(BASIS && typeof BASIS === "object" && Object.keys(BASIS).length >= 1, "register one, the transformation basis, is present");
ok(DISCRIMINATORS && typeof DISCRIMINATORS === "object" && Object.keys(DISCRIMINATORS).length >= 1, "register two, the discrimination patterns, is present");

// =====================================================================================
console.log("\n[B] register one, the transformation basis: type-correct, admitted solo on an existing exemplar");
const basis = Object.values(BASIS);
for (const e of basis) {
  ok(TYPES.includes(e.terminal_type), `${e.id}: terminal type is real, not vague (${e.terminal_type})`);
  ok(typeof e.signature === "string" && e.signature.length >= 20, `${e.id}: the signature is clean and specific`);
  if (e.admitted) {
    ok(!!e.exemplar && nodeExists(e.exemplar.store, e.exemplar.node), `${e.id}: admitted with an existing exemplar node (${e.exemplar ? e.exemplar.store + "/" + e.exemplar.node : "none"})`);
  } else {
    ok(e.exemplar == null && typeof e.pending === "string" && e.pending.length > 0, `${e.id}: no exemplar in the corpus, so defined-but-pending, not admitted`);
    console.log(`      PENDING ${e.terminal_type}: ${e.pending.slice(0, 120)}...`);
  }
}
const admittedBasis = basis.filter((e) => e.admitted).map((e) => e.terminal_type);
ok(["measurement", "structured-forum", "irreducible-by-choice prior", "derivation"].every((t) => admittedBasis.includes(t)), `the four type-correct terminals admit (${admittedBasis.join(", ")})`);
// no admitted basis entry shares a terminal type with another (one entry per terminal type).
ok(new Set(basis.map((e) => e.terminal_type)).size === basis.length, "one entry per terminal type, no duplicate type");

// =====================================================================================
console.log("\n[C] register two, the discrimination patterns: admitted in pairs on a real departure node-id");
const discs = Object.values(DISCRIMINATORS);
for (const d of discs) {
  const existing = (d.clones || []).filter((c) => c.status === "existing");
  const pending = (d.clones || []).filter((c) => c.status !== "existing");
  // the admission test: admitted iff at least two existing clones.
  ok(d.admitted === (existing.length >= 2), `${d.id}: admission matches the two-existing-clones test (${existing.length} existing, admitted ${d.admitted})`);
  // every existing clone's departure is a node-id that resolves in its case store.
  for (const c of existing) {
    ok(nodeExists(c.store, c.node), `${d.id}: departure ${c.store}/${c.node} is a node-id that resolves in the case store`);
    ok(typeof c.node === "string" && c.node.length > 0 && typeof c.departure === "string", `${d.id}: the clone carries a departure coordinate, not a bare resemblance`);
  }
  for (const c of pending) console.log(`      PENDING clone ${d.id}: ${c.case} (${c.store}/${c.node}) marked ${c.status}`);
}
const admittedDiscs = discs.filter((d) => d.admitted);
ok(admittedDiscs.length === 4, `all four discrimination patterns admit with two or more existing clones (${admittedDiscs.length})`);
ok(admittedDiscs.every((d) => (d.clones.filter((c) => c.status === "existing")).every((c) => nodeExists(c.store, c.node))), "every admitted discriminator's departures resolve to real nodes across the three cases");

// =====================================================================================
console.log("\n[D] the honesty discipline: pending entries are named, not counted as present");
const pendingBasis = basis.filter((e) => !e.admitted).map((e) => e.terminal_type);
ok(pendingBasis.length === 2 && pendingBasis.includes("withheld-record") && pendingBasis.includes("constitutive"), `the two terminals with no exemplar node are held pending (${pendingBasis.join(", ")})`);
console.log("      the withheld-record and constitutive terminals are described in the trellises but not yet typed as nodes; they land with a covid sealed-record node and an eggs moral-status node respectively.");

console.log("\n" + H);
if (fails) { console.log(`check-atlas: ${fails} FAILURE(S)`); process.exit(1); }
console.log("check-atlas: OK (two registers, both admission tests, pending named)"); console.log(H);
