# EpiStack Design Axioms

*Design guidelines for the codebase, in the trellis tier form. The thesis: the code eats its own dog food. The system is about typed knowledge decomposed to a shared basis, with departures localized and gaps named, forkable so uncoordinated work can accrete. The codebase makes the same commitments about itself. Tier 0 is non-negotiable; violating it means the code has failed its own thesis. Tier 1 is a strong default that significant evidence can revise. Then the linter rules that enforce them, the patterns excluded with reactivation conditions, and the comment conventions.*

---

## Tier 0: non-negotiable

**T0-1. One schema, one source of truth.** The node schema lives in exactly one place, `data/schema.js`, and is imported everywhere a node is created, validated, or read. No module redefines a node shape, duplicates the field list, or hand-rolls a parallel structure. This is the shared-basis principle applied to the code: the schema is the coordinate system, and a coordinate system with two definitions is two systems. Departures from the schema are made by changing the one definition, never by local divergence.

**T0-2. One trust boundary, crossed only through the membrane.** The primary axis is the trust boundary, and purity survives as the direction of dependency: a one-way flow across a single gate. `kernel/` is the trusted core, pure logic with no DOM reference, no `window`, no `document`, so it runs headless for the gate and the linter; it imports only `kernel/`. `api/` is the sole membrane; it imports `kernel/` (and `api/`) and nothing in the periphery. `periphery/` is the fallible layer, every AI component and every render surface; it reaches the kernel only through `api/`, never `kernel/` directly. `corpora/` is pure data imported by nothing (a corpus reference to another corpus is data, not a code import); `build/` may reach any layer. A DOM call in `kernel/` or `api/`, or a `periphery` module importing `kernel` directly, is a Tier 0 violation. The load-bearing property: no path imports `kernel` from `periphery` except through `api`, and `kernel` imports nothing outside `kernel`. `build/check-map.mjs` derives this from the real import graph and enforces it.

**T0-3. No hidden state.** State is explicit and passed, never reached for through a global or a mutable singleton. The graph is immutable data operated on by pure functions; perturbation is an overlay computed from a flipped-assumption set, not a mutation of the graph. The reason is the same reason the system refuses hidden provenance: a value whose origin you cannot point to is a value you cannot audit. No `localStorage`, no module-level mutable state shared across calls.

**T0-4. A case-family is a self-contained data module.** Each case, the LHC cascade, the population pipeline, the next one, is one data file the engine loads. Adding a case is writing a file. It never requires editing the engine, the view, or another case. This is the atlas-as-market principle in the code: the engine is the map, the cases are pulled subsets, and a new contributor adds an entry without touching the machinery. If adding a case forces an engine edit, the engine has a hardcoded assumption that belongs in the data.

**T0-5. Gaps are first-class.** Every unverified node carries an explicit `sorry` or `TODO_verify` field, every such marker is listed in `docs/sorry-ledger.md`, and the linter fails on a marker that is not in the ledger or a ledger entry with no marker. Nothing is silently incomplete. This is the sorry ledger as a build artifact: the honest unit of progress is the named gap, and the code states its gaps the way the research does.

**T0-6. The deliverable opens standalone.** The build emits one file that runs from `file://` with no server, no network call, no runtime dependency a judge does not already have in a browser. The Pyodide compose-gate runner loads in-browser. Modular source is the forkable thing; the single bundled artifact is the deliverable. Any dependency that breaks a double-click to open is excluded regardless of what it offers.

---

## Tier 1: strong defaults

**T1-1. The three motions are three modules over one node interface.** Decompose, perturb, and compare live in `decompose.js`, `perturb.js`, `compare.js`, each operating on the node interface from the schema, never entangled with each other. They correspond to the three structures in the architecture, and keeping them separate in the code keeps them separable in the head. Revisable if two motions turn out to share so much logic that the split costs more than it saves, which the stress test suggests will not happen.

**T1-2. Primitives are leaf data with citations, not implementations.** A floor node carries a citation and no children. The engine never re-derives a primitive; it points to the proof. This is the decomposition floor in the code: stop at the named basis, store the node, cite its source. A primitive that grows an implementation has either stopped being a primitive or leaked re-derivation into the engine.

**T1-3. Perturbation is authored data in v1, computed only when it earns it.** A flipped assumption looks up a stored, typed consequence; it does not run a simulation. The consequence is a fact in the data the renderer displays. The computed propagation engine is excluded until authored consequences exist for every case and a rule audit exists, because a wrong rule misleads silently and honest beats impressive.

