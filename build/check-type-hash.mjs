// Role: the type-hash oracle. Proves the one primitive the three-tier crossing rests on: a type bundle
//   hashes deterministically, identical bundles hash identically, any change to a meaning-bearing field
//   changes the hash, and the authored common-type hash literals match what hashTypeBundle computes.
// Contract: `node build/check-type-hash.mjs` exits non-zero on any failure. Imports the kernel type-hash
//   module and the shared common-types seed.
// Invariant: DETERMINISM and MEANING-SENSITIVITY. A re-run is byte-identical; every meaning-bearing
//   field is load-bearing in the hash, so no two distinct type meanings share a hash by accident.
"use strict";
import { createRequire } from "node:module";
import { hashTypeBundle, canonicalizeBundle } from "../kernel/schema/type-hash.mjs";
import { encode } from "../kernel/schema/canonical.mjs";

const require = createRequire(import.meta.url);
const { COMMON_BUNDLES, COMMON_TYPE_HASHES } = require("../corpora/_shared/common-types.js");

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-TYPE-HASH: content-address a shared type"); console.log(H);

const bundle = (kind, ceiling, extra = {}) => Object.assign({ kind, ceiling, compatibility_rule_id: null, atlas_refs: [] }, extra);

// --- 1. determinism: identical bundles hash identically, and a re-run is byte-identical ---
console.log("\n[1] determinism");
{
  const a = bundle("measurement", "checked");
  const b = bundle("measurement", "checked");
  ok(hashTypeBundle(a) === hashTypeBundle(b), "two identical bundles hash identically");
  ok(hashTypeBundle(a) === hashTypeBundle(a), "the same bundle hashes the same on a re-run");
  // key order does not matter: canonicalization sorts fields
  const reordered = { atlas_refs: [], ceiling: "checked", compatibility_rule_id: null, kind: "measurement" };
  ok(hashTypeBundle(reordered) === hashTypeBundle(a), "field order does not change the hash (canonical key sort)");
  ok(encode(canonicalizeBundle(a)) === encode(canonicalizeBundle(reordered)), "the canonical bytes are identical regardless of authored order");
}

// --- 2. meaning-sensitivity: changing any meaning-bearing field changes the hash ---
console.log("\n[2] every meaning-bearing field is load-bearing");
{
  const base = bundle("measurement", "checked");
  const baseHash = hashTypeBundle(base);
  ok(hashTypeBundle(bundle("forum", "checked")) !== baseHash, "changing the kind changes the hash");
  ok(hashTypeBundle(bundle("measurement", "corroborated")) !== baseHash, "changing the ceiling changes the hash");
  ok(hashTypeBundle(bundle("measurement", "checked", { compatibility_rule_id: "rule:x" })) !== baseHash, "adding a compatibility rule changes the hash");
  ok(hashTypeBundle(bundle("measurement", "checked", { atlas_refs: ["atlas:x"] })) !== baseHash, "adding an atlas reference changes the hash");
  // two kinds that share a ceiling still differ, because the kind name is meaning-bearing
  ok(hashTypeBundle(bundle("declaration", "constitutive")) !== hashTypeBundle(bundle("derivation", "constitutive")), "declaration and derivation share a ceiling but hash differently (kind is meaning)");
}

// --- 3. the authored common-type hash literals match what hashTypeBundle computes ---
console.log("\n[3] the common-types seed is honest");
{
  for (const kind of Object.keys(COMMON_BUNDLES)) {
    const got = hashTypeBundle(COMMON_BUNDLES[kind]);
    ok(got === COMMON_TYPE_HASHES[kind], `common bundle ${kind}: authored hash matches hashTypeBundle (${COMMON_TYPE_HASHES[kind].slice(0, 12)})`);
  }
  const hashes = Object.values(COMMON_TYPE_HASHES);
  ok(new Set(hashes).size === hashes.length, "the three common types have three distinct hashes");
}

console.log("\n" + H);
if (fails === 0) console.log("verified: a type bundle content-addresses deterministically and every meaning-bearing field is load-bearing, so shared meaning is shared hash and distinct meaning is distinct hash.");
console.log(fails === 0 ? "check-type-hash: OK" : `check-type-hash: ${fails} FAILURE(S)`);
console.log(H);
process.exit(fails === 0 ? 0 : 1);
