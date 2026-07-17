---
Type: reference
Purpose: "The spine of the producer-and-consumer workflow atlas: states the two-sided-boundary thesis, guides the six workflow documents grouped producer and consumer, names the two built anchors, and holds the honest bound on register. The consumer capstone (an AI reading from the kernel) closes it."
Depends on: [docs/api.md, docs/clients.md, docs/the-climb-of-synthesis.md, docs/producer-connector-findings.md, docs/composition-spec.md, docs/status-ledger.md, docs/kernel-workflow-guide.md, docs/community-invitation.md]
Depended on by: [docs/kernel-at-inference.md, docs/kernel-at-training.md, docs/workflow-consumer-adversarial.md, docs/workflow-consumer-crux.md, docs/workflow-consumer-evidence.md, docs/workflow-producer-data.md, docs/workflow-producer-video.md, docs/workflow-producer-web.md]
---

# The Workflow Atlas

*How a producer feeds any source into the gate, and how a consumer asks any question of the graph the gate protects. One index, six workflows, one closing capstone.*

## The kernel is a boundary with two faces

The kernel is not a store you read. It is a boundary with two built faces, and the workflows in this atlas live on those two faces.

One face is a write terminus. Any producer types a claim into it, and the gate admits the claim only if it grounds. The producer supplies the typing; the gate checks it and answers, admitted at this standing or held back for this reason. A person, an organization, a model, or a pipeline of these all land at the same terminus and are checked the same way, because the gate reads a claim's structure and never its agent's nature.

The other face is a read terminus. Any consumer queries it, and a read never mutates. The consumer asks what a conclusion rests on, where a disagreement turns, whether a graph would survive a motivated reader, and the terminus answers from public structure that anyone recomputes and everyone recomputes alike.

Neither face trusts the other. A producer cannot reach past the gate into the store, and the gate is not obliged to trust what a producer typed; it earns standing only by the grounding rule. A consumer reads what stands and recomputes it, and is never asked to trust the producer who typed it. The two faces are joined only by the graph between them, and the graph carries no authority that a reader cannot check.

The shape of the atlas follows the shape of the boundary. Producers vary all the way up to the gate and converge at it: a spoken debate, a live news page, and a clean dataset are three different sources, and each ends at the same `propose` call landing the same `proposedClaim` shape. Consumers vary all the way up from the reads and diverge above them: one built `read`, one built `reconciliations`, one built `robustness` fan out into an evidence finder, a crux locator, and an adversarial auditor. The variety is in the periphery. The contract is invariant.

## The two built anchors

Two things in this atlas are built, and everything else is periphery over them.

The write anchor is the MCP producer tool (`periphery/produce/propose-tool.mjs`, `periphery/produce/mcp-server.mjs`, oracle `build/check-produce.mjs`). It exposes `propose` as a strict schema-gated tool: a claim authored through it receives a receipt byte-identical to the one a human authoring surface produces for the same claim, so the gate grades the claim and not the agent. Build status is graded in `docs/status-ledger.md`; a live agent session and autonomous multi-claim orchestration are named deferred depth, not built.

The read anchor is the read contract (`createClientApi(provider)`, `api/client-api.mjs`), exposing `read`, `robustness`, `reconciliations`, `gaps`, and `characterizedGaps`, plus the trellis `api` reads `resolve`, `decompose`, `dependents`, and `perturb`. Each is derived on read, never stored, and reports structure rather than certified truth. The consumer workflows are assessment-layer clients over these reads.

## The six workflows

Three producer workflows carry source into the gate. Three consumer workflows carry a question out of the reads.

Producer workflows (source in, converging at the built gate):

- `docs/workflow-producer-video.md`. Spoken multi-party debate, the richest case. Registers: acquire, transcribe, extract, and type are example, current tooling; the landing is built.
- `docs/workflow-producer-web.md`. Live web and news, mundane-but-contested, mixed reliability. Registers: fetch, extract, and type are example; the landing is built.
- `docs/workflow-producer-data.md`. Structured data and datasets, quantitative, the clean contrast. Registers: the extraction is built-assembly, a deterministic script with no model in the loop; the landing is built.

Consumer workflows (question out, diverging from the built reads):

- `docs/workflow-consumer-evidence.md`. The load-bearing evidence finder: what a conclusion rests on and where the weakest link is. Register: assembly over built reads, near-direct on `read` plus `decompose`.
- `docs/workflow-consumer-crux.md`. The crux locator: where a disagreement actually turns. Register: assembly over a built read, mapping almost directly onto `reconciliations`.
- `docs/workflow-consumer-adversarial.md`. The adversarial auditor: whether a graph is gamed and would survive a motivated reader. Register: assembly over built reads, over `robustness` plus `dependents` and `gaps`.

