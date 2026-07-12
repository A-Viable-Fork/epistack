---
Type: reference
Purpose: The producer workflow for structured data and datasets: the deterministic pipeline from a tabular source to measurement-typed proposedClaims landing at the built gate, the one producer workflow that need not use a model, and the clean contrast to the messy video.
Depends on: docs/workflow-atlas.md, docs/api.md, docs/producer-connector-findings.md
Depended on by: nothing
---

# Producer Workflow: Structured Data and Datasets

*Source shape: a CSV or a queryable dataset. The clean contrast to the spoken debate: fully deterministic, no model in the loop.*

## The source

A tabular source, a CSV or a queryable dataset, where each row or query result already carries a measured quantity with a clean provenance. This is the cleanest possible path to the gate, and the one producer workflow in the atlas that need not use a model at all. Where the video pipeline extracts messy claims from speech with a frontier model, this one maps clean rows to claims with a deterministic script, and that is why it is the contrast: the same gate lands both, and the difference is entirely in the periphery above it.

## The pipeline

1. **Read the tabular source.** A script reads the CSV or queries the dataset, deterministic, with no model in the loop. Provenance captured: the row identity or the exact query that produced each value. Register: built-assembly, a deterministic script.

2. **Map to measurement-typed claims.** The script maps each row or query result to a measurement-typed `proposedClaim`, carrying the row or query as its citation. The typing here is mechanical, because the source is already structured: a measured value maps to a measurement-typed claim without a model deciding what kind of thing it is. Register: built-assembly.

3. **Emit and land.** Each claim lands through `propose` or the MCP producer tool. Register: built. A measurement-typed claim that cites a real value grounds to the measurement floor; one that over-declares is demoted at the gate exactly as any other producer's claim is.

A landed claim from this source, using only the real fields:

```
{
  statement: "Mean egg mass in the sample is 58.2 grams",
  kind: "claim",
  declared_grade: "checked",
  citation: "usda-egg-dataset/row-4417"
}
```

## What it proves

A producer can be fully deterministic. There is no model to hallucinate structure, no extraction to audit, no speaker to attribute: a script reads a value and a claim carrying that value lands at the gate. This is the clean end of the producer range, and it demonstrates that the measurement floor connects to actual data rather than to a description of data. The gate that grades a demoted over-declaration from a messy debate grades a clean measurement from a dataset the same way, so the two workflows meet at one terminus from opposite ends of the reliability range.

## The register of each stage

The extraction here is built-assembly, not example: a deterministic script composing over the source needs no external model, which is exactly what makes this the clean contrast to the video pipeline. Read and map are assembly a producer writes; the landing is built, `propose` and the MCP producer tool, graded in `docs/status-ledger.md`. Every stage above the gate is periphery a producer supplies. The gate it lands at is built.
