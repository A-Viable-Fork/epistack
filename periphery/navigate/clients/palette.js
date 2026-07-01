// Role: the thin-client palette and the manifest validator. A thin client is a single
//   declarative manifest (tokens + a kind-to-look mapping) that composes from this palette of
//   built-in layouts and visual renderers. No engine, API, or view code for the common case.
// Contract: PALETTE = { layouts, visuals } catalogs (id -> description); validateManifest(
//   manifest, kinds) -> [problem strings]. Pure data + a pure function, DOM-free.
// Invariant: the palette names are the only layouts/visuals a thin client may choose; a manifest
//   that names anything else, or misses a kind, fails loudly (docs/thin-clients.md). The closed
//   node-kind set stays graph-owned: a manifest maps kinds, it never invents one.
"use strict";

const PALETTE = {
  // layout ids understood by view/card.js
  layouts: {
    teaching: "the learning-first card: hook, intuition, the communicated math, the visual, the break as a scenario, the stakes, and a see-the-precise-version disclosure",
    terse: "a compact card; a primitive renders as a walled citation, an observation/prediction/comparison as its world-fact or test",
  },
  // visual ids understood by view/visuals.js (plus "none" for no visual)
  visuals: {
    "viz.searchlight": "the interactive swept searchlight; consumes a selection-step's distribution + detection data",
    "viz.selection-static": "a static-figure variant of the searchlight (no slider); same data",
    none: "no visual",
  },
};

function isPlainObject(v) {
  return v != null && typeof v === "object" && !Array.isArray(v);
}

// validateManifest: a manifest covers every node kind, names only palette entries, and carries
// well-formed tokens. `kinds` is the closed set (api.kinds()). Empty array == valid.
function validateManifest(manifest, kinds) {
  const problems = [];
  if (!isPlainObject(manifest)) return ["manifest is not an object"];
  const id = manifest.id || "(no id)";
  if (manifest.tier && manifest.tier !== "thin") problems.push(`${id}: the kit validates thin clients; tier is '${manifest.tier}'`);

  // tokens: a map of CSS custom properties to string values
  if (manifest.tokens !== undefined) {
    if (!isPlainObject(manifest.tokens)) problems.push(`${id}: tokens must be an object`);
    else for (const k of Object.keys(manifest.tokens)) {
      if (!/^--[a-z0-9-]+$/i.test(k)) problems.push(`${id}: token '${k}' is not a CSS custom property (--name)`);
      if (typeof manifest.tokens[k] !== "string") problems.push(`${id}: token '${k}' must be a string`);
    }
  }

  // mapping: every kind covered, every layout/visual from the palette
  const m = manifest.mapping;
  if (!isPlainObject(m)) return problems.concat([`${id}: mapping must be an object`]);
  for (const k of kinds) {
    const entry = m[k];
    if (!entry) { problems.push(`${id}: mapping is missing kind '${k}' (a thin client must cover every kind)`); continue; }
    if (!entry.layout || !PALETTE.layouts[entry.layout]) problems.push(`${id}: kind '${k}' names layout '${entry.layout}', not in the palette`);
    if (entry.visual != null && entry.visual !== "none" && !PALETTE.visuals[entry.visual]) problems.push(`${id}: kind '${k}' names visual '${entry.visual}', not in the palette`);
  }
  for (const k of Object.keys(m)) if (!kinds.includes(k)) problems.push(`${id}: mapping names kind '${k}' that is not in the closed set`);

  return problems;
}

if (typeof module !== "undefined" && module.exports) module.exports = { PALETTE, validateManifest };
