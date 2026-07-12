---
Type: reference
Purpose: The depth under the atlas capstone's train-time grade: a kernel exported as a graded training corpus, and a model fine-tuned on it. The subtler grade, held to a three-tier honesty about what is buildable now versus what is unproven, with the domain-scope bound load-bearing throughout, a bounded licensing pointer, and the producer-consumer loop as the close.
Depends on: docs/workflow-atlas.md, docs/api.md, docs/vision-and-continuation.md
Depended on by: nothing
---

# Consumer Capstone: The Kernel at Training

*The depth under the atlas capstone's train-time grade: a kernel exported as a graded corpus, and a model trained on it. The subtler grade, and its integrity is a three-tier honesty.*

The atlas capstone names this in brief, and names it carefully: a kernel is also a training corpus whose every claim carries its grade and its support, so a model trained on it is exposed to grounding as data. This document is the depth under that sentence, and it is the harder grade to state honestly, because the seductive overclaim is only one careless sentence away. The pipeline is real and buildable now; whether the model that comes out of it inherits the grounding is an open empirical question. Those are two different things, and the discipline of this document is never leveling them.

## The move

A kernel is a training corpus whose every claim carries its grade and its support. Export the claims as training text: each statement with its kind, its grade, and its serialized support path, so the reliability of a claim travels with the claim into the corpus. A model trained on that corpus is exposed to grounding as data, rather than to flat assertion whose reliability it must reconstruct from frequency and surface. The difference from ordinary training text is the same difference the inference document turns on: the graded corpus carries the attenuation the graph performed, where flat text carries only the assertion.

## The three tiers

State these as three, and never level them.

**Tier 1: buildable now.** Exporting the kernel to a graded training corpus and fine-tuning an open-weight model on it is entirely off-the-shelf today. A serialization step over `read` produces the claims with their grades and support paths, formatted as instruction pairs or as continued-pretraining text, and a standard fine-tuning path consumes it: LoRA or QLoRA on a single GPU, or a managed fine-tuning API. None of this is built or vendored by this submission; all of it is current mass-market tooling, named honestly. Register: example, current tooling, over the built `read`.

**Tier 2: it produces a model, also now.** Running that pipeline yields a fine-tuned model. That is a fact, not a projection. The serialization runs, the fine-tuning runs, and a model comes out. Nothing about tier 2 is in doubt.

**Tier 3: the open question.** Whether that model measurably inherits the attenuation, whether its confidence tracks the grades rather than the frequency of a claim in its far larger pretraining corpus, is an untested empirical hypothesis. The mechanism is runnable; the effect is unproven. This is the open empirical question of the whole train-time grade, and it is marked as open, not asserted as a result. What would test it is a calibration comparison: measure whether the fine-tuned model's expressed confidence on questions the kernel covers tracks the kernel's grades more closely than its base model's does. Until that comparison is run and reported, the effect is a hypothesis with a named test, and this document claims the pipeline and not the effect.

The tiers are ordered by certainty, and the honesty is in the ordering. Tier 1 and tier 2 run today. Tier 3 is the thing the pipeline is for and the thing not yet shown, and a reader should read tier 3 as the open question it is rather than as the payoff the first two tiers seem to promise.

## Any organization, its own kernels

Any organization can train a model on its own kernels or the kernels it chooses to pin, mirroring in the model which grounding it trusts. This is the same producer-agnostic and fork-based logic the federation runs on, extended to training: a participant pins the kernels whose attenuation it stands under and trains on those, so the model reflects the trust choices the organization already made in the graph. This is a capability statement about the pipeline, tier 1, and not a claim about the effect, tier 3. The pipeline lets any organization do this today; whether the resulting model inherits the grounding is the same open question, held separate.

## The domain-scope bound

This bound is load-bearing here especially, because the training grade is where the overclaim is most tempting. Even granting the open question resolves well, the claim would only ever be that within the kernel's domain the model's graded priors track the kernel's grades. It is never that the model is made truthful, and never that it only knows the kernel. A model trained on a kernel still knows vastly more than the kernel holds, from a pretraining corpus orders of magnitude larger, and the kernel touches only the slice it covers. The most the effect could show, if shown, is that on the covered domain the model defers to graded grounding over its own priors. That ceiling stays in view through every sentence of this grade: a graded corpus is not a truth serum, it is grounding offered as data on the domain it covers.

## The licensing pathway

One pathway the architecture's provenance permits, stated as a possibility and not a plan. This repository is AGPL, whose network-copyleft many commercial operators avoid. A kernel community could offer such operators an alternate commercial license to train on a kernel, and route the proceeds to the producers whose signed, hashed grounding the kernel records, paying against the attribution the graph already keeps. What such a license would sell is exemption from copyleft, not access to fact: the knowledge stays open and un-tolled, and what would be funded is the labor of grounding, not the ownership of truth. This is a possibility the provenance permits, not a mechanism this work runs; the fuller pointer lives in `docs/vision-and-continuation.md`.

## The loop

An AI is a fine producer and a disciplined consumer, and the kernel is the channel between the two.

It is a fine producer because it types claims and stakes standing, and the gate checks the typing and not the agent, so an agent's claim is graded by structure exactly as a person's is. It is a disciplined consumer whether it reads grounding live at inference or inherits it from training, because in both cases it asserts what grounds and defers where the graph floors out. So the kernel is the shared typed channel that lets AI systems produce and consume knowledge without trusting each other's syntheses: producing AI types in, consuming AI reads out or trains on the graded corpus, and the channel between them carries grade and support rather than bare assertion.

Bound it immediately. The kernel does not make an AI truthful. It makes a channel where an AI's claims are checked and an AI's reading is grounded, within the domain the kernel covers, and ungrounded output never enters because it arrives untyped and grounds nothing. That is the whole of the claim, and it is enough: a channel that checks what enters and grounds what is read is the stabilizing infrastructure the influx needs, and it is a smaller and truer thing than a truthful machine.
