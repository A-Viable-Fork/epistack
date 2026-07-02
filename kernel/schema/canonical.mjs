// Role: the v3 canonical form and the one named hash (intake data model v3, Section 1). Turns a
//   record into a byte-exact canonical form and hashes it. This is the determinism foundation of
//   the gate kernel: two inputs with the same content produce identical bytes and identical hashes.
// Contract: canonicalize(value, policy) -> canonical node; encode(node) -> canonical string;
//   hashOf(value|node) -> hex sha256; computeIdentity(fields...) helpers. ESM, kernel imports only
//   kernel. Node standard-library hashing (node:crypto) is the one named hash function; nothing else.
// Invariant: DETERMINISM DISCIPLINE, one canonical form, byte-exact. Fields sorted by field-name
//   byte order; strings NFC + LF + outer-trimmed, interior preserved; NUMBERS are exact-decimal
//   strings preserved verbatim and NEVER parsed to a floating-point value anywhere (a JS `number`
//   on the path throws). Absent optionals omitted; no null in canonical form. Reference lists and
//   generic arrays sort by canonical byte order (reference lists drop exact duplicates); a
//   sequence child list keeps authored order. The extension area is hashed and read by no check.
import { createHash } from "node:crypto";

// ---- string normalization (Section 1) ----
export function normalizeString(s) {
  return s.normalize("NFC").replace(/\r\n?/g, "\n").replace(/^\s+|\s+$/gu, "");
}

// ---- exact-decimal validation: no leading zeros, no trailing fraction zeros, no exponent, finite ----
const DECIMAL_RE = /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*[1-9])?$/;
export function isExactDecimal(s) {
  return typeof s === "string" && s !== "-0" && DECIMAL_RE.test(s);
}

// ---- byte-order comparison over UTF-8 (field names and canonical forms sort by byte order) ----
function byteCompare(a, b) {
  return Buffer.compare(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
}

// a decimal node is tagged so it encodes as a bare token, distinct from a quoted string of the same
// digits: a measured value 1.5 and the text "1.5" are different content and hash differently.
function decimalNode(dec) {
  return { $dec: dec };
}
function isDecimalNode(n) {
  return n !== null && typeof n === "object" && !Array.isArray(n) && typeof n.$dec === "string";
}

// canonicalize a value. `policy` steers arrays: "reference" (sort + drop exact dupes), "child"
// (sort, keep dupes: Section 1 grants dedup to reference lists only), "sequence" (keep authored
// order), "decimal" (an exact-decimal string), or undefined (a plain value: objects recurse,
// arrays sort without dedup). Throws on a JS number, holding the no-float invariant structurally.
export function canonicalize(value, policy) {
  if (typeof value === "number")
    throw new Error("no floating-point values on the canonical path; pass numbers as exact-decimal strings (Section 1)");
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (policy === "decimal") {
      const n = normalizeString(value);
      if (!isExactDecimal(n)) throw new Error(`not an exact-decimal string: ${JSON.stringify(value)} (Section 1)`);
      return decimalNode(n);
    }
    return normalizeString(value);
  }
  if (Array.isArray(value)) {
    const elemPolicy = policy === "reference" || policy === "child" || policy === "sequence" ? undefined : policy;
    const elems = value.map((v) => canonicalize(v, elemPolicy));
    if (policy === "sequence") return elems; // authored order preserved
    // unordered: sort by canonical byte order; reference lists drop exact duplicates
    const sorted = elems.slice().sort((a, b) => byteCompare(encode(a), encode(b)));
    if (policy === "reference") {
      const out = [];
      let last = null;
      for (const e of sorted) {
        const enc = encode(e);
        if (enc !== last) out.push(e);
        last = enc;
      }
      return out;
    }
    return sorted;
  }
  if (value !== null && typeof value === "object") {
    const out = {};
    for (const k of Object.keys(value)) {
      if (value[k] === undefined) continue; // absent optional omitted; no null in canonical form
      out[k] = canonicalize(value[k]);
    }
    return out;
  }
  throw new Error(`uncanonical value: ${String(value)} (null/undefined are omitted, not encoded)`);
}

// ---- the canonical byte string: a deterministic encoding with full byte control ----
export function encode(node) {
  if (node === true) return "true";
  if (node === false) return "false";
  if (isDecimalNode(node)) return node.$dec; // bare decimal token
  if (typeof node === "string") return JSON.stringify(node); // deterministic string escaping
  if (Array.isArray(node)) return "[" + node.map(encode).join(",") + "]";
  if (node !== null && typeof node === "object") {
    const keys = Object.keys(node).sort(byteCompare); // fields by byte order
    return "{" + keys.map((k) => JSON.stringify(k) + ":" + encode(node[k])).join(",") + "}";
  }
  throw new Error(`cannot encode node: ${String(node)}`);
}

// ---- the one named hash over the full canonical byte sequence, extensions included ----
export function hashBytes(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}
export function hashOf(valueOrNode, { pre = false } = {}) {
  const node = pre ? valueOrNode : canonicalize(valueOrNode);
  return hashBytes(Buffer.from(encode(node), "utf8"));
}

// content identities (Section 2). A claim identity is the hash of (kind, statement); a link identity
// is the hash of (link_kind, from_identity, to_identity). Over a SUBSET of fields, so identity is
// not the record hash.
export function computeClaimIdentity(kind, statement) {
  return hashOf({ kind, statement });
}
export function computeLinkIdentity(link_kind, from_identity, to_identity) {
  return hashOf({ link_kind, from_identity, to_identity });
}
