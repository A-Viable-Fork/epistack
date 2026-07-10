---
Type: record
Purpose: Records what the producer connector built, an MCP server exposing the propose contract as a schema-gated tool so an agent authors a claim through the same gate a human does, the producer-agnostic proof it carries, and that a live agent session and autonomous multi-claim orchestration are the named deferred depth the submission's thesis deliberately does not build.
Depends on: nothing
Depended on by: nothing
---

# The Producer Connector: Findings

The producer connector is the labor-side counterpart of the ingestion connector. Ingestion brings
material in; the producer connector lets an agent author grounded claims through the gate. It is the
direct payoff of producer-agnosticism: the kernel checks the claim, not the claimant, so an agent's
claim is graded by structure exactly as a person's is. This is the shallow-but-real version, one agent
authoring one checked claim through the tool, real and graded, including the case where it over-declares
and the gate demotes it.

## What was built

- `periphery/produce/propose-tool.mjs`: the MCP tool definition for authoring a claim. Its `inputSchema`
  is the propose contract's `proposedClaim` shape as a JSON Schema (statement and kind required;
  citation, contributor_id, declared_grade, supports optional), with `kind` constrained to the kernel's
  real kinds and `declared_grade` to the five real grade values, marked `strict: true`. The strict flag
  is the point: the schema compiles to a grammar the agent's tool call must satisfy, so a malformed claim
  cannot be emitted. This is the fix for agents-hallucinate-structure, a property of the schema.
- `periphery/produce/mcp-server.mjs`: a minimal MCP server. `tools/list` returns the propose tool;
  `tools/call` validates the agent's arguments against the strict inputSchema at the boundary and, only
  if they pass, drives them through `createClientApi(provider).propose`. It is the transport between an
  agent's tool call and the gate; it holds no grading logic.
- `build/check-produce.mjs`: the producer-agnostic proof, offline and deterministic.

The connector lives under `periphery/produce/` with its oracle at `build/check-produce.mjs`, mirroring
the ingestion connector's `periphery/ingest/` and `build/check-ingest.mjs`. Both producing surfaces are
periphery producers, fallible, reaching the gate only through the contract; the server imports the api
contract and never the kernel.

## The proof: structure by the schema, grounding by the gate

Because a live agent needs a running model, the proof simulates the agent's side deterministically:
well-formed `proposedClaim` objects, as a strict-tool-use agent would emit, driven through the server's
tool-call handler into the real gate. It verifies three things, and the division between them is the
whole point.

1. **Producer-agnostic grading.** A well-formed claim through the tool produces a receipt byte-identical
   to the one the human authoring surface produces for the same claim, over the same provider. The server
   adds nothing; the grade is the gate's. An agent's claim is graded exactly as a person's is.
2. **The gate demotes an over-declaration.** A well-formed claim that declares `independently-rechecked`
   with no basis passes the schema (its structure is fine) and is then declined by the gate with the
   reason `GM-ABOVE` and a well-formedness finding naming the broken rule. Strict tool use enforces
   structure; the gate enforces grounding. Structure being well-formed does not make a grade earned.
3. **The schema gates structure at the boundary.** A missing statement, a kind outside the kernel's
   kinds, a grade outside the real values, and an unexpected extra property are each rejected by the
   schema before `propose` is called, proven by a provider spy that counts calls: the gate is never
   reached for an invalid input.

The verified line states it: an agent authoring through the schema-gated tool is graded by the same gate
as any producer, structure enforced by the schema and grounding by the gate, so the producer is checked,
not trusted.

## The bound that keeps this honest

The proof is one agent authoring one checked claim through the tool, real and graded. It is deliberately
not an autonomous agent investigating and writing many claims. That would be a research effort of its
own, and it would produce the unaccountable flood the submission's critique condemns. The submission's
own thesis is the guardrail: a more capable agent produces more grounded claims, not more claims, because
the gate grades structure. The MCP server is the slot; one agent authoring one checked claim is the
proof.

## The named deferred depth

- **A live agent session over MCP transport.** The proof drives the tool-call handler directly, which is
  the server's real logic; wiring it to a stdio or HTTP MCP transport and connecting a running model that
  authors in a real session is the production form, named here and not faked. The slot and the gate are
  built; the live session is deferred.
- **Autonomous multi-claim orchestration.** An agent that plans an investigation and authors many claims
  is not built, by thesis. Grounding, not volume, is the point, so the connector proves the gate grades
  an agent's claim, and stops there.

## The honest one-line summary

An MCP server exposes propose as a strict schema-gated tool, and the proof shows an agent's claim graded
by the same gate as a human's, an over-declaration demoted, and an invalid input rejected at the schema;
a live agent session and autonomous multi-claim orchestration are the named deferred depth.
