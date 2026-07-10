// Role: the arXiv metadata connector. Queries the arXiv Atom API (or replays a saved response fixture
//   when the network is unavailable), parses the descriptive metadata deterministically, and returns
//   normalized work objects. It reads descriptive metadata only (title, authors, abstract, date,
//   identifiers) and records the link back to the arXiv page; it never downloads, stores, or
//   redistributes the full-text e-print, which arXiv does not license for redistribution.
// Contract: fetchArxiv({ query, maxResults?, fixture?, limiter?, fetchImpl? }) -> Promise<[work]>, where
//   a work is { source:"arxiv", id, title, authors:[name], abstract, year, url, primary_class }. Pass
//   `fixture` (Atom XML string) to parse offline; otherwise it fetches live through the rate limiter.
//   Periphery: imports only periphery (the rate limiter); never the kernel.
// Invariant: parsing is deterministic (same XML in, same works out); the metadata endpoint is the only
//   URL fetched (export.arxiv.org/api), never an e-print or PDF path; every work carries its abstract
//   page link back. The rate limiter is honored before every live request, one request per three seconds.
"use strict";
import { createRateLimiter, ARXIV_MIN_INTERVAL_MS } from "./rate-limit.mjs";

const ENDPOINT = "http://export.arxiv.org/api/query";

// decode the five XML entities that appear in arXiv Atom text. Deterministic and total.
function unescapeXml(s) {
  return String(s)
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function tagText(block, tag) {
  const m = block.match(new RegExp("<" + tag + "[^>]*>([\\s\\S]*?)</" + tag + ">"));
  return m ? unescapeXml(m[1].trim().replace(/\s+/g, " ")) : "";
}

// the arXiv id and version stripped from the entry's <id> URL (http://arxiv.org/abs/2401.01234v2).
function arxivIdFrom(idUrl) {
  const m = String(idUrl).match(/arxiv\.org\/abs\/([^\s<]+?)(v\d+)?$/i);
  return m ? m[1] : String(idUrl).trim();
}

// parse an Atom feed into normalized works. Pure: no network, no clock.
export function parseArxivAtom(xml) {
  const works = [];
  const entries = String(xml).match(/<entry>[\s\S]*?<\/entry>/g) || [];
  for (const entry of entries) {
    const idUrl = tagText(entry, "id");
    const id = arxivIdFrom(idUrl);
    const title = tagText(entry, "title");
    const abstract = tagText(entry, "summary");
    const published = tagText(entry, "published");
    const year = (published.match(/^(\d{4})/) || [])[1] || "";
    const authors = (entry.match(/<author>[\s\S]*?<\/author>/g) || []).map((a) => tagText(a, "name")).filter(Boolean);
    const primary = entry.match(/<arxiv:primary_category[^>]*term="([^"]+)"/);
    const primary_class = primary ? primary[1] : "";
    // the link back: the human abstract page, never the pdf or e-print source.
    const url = "https://arxiv.org/abs/" + id;
    works.push({ source: "arxiv", id, title, authors, abstract, year, url, primary_class });
  }
  return works;
}

export async function fetchArxiv(opts) {
  const o = opts || {};
  if (o.fixture != null) return parseArxivAtom(o.fixture); // offline replay of a saved response
  const limiter = o.limiter || createRateLimiter({ minIntervalMs: ARXIV_MIN_INTERVAL_MS });
  const fetchImpl = o.fetchImpl || (typeof fetch !== "undefined" ? fetch : null);
  if (!fetchImpl) throw new Error("fetchArxiv: no fetch available and no fixture provided");
  const params = new URLSearchParams({
    search_query: o.query || "all:metascience",
    start: "0",
    max_results: String(o.maxResults || 5),
  });
  await limiter.acquire(); // one request per three seconds, by construction
  const res = await fetchImpl(ENDPOINT + "?" + params.toString(), {
    headers: { "User-Agent": "epistack-ingest/0.1 (metadata-only; links back for full text)" },
  });
  const xml = await res.text();
  return parseArxivAtom(xml);
}
