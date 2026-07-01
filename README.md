# A Typed Substrate for Navigating Knowledge

*A typed claim-graph epistemic engine. Every claim carries its type, its verification state, and its provenance, so that uncoordinated investigations can accrete onto one navigable map instead of each starting from nothing.*

Working repository name: `typed-substrate`. Rename freely.

## What this is

Most tools that survey a question return prose. This returns a typed graph. A claim is a node with a kind, a verification state, and a path back to what supports it. Derivations are stored as their own structure, decomposed until each leaf is a named primitive that is cited rather than re-derived. Where two investigations reach the same transformation, the map records the shared pattern and the point where the two diverge, and that divergence is the valuable information.

The central claim is composition: because every node speaks one typed schema, two investigations with disjoint sources can be merged mechanically, with no model in the loop, onto one map. The submission demonstrates this on three cases chosen to fail differently from each other, a confident answer over complex evidence, a curated debate that the engine prices and refuses rather than resolves, and a mundane statistic that is contested for a precise structural reason.

**Start here.** The orientation for the whole goal is the three blueprints in `docs/`: `knowledge-system-what.md` (the functions), `knowledge-system-how.md` (the makeup), and `knowledge-system-why.md` (the rationale). For the competition-facing summary, read `docs/judges-document.md`. Build status for every component is graded in `docs/status-ledger.md`.

## Status

Active development, prepared for the FLF EpiStack competition. The engine, the case data, and the build are under construction; open obligations are tracked honestly in `docs/sorry-ledger.md`, including deferred verifications that are marked in the data rather than quietly resolved.

## Quick start

The deliverable is a single self-contained file that opens in any modern browser.

```
# open the built artifact directly
open submission.html

# or rebuild it from modular source
node build/bundle.js      # inlines data + engine + view into submission.html
node linter.js            # checks fields, references, the sorry ledger, layer boundaries
```

No server, no network call, no install beyond a browser. The in-browser compose-gate runner loads its own runtime.

## Architecture

The code makes the same commitments the system makes about knowledge: typed, decomposed to a shared basis, gaps named, forkable. The design axioms are in `docs/design-axioms.md` and are binding.

One trust boundary, crossed only through a membrane. `kernel/` is the trusted core, pure logic with no DOM, so it runs headless for the gate and the linter; it imports only `kernel/`. `api/` is the sole membrane; it imports the kernel and nothing in the periphery. `periphery/` is the fallible layer, every AI component and every render surface, and it reaches the kernel only through `api/`. `corpora/` is pure data, imported by nothing. A new case is a folder under `corpora/`, never an edit to the kernel. See `docs/knowledge-system-how.md` for the boundary and `docs/design-axioms.md` (T0-2).

```
kernel/     schema/ (lattice, the one schema), store, grounding, gate, analysis, motions
api/        api.js (the membrane): open reads, gated write
corpora/    _shared/ (units, bodies, atlas), _primitives/, lhc/ population/ ... (pure data)
periphery/  navigate/ (render, clients, fat) + ingest/ author/ assess/ query/ redteam/ filter/
build/      bundle.js -> submission.html ; check-gaps, check-perturb, check-map
docs/       knowledge-system-{what,how,why}, judges-document, status-ledger, design-axioms, corpus-index, sorry-ledger
```

## Methodology

The work runs on a few commitments that show up in both the research and the code. The distinction between generating a claim and verifying it is treated as primary, and every node states which it has had. Negative results are first-class: a dead approach is removed but its death is recorded with the condition that would revive it. Open obligations are written down rather than hidden. The unit of progress is the named gap, not the confident resolution.

## AI and human collaboration

This project was developed in sustained collaboration with AI systems, primarily Claude, with a second system used for adversarial review. The division is deliberate and is itself part of the method. The human directs the research: the framing, the design decisions, the judgments about what survives scrutiny, and the verification. The AI systems assist generation, drafting, decomposition, and implementation. The engine's own insistence that a claim's verification state and provenance travel with it is the same discipline applied to its construction.

## License

Licensed under the GNU Affero General Public License, version 3 (see `LICENSE`).

AGPL is a deliberate choice, not a default. It is the license whose copyleft reaches network use: anyone who runs a modified version as a service must offer the source of that modified version to its users. For a map intended to be a shared public good that others may host and extend, that is the legal form of the same commitment the system makes against capture. A more capable operator can fork it; it cannot fork it and close it.

Add this notice to the top of each source file, choosing the year and author:

```
A Typed Substrate for Navigating Knowledge
Copyright (C) 2026  <your name or handle>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```

For AGPL-3.0-only rather than or-later, replace the third paragraph with: "under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation." (No "or any later version.")

## Citing

See `CITATION.cff`, or cite as: `<author>, "A Typed Substrate for Navigating Knowledge," 2026, <repository URL>.`

## Forking and contributing

The map is built to be forked. A new case is a data file under `data/cases/` conforming to the schema in `data/schema.js`; the linter enforces the schema and the layer boundaries. The design axioms explain what to keep invariant. Because of the license, public forks and hosted modifications carry the same source-availability obligation, which is the point: the map stays open as it grows.

The lightest fork is a **thin client**: one declarative manifest that restyles what the engine returns, no code below it. Run `node build/new-client.mjs <name>`, edit the tokens and the kind-to-look mapping in the generated `clients/<name>.json`, rebuild, and open `v1.html#client=<name>`. Community manifests live in `clients/`; each is validated at build and at render, so a manifest that misses a kind or names a layout the palette does not have fails loudly instead of rendering broken. The full authoring path is `docs/thin-clients.md`. For a client that uses the map a genuinely different way, write a fat client against the API per `docs/clients.md`.
