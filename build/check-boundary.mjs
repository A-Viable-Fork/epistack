// Role: the boundary linter. Makes the fixed/free line a checkable object: it holds the contract
//   register (the required tier) and the parameters register (the free tier) together, proving their
//   entry sets disjoint, that no marked claim's text asserts the wrong modality (a free parameter
//   phrased as an invariant, or a contract phrased as a choice), that every enumerable source of the
//   contract (the composition spec's composability list, the ecosystem guide's invariants) resolves to a
//   contract entry, and that every marker and cross-kernel reference resolves. The masquerade prior
//   sessions caught by hand becomes a check that runs in CI.
// Contract: `node build/check-boundary.mjs` exits non-zero on any failure, naming the offender. Reads
//   the two registers, the two source documents, the tagged front documents, the self-kernel, and the
//   decomposition; imports nothing from the kernel (it is a doc/data linter).
// Invariant: the linter operates over MARKED claims and the ENUMERABLE sources, never over free prose.
//   Unmarked prose is out of scope by design; a normative-sounding sentence it judged load-bearing but
//   found unmarked is reported for human decision, not failed.
"use strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const read = (p) => readFileSync(join(ROOT, p), "utf8");

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-BOUNDARY: the contract register and the parameters register, held disjoint"); console.log(H);

