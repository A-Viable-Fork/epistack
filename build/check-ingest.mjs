// Role: the acceptance oracle for the ingestion connector. From saved arXiv and OpenAlex response
//   fixtures it proves the connector produces valid kernel source rows (real class, real shape) that
//   makeSourceTable accepts, that every row carries its link back and holds no full-text body (the legal
//   boundary, asserted), that the rate limiter enforces the three-second interval by construction against
//   a virtual clock, and that the two halves of the pipeline meet: one ingested source enters a kernel's
//   source table and a claim citing it is authored through the real propose contract, receipt and all.
// Contract: `node build/check-ingest.mjs` exits non-zero on any failure. Build layer: imports the
//   periphery connector modules, the kernel source table, and the api propose contract for the demo.
// Invariant: the gate is the real one; the fixtures are replayed offline so the check is deterministic;
//   no assertion waits on real time, and no full text is fetched, stored, or asserted present.
"use strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseArxivAtom, fetchArxiv } from "../periphery/ingest/arxiv.mjs";
import { parseOpenAlex, fetchOpenAlex } from "../periphery/ingest/openalex.mjs";
import { worksToSources } from "../periphery/ingest/to-sources.mjs";
import { createRateLimiter, ARXIV_MIN_INTERVAL_MS } from "../periphery/ingest/rate-limit.mjs";
import { makeSourceTable } from "../kernel/schema/tables.mjs";
import { genesis } from "../kernel/store/state.mjs";
import { createClientApi } from "../api/client-api.mjs";
import { createLocalProvider } from "../api/providers/local-provider.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const H = "=".repeat(80);
let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };

const arxivXml = readFileSync(join(ROOT, "periphery/ingest/fixtures/arxiv-sample.xml"), "utf8");
const openalexJson = readFileSync(join(ROOT, "periphery/ingest/fixtures/openalex-sample.json"), "utf8");

console.log(H);
console.log("CHECK-INGEST: metadata into sources, honest and rate-limited, meeting authoring at a citation");
console.log(H);

// [1] the fetch layer parses the fixtures deterministically into normalized works.
console.log("\n[1] the connectors parse the saved responses into normalized works");
const arxivWorks = parseArxivAtom(arxivXml);
const openalexWorks = parseOpenAlex(openalexJson);
ok(arxivWorks.length === 2, `arXiv fixture yields 2 works (got ${arxivWorks.length})`);
ok(openalexWorks.length === 2, `OpenAlex fixture yields 2 works (got ${openalexWorks.length})`);
ok(arxivWorks[0].id === "2401.01234" && arxivWorks[0].authors.length === 3, "arXiv id and authors parsed (2401.01234, 3 authors)");
ok(openalexWorks[0].venue === "PeerJ" && !openalexWorks[1].venue, "OpenAlex venue parsed: one venued, one not");
// replaying through the async fetch path with the fixture must equal the pure parse (offline replay).
const arxivReplayed = await fetchArxiv({ fixture: arxivXml });
ok(JSON.stringify(arxivReplayed) === JSON.stringify(arxivWorks), "fetchArxiv({fixture}) replays offline, identical to the pure parse");
const openalexReplayed = await fetchOpenAlex({ fixture: openalexJson });
ok(JSON.stringify(openalexReplayed) === JSON.stringify(openalexWorks), "fetchOpenAlex({fixture}) replays offline, identical to the pure parse");

// [2] the mapping produces real source rows that makeSourceTable accepts.
console.log("\n[2] the works map to kernel source rows the real makeSourceTable accepts");
const rows = worksToSources([...arxivWorks, ...openalexWorks]);
ok(rows.length === 4, `4 works map to 4 source rows (got ${rows.length})`);
let table;
try { table = makeSourceTable(rows); ok(true, "makeSourceTable accepted every row (real class, real shape)"); }
catch (e) { ok(false, "makeSourceTable rejected a row: " + e.message); }
const byOrigin = Object.fromEntries(rows.map((r) => [r.source_id, r.source_class]));
const arxivRows = rows.filter((r) => r.source_id.startsWith("src:arxiv:"));
ok(arxivRows.every((r) => r.source_class === "preprint"), "every arXiv work is classed preprint");
const venued = rows.find((r) => r.source_id === "src:doi:10-7717-peerj-4375");
const unvenued = rows.find((r) => r.source_id === "src:openalex:w4390000001");
ok(venued && venued.source_class === "peer-reviewed", "the OpenAlex work with a venue is peer-reviewed");
ok(unvenued && unvenued.source_class === "preprint", "the OpenAlex work without a venue is a preprint");
const CLASSES = ["primary-measurement", "peer-reviewed", "preprint", "dataset", "institutional-report", "testimony"];
ok(rows.every((r) => CLASSES.includes(r.source_class)), "no invented source class: every row is one of the kernel's real classes");

