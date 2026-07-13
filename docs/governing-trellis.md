---
Type: reference
Purpose: The repository's governing trellis: the constraint hierarchy any state of the repo must hold, each with its real enforcement status derived from the check suite, as the parent the design axioms are the code-layer instance of.
Depends on: docs/coordination-layer-spec.md, docs/design-axioms.md, docs/sorry-ledger.md, docs/status-ledger.md
Depended on by: nothing
---

# The Governing Trellis

*The trellis self-hosted. The method that built this repository, deposited back into the repository as its own governing kernel, checked by the same suite it governs. Tier 0 is non-negotiable; Tier 1 is a strong default that significant evidence can revise. Every enforcement claim below is derived from a read of the named check, not from expectation.*

## The externalize-shore-internalize loop

The trellis externalized to the repository is its public state: the commits, the compost of killed approaches (`docs/exclusion-reservoir.md`, `docs/compost-ledger.md`), and the open obligations (`docs/sorry-ledger.md`). A Shore reads that externalized state and reconciles the constraints against it. This document is the internalization: the trellis deposited back as the repository's own governing kernel, enforced by the same checks it governs. The method that built the repository is the method the repository is governed by.

This trellis is the parent of `docs/design-axioms.md`. The axioms are the code-layer instance of these constraints, stated at the grain of modules and imports; this document states the whole governing constraint set, at the grain of the repository, and points to the axioms for the code tier rather than restating them.

## Enforcement statuses

Each constraint carries one status, meaning exactly what it says and no more.

- **Checked.** Mechanically enforced today by a named oracle in `build/` or by `linter.js`. The oracle was read, not inferred from its name.
- **Prose-specified.** A real governing constraint enforced by discipline, not yet by machinery. Carried as a sorry in this trellis's own ledger below.
- **Deferred.** Enforcement is the coordination layer's participant economy (standing dynamics, tolls, opposed-role staffing, decay), specified and not built. Its home is `docs/coordination-layer-spec.md`, consistent with the status ledger's Stage 4.

## Tier 0: non-negotiable

**G0-1. One trust boundary, one direction of dependency.** The repository has a single trust boundary: `kernel/` is the trusted core and imports only `kernel/`; `api/` is the sole membrane; `periphery/` reaches the kernel only through `api/`; `corpora/` is data imported by nothing; `build/` may reach any layer. **Checked** by `build/check-map.mjs`, which derives the real import graph and fails on any cross-boundary import, and by `linter.js` rule 4 (no DOM in `kernel/` or `api/`, no `periphery` module importing `kernel` directly). Code-layer instance: design axioms T0-2.

