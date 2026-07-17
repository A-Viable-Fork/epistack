---
Type: record
Purpose: "Records what the ingestion connector built, the metadata-only legal boundary and the by-construction rate limit it holds, the honest source-class mapping it produces, how it meets the authoring surface at a citation, and that full-text parsing and deduplication are the named deferred depth."
Depends on: []
Depended on by: []
---

# The Ingestion Connector: Findings

The connector is the source half of the pipeline whose claim half is the authoring surface. It pulls
scholarly metadata from arXiv and OpenAlex and turns each work into a source record a kernel can hold,
so an author can then write claims that cite it through the gate. Ingest brings in the material;
authoring writes the grounded claims; the two meet at a citation. This is the shallow-but-real version:
the fetch is real, the mapping is real, and the end-to-end demo runs the real gate.

## What was built

- `periphery/ingest/rate-limit.mjs`: a minimum-interval limiter enforced by construction. Consecutive
  `acquire()` calls resolve at monotonic times spaced at least the interval apart, and the clock and
  the delay are injectable so the spacing is provable against a virtual clock, not by waiting.
- `periphery/ingest/arxiv.mjs` and `periphery/ingest/openalex.mjs`: each queries its metadata API or
  replays a saved response fixture offline, parses the descriptive metadata deterministically, and
  returns normalized works. arXiv is honored through the limiter, one request per three seconds;
  OpenAlex is given a polite delay and identifies the client.
- `periphery/ingest/to-sources.mjs`: maps normalized works into kernel source rows in the real shape
  `{ source_id, source_class, description }`, pure and deterministic.
- `build/check-ingest.mjs`: the oracle, proving all four properties below plus the end-to-end meeting.

The producer modules live in `periphery/ingest/`, the home the trust-boundary schema already reserves
for ingest producers; they are fallible and import no kernel module. The check lives in `build/`, the
layer permitted to import the kernel source table and the propose contract for its assertions. So the
connector sits inside the enforced boundary and `build/check-map.mjs` covers every file.

## The two hard constraints, held

- **Rate limit, by construction.** The limiter guarantees arXiv's one-request-per-three-seconds spacing
  rather than approximating it. The check runs four acquisitions on a virtual clock and confirms each is
  spaced at least three seconds from the last, with zero real time elapsed, so the guarantee is a
  property of the schedule and not of how promptly the caller fires.
- **Metadata only, link back for full text.** arXiv descriptive metadata is CC0 and freely storable;
  the full-text e-print is not redistributable and automated full-text crawling is prohibited. The
  connector fetches only the metadata endpoints, stores only metadata (title, authors, year,
  identifiers), and records the arXiv abstract-page link back in every description. The check asserts
  this as a legal invariant: every source row is exactly the three-field shape with a link back and no
  full-text body field, and the output carries no full-text marker. The connector never downloads,
  stores, or redistributes full text.

## The honest source-class mapping

An arXiv work is a `preprint` by definition. An OpenAlex work with a published venue is `peer-reviewed`;
one without a venue is a `preprint`. No source class outside the kernel's real menu is invented. The
check confirms the venued OpenAlex work classes peer-reviewed and the un-venued one classes preprint,
and that `makeSourceTable` accepts every row.

## Where ingest meets authoring

The end-to-end demo places one ingested arXiv source row in a kernel's source table and authors a claim
citing that work through the real propose contract. The gate accepts it and grades it `checked`: a
citation enters as a distinct-party checking record, which raises an otherwise-asserted claim. That is
the honest whole, ingested material then a grounded claim citing it, run through the real gate.

One precise limit named in the present: the propose contract models a citation as a synthesized
checking-record source (`judge:cite:<slug>`), so the demo shows the ingested source present in the
kernel's table and a claim citing that work, rather than binding the authored claim's `source_id`
directly to the ingested row's id. Wiring an authored claim's source_id straight to an ingested
source_id is a small propose extension, specified and not built here.

## The named deferred depth

- **Full-text parsing (GROBID and the like) is the deep connector, out of scope.** This connector is
  metadata only by law and by design; parsing full-text bodies is deferred and named, not attempted.
- **Deduplication across sources is deferred.** `worksToSources` deduplicates by `source_id` within one
  ingest, but cross-source identity resolution (the same work as an arXiv preprint and an OpenAlex
  peer-reviewed record) is not built here; it is the next depth, named in the present.
- **The producer connector** (publishing outward) is a separate connector, not built in this pass.

## The honest one-line summary

The connector ingests scholarly metadata into real source rows the kernel accepts, holds the rate limit
by construction and the metadata-only legal boundary by assertion, and meets the authoring surface at a
citation through the real gate; full-text parsing and deduplication are the named deferred depth.
