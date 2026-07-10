// Role: the acceptance oracle for the management contract and its local provider. Confirms the contract
//   is a faithful membrane over the real machinery: the provider runs over the vendored management
//   snapshot and its listKernels/readKernel/readCrossings equal what the adoption layer computes
//   directly, adopt changes a crossing from untyped to native and the receipt reflects it, cross returns
//   untyped for an unadopted type and native for a shared one, and the contract's outputs equal the
//   provider's own, so the contract holds no adoption or crossing logic of its own and the provider is
//   proven a faithful running of build/adoption, not a divergent copy.
// Contract: `node build/check-management.mjs` exits non-zero on any failure. Imports the management
//   contract, the api-layer local management provider, the vendored snapshot, and (for the cross-check)
//   the adoption layer directly.
// Invariant: the content-addressing (hashTypeBundle) and the crossing rule are the real ones. A
//   divergence between the provider's output over the snapshot and the adoption layer's direct output
//   would fail here, which is what proves the provider real and the snapshot current.
"use strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { createManagementApi } from "../api/management-api.mjs";
import { createLocalManagementProvider } from "../api/providers/local-management-provider.mjs";
import { adoptionOf, crossingStatus, CASE_IDS } from "./adoption.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const { COMMON_TYPE_HASHES } = require("../corpora/_shared/common-types.js");
const snapshot = JSON.parse(readFileSync(join(ROOT, "vendor/management/management-snapshot.json"), "utf8"));

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
const sorted = (a) => a.slice().sort();
console.log(H); console.log("CHECK-MANAGEMENT: the management contract as a faithful membrane"); console.log(H);

const api = createManagementApi(createLocalManagementProvider(snapshot));

// --- 1. listKernels returns the four members with their pins, matching the adoption layer ---
console.log("\n[1] listKernels returns the four members with their pins");
{
  const kernels = api.listKernels();
  ok(kernels.length === 4 && sorted(kernels.map((k) => k.id)).join(",") === "covid,eggs,lhc,lineage", `four members (${kernels.map((k) => k.id).join(", ")})`);
  ok(kernels.every((k) => k.author && k.provenance), "every kernel object carries a real author and provenance field");
  const match = CASE_IDS.every((id) => {
    const k = kernels.find((x) => x.id === id);
    return sorted(k.pins.kinds).join(",") === sorted(Object.keys(adoptionOf(id).pins)).join(",");
  });
  ok(match, "each kernel's pins over the snapshot equal Object.keys(adoptionOf(id).pins), the adoption layer's direct output");
}

// --- 2. readKernel returns the local-versus-shared tier ---
console.log("\n[2] readKernel returns the local-versus-shared tier");
{
  const lhc = api.readKernel("lhc");
  ok(lhc.local_kinds.length === 1 && lhc.local_kinds[0].kind === "derivation", "lhc's local kind is derivation (owned, not shared)");
  ok(sorted(lhc.shared_pins.map((p) => p.kind)).join(",") === "forum,measurement", "lhc's shared pins are measurement and forum");
  const covid = api.readKernel("covid");
  ok(covid.local_kinds.length === 0, "covid declares no local kind (all adopted from the shared subtree)");
}

// --- 3. readCrossings reports the same statuses the crossing rule computes directly ---
console.log("\n[3] readCrossings matches crossingStatus computed directly");
{
  const rows = api.readCrossings();
  ok(rows.length >= 2, `crossings read (${rows.length})`);
  const nat = rows.find((r) => r.id === "x-native"), unt = rows.find((r) => r.id === "x-untyped");
  ok(nat && nat.status === "native", "the shared-hash crossing (lineage forum into lhc) reads native");
  ok(unt && unt.status === "untyped", "the unpinned crossing (lineage declaration into covid) reads untyped");
  const faithful = rows.every((r) => r.status === crossingStatus(r.kind, adoptionOf(r.origin), adoptionOf(r.target)));
  ok(faithful, "every crossing status equals crossingStatus(kind, adoptionOf(origin), adoptionOf(target)) directly");
}