**G0-2. One schema, one source of truth.** The claim and link shape lives in one place, `kernel/schema/`, imported everywhere a record is created, validated, or read; no module hand-rolls a parallel structure. **Checked** by `linter.js` rules 1 and 2 (every node carries its kind's required fields; every reference resolves) and by `build/check-gate.mjs`, which asserts the v3 records' exact fields and allowed values against the one canonical form. The drift guard is those field and reference rules; the single-definition clause is held by G0-1 keeping the schema inside `kernel/`. Code-layer instance: design axioms T0-1.

**G0-3. Gaps are first-class and ledgered.** Every unverified node carries an explicit `sorry` or `TODO_verify` marker, and every marker is listed in `docs/sorry-ledger.md`. **Checked** by `linter.js` rule 3 (every marker appears in the ledger and every ledger entry has a live marker) and by `build/check-gaps.mjs`, which runs the gap detector over the real cases, reproduces the sorry-ledger structural markers, adds no false ones, and asserts the detector ranks nothing. Code-layer instance: design axioms T0-5.

**G0-4. Grounding is earned at the gate, never asserted.** A claim's standing is a deterministic function of its structure: declared grade never exceeds earned grade, and standing above supported is earned only on independent corroboration. **Checked** by `build/check-gate.mjs`, which runs the gate acceptance suite phase by phase over the canonical form, the records, the confidence order, and the reference tables, asserting determinism and the declared-versus-earned rule.

**G0-5. The crossing strips standing; the untyped type launders nothing.** A claim crossing a kernel boundary arrives untyped and grounds nothing until an owned fork re-types it, except where both kernels pin the same type-hash, in which case the crossing is native and lossless. **Checked** by `build/check-crossing.mjs` (a same-hash claim crosses native and lossless; an unpinned claim arrives untyped and grounds nothing; a fork restores standing) and by `build/check-type-hash.mjs` (the type-hash is deterministic and meaning-sensitive, so no two distinct type meanings share a hash by accident).

**G0-6. The argument graph is symmetric and its code graph agrees with the imports.** Every document's `Depends on` edge carries its `Depended on by` backlink and the reverse, and every declared code edge is a real cross-directory import. **Checked** by `build/check-docs.mjs`, which checks the authored argument chain for symmetry (the dangling-citation guard, the documentation analog of the contamination the kernel forbids) and the derived code chain for agreement with the real imports.

**G0-7. The deliverable opens standalone.** The build emits one file that runs from `file://` with no server, no network call, and no runtime dependency a browser lacks. **Checked** by `linter.js` rule 7 (the built artifact opens from `file://` and reaches interactive with no console error). Code-layer instance: design axioms T0-6.

## Tier 1: strong defaults and standing rules

**G1-1. Perturbation is computed from the support graph, pinned to the authored cascade.** A flipped assumption removes the support it grounds and the collapse propagates along support edges only, checked against the authored ground truth. **Checked** by `build/check-perturb.mjs` (propagation along support edges only, no collapse a lost support does not force; a mismatch stops and reports). Code-layer instance: design axioms T1-3.

**G1-2. The built-versus-specified line is a standing rule.** Build status is asserted in exactly one place, `docs/status-ledger.md`, and prose elsewhere cites a ledger entry rather than restating a maturity claim. This is the discipline that keeps the specified frontier from leaking into the built core's warrant. **Prose-specified.** No oracle enforces that a maturity claim lives only in the ledger; the rule is held by discipline and by the review that moves a ledger line on the same merge that builds the thing it grades. Carried as sorry SG-1 below. It does not belong in `docs/sorry-ledger.md`, which tracks node-level code markers, not a governance discipline.

**G1-3. Standing is forkable; captured standing is recoverable.** Standing crosses a boundary only by an owned fork, and misassigned or captured standing can be forked away from and revoked. The fork-confers-standing half is **Checked** by `build/check-crossing.mjs` (a fork adopting the type is what restores standing, so non-adoption is safe rather than broken). The capture-recovery and revocation half is **Deferred**: it is a participant-economy function whose enforcement is the coordination layer, specified and not built in `docs/coordination-layer-spec.md`.

## The participant economy: the deferred frontier

The governing functions above reduce to the gate applied to their objects, and each has a check. The functions that do not reduce to the gate are the participant-economy functions: how standing accrues in elapsed time, how it decays with inactivity, how tolls price gaming against contribution, and how opposed verifier and red-team roles are staffed by unsteerable draw. These are the coordination frontier. **Deferred**, with `docs/coordination-layer-spec.md` as their home and the status ledger's Stage 4 as their build status. This trellis names them so the boundary between what the checks enforce and what the frontier owes is legible, not so it claims them as held.

## This trellis's own ledger

The governing trellis holds its own open obligations, the same discipline it enforces on the code.

| Sorry | Obligation | Status |
|---|---|---|
| SG-1 | The built-versus-specified standing rule (G1-2) is enforced by discipline, not machinery: no oracle asserts that a maturity claim lives only in the status ledger. Prose-specified; a linter pass that flagged a maturity verb outside the ledger would move it to Checked. | Open |
| SG-2 | The capture-recovery and revocation half of forkability (G1-3) is specified in the coordination layer and not built. | Deferred to `docs/coordination-layer-spec.md` |

## Relationship to the design axioms

`docs/design-axioms.md` is this trellis at the code tier: T0-1 through T0-6 and the linter rules are the module-and-import instances of the constraints above, and this document points to them rather than restating them. The governing trellis is their parent, stating the whole governing constraint set at the grain of the repository; the axioms state its code tier at the grain of modules and imports.
