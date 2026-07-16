---
Type: reference
Purpose: Describes the two client tiers over the API, as the reference the thin-client kit derives from.
Depends on: docs/api.md, docs/components-and-forking.md
Depended on by: docs/ecosystem-guide.md, docs/kernel-at-inference.md, docs/thin-clients.md, docs/workflow-atlas.md, docs/workflow-consumer-adversarial.md, docs/workflow-consumer-crux.md, docs/workflow-consumer-evidence.md
---

# Writing a client

A client is a forkable unit over the untouched store. It reads through the API
(`docs/api.md`) and is read-only against truth: it may read what the API exposes and submit
through the gate, but it can never reach in and rewrite a claim. Clients differ only in how
much of the API they use. You can write one from this doc and `docs/api.md` without reading
the engine.

The one rule: **read through the API, submit through the gate, never touch the store.**

## The closed node-kind set

A node declares what it is with `presentation: { type, data }`. It never names a layout or a
visual. The set of kinds is graph-owned and closed (`data/schema.js`, `PRESENTATION_TYPES`);
no client may invent a kind, because that would produce a node another client cannot render.

| kind | what it is | data it carries |
|---|---|---|
| `question` | a concrete contested question, the entry | none |
| `selection-step` | a representativeness step | `{ distribution, detection, marker, markerLabel, spread }` |
| `sufficiency-step` | a sufficiency step | none |
| `transformation` | a generic derivation/composition step | none |
| `primitive` | a cited basis, the floor | none (the citation is on the node) |
| `observation` | a world-fact that closes a claim | none |
| `prediction` | a value the reasoning produces | none |
| `comparison` | a test of a prediction against an observation | none |
| `assumption` | a perturbable proposition | none |
| `claim` | a case-level assertion with a terminal type | none |

`api.kinds()` returns this set at runtime.

## Two tiers

### Thin client: the five-minute fork

Tokens plus a mapping from each node kind to a look, over the default read path
(`api.entry`, `api.resolve`, `api.decompose`). It restyles the response and nothing more.
Because it maps every kind, it renders every node: that is its guarantee.

```
{ id, kind: "client", tier: "thin", renderer: "thin",
  tokens:  { "--paper": ..., "--ink": ..., "--lamp": ..., ... },   // CSS custom properties
  mapping: { "<kind>": { layout: "teaching" | "terse", visual?: "<visual id>" }, ... } }   // every kind
```

`client.plain` is one. To reskin it, fork it and override only `tokens`: `client.plain.warm`
forks `client.plain` and changes nothing but the palette, inheriting the mapping and renderer
live. That is the whole surface reskinned with zero change to the store.

### Fat client: compose your own way

Calls more of the API and composes the results however it likes. It can lead with a different
operation, re-sequence the entry, recompose a view, redefine what acting on a kind does. It
trades the render-everything guarantee for power.

- `client.teaching` (the teaching walk) leads with the concrete entry path and the compare
  reveal; it uses `api.decompose`, `api.compare`, `api.compareTargetFor`, `api.motions`.
- `client.auditor` (the auditor console) leads with the inspect layer and the dependents
  query and surfaces the gate; it uses `api.resolve`, `api.decompose`, `api.dependents`,
  `api.submit` (to show the write path, never to write). It is a different USE, not a paint job.

A fat client supplies a `renderer` function in `view/clients/` and is registered with its
`tokens`. It still touches no truth field; the `api` object exposes no setter, so it cannot.

## What a renderer is handed

The host (`view/host.js`) builds the API once, selects the active client from the `#client=`
hash, applies the client's tokens as CSS custom properties, and calls the renderer:

```
renderClient(api, mount, client, { node })   // node: an optional entry id from #node=
```

The renderer reads through `api`, maps each node's `presentation.type` to a look via
`client.mapping`, and renders into `mount`. For a visual, it reads the node's
`presentation.data` and hands it to the mapped renderer (for example `selection-step` ->
`viz.searchlight`, fed the distribution and detection function). The card is handed the layout
and an already-rendered visual element; it never names either.

## The boundary, enforced

The linter (Phase E in `linter.js`) proves the boundary: a client file in `view/clients/` may
not name the store (`PRIMITIVES`, `CASE`, `ATLAS`, ...), build a registry, or reach a raw
resolver; a client descriptor carries only tokens + mapping; a thin client covers every kind;
no client names a kind outside the closed set. A new client of either tier cannot break a claim.

Build status for the client layer is graded in `docs/status-ledger.md` (Stage 0, [0.9]).
