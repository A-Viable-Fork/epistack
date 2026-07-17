---
Type: reference
Purpose: "The submission-decomposition contribution set: what is staged, the three registers, and the operator's one merge step on the Knowledge-Game side."
Depends on: []
Depended on by: []
---

# The submission decomposition: a contribution set for the competition community

This directory stages the judge-facing spine of the submission decomposed into typed claims of the
**epistack-competition** community, whose store lives in the public Knowledge-Game repository. This
epistack session cannot write to Knowledge-Game, so the output is a **contribution set**, not an
admission: gate-passed proposals plus the anchor maps that let any client render the documents with
their sentences live. Prose becomes a view over the graph.

## What is here

- `decomposition.js`: the decomposition itself as data, one row per claimed span (verbatim span, the
  assertion it carries, its register, its evidence or vocabulary reference, its dependence links). This
  is the reviewable source of truth; the tables in the pull request that carried it are generated from it.
- `bundles/<document>.bundle.json`: per-document contribution bundles (`api/contribution.js`), each a
  gate-passed proposal carrying its claim and dependence-link records, the gate receipt, and the
  `gate-passed, not admitted` status. Content-derived id; a tampered bundle is rejected on import.
- `anchors/<document>.anchors.json`: per-document anchor maps `{ document, content_hash, spans: [{ ref,
  register, anchor: { start, end, quote_key }, claim } ] }`. Each anchor is valid exactly against the
  recorded `content_hash`; the freeze makes it permanent. This is the interface contract a client renders
  documents live against, and the provenance bond from each claim back to (document hash, span anchor).

Regenerate with `node build/decomposition-build.mjs`; verify with `node build/check-decomposition.mjs`.

## Registers

- **Mechanical** claims (what the repositories do) enter `supported` and carry test-execution checking
  records naming the epistack checks that ground them; the gate grades them to `checked`.
- **Evaluative** claims (about the world and the argument) enter bare at the floor, `asserted`.
- **Constitutive** spans (definitions) mint no new claim: they anchor to the existing vocabulary-kernel
  claim that already holds the definition, and dependence links (`depends-on`) carry each claim's use of
  a defined term to that definition, so a definition's blast radius is computable.

Attribution is structural: every claim's `source_id` is the epistack document it transcribes
(`S-epistack-protocol-spec` for mechanical, `S-epistack-submission-argument` for evaluative), and the
work is credited as a transcription, per the transcription section of `docs/knowledge-kernels-and-crypto.md`.

## The operator's one merge step

To admit these into the competition community, on the **Knowledge-Game** side:

1. Copy the claim and link records from `bundles/*.bundle.json` (the `proposal` field of each) into the
   `epistack-competition` community's store, or feed each bundle through that community's own gate.
2. Its CI re-runs the gate over the patch; admission is the community's act. The anchor maps travel with
   the store so a client can render the epistack documents with their sentences live.

Admission is the target community's act and semantic acceptance is its members'; nothing here asserts
either. Decomposition choices are themselves contestable through the normal path: a span typed wrongly,
a definition mis-referenced, or a claim that should have been split is a contest or a fork like any other.
