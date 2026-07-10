// Role: map normalized ingested works into kernel source rows, the source half of the pipeline. It
//   produces the same row shape the cases' tables.js already hold, with an honest source-class mapping
//   and a link back in every description. It authors no claims and assigns no grades; it brings in the
//   material that claims will later cite through the gate.
// Contract: worksToSources([work]) -> [{ source_id, source_class, description }], sorted by source_id and
//   deduplicated. An arXiv work is a preprint; an OpenAlex work with a published venue is peer-reviewed,
//   one without is a preprint. Pure and deterministic. Periphery: imports nothing; never the kernel.
// Invariant: source_class is always one of the kernel's real classes (never invented); every description
//   is a citation carrying its link back and holds no full-text body; same works in, same rows out.
"use strict";

function slug(s) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64);
}

// a compact author list for the citation: the first author et al. past two.
function authorsShort(authors) {
  const a = (authors || []).filter(Boolean);
  if (!a.length) return "unattributed";
  if (a.length <= 2) return a.join(" and ");
  return a[0] + " et al.";
}

function arxivRow(w) {
  const source_id = "src:arxiv:" + slug(w.id);
  const cite = [w.title, authorsShort(w.authors)].filter(Boolean).join(", ");
  const year = w.year ? " (" + w.year + ")" : "";
  // preprint by definition; the description is a citation plus the arXiv abstract-page link back.
  const description = cite + year + ". Preprint arXiv:" + w.id + ". " + w.url;
  return { source_id, source_class: "preprint", description };
}

function openalexRow(w) {
  const hasVenue = !!(w.venue && w.venue.trim());
  const source_class = hasVenue ? "peer-reviewed" : "preprint";
  const base = w.doi ? "doi:" + slug(w.doi) : "openalex:" + slug(w.id);
  const source_id = "src:" + base;
  const cite = [w.title, authorsShort(w.authors)].filter(Boolean).join(", ");
  const year = w.year ? " (" + w.year + ")" : "";
  const venue = hasVenue ? ". " + w.venue : "";
  const idref = w.doi ? ". DOI:" + w.doi : "";
  const description = cite + year + venue + idref + ". " + w.url;
  return { source_id, source_class, description };
}

export function workToSource(w) {
  if (!w || !w.source) throw new Error("worksToSources: a work needs a source origin");
  if (w.source === "arxiv") return arxivRow(w);
  if (w.source === "openalex") return openalexRow(w);
  throw new Error("worksToSources: unknown work source '" + w.source + "'");
}

export function worksToSources(works) {
  const byId = new Map();
  for (const w of works || []) {
    const row = workToSource(w);
    byId.set(row.source_id, row); // dedup by id; a repeated work maps to the same row
  }
  return [...byId.values()].sort((a, b) => (a.source_id < b.source_id ? -1 : a.source_id > b.source_id ? 1 : 0));
}