**T1-4. Small units, one role each, decomposed to a floor.** A module is decomposed until each unit has one role and one reason to change, and then stopped. This is the floor principle for code: finer than that adds cost and localizes nothing. Composition over inheritance throughout; node kinds are a tag plus behavior selected by it, never an inheritance hierarchy. A unit with two reasons to change is two units; a unit split below its floor is noise.

**T1-5. Graph operations are pure functions.** Same input, same output, no side effects. This is what makes them testable, and the kill-it-where-failing-is-cheap discipline lives in those tests: a graph operation that cannot be tested in isolation is doing too much. Side effects live at the edges, in the view and the build.

**T1-6. Extensible sets are registries, not switch statements.** Terminal types, node kinds, and motions are registered in one place and looked up, so adding one touches the registry and a new file, not a switch buried in the engine. This is forkability at the seams: a new terminal type for a new domain is an entry, not a surgery.

**T1-7. Layer boundaries are documented contracts.** The interface between data and engine, and between engine and view, is written down the way the submission's machine contract is written down: what crosses, in what shape, with what guarantees. A change to a contract is a deliberate, visible act, not a silent drift.

---

## Linter rules

Concrete checks `linter.js` runs, in CI and via the linter agent. Each maps to a Tier entry.

1. Every node has the required fields for its kind. (T0-1)
2. Every `atlas_ref` resolves to an entry; every child id exists; every input and output id exists. (T0-1, T0-4)
3. Every `sorry` or `TODO_verify` marker appears in the ledger, and every ledger entry has a live marker. (T0-5)
4. No DOM reference in the trusted core (`kernel/`, `api/`); no `window` or `document`. No `periphery` module importing `kernel` directly (only through `api/`). (T0-2)
5. The decomposition graph is acyclic. Primitives have no children. Every leaf of a decomposition is a primitive with a citation. (T1-2)
6. No `localStorage`, no module-level mutable state shared across calls. (T0-3)
7. The built artifact opens from `file://` and reaches interactive with no console error. (T0-6)
8. Every module file has a head comment with role, contract, and the invariant it preserves. (comment conventions)
9. `docs/corpus-index.md` lists every module and data file; the linter flags a file not in the index.

---

## Exclusion reservoir

Patterns rejected, with the condition that would reactivate them. Dead, but recorded, because a kill without its reactivation condition is a kill you cannot revisit.

- **A framework with a dev-server-only mode.** Excluded: it breaks standalone-open (T0-6). Reactivate only if the build still emits a single file that opens from `file://`.
- **Computed perturbation in v1.** Excluded: silent-error risk (T1-3). Reactivate when authored consequences exist for every case and a rule audit exists.
- **Inheritance hierarchies for node kinds.** Excluded: rigidity, and it fights T1-4. Reactivate never; use a kind tag with composed behavior.
- **A global mutable store for graph or UI state.** Excluded: hidden state (T0-3). Do not reactivate.
- **Bundling that minifies or obfuscates the submission source.** Excluded: the source is the forkable artifact and a judge may read it. Reactivate never for the submission build; a separate minified build is fine if the readable one remains the deliverable.
- **Re-deriving a primitive in the engine to avoid a citation.** Excluded: it breaks the floor (T1-2). Do not reactivate.

---

## Comment conventions

Comments carry role and why, mirroring the node fields. The mechanics are in the code; the comment is for what the code cannot say about itself.

- **Module head, three lines.** Role, what this module is. Contract, what it takes and produces. Invariant, what it preserves that a caller relies on. This is the dual representation applied to code: the linguistic layer beside the mechanical one.
- **The load-bearing comment is the why, not the what.** Comment the invariant, the reason a thing exists, the way it would break, the same as `why_breaks` is the load-bearing node field. A comment that restates the code is noise; a comment that states the constraint the code is honoring is load-bearing.
- **Greppable markers.** `// SORRY:` for an honest gap, `// DEPARTURE:` for a deliberate divergence from a shared pattern, `// CONTRACT:` at a layer boundary. The honest gaps and the divergences are findable in the code the same way they are findable in the data.

---

## The HTML recode (complete)

The submission began as one file, `knowledge-game.html`, roughly 2900 lines mixing data, logic, and DOM. It was pulled apart into the structure above in one disciplined order, behavior-preserving extraction first, then the schema migration, then the v1 features, so that when something broke later it was legibly the addition and not the migration. That recode is done: the tree is now the trust-boundary layout, and the build reproduces the artifact from modular source (`build/bundle.js`). The original single-file artifact and the one-time extraction tool that sliced it (`build/extract.mjs`) have been retired now that nothing consumes them; both remain in git history at the commits where they were live, so the migration stays auditable.
