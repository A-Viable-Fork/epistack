# The thin-client kit

A thin client is the five-minute fork: one declarative manifest that restyles what the API
returns. No engine code, no API code, no view module. You read this and `docs/api.md`, run one
command, edit a file, and ship a client that renders the whole map. For the heavier path (a
different USE of the map, leading with a different operation), write a fat client against the
API directly, per `docs/clients.md`.

The one rule holds for every client: **read through the API, submit through the gate, never
touch the store.**

## A thin client is one manifest

A manifest is a JSON file in `clients/`:

```json
{
  "id": "client.<name>",
  "kind": "client",
  "tier": "thin",
  "title": "<shown in the gallery>",
  "tokens":  { "--paper": "#fff", "--ink": "#111", "--lamp": "#2f6df0", ... },
  "mapping": { "<node kind>": { "layout": "<layout>", "visual": "<visual or none>" }, ... }
}
```

- **`tokens`** are CSS custom properties. Editing tokens only is a **reskin**.
- **`mapping`** names, for every node kind, a layout and a visual from the palette. Swapping a
  mapping entry is a **re-present** (for example, render `selection-step` as a static figure
  instead of the live searchlight).
- A manifest may **fork** another: `{ "id": "client.warm", "forks": "client.plain",
  "overrides": { "tokens": { ... } } }` inherits the mapping live and changes only the tokens.

The mapping must cover **every** node kind. Run `api.kinds()` or read the list in
`docs/clients.md`. A manifest that misses a kind, or names a layout or visual not in the
palette, fails validation loudly in the gallery and renders nothing broken.

## The palette

The layouts and visuals a thin client may choose among (`data/clients/palette.js`):

**Layouts**

| id | what it renders |
|---|---|
| `teaching` | the learning-first card: hook, intuition, the communicated math, the visual, the break as a scenario, the stakes, and a see-the-precise-version disclosure |
| `terse` | a compact card; a primitive shows as a walled citation, an observation/prediction/comparison as its world-fact or test |

**Visuals**

| id | what it renders |
|---|---|
| `viz.searchlight` | the interactive swept searchlight; consumes a selection-step's distribution + detection data |
| `viz.selection-static` | a static-figure variant of the searchlight (no slider); same data |
| `none` | no visual |

## The five-minute walkthrough: build `client.blueprint`

This is exactly how `clients/blueprint.json` was made. No engine, API, or view file was touched.

1. **Scaffold.** Start from a working copy of the default:

   ```
   node build/new-client.mjs blueprint
   ```

   This writes `clients/blueprint.json`, pre-filled with the default tokens and a mapping that
   already covers every kind. It is valid and renders the whole map immediately.

2. **Reskin.** Open `clients/blueprint.json` and edit `tokens` to a cool navy palette with a
   cyan accent (`--paper` to `#0e1c2b`, `--lamp` to `#38bdf8`, and so on). Tokens are the only
   thing a pure reskin changes.

3. **Re-present one kind.** Change the `selection-step` mapping entry's `visual` from `"none"`
   to `"viz.selection-static"`. Now the representativeness step renders the static figure
   instead of the swept searchlight. Everything else is inherited from the scaffold.

4. **Build and preview.**

   ```
   node build/bundle.js
   ```

   Open `v1.html#client=blueprint` (or `v1.html#client=blueprint&node=pipe.stage1`). The whole
   map renders in the new skin. Share the link; it is the client.

That is the entire authoring path. If anything in it forced you to edit code below the
manifest, that is a bug in the kit, not in your client; report it.

## Sharing

A thin client is a self-contained, forkable unit: a validated manifest in `clients/`, shareable
as a hash link (`v1.html#client=<name>`). Drop a manifest into `clients/`, rebuild, and the
gallery picks it up with no other change. Fat clients live alongside as modules against the API.

Build status for the client layer and this kit is graded in `docs/status-ledger.md` (B8, B9), not
asserted here.
