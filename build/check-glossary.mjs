// Role: the self-describing-vocabulary oracle (DESCRIBE-1). Verifies the glossary is complete
//   against the real schema (every grade, claim kind, and link kind explained, no entry naming one
//   the schema does not carry), that the declared-vs-earned concept names both sides of the
//   distinction and frames the divergence as a finding, that the client contract's glossary() serves
//   the kernel's export unchanged, and that the worked example (a real covid mode-split pair) is
//   printed from data, not invented.
// Contract: `node build/check-glossary.mjs` exits non-zero on any failure, naming it.
// Invariant: read-only, rung 1 of the extension ladder. Touches no truth field; imports
//   kernel/schema/glossary.mjs, corpora/_shared/common-types.js, and kernel/schema/records.mjs
//   read-only (the last by source text, since LINK_KINDS is not exported), through the same
//   convention build/check-covid.mjs uses for its own house shape.
"use strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { tierOf } from "../kernel/schema/confidence.mjs";
import { GRADES, KINDS, LINKS, CONCEPTS, glossary, completenessAgainst } from "../kernel/schema/glossary.mjs";
import { createClientApi } from "../api/client-api.mjs";
import { createLocalProvider } from "../api/providers/local-provider.mjs";
import { buildCovid } from "./covid-build.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-GLOSSARY (DESCRIBE-1): the self-describing vocabulary"); console.log(H);

// the real schema, read without hand-copying it a second time. Kinds: the shared-root common bundles
// (corpora/_shared/common-types.js); a kernel-local kind extension (the math kernel's "theorem") is
// not shared-root vocabulary and carries no glossary entry, the same split the compute layer draws.
const { COMMON_BUNDLES } = require("../corpora/_shared/common-types.js");
const REAL_KINDS = Object.keys(COMMON_BUNDLES);
// links: LINK_KINDS is not exported from records.mjs (kernel-internal), so it is read from the
// module's own source text, the same convention build/check-map.mjs uses to derive its import graph.
const recordsSrc = readFileSync(join(ROOT, "kernel", "schema", "records.mjs"), "utf8");
const linkMatch = recordsSrc.match(/const LINK_KINDS = \[([^\]]+)\];/);
if (!linkMatch) throw new Error("check-glossary: could not locate LINK_KINDS in kernel/schema/records.mjs");
const REAL_LINKS = [...linkMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);

// =====================================================================================
console.log("\n[1] completeness against the real schema, both directions");
const completeness = completenessAgainst(REAL_KINDS, REAL_LINKS);
ok(completeness.grades.missing.length === 0, `every grade in the confidence order has a GRADES entry (missing: ${JSON.stringify(completeness.grades.missing)})`);
ok(completeness.grades.extra.length === 0, `no GRADES entry names a grade the confidence order does not carry (extra: ${JSON.stringify(completeness.grades.extra)})`);
ok(completeness.kinds.missing.length === 0, `every shared-root claim kind has a KINDS entry (missing: ${JSON.stringify(completeness.kinds.missing)})`);
ok(completeness.kinds.extra.length === 0, `no KINDS entry names a claim kind the shared root does not carry (extra: ${JSON.stringify(completeness.kinds.extra)})`);
ok(completeness.links.missing.length === 0, `every link kind the schema carries has a LINKS entry (missing: ${JSON.stringify(completeness.links.missing)})`);
ok(completeness.links.extra.length === 0, `no LINKS entry names a link kind the schema does not carry (extra: ${JSON.stringify(completeness.links.extra)})`);
for (const g of Object.keys(GRADES)) ok(!!GRADES[g].description && !!GRADES[g].whenToUse, `${g}: carries a non-empty description and whenToUse`);
for (const k of REAL_KINDS) ok(KINDS[k] && KINDS[k].ceiling === COMMON_BUNDLES[k].ceiling, `${k}: glossary ceiling (${KINDS[k] && KINDS[k].ceiling}) matches the shared-root bundle (${COMMON_BUNDLES[k].ceiling})`);

// =====================================================================================
console.log("\n[2] the declared-vs-earned concept is present and load-bearing");
const dve = CONCEPTS["declared-vs-earned"];
ok(!!dve && typeof dve.description === "string" && dve.description.length > 0, "CONCEPTS[\"declared-vs-earned\"] exists with a non-empty description");
const mentionsDeclared = /declar/i.test((dve || {}).description || "");
const mentionsEarned = /earn/i.test((dve || {}).description || "");
const mentionsFinding = /finding/i.test((dve || {}).description || "");
ok(mentionsDeclared, "the description references the composer's declaration");
ok(mentionsEarned, "the description references the gate's earned grade");
ok(mentionsFinding, "the description frames the divergence as a finding, not a failure");

// =====================================================================================
console.log("\n[3] one source of truth through the client contract");
const snapshot = JSON.parse(readFileSync(join(ROOT, "vendor", "gate", "snapshot.json"), "utf8"));
const api = createClientApi(createLocalProvider(snapshot));
const viaContract = api.glossary();
const viaKernel = glossary();
ok(JSON.stringify(viaContract) === JSON.stringify(viaKernel), "api.glossary() is deep-equal to kernel/schema/glossary.mjs's own export: a client renders exactly what the kernel defines");

// =====================================================================================
console.log("\n[4] the worked example, printed from real covid data");
const C = buildCovid();
const id = (ref) => C.refId.get(ref);
const earned = (ref) => (C.view.earnedByIdentity.get(id(ref)) || { earned: "ungraded" }).earned;
const specOf = (ref) => { const c = C.claims.find((c) => c.spec.ref === ref); return c && c.spec; };
const OBS = "ev.wildlife-dna";
const INTP = "int.wildlife-infected";
const obsSpec = specOf(OBS);
const intpSpec = specOf(INTP);
ok(!!obsSpec && !!intpSpec, `both halves of the worked example are real covid claims (${OBS}, ${INTP})`);
if (obsSpec && intpSpec) {
  const obsTier = tierOf(earned(OBS));
  const intpTier = tierOf(earned(INTP));
  ok(obsTier === "settled" && intpTier !== "settled", `the pair is a real mode-split: ${OBS} grounds to the floor (${earned(OBS)}), ${INTP} sits as contested forum (${earned(INTP)})`);
  console.log("\n      the declared-vs-earned worked example, from the covid corpus:");
  console.log(`        observation  (${OBS}, earned ${earned(OBS)}): ${obsSpec.statement}`);
  console.log(`        interpretation (${INTP}, earned ${earned(INTP)}): ${intpSpec.statement}`);
  console.log(`        FINDING: the write-up's single declared mode splits here; the gate grants the observation its floor and holds the interpretation in the forum, exactly the divergence CONCEPTS["declared-vs-earned"] describes.`);
}

console.log("\n" + H);
if (fails) { console.log(`check-glossary: ${fails} FAILURE(S)`); process.exit(1); }
console.log("verified: the glossary is complete against the real schema by identity, declared-vs-earned names both sides and reports the divergence as a finding, the client contract serves the kernel's own export unchanged, and the covid corpus carries a real worked example of the split.");
console.log("check-glossary: OK"); console.log(H);