The three consumer workflows each map close to a single built read, and that is the honest strength of the consumer set: the evidence finder to `read` plus `decompose`, the crux locator to `reconciliations`, the adversarial auditor to `robustness` plus `dependents` and `gaps`. The client adds orchestration and presentation, and the store deliberately defers the assessment-layer judgment to it: which gap most needs closing, which crux candidate to lead with, which fragility a reader should worry about are decided in the client, never in the store.

## The honest bound

These are periphery workflows. Some are assembly over the built termini, composing built contract calls and adding only orchestration. Some are worked examples using current mass-market tooling, a transcriber, a fetcher, a frontier model, none of which this submission builds or vendors, provided so a reader can build their own. The gate a producer workflow lands at and the reads a consumer workflow rests on are built; the upstream extraction and the downstream presentation are the periphery a market supplies. The atlas provides these so the ecosystem can build producers and consumers this protocol composes, and names honestly, at every stage, which register that stage sits in.

## The consumer capstone: an AI reading from the kernel

The consumer set has a capstone that is not a seventh workflow file, because it is the same read terminus put to a specific use: a model reading from the kernel rather than a person. State it carefully, at two grades, with an honest bound. Each grade has its full treatment in a depth document: `docs/kernel-at-inference.md` for the inference-time grade, `docs/kernel-at-training.md` for the train-time grade.

Inference-time is the demonstrable example. Retrieval-grounded generation where retrieval returns graded, grounded claims through `read` rather than raw text, and the model is instructed to assert a claim only at the strength the graph grounds it, to surface the load-bearing support the way the evidence finder does, and to defer where the graph floors out. This is buildable today with current tooling: a retrieval step over the read contract plus a frontier model carrying a grounding-discipline instruction. It is the example register, and it is periphery a consumer supplies over the built read.

Train-time holds three tiers, and they are never leveled. Exporting a kernel to a graded training corpus, every claim carrying its grade and its serialized support, and fine-tuning an open-weight model on it is buildable now with off-the-shelf tooling: a serialization step over `read` and a standard fine-tuning path. Running that pipeline yields a fine-tuned model, a fact, not a projection. Whether that model measurably inherits the attenuation, whether its confidence tracks the grades rather than the frequency of a claim in its wider pretraining, is the open empirical question, untested, with a named test: a calibration comparison between the fine-tuned model and its base on questions the kernel covers. The pipeline lets any organization train a model on its own kernels or the kernels it chooses to pin, mirroring in the model which grounding it trusts; that is a capability of the pipeline, held separate from the unproven effect. The full three-tier treatment is `docs/kernel-at-training.md`.

The bound is stated plainly and never crossed. Scope every claim to the kernel's domain. On questions the kernel covers, the model's standing is the kernel's standing. It is never that the kernel is the model's knowledge, and never that the model only knows what is in the kernel; a model knows vastly more than any kernel holds. The claim is only that within the covered domain the model defers to graded grounding over its own priors.

The loop is the insight. An AI is a fine producer, because it types claims and stakes standing and the gate checks the typing and not the agent, and a disciplined consumer, because it asserts only what grounds. So the kernel is the shared typed channel that lets AI systems produce and consume knowledge without trusting each other's syntheses. That loop is the stabilizing infrastructure the influx needs: producing AI types in, consuming AI reads out, and ungrounded synthesis never enters, because it arrives untyped and grounds nothing.

The depth under each grade: inference-time in `docs/kernel-at-inference.md`, train-time in `docs/kernel-at-training.md`.

## The deepest workflow, and the door it opens onto

The six workflows above are single operations on the boundary: one producer feeding one source in, one consumer asking one question out. The atlas has one entry deeper than any of them, because it is not a single operation but the whole lifecycle a kernel lives through.

`docs/kernel-workflow-guide.md` is the kernel workflow guide: the six stages a small kernel comes to know its own domain through, from before any structure exists to past its own boundary, stated at the type level so a reader can run it on any domain and carrying the math kernel as its worked instance. Where a producer workflow ends at the gate and a consumer workflow begins at the reads, the guide runs the full arc, framing, generating, entering bare claims, forking and grounding, embedding, and the community handoff, on machinery that is already built (the generator, the gate, the grounding computation, and the crossing). Its worked instance is checkable end to end: the math kernel's grounding is not only embedded in the code but verified, since the embed guard (`build/check-math-embed.mjs`) confirms each code-to-kernel pointer resolves at its stated tier and hash-pins the described code operation so drift is caught.

`docs/community-invitation.md` is where the guide's stage-five handoff and the coordination frontier become an open door. The guide's final stage is the community handoff, which no single author can honestly complete alone; the invitation states the frame a community would form through, with the fixed invariants named and built, the free parameters named and left open, and the first act being the community constituting itself by setting those parameters together. It is an invitation, not a launch: nothing in it implies a community exists, has members, or expects traffic. It is the honest terminus of the atlas, the point where the built boundary opens onto the coordination layer a federation would build for itself.
