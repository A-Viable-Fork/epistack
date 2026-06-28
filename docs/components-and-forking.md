# Components, References, and Forking

*One mechanism for two things you want: change a module once and have it propagate everywhere, and let people fork a component without touching the rest. Both fall out of a single rule: everything is addressable by a stable id and referenced, never copied inline. Propagation is then free, because consumers hold references. Forking is then cheap, because a fork is a diff against a parent. This is the composition claim made operational, and it is departures-as-coordinates turned into a runtime.*

---

## The one rule

Every shared thing, a primitive, a transformation, an atlas entry, a card layout, a visual, a teaching block, lives once at a stable address and is referenced by that address. Nothing that is shared is duplicated inline.

Two consequences:

- **Propagation is free.** Change the definition at an id and every reference resolves to the new version. There is no second copy to update.
- **Forking is a diff.** A fork is a new id that names a parent and lists only its overrides. It inherits everything else by reference, so the shared basis stays live and improvements to the parent flow into the fork for everything the fork did not override.

A fork is its departure from a parent. The parent is the shared basis. The same metric that measures the distance between two cases now governs how a component diverges from the thing it forked.

---

## The resolver

A single resolver sits under everything: `resolve(id)` returns the merged component. All data and all presentation lookups go through it.

```
resolve(id):
    c = registry[id]
    if c.forks:                       # live fork
        return merge(resolve(c.forks), c.overrides)
    if c.copy_of:                     # snapshot fork
        return c.frozen
    return c
```

`merge` overlays the fork's overrides field-by-field onto the resolved parent. A fork that overrides `explain.intuition` and nothing else gets the parent's math, children, role, and everything else, current.

Two fork flavors, chosen per fork:

- **Live** `{ id, forks: parentId, overrides: {...} }`. Inherits the parent by reference. Parent fixes propagate into the un-overridden fields. This is the default, and it is what keeps the map coherent as it grows.
- **Snapshot** `{ id, copy_of: parentId, at: version }`. Frozen at a version. Propagation stops; the fork is on its own. Use it when you need the parent not to change under you.

---

## What is forkable

The same mechanism covers data and presentation. Every kind below is addressable, resolvable, and forkable.

- **Data.** Primitives (the floor), atlas entries (the abstract patterns), nodes and transformations, whole cases.
- **Presentation.** Card layouts, visuals (the searchlight), teaching blocks (the `explain` field).

Forking a node to improve its teaching, forking a visual to render it differently, forking a case to make a new one, forking a primitive to a stricter version, all the same move: new id, name the parent, list the overrides.

---

## Visuals are embeddable components

A node does not contain a visual. It references one and passes parameters.

```
"pipe.stage1": {
  ...,
  visual: { component: "viz.searchlight",
            params: { sigma: 0.085, marker: 0.68, markerLabel: "the market" } }
}
```

`viz.searchlight` is a registered component. The renderer resolves it and hands it the params. Any node with a detection-or-selection shape reuses it by reference; change `viz.searchlight` once and every node using it updates. Fork it, `viz.searchlight.heat` forks `viz.searchlight` and overrides the render to a heatmap, and point a node's `component` at the fork. The searchlight built for stage 1 is now infrastructure, not a one-off.

---

## The blast radius is visible

Because everything is referenced, the resolver can answer the question that makes changing a shared module safe: what uses this. The back-references already tracked for primitives generalize to every component.

- Before editing a shared definition, query its dependents and see exactly where the change will land.
- When a change should reach everyone, edit the definition.
- When a change should reach only you, fork by diff.

Both motions are legible. Propagate-to-all and propagate-to-just-mine are the same system seen from two sides, and you can always see the reach before you act.

---

## The worked case: the clunky intuition

The phrasing you flagged is the canonical fork.

1. `pipe.stage1.plain` forks `pipe.stage1`, overrides `explain.intuition` with the cleaner sentence, inherits everything else live.
2. Point your build, or your reader's path, at the fork. Only the intuition changed; the math, the children, the searchlight, all current.
3. If the rewrite is good, merge the override into `pipe.stage1` itself. It now propagates to every case that references stage 1.

Fork to change one thing for yourself. Merge to change it for everyone. A contributor who has never seen the rest of the map can improve one node's teaching and have it compose cleanly, which is the whole point of the substrate.

---

## How this maps onto v1

v1 already has data modules, an engine, and a view, and it already resolves children and atlas refs by id. Three changes make forking real.

1. **Route every lookup through one resolver** that understands forks (merge parent plus overrides). Today the engine reads `registry[id]`; it should read `resolve(id)`.
2. **Make presentation forkable too.** Register card layouts and visuals by id. A node references a visual by id and params. The renderer resolves them instead of hardcoding.
3. **Add the fork descriptor and the dependents query.** Extend the linter to enforce reference-not-inline (nothing shared is duplicated) and fork resolvability (every `forks` and `copy_of` resolves, no cycles).

The build does not change shape: it still inlines to one standalone artifact. A fork is a small overlay file the build merges through the resolver. For a live, collaborative version the resolver runs at runtime; for the submission, resolving at build time is enough.

---

## The floor on what earns an address

Not everything should be a component, and over-addressing is its own failure. The floor principle applies: a thing earns a stable id when it is shared or likely to be forked. Purely local, one-off content stays inline. A registry full of single-use ids is noise, the same way a decomposition past its floor localizes nothing. Addressable if shared or forkable; inline otherwise.

---

## Build order

- **v2a, propagation.** The resolver and the reference discipline and the dependents query, before any forking. Make every lookup go through `resolve()`; the linter enforces no inlined duplication of a shared component. This alone delivers change-once-propagate-everywhere.
- **v2b, forking.** The fork descriptor, live and snapshot. `resolve` merges parent and overrides; the linter checks resolvability and the absence of cycles. This delivers fork-a-component.
- **v2c, presentation as components.** Register card layouts and visuals by id; nodes embed visuals by reference. This makes the UI forkable, the searchlight reused and forked like any data component.

The teaching-layer authoring then rides on this for free: an `explain` block is a forkable field, so a contributor improves one node's teaching by forking that field and nothing else, which is exactly the workflow your phrasing fix wants.
