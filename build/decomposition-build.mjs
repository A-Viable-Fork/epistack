// Role: build the submission-decomposition contribution set from corpora/submission-decomposition/
//   decomposition.js and the scoped documents. Computes each document's content hash, resolves every
//   span to an offset and quote key, resolves constitutive spans and dependence links to existing
//   vocabulary-kernel claims, builds gate-valid claim and dependence-link records, gate-checks the
//   whole against the competition community's own parameters, and emits per-document contribution
//   bundles and anchor maps. It mints no constitutive claim (definitions are referenced, never
//   re-authored) and asserts nothing durable; the bundles are gate-passed proposals, not admissions.
// Contract: buildDecomposition() -> { docs, mechanical, evaluative, constitutive, links, receipt,
//   gradeByIdentity, vocabByRef, bundles, anchors }. `node build/decomposition-build.mjs` also writes
//   the bundles and anchor maps under corpora/submission-decomposition/. Build layer; reuses the
//   kernel records, gate, and tables and the api contribution export. Pure over the corpus.
// Invariant: the competition community's kind table (measurement, forum, comment) carries no
//   constitutive kind, so a constitutive span anchors to its vocabulary claim and never becomes a new
//   claim here; a dependence link resolves to that vocabulary claim's identity. Mechanical claims enter
//   supported with test-execution checking records naming epistack checks; evaluative claims enter at
//   the floor. The gate grades everything; no grade is asserted by hand.
"use strict";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { claimRecord, linkRecord } from "../kernel/schema/records.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { hashBytes, computeClaimIdentity, hashOf } from "../kernel/schema/canonical.mjs";
import { decide } from "../kernel/gate/gate.mjs";
import { exportContribution } from "../api/contribution.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const { DOCS, CLAIMS } = require(join(ROOT, "corpora/submission-decomposition/decomposition.js"));
const { VOCABULARY } = require(join(ROOT, "corpora/vocabulary/vocabulary.js"));

// the competition community's own parameters (from Knowledge-Game's epistack-competition kernel).
const KIND_TABLE = makeKindTable([
  { kind: "measurement", ceiling: "checked" },
  { kind: "forum", ceiling: "corroborated" },
  { kind: "comment", ceiling: "ungraded" },
]);
const SOURCE_TABLE = makeSourceTable([
  { source_id: "S-epistack-protocol-spec", source_class: "institutional-report", rests_on: [] },
  { source_id: "S-epistack-submission-argument", source_class: "preprint", rests_on: [] },
]);
const CONTRIBUTOR = "P-submission-transcription";
const MECH_SOURCE = "S-epistack-protocol-spec";
const EVAL_SOURCE = "S-epistack-submission-argument";

// vocabulary claims are declaration-kind claims whose statement is the term's statement; a vocab ref
// resolves to that claim's identity. A ref with no vocabulary entry is a stop-and-report.
const VOCAB_BY_REF = new Map(VOCABULARY.terms.map((t) => [t.ref, t]));
function vocabIdentity(ref) {
  const t = VOCAB_BY_REF.get(ref);
  if (!t) throw new Error(`decomposition: vocab ref ${ref} has no vocabulary entry (stop-and-report: missing load-bearing term or non-definitional span)`);
  return computeClaimIdentity("declaration", t.statement);
}

// a test-execution checking record naming an epistack check that grounds a mechanical claim.
function checkRecord(checkPath) {
  return { checker_id: checkPath, method_class: "direct-measurement", method: "test-execution evidence: the named oracle runs green in this repository", checked_at_state: "ST0", outcome: "confirms", independence: "distinct-party" };
}