// ---- parse the contract register: ### CR-x with its fields ----
const cr = read("docs/contract-register.md");
const CR = new Map(); // id -> { modality, grounds:[], covers:[], claims:[], enforced }
for (const block of cr.split(/\n(?=### )/)) {
  const m = block.match(/^### (CR-\S+)/);
  if (!m) continue;
  const id = m[1];
  const field = (name) => { const r = block.match(new RegExp(`^- ${name}: (.+)$`, "m")); return r ? r[1].trim() : null; };
  const list = (name) => { const v = field(name); return v ? v.split(",").map((s) => s.trim()).filter((s) => s && s !== "nothing") : []; };
  const groundsField = field("Grounds in the self-kernel") || "";
  CR.set(id, {
    modality: (field("Modality") || "").toLowerCase(),
    enforced: field("Enforced by") || "",
    grounds: [...groundsField.matchAll(/\bself\.[A-Za-z0-9.\-]+/g)].map((m) => m[0]), // ref tokens only, ignoring any parenthetical note
    covers: list("Covers"),
    claims: list("Claims"),
    raw: block,
  });
}
console.log(`\nparsed ${CR.size} contract entries, ${[...CR.values()].reduce((n, e) => n + e.covers.length, 0)} covers, ${[...CR.values()].reduce((n, e) => n + e.grounds.length, 0)} self-kernel groundings`);

// ---- parse the parameters register: <!-- param: PR-x --> and any <!-- boundary: CR-x --> tags ----
const pr = read("docs/parameters-register.md");
const PR = new Set([...pr.matchAll(/<!--\s*param:\s*(PR-\S+)\s*-->/g)].map((m) => m[1]));
console.log(`parsed ${PR.size} free-parameter entries: ${[...PR].join(", ")}`);

// ---- collect every marker across the tagged documents ----
const TAGGED = ["docs/parameters-register.md", "docs/contract-register.md", "docs/ecosystem-guide.md", "docs/for-the-institutional-adopter.md", "docs/the-climb-of-synthesis.md", "docs/submission-overview.md", "docs/composition-spec.md"];
const markers = []; // { doc, id, kind, sentence, claim }
for (const doc of TAGGED) {
  const text = read(doc);
  const re = /<!--\s*(?:boundary|param):\s*((?:CR|PR)-\S+)(?:\s+claim=(\S+))?\s*-->/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const id = m[1];
    const kind = id.startsWith("CR-") ? "contract" : "parameter";
    // the text the marker is attached to: the last non-empty sentence before it (the marker is appended
    // after the sentence's terminal punctuation, so the naive tail of the split is an empty string).
    const before = text.slice(Math.max(0, m.index - 600), m.index);
    const sentence = before.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean).pop() || "";
    markers.push({ doc, id, kind, sentence, claim: m[2] || null });
  }
}
console.log(`collected ${markers.length} markers across ${TAGGED.length} documents`);

// =====================================================================================
console.log("\n[1] disjointness: no id belongs to both registers");
const crIds = new Set(CR.keys());
const overlap = [...crIds].filter((id) => PR.has(id)).concat([...PR].filter((id) => crIds.has(id)));
ok(overlap.length === 0, overlap.length ? `an id is claimed by both registers: ${overlap.join(", ")}` : "the contract and parameter id sets are disjoint");
ok([...crIds].every((id) => id.startsWith("CR-")) && [...PR].every((id) => id.startsWith("PR-")), "every contract id is CR-* and every parameter id is PR-*, so the prefixes keep the tiers apart");

// =====================================================================================
console.log("\n[2] the masquerade check: a marked claim's modality agrees with its register entry");
// free signals contradict a contract marker; fixed signals contradict a parameter marker.
const FREE = [/a community (may|sets|chooses|runs|tunes)/i, /community's own/i, /governance choices/i, /free parameter/i, /\bat will\b/i, /configurable/i, /local policy/i, /each community/i, /sets it as/i, /run flat or hierarchical/i, /a deployment's choice/i];
const FIXED = [/fixed at protocol/i, /required invariant/i, /must hold/i, /cannot be waived/i, /every kernel must/i, /no kernel could/i, /a promise every/i, /holds by construction/i, /impossible to express/i];
let masqOk = 0;
const review = [];
for (const mk of markers) {
  const entry = mk.kind === "contract" ? CR.get(mk.id) : (PR.has(mk.id) ? { modality: "free" } : null);
  if (!entry) continue; // resolution handles the dangling case
  if (mk.kind === "contract") {
    const bad = FREE.find((re) => re.test(mk.sentence));
    if (bad) { ok(false, `${mk.doc}: a contract marker ${mk.id} sits on a sentence phrased as a free choice ("${bad.source}"), a masquerade: ${mk.sentence.trim().slice(-90)}`); }
    else masqOk++;
  } else {
    const bad = FIXED.find((re) => re.test(mk.sentence));
    if (bad) { ok(false, `${mk.doc}: a parameter marker ${mk.id} sits on a sentence phrased as an invariant ("${bad.source}"), a masquerade: ${mk.sentence.trim().slice(-90)}`); }
    else masqOk++;
  }
}
ok(masqOk === markers.length, `${masqOk}/${markers.length} marked claims carry a modality consistent with their register entry`);

// =====================================================================================
console.log("\n[2b] the origin-trust masquerade: no contract entry obligates a receiver to accept an incoming grade");
// whether a receiver accepts an incoming grade or re-grounds it is admission policy, free (the origin
// verification stance, PR-origin-stance). A contract entry that asserts a same-hash crossing MUST
// transfer a grade losslessly, that a receiver must accept or inherit it, or that standing is stripped
// nowhere, is a masquerade: it states a receiver-must-accept obligation as contract. The corrected
// CR-shared-hash passes (native acceptance is available, not obligated); the old "native and lossless"
// wording fails.
// the obligation signals: a same-hash crossing stated as compelling lossless transfer, or a receiver
// stated as obligated to accept. The lookbehind lets the corrected text negate the obligation ("never
// that the receiver must accept") without tripping, while a bare "the receiver must accept" trips.
const OBLIGATES_ACCEPT = [/native and lossless/i, /grade carries across intact/i, /no standing is stripped/i, /losslessly transfers?\b/i, /lossless[- ]by[- ]contract/i, /(?<!never that )the receiver must (?:accept|inherit|absorb)/i];
let acceptOk = 0;
for (const [id, e] of CR) {
  const bad = OBLIGATES_ACCEPT.find((re) => re.test(e.raw));
  if (bad) ok(false, `contract entry ${id} obligates a receiver to accept an incoming grade ("${bad.source}"), but accepting versus re-grounding is admission policy, free (PR-origin-stance); this is a receiver-must-accept masquerade`);
  else acceptOk++;
}
ok(acceptOk === CR.size, `${acceptOk}/${CR.size} contract entries leave grade acceptance to the receiver's stance rather than obligating it`);

// =====================================================================================
console.log("\n[3] totality: every enumerable source of the contract resolves to a contract entry");
// source list 1: the composition spec's composability invariants, enumerated as CR-ids.
const spec = read("docs/composition-spec.md");
const specSection = spec.slice(spec.indexOf("## The composability invariants"));
const specItems = [...specSection.matchAll(/^- `(CR-\S+)`/gm)].map((m) => m[1]);
ok(specItems.length >= 5, `the composition spec enumerates its composability invariants (${specItems.length} found)`);
for (const id of specItems) ok(crIds.has(id), `spec composability invariant ${id} resolves to a contract-register entry`);
// source list 2: the ecosystem guide's numbered invariants, each carrying a CR marker.
const guide = read("docs/ecosystem-guide.md");
const guideSection = guide.slice(guide.indexOf("## The invariants"), guide.indexOf("## For a community founder"));
const guideItems = [...guideSection.matchAll(/^(\d+)\. \*\*(.+?)\*\*[\s\S]*?<!--\s*boundary:\s*(CR-\S+)\s*-->/gm)];
const guideUntagged = [...guideSection.matchAll(/^(\d+)\. \*\*(.+?)\*\*/gm)].filter((g) => !guideItems.some((t) => t[1] === g[1]));
ok(guideUntagged.length === 0, guideUntagged.length ? `an ecosystem-guide invariant carries no contract entry: ${guideUntagged.map((g) => g[2]).join("; ")}` : `all ${guideItems.length} ecosystem-guide invariants carry a contract marker`);
for (const g of guideItems) ok(crIds.has(g[3]), `guide invariant ${g[1]} (${g[2]}) resolves to contract entry ${g[3]}`);
// every contract entry covers a real source item, and every source item is covered.
const covered = new Set([...CR.values()].flatMap((e) => e.covers));
for (const [id, e] of CR) ok(e.covers.length > 0, `contract entry ${id} names the source item it covers`);
for (const g of guideItems) ok(covered.has(`guide:${g[1]}`), `guide invariant ${g[1]} is covered by a contract entry's Covers field`);
// parameters totality: every named free parameter carries a param marker.
const FREE_PARAMS = ["The time-lock parameters", "The standing and reputation rules", "The identity and admission policy", "The origin verification stance", "The agent policy", "The type system", "The forum and weighing conventions", "The corpus content license"];
for (const lead of FREE_PARAMS) {
  const idx = pr.indexOf(lead);
  const para = idx >= 0 ? pr.slice(idx, pr.indexOf("\n\n", idx) === -1 ? undefined : pr.indexOf("\n\n", idx)) : "";
  ok(idx >= 0 && /<!--\s*param:\s*PR-\S+\s*-->/.test(para), `the free parameter "${lead}" carries a parameter marker`);
}

// =====================================================================================
console.log("\n[4] resolution: every marker and cross-kernel reference resolves");
for (const mk of markers) {
  const known = mk.kind === "contract" ? crIds.has(mk.id) : PR.has(mk.id);
  ok(known, `${mk.doc}: marker ${mk.id} resolves to a real register entry`);
}
// self-kernel groundings resolve
const { STORE: SELF } = require(join(ROOT, "corpora/self/self-data.js"));
const selfRefs = new Set(SELF.claims.map((c) => c.ref));
for (const [id, e] of CR) for (const g of e.grounds) ok(selfRefs.has(g), `contract entry ${id} grounds in a real self-kernel claim (${g})`);
// decomposition claim references resolve
const { CLAIMS: DECOMP_CLAIMS } = require(join(ROOT, "corpora/submission-decomposition/decomposition.js"));
const decompRefs = new Set(DECOMP_CLAIMS.map((c) => c.ref));
for (const [id, e] of CR) for (const c of e.claims) ok(decompRefs.has(c), `contract entry ${id} references a real decomposition claim (${c})`);

// =====================================================================================
console.log("\n[5] unmarked-but-load-bearing sentences, for human decision (informational, not a failure)");
// a sentence asserting fixedness at protocol level, or naming a free choice, near boundary vocabulary,
// that carries no marker: reported so a human can decide whether it should be tagged.
for (const doc of ["docs/submission-overview.md", "docs/for-the-institutional-adopter.md", "docs/the-climb-of-synthesis.md"]) {
  const text = read(doc);
  for (const sent of text.split(/(?<=[.!?])\s+/)) {
    if (/<!--/.test(sent)) continue;
    if (/(fixed at protocol level|required invariant|a free parameter|community sets)/i.test(sent) && !/`?(CR|PR)-/.test(sent)) {
      review.push(`${doc}: ${sent.trim().slice(0, 140)}`);
    }
  }
}
if (review.length) { console.log(`      ${review.length} unmarked load-bearing sentence(s) for human decision:`); for (const r of review) console.log(`        - ${r}`); }
else console.log("      none surfaced");

console.log("\n" + H);
if (fails === 0) console.log("verified: the contract register and the parameters register are disjoint, no marked claim asserts the wrong modality, every composability invariant and guide invariant resolves to a contract entry, and every marker and cross-kernel reference resolves.");
console.log(fails === 0 ? "check-boundary: OK" : `check-boundary: ${fails} FAILURE(S)`);
console.log(H);
process.exit(fails === 0 ? 0 : 1);