// --- 4. cross returns untyped for an unadopted type and native for a shared one ---
console.log("\n[4] cross returns untyped for an unadopted type and native for a shared one");
{
  const nat = api.cross("lineage", "sci.fake-independence", "lhc");
  ok(nat.status === "native" && nat.grounds === true, `a forum claim crosses native into lhc (both pin forum): ${nat.status}`);
  const unt = api.cross("lineage", "conj.novelty", "covid");
  ok(unt.status === "untyped" && unt.grounds === false, `a declaration claim crosses untyped into covid (covid pins no declaration): ${unt.status}`);
  ok(/untyped and grounds nothing/.test(unt.note), "the untyped cross receipt states it grounds nothing until adoption or fork");
}

// --- 5. adopt changes a crossing from untyped to native, and the receipt reflects it ---
console.log("\n[5] adopt changes an untyped crossing to native, reflected in the receipt");
{
  const fresh = createManagementApi(createLocalManagementProvider(snapshot));
  const before = fresh.readCrossings().find((r) => r.id === "x-untyped");
  ok(before.status === "untyped", "before adopt, lineage declaration into covid is untyped");
  const receipt = fresh.adopt("covid", COMMON_TYPE_HASHES.declaration);
  ok(receipt.operation === "adopt" && receipt.pinned === COMMON_TYPE_HASHES.declaration, "the adopt receipt names the pinned type-hash");
  const changed = (receipt.crossings_changed || []).find((c) => c.crossing === "x-untyped");
  ok(changed && changed.from === "untyped" && changed.to === "native", "the receipt reports the x-untyped crossing changed from untyped to native");
  const after = fresh.readCrossings().find((r) => r.id === "x-untyped");
  ok(after.status === "native", "after adopt, the same crossing reads native through the contract");
  ok(fresh.cross("lineage", "conj.novelty", "covid").status === "native", "and cross now returns native for the adopted type");
}

// --- 6. fork derives a child kernel inheriting the parent's pins, honest about persistence ---
console.log("\n[6] fork derives a child kernel, honest about persistence");
{
  const r = api.fork("covid");
  ok(r.operation === "fork" && r.forked_from === "covid" && r.new_kernel_id === "covid#fork", "fork names the new kernel and the parent");
  ok(Object.keys(r.inherited_pins).length > 0, "the child inherits the parent's pins");
  ok(r.persisted === false, "the receipt marks durable persistence as not built (Stage 4, specified)");
}

// --- 7. the membrane holds no logic: the contract forwards the provider's output unchanged ---
console.log("\n[7] the contract is a membrane: its output equals the provider's own output");
{
  const provider = createLocalManagementProvider(snapshot);
  const wrapped = createManagementApi(provider);
  ok(JSON.stringify(wrapped.listKernels()) === JSON.stringify(provider.listKernels()), "listKernels through the contract equals the provider's direct output");
  ok(JSON.stringify(wrapped.readCrossings()) === JSON.stringify(provider.readCrossings()), "readCrossings through the contract equals the provider's direct output");
  ok(wrapped.providerKind() === "local", `the contract reports its provider kind: ${wrapped.providerKind()}`);
  let threw = false; try { createManagementApi({ listKernels: () => [] }); } catch (e) { threw = true; }
  ok(threw, "the contract refuses a provider missing an operation");
}

console.log("\n" + H);
if (fails === 0) console.log("verified: the management contract's reads and writes over the vendored snapshot equal what the adoption layer computes directly, so the provider is a faithful running of the real machinery and the contract a membrane over it, not a second copy.");
console.log(fails === 0 ? "check-management: OK" : `check-management: ${fails} FAILURE(S)`);
console.log(H);
process.exit(fails === 0 ? 0 : 1);
