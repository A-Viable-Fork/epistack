---
Type: reference
Purpose: "The producer workflow for live web and news: the pipeline from a current web page to a proposedClaim landing at the built gate, and the point it proves, that low-reliability input enters freely and earns little because the floor does real work."
Depends on: [docs/workflow-atlas.md, docs/api.md, docs/producer-connector-findings.md]
Depended on by: []
---

# Producer Workflow: Live Web and News

*Source shape: fast-moving, mixed-reliability web pages and news. The workflow that shows the floor doing its job.*

## The source

Current web pages and news reports: a source that moves fast, mixes reliability freely, and carries claims that are mostly estimates and contested judgments rather than measurements. This is the input a naive store would either flood with or refuse. The kernel does neither: it admits the flood and grounds almost none of it, because a claim earns the grade its structure supports and news structure rarely supports much.

## The pipeline

1. **Fetch.** A search-and-fetch step over current pages retrieves the source text, capturing the URL and the access date. Name the tool honestly: this is an off-the-shelf fetcher, not a kernel capability. Provenance captured: source URL and access date on every fetched page. Register: example, current tooling.

2. **Extract candidate claims.** A frontier model reads the fetched text and emits candidate claims, each carrying its source URL and date. Provenance captured: URL and date on every candidate. Register: example, current tooling.

3. **Type each candidate.** The model types each candidate against the kernel's kinds and grades. This is the load-bearing stage, and its result is the point of the workflow: most news claims type low. A news report is an estimate or a contested judgment far more often than a measurement, so most candidates declare a low grade honestly, and the few that cite a real measurement declare higher and are checked for it at the gate. Register: example, current tooling.

4. **Emit and land.** Each typed candidate becomes a `proposedClaim` and lands through the MCP producer tool or `propose`. Register: built. The gate admits each at the grade its typing earns, and a candidate that declares more than it supports is demoted at the gate.

A typical landed claim from this source, using only the real fields:

```
{
  statement: "Analysts expect the policy to raise prices modestly",
  kind: "claim",
  declared_grade: "attributed",
  citation: "https://example.com/report @ 2026-07-10"
}
```

## What it proves

The floor does real work. Low-reliability input enters the graph freely and simply earns little, which is the gate protecting the graph from a flood of weak assertion without refusing the assertion. Nothing is turned away at the door; a weak claim is admitted and grounds nothing, sitting near the floor where a reader sees exactly how little it carries. This is the difference between a gate and a filter: a filter refuses input and forces a producer to argue for entry, while the gate admits input and lets the grounding rule decide what it is worth. A flood of news becomes a floor of weakly-grounded claims, legible as weak, rather than a wall of refusals or a store quietly polluted by volume.

## The register of each stage

Fetch, extract, and type are the example register: off-the-shelf tools this submission does not build or vendor. The landing is built: `propose` and the MCP producer tool are the write anchor, graded in `docs/status-ledger.md`. Every stage above the gate is periphery a producer supplies. The gate it lands at is built.
