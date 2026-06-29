// Role: the registered client descriptors. A client is a forkable unit over the untouched
//   store, read-only against truth (docs/architecture-storage-api-clients.md, docs/clients.md).
//   A descriptor carries only presentation: tokens (design tokens) + mapping (node kind -> a
//   layout and an optional visual) + which renderer drives it + its tier.
// Contract: exports { id -> { id, kind:"client", tier, renderer, tokens, mapping } }. The
//   render functions live in view/clients/ (view owns DOM); this layer owns only the descriptor.
// Invariant: pure data, no truth fields. A thin client's mapping covers every node kind (the
//   render-everything guarantee); a fat client may cover fewer because it composes its own way.
"use strict";

// the searchlight-world palette: the default teaching skin (matches v1 exactly).
const TOK_TEACHING = {
  "--paper": "#e7eaec", "--paper-2": "#dfe3e6", "--ink": "#1a2026", "--ink-soft": "#48555f",
  "--ink-faint": "#8995a0", "--rule": "#cdd3d8", "--lamp": "#e8a33d", "--lamp-deep": "#c9852a",
  "--slate": "#647682", "--night": "#141a1f", "--danger": "#c5604b",
};
// a dark console palette for the auditor.
const TOK_AUDITOR = {
  "--paper": "#0e1116", "--paper-2": "#161b22", "--ink": "#e6edf3", "--ink-soft": "#9da7b3",
  "--ink-faint": "#6b7682", "--rule": "#2a323c", "--lamp": "#3fb950", "--lamp-deep": "#2ea043",
  "--slate": "#7d8590", "--night": "#010409", "--danger": "#f85149",
};

// the full kind-to-look mapping (covers every kind). Teaching cards for the explained steps,
// terse cards for the floor and closures; selection-step gets the searchlight visual.
const MAP_TEACHING = {
  question: { layout: "teaching" },
  "selection-step": { layout: "teaching", visual: "viz.searchlight" },
  "sufficiency-step": { layout: "teaching" },
  transformation: { layout: "teaching" },
  assumption: { layout: "teaching" },
  primitive: { layout: "terse" },
  observation: { layout: "terse" },
  prediction: { layout: "terse" },
  comparison: { layout: "terse" },
  claim: { layout: "terse" },
};
// Thin clients are no longer hand-coded here. They are declarative manifests under clients/,
// composed from the palette (data/clients/palette.js) and authored with the kit. This file now
// holds only the FAT clients, which call more of the API and compose their own way.

const CLIENTS = {
  // FAT: the learning-first teaching surface. Concrete entry, the compare reveal, the
  // searchlight. Renders exactly as v1. Its mapping is the thin part it also carries.
  "client.teaching": {
    id: "client.teaching",
    kind: "client",
    tier: "fat",
    renderer: "teaching",
    title: "Teaching walk",
    tokens: TOK_TEACHING,
    mapping: MAP_TEACHING,
  },
  // FAT: the auditor. Leads with the inspect layer and the dependents query (the blast
  // radius) and surfaces the gate's reasoning. A different USE of the same store.
  "client.auditor": {
    id: "client.auditor",
    kind: "client",
    tier: "fat",
    renderer: "auditor",
    title: "Auditor console",
    tokens: TOK_AUDITOR,
    mapping: MAP_TEACHING,
  },
};

if (typeof module !== "undefined" && module.exports) module.exports = { CLIENTS };