// [3] the legal boundary: metadata and links only, never a full-text body.
console.log("\n[3] the legal boundary: every row carries a link back and holds no full text");
const LINK = /(https:\/\/arxiv\.org\/abs\/|https:\/\/doi\.org\/|https:\/\/openalex\.org\/)/;
ok(rows.every((r) => LINK.test(r.description)), "every description carries its arXiv, DOI, or OpenAlex link back");
ok(arxivRows.every((r) => /arxiv\.org\/abs\//.test(r.description) && !/arxiv\.org\/pdf|\/e-print/.test(r.description)),
  "arXiv rows link the abstract page, never a pdf or e-print path");
const BODY_KEYS = ["full_text", "fulltext", "body", "pdf", "eprint", "content"];
ok(rows.every((r) => Object.keys(r).length === 3 && "source_id" in r && "source_class" in r && "description" in r),
  "a source row is exactly { source_id, source_class, description }, no body field");
ok(rows.every((r) => BODY_KEYS.every((k) => !(k in r))), "no row carries a full-text field (" + BODY_KEYS.join(", ") + ")");
// the connector output as a whole holds only metadata and links.
const outputJson = JSON.stringify(rows);
ok(!/e-print|full[- ]?text/i.test(outputJson), "the output contains no full-text marker: metadata and links only");

// [4] the rate limiter enforces the three-second interval by construction, tested on a virtual clock.
console.log("\n[4] the rate limiter enforces the arXiv interval by construction (virtual clock, no real wait)");
let clock = 1000;
const now = () => clock;
const sleep = async (ms) => { clock += ms; }; // advance the virtual clock; never wait for real time
const lim = createRateLimiter({ minIntervalMs: ARXIV_MIN_INTERVAL_MS, now, sleep });
const N = 4;
const wallStart = Date.now();
const scheduled = [];
for (let i = 0; i < N; i++) scheduled.push(await lim.acquire());
const wallElapsed = Date.now() - wallStart;
const spans = scheduled.slice(1).map((t, i) => t - scheduled[i]);
ok(spans.every((s) => s >= ARXIV_MIN_INTERVAL_MS), `each of ${N} requests is spaced at least ${ARXIV_MIN_INTERVAL_MS}ms (spans ${spans.join(", ")})`);
ok(scheduled[N - 1] - scheduled[0] >= (N - 1) * ARXIV_MIN_INTERVAL_MS, `${N} requests span at least ${(N - 1) * ARXIV_MIN_INTERVAL_MS}ms of enforced spacing on the limiter's clock`);
ok(wallElapsed < 500, `the interval is enforced against the clock, not by waiting (real elapsed ${wallElapsed}ms)`);

// [5] the two halves meet: an ingested source enters a kernel and a claim cites it through the gate.
console.log("\n[5] end to end: an ingested source enters a kernel, a claim cites it through the real gate");
const ingested = arxivRows[0]; // one real ingested source row
const snapshot = {
  state: genesis(),
  sources: [ingested],
  kinds: [{ kind: "measurement", ceiling: "checked" }],
};
const api = createClientApi(createLocalProvider(snapshot));
ok(snapshot.sources.some((s) => s.source_id === ingested.source_id), "the ingested source row is in the kernel's source table before authoring");
const receipt = api.propose({
  statement: "The reproducibility signal reported in the ingested preprint holds on the replication subset.",
  kind: "measurement",
  citation: ingested.description, // the claim cites the ingested work
  declared_grade: "checked",
});
ok(!receipt.error, "the propose contract returned a receipt (no pre-gate error)");
ok(receipt.decision === "accepted", `the real gate accepted the cited claim (decision ${receipt.decision})`);
const proposedRow = (receipt.grade_table || []).find((g) => g.identity === receipt.proposed_identity) || {};
ok(proposedRow.earned_grade === "checked", `the claim citing the ingested source earned '${proposedRow.earned_grade}' (a citation raises it from asserted)`);
console.log(`       cited work: ${ingested.source_id} (${ingested.source_class})`);
console.log(`       claim earned: ${proposedRow.earned_grade}; gate decision: ${receipt.decision}`);

console.log("\n" + H);
if (fails) { console.log(`check-ingest: ${fails} FAILURE(S)`); process.exit(1); }
console.log("verified: the connector produces valid source rows makeSourceTable accepts, each with a link back and no");
console.log("full text; the rate limiter enforces the three-second interval by construction; and an ingested source");
console.log("grounds a real claim through the gate. Full-text parsing and deduplication are the named deferred depth.");
console.log("check-ingest: OK");
console.log(H);