export function buildDecomposition() {
  // document content and hashes, at the current pinned text.
  const docs = {};
  const text = {};
  for (const [id, rel] of Object.entries(DOCS)) {
    const content = readFileSync(join(ROOT, rel), "utf8");
    text[id] = content;
    docs[id] = { document: rel, content_hash: hashBytes(content) };
  }

  // resolve every span to an anchor, and build records by register.
  const mechanical = [], evaluative = [], links = [];
  const constitutive = []; // { ref, doc, anchor, vocab_ref, claim_identity }
  const byRef = new Map();
  const seenSpanPerDoc = new Map(); // doc -> Set(span) : no two claims share an identical span

  function anchorOf(c) {
    const t = text[c.doc];
    const start = t.indexOf(c.span);
    if (start < 0) throw new Error(`decomposition: span for ${c.ref} not found verbatim in ${c.doc}`);
    if (t.indexOf(c.span, start + 1) >= 0) throw new Error(`decomposition: span for ${c.ref} is ambiguous in ${c.doc} (appears more than once)`);
    const set = seenSpanPerDoc.get(c.doc) || seenSpanPerDoc.set(c.doc, new Set()).get(c.doc);
    if (set.has(c.span)) throw new Error(`decomposition: two claims share an identical span in ${c.doc} (${c.ref})`);
    set.add(c.span);
    return { start, end: start + c.span.length, quote_key: c.span.slice(0, 48) };
  }

  for (const c of CLAIMS) {
    const anchor = anchorOf(c);
    if (c.register === "constitutive") {
      const id = vocabIdentity(c.vocab_ref);
      constitutive.push({ ref: c.ref, doc: c.doc, anchor, vocab_ref: c.vocab_ref, claim_identity: id });
      byRef.set(c.ref, { register: "constitutive", claim_identity: id, doc: c.doc, anchor });
      continue;
    }
    // evidence drives checking records for either register; the typing review then enforces that
    // evidence attached implies the mechanical register (a forum claim carrying evidence is a fault).
    const mech = c.register === "mechanical";
    const checks = (c.evidence || []).map(checkRecord);
    const rec = claimRecord({
      kind: mech ? "measurement" : "forum",
      statement: c.statement,
      source_id: mech ? MECH_SOURCE : EVAL_SOURCE,
      contributor_id: CONTRIBUTOR,
      declared_grade: mech ? "supported" : "asserted",
      checking_records: checks.length ? checks : undefined,
    });
    const entry = { ref: c.ref, doc: c.doc, register: c.register, anchor, record: rec, evidence: c.evidence || [] };
    (c.register === "mechanical" ? mechanical : evaluative).push(entry);
    byRef.set(c.ref, { register: c.register, claim_identity: rec.identity, doc: c.doc, anchor });
    // dependence links: this claim uses a defined term in its defined sense -> depends-on the definition.
    for (const dref of c.depends_on || []) {
      const to = vocabIdentity(dref);
      const lrec = linkRecord({ link_kind: "depends-on", from_identity: rec.identity, to_identity: to, source_id: rec.source_id, contributor_id: CONTRIBUTOR, declared_grade: "asserted" });
      links.push({ from_ref: c.ref, to_vocab: dref, record: lrec });
    }
  }

  // gate-check the whole contribution against the competition parameters. The vocabulary claims the
  // dependence links point at are seeded as in-force prior entries (the community pins the vocabulary
  // kernel), so a depends-on resolves; the gate grades every new claim.
  const entries = [...mechanical, ...evaluative].map((e) => e.record);
  const linkRecs = links.map((l) => l.record);
  const earnedByIdentity = new Map();
  const kindOf = new Map();
  for (const t of VOCABULARY.terms) {
    const id = computeClaimIdentity("declaration", t.statement);
    earnedByIdentity.set(id, { earned: "constitutive", inForce: true });
    kindOf.set(id, "declaration");
  }
  const storeView = { stateHash: "ST-epistack-competition", earnedByIdentity, links: [], restatementLinks: [], withdrawnRecords: [], kindOf, sourceTable: SOURCE_TABLE, kindTable: KIND_TABLE };
  const contribution = { hash: hashOf({ entries: entries.map((e) => e.identity).sort(), links: linkRecs.map((l) => l.identity).sort() }), entries, links: linkRecs };
  const receipt = decide(contribution, storeView, { rulesetVersion: "v3", schemaVersion: "v3", sourceVersion: "epistack-competition" });
  const gradeByIdentity = new Map(receipt.grade_table.map((g) => [g.identity, g.earned_grade]));

  // per-document bundles (the gate-passed proposal packaged for the operator) and anchor maps.
  const bundles = {}, anchors = {};
  for (const id of Object.keys(DOCS)) {
    const docEntries = [...mechanical, ...evaluative].filter((e) => e.doc === id).map((e) => e.record);
    const entryIds = new Set(docEntries.map((e) => e.identity));
    const docLinks = linkRecs.filter((l) => entryIds.has(l.from_identity));
    bundles[id] = exportContribution({ entries: docEntries, links: docLinks }, receipt, { kernel_id: "epistack-competition", state_id: storeView.stateHash });
    // anchor map: every claimed span in document order, each bound to its claim identity.
    const spans = CLAIMS.filter((c) => c.doc === id).map((c) => {
      const b = byRef.get(c.ref);
      return { ref: c.ref, register: b.register, anchor: b.anchor, claim: b.claim_identity };
    }).sort((a, b) => a.anchor.start - b.anchor.start);
    anchors[id] = { document: docs[id].document, content_hash: docs[id].content_hash, spans };
  }

  return { docs, text, mechanical, evaluative, constitutive, links, receipt, gradeByIdentity, vocabIdentity, bundles, anchors, CLAIMS, DOCS };
}

if (process.argv[1] && process.argv[1].endsWith("decomposition-build.mjs")) {
  const b = buildDecomposition();
  const dir = join(ROOT, "corpora/submission-decomposition");
  mkdirSync(join(dir, "bundles"), { recursive: true });
  mkdirSync(join(dir, "anchors"), { recursive: true });
  for (const id of Object.keys(b.DOCS)) {
    writeFileSync(join(dir, "bundles", `${id}.bundle.json`), JSON.stringify(b.bundles[id], null, 2) + "\n");
    writeFileSync(join(dir, "anchors", `${id}.anchors.json`), JSON.stringify(b.anchors[id], null, 2) + "\n");
  }
  const mech = b.mechanical.length, evalN = b.evaluative.length, con = b.constitutive.length;
  console.log(`decomposition: ${mech} mechanical, ${evalN} evaluative, ${con} constitutive across ${Object.keys(b.DOCS).length} documents; decision ${b.receipt.decision}`);
  console.log(`wrote ${Object.keys(b.DOCS).length} bundles and ${Object.keys(b.DOCS).length} anchor maps under corpora/submission-decomposition/`);
}
