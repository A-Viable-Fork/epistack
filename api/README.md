---
Type: reference
Purpose: Describes the boundary layer for a reader who has opened api/, deferring the whole-system story upward.
Depends on: nothing
Depended on by: nothing
Code depends on: kernel/README.md
Code depended on by: periphery/README.md
---

# api/

This is the boundary: the sole membrane between the trusted core and everything fallible around it. It is the contract through which the periphery reads grounded claims and proposes new ones, and it is the only path by which anything enters the kernel.

## What it is responsible for, and what it may never do

It is responsible for holding the boundary real: exposing the kernel's reads as open operations, routing every write through the gate, and presenting one stable contract so a periphery can be built, swapped, or replaced without the kernel moving. That swappability is its whole job; it is what makes peripheries interchangeable over one core.

It may never let the periphery reach past it. It never hands out a way to touch the store directly, never lets a proposal skip the gate, and never lets a caller mutate a truth field. A read returns a derived value; a write is a proposal the gate decides.

## What it exposes, and what it depends on

Upward, it exposes reads (`resolve`, `decompose`, `compare`, `dependents`, `gaps`, robustness, reconciliations) that return derived readings and never a mutable handle, and one write, `submit`/`propose`, that carries a claim to the gate and returns its receipt. The provider seam (`providers/`) lets the same contract serve a local in-process kernel or a remote one without the caller changing.

Downward, it depends only on `kernel/` (and on `api/` itself). It never imports the periphery; the arrow runs one way, `periphery -> api -> kernel`.

## The invariant it enforces

Read through the contract, propose through the gate, never touch the store. Everything above obtains grounding only by reading, changes the graph only by a gated proposal, and holds no reference that would let it write directly. The membrane is where trust is subtracted, so the contract is where the protocol holds.

## What lives here

- `api.js`, `client-api.mjs`, the entry contracts consumers call.
- `read.js`, the open reads over the kernel.
- `propose.js`, `compose.js`, `fork.js`, the gated write and composition paths.
- `subscribe.js`, notification when a relied-on claim changes.
- `credential.js`, `export.js`, the standing seam and the serialization out.
- `providers/`, `local-provider.mjs` (the real gate in process) and `remote-provider.mjs` (the same contract, a stub, touching no kernel).

---

For the whole-system argument, see the top-level [`README.md`](../README.md) and the judges document [`docs/what-stands-without-trust.md`](../docs/what-stands-without-trust.md); the read-and-propose contract is documented in [`docs/api.md`](../docs/api.md). For how to work in this tree, see the agent orientation in [`CLAUDE.md`](../CLAUDE.md).
