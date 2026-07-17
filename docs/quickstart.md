---
Type: reference
Purpose: "Tells a reader how to clone, install, and run the gate check, as the entry procedure."
Depends on: [docs/api.md, docs/design-axioms.md]
Depended on by: []
---

# Quickstart

Clone, install, and watch the gate check run. The whole path completes in about two minutes on a
laptop, and it needs nothing a browser and a recent Node do not already give you.

## Requirements

- Node 20 or newer (the kernel is plain ESM, zero runtime dependencies).
- A modern browser, only for the last step. No server, no network call.

## Clone and install

```
git clone <repository-url> epistack
cd epistack
npm ci || npm install || true    # there is no dependency to fetch; this is a no-op you can skip
```

The kernel, the gate, and every oracle are dependency-free `.mjs`, so there is nothing to build
before you can run them.

## Run the gate check

The gate is the one write path: a claim is admitted only when it holds together with what is already
there. This check runs the v3 gate kernel over its fixtures and the three migrated cases, headless.

```
node build/check-gate.mjs        # the intake gate: canonical form, earned grade, apply, verify
node build/check-migrate.mjs     # the three cases migrated to v3; grounding reproduced
```

Each prints its sections and ends in `OK`. Together they finish in seconds. To run the whole suite
the way CI does:

```
node linter.js                   # fields, references, the sorry ledger, the trust boundary
node build/check-gaps.mjs        # the gap detector reproduces the sorry ledger
node build/check-gate.mjs
node build/check-translate.mjs
node build/check-migrate.mjs
node build/check-client.mjs
node build/check-robustness.mjs
node build/check-characterized-gaps.mjs
node build/check-composition.mjs
node build/check-registers.mjs    # the two registers held together: counterpart, links, delta, grounding under both
node build/check-map.mjs          # derives the import graph, enforces the trust boundary
```

The checks themselves finish in seconds; the clone, the install no-op, and this full pass together
fit inside about two minutes on a laptop. Every line ends in `OK` or the run stops.

## Open the artifact

The deliverable is one self-contained file. Build it and double-click it, no server involved.

```
node build/bundle.js             # inlines kernel + api + corpora + periphery into submission.html
```

Then open `submission.html` from the file system. The in-page compose-gate runs the same kernel the
oracles just checked, vendored offline, so the composition you see in the browser is byte-for-byte the
logic that passed headless.

## Where to go next

- The argument the engine makes: [`what-stands-without-trust.md`](what-stands-without-trust.md).
- The three cases as data: [`../corpora/`](../corpora/).
- What is built and what is still open: [`status-ledger.md`](status-ledger.md) and
  [`sorry-ledger.md`](sorry-ledger.md).
