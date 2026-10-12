// Role: the receipt record and the source row's landing fields, the provenance shape six sibling
//   repositories converged on (A-Viable-Fork Metacomplexity map/receipts.js, Formalization
//   trusted-base/receipts.js, Math_Map excerpts, Phone corrections, Philosophy readings, PDE
//   document-claim): a quote held at exact UTF-16 offsets in a file whose sha256 is recorded.
// Contract: receiptRecord(raw) -> { receipt_id, source_id, file, sha256, start, end, quote, commit?, canonical,
//   hash }; verifyReceipt(receipt, text) -> { ok, reason, occurrences }; READ_DEPTHS. Pure, ESM; kernel
//   imports only kernel. The kernel never reads a file: the caller hands it the text.
// Invariant: a receipt verifies only when the text hashes to its sha256 and the quote sits at its offsets;
//   offsets are integers on the record and exact-decimal strings on the canonical path.
"use strict";
import { canonicalize, hashOf, hashBytes } from "./canonical.mjs";

// how deeply a source was read (after Metacomplexity scripts/catalogue.mjs). A flag from an outside report
// is not an inspection; an inspected or unretrievable source carries a note saying what was seen.
export const READ_DEPTHS = ["receipted", "inspected-body", "inspected-abstract", "unretrievable", "queued", "out-of-scope"];

const req = (v, msg) => { if (v === undefined || v === null || v === "") throw new Error(msg); return v; };
const offset = (v, where) => { if (!Number.isInteger(v) || v < 0) throw new Error(`receipt: ${where} must be a non-negative integer`); return v; };

export function receiptRecord(raw) {
  const sha256 = req(raw.sha256, "receipt: sha256 required");
  if (!/^[0-9a-f]{64}$/.test(sha256)) throw new Error("receipt: sha256 must be 64 lowercase hex characters");
  const start = offset(raw.start, "start"), end = offset(raw.end, "end");
  if (end <= start) throw new Error("receipt: end must be after start");
  const quote = req(raw.quote, "receipt: quote required");
  if (quote.length !== end - start) throw new Error("receipt: the quote's length must equal end - start (UTF-16 code units)");
  const r = {
    receipt_id: req(raw.receipt_id, "receipt: receipt_id required"),
    source_id: req(raw.source_id, "receipt: source_id required"),
    file: req(raw.file, "receipt: file required"),
    sha256, start, end, quote,
  };
  if (raw.commit !== undefined) {
    if (!/^[0-9a-f]{7,40}$/.test(raw.commit)) throw new Error("receipt: commit must be a hex commit id");
    r.commit = raw.commit;
  }
  const node = { ...r, start: canonicalize(String(start), "decimal"), end: canonicalize(String(end), "decimal"), quote: canonicalize(quote) };
  const canonical = canonicalize(node); // the decimal nodes pass through unchanged
  return { ...r, canonical, hash: hashOf(canonical, { pre: true }) };
}

// the file's text, as the landed bytes decode to UTF-8. Offsets count UTF-16 code units, as JavaScript does.
export function verifyReceipt(receipt, text) {
  if (typeof text !== "string") return { ok: false, reason: "no text supplied", occurrences: 0 };
  if (hashBytes(text) !== receipt.sha256) return { ok: false, reason: "the text does not hash to the receipt's sha256", occurrences: 0 };
  let occurrences = 0;
  for (let i = text.indexOf(receipt.quote); i !== -1; i = text.indexOf(receipt.quote, i + 1)) occurrences++;
  if (text.slice(receipt.start, receipt.end) !== receipt.quote) return { ok: false, reason: "the quote is not at its offsets", occurrences };
  return { ok: true, reason: null, occurrences };
}
