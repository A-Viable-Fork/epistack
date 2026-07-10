// Role: the OpenAlex metadata connector. Queries the OpenAlex works API (or replays a saved JSON
//   response fixture when the network is unavailable), parses the descriptive metadata deterministically,
//   and returns normalized work objects. It reads metadata only (title, authors, year, venue, DOI) and
//   records a link back; it stores no full-text body.
// Contract: fetchOpenAlex({ query, perPage?, fixture?, mailto?, limiter?, fetchImpl? }) -> Promise<[work]>,
//   a work is { source:"openalex", id, title, authors:[name], year, doi, venue, url }. Pass `fixture`
//   (JSON string or parsed object) to parse offline; otherwise it fetches live with a polite delay and
//   identifies the client. Periphery: imports only periphery (the rate limiter); never the kernel.
// Invariant: parsing is deterministic; the client is identified (User-Agent and the polite mailto) on
//   every live request; a work with a published venue is peer-reviewed material, one without is a
//   preprint, and that honest distinction is carried through unchanged for the source mapping to read.
"use strict";
import { createRateLimiter, OPENALEX_MIN_INTERVAL_MS } from "./rate-limit.mjs";

const ENDPOINT = "https://api.openalex.org/works";

// the short OpenAlex id (W2741809807) from its full URL id.
function shortId(idUrl) {
  const m = String(idUrl || "").match(/(W\d+)\s*$/);
  return m ? m[1] : String(idUrl || "").trim();
}

// normalize one OpenAlex work record into our shape. Pure.
function normalizeWork(w) {
  const id = shortId(w.id);
  const title = w.display_name || w.title || "";
  const year = w.publication_year != null ? String(w.publication_year) : "";
  const authors = (w.authorships || []).map((a) => (a.author && a.author.display_name) || "").filter(Boolean);
  const doi = w.doi ? String(w.doi).replace(/^https?:\/\/doi\.org\//, "") : "";
  const loc = (w.primary_location && w.primary_location.source) || w.host_venue || null;
  const venue = loc && (loc.display_name || loc.venue) ? (loc.display_name || loc.venue) : "";
  // the link back: DOI when present, else the OpenAlex work page.
  const url = doi ? "https://doi.org/" + doi : "https://openalex.org/" + id;
  return { source: "openalex", id, title, authors, year, doi, venue, url };
}

export function parseOpenAlex(json) {
  const obj = typeof json === "string" ? JSON.parse(json) : json;
  const results = (obj && obj.results) || [];
  return results.map(normalizeWork);
}

export async function fetchOpenAlex(opts) {
  const o = opts || {};
  if (o.fixture != null) return parseOpenAlex(o.fixture); // offline replay of a saved response
  const limiter = o.limiter || createRateLimiter({ minIntervalMs: OPENALEX_MIN_INTERVAL_MS });
  const fetchImpl = o.fetchImpl || (typeof fetch !== "undefined" ? fetch : null);
  if (!fetchImpl) throw new Error("fetchOpenAlex: no fetch available and no fixture provided");
  const mailto = o.mailto || "ingest@epistack.local"; // the polite-pool identifier OpenAlex requests
  const params = new URLSearchParams({
    search: o.query || "metascience",
    per_page: String(o.perPage || 5),
    mailto,
  });
  await limiter.acquire(); // a polite delay between requests
  const res = await fetchImpl(ENDPOINT + "?" + params.toString(), {
    headers: { "User-Agent": "epistack-ingest/0.1 (mailto:" + mailto + ")" },
  });
  const json = await res.text();
  return parseOpenAlex(json);
}
