---
Type: reference
Purpose: The type-level workflow for a small kernel coming to know its own domain in six stages, reusable on any domain, with the math kernel as the worked instance; and the EpiStack community negative space as a separate, invited section.
Depends on: docs/coordination-layer-spec.md, docs/design-axioms.md, docs/parameters-register.md, docs/protocol-spec.md
Depended on by: docs/substrate-map.md
---

# The Kernel Workflow Guide

This guide is an example workflow: a small kernel grounding its own domain, from before any structure exists to past the single kernel's boundary. It states the workflow at the type level, so a reader can pick it up and run it on their own domain, and it carries the math kernel as the worked instance, the EpiStack code grounding its own mathematics through its own gate.

The workflow runs on machinery that is already built: the generator (`scaffolder/new-kernel.mjs`), the gate (`kernel/gate/`), the grounding computation (`kernel/grounding/`), and the crossing (`kernel/composition/`). Stages zero through four run on that machinery; stage five is the community handoff, which is specified in `docs/coordination-layer-spec.md` and not built. The math kernel sits at exactly the tier its own evidence reaches at each stage, and the gate computes it.

**This is a living document.** The worked prompts that instantiate the math kernel (Prompt A through Prompt E) are appended here as they run, so the guide accumulates the real instance record as the build happens. Prompt A, the config-and-generate step, is the inline worked example below; Prompt B through Prompt E are appendices, added as each runs.

## Two entry points

The same six-stage workflow serves two readers, and they start in different places.

- **Extending this repository in place.** The math kernel takes this path: it is this system's own self-grounding exhibit, so it starts at stage zero in the existing tree and needs no fork. A domain that belongs inside this repository is grown here.
- **Building your own kernel elsewhere.** An outside builder takes this path: the first step is to fork the substrate (`docs/substrate-map.md` describes what a fork gets you), then run the workflow against the fork. The substrate is AGPL and forkable by design.

Both run the same six stages. The math kernel is built in place, not by forking; an outside builder forks first and never edits this repository. The workflow is the constant; where you start is the variable.

## Why a kernel grounding its own domain matters

A kernel that holds its own mathematics validates the artifact from inside: the grade lattice, the earned-grade recurrence, and the contamination rule are stated formally and shown to be what the code computes, so the analysis rests on the actual math rather than on reading the code. It also demonstrates the full kernel lifecycle on one domain, from before any structure exists to past the single kernel's boundary, which the populated cases do not show. And it reaches the limit case of the thesis: knowledge is the invariant left as trust in the producer is attenuated, a proof is where attenuation completes because the steps carry the whole weight, so a property grounded in a proof is the thesis at its limit, on the submission's own foundations.

## The six stages

Each stage is a committed state, so the git history records the transitions and their order. The stages are real states, not narrated ones.

**Stage zero: frame the domain and its axioms.** The output is the domain boundary (what question the kernel answers, what is in and out of scope) and the axioms, entered as declaration-claims at the kernel's foundation. The axioms are the free parameters at their most basic: the primitives taken as given, versus what the kernel will ground. Entering them as claims makes them first-class objects that later stages can reference, contest, or revise, the same as any other claim. A later revision to the framing is another commit, because the axioms are revisable free parameters rather than fixed inputs.

**Stage one: generate the kernel.** From the framing, the generator emits the empty kernel structure (the store, the schema binding, the identity), holding no claims beyond the stage-zero axioms. The container exists independently of its content: a typed space, with structure prior to any populated claim.

**Stage two: the bare claims.** The foundational properties are entered as claims with no supporting structure, so the gate computes them at the floor. The grades here are a function of the absent grounding, not a judgment: an ungrounded claim resolves to the floor by the grade rule. Committed as a state, so the floor-to-grounded transition is genuine in the history.

**Stage three: fork and ground.** Each claim is forked with supporting structure attached, and the gate recomputes the grade from the support. The grounding comes in tiers matching the evidence, stated here as kinds of grounding so the workflow is reusable:

- **Exhaustion.** A finite property (a lattice law over the grade set) is grounded by enumerating the operation over its whole domain, which is a proof, so it reaches proof-floor.
- **Differential testing.** A recurrence property (the earned-grade rule matches the code, contamination is monotone and single-pass) is grounded by a harness that generates random graphs and confirms the extracted math is what the code computes, which reaches the checked tier.
- **Formal proof.** Where a property is provable but not yet proven, the gap to proof-floor is a characterized open line, with the formal proof named as its closing condition.

Another domain grounds by its own kinds of evidence; the specific harness and enumeration live in the prompts and the kernel, not in this type-level guide.

**Stage four: embed.** References run from the source to its grounding: each code file whose math is grounded carries a header pointing to its kernel claims, with inline comments at the load-bearing operations (the meet and join, the recurrence, the cycle guard). The direction is code-to-kernel, the inverse of the vocabulary kernel's terms pointing to their source documents.

**Stage five: the community handoff (specified).** A grounded kernel that has reached the tier its own evidence allows can go no further alone; the next grounding is conferred by a community with its own verification process. The math kernel illustrates this by example: it would join an already-established mathematicians' community kernel, one with a working verification process such as a Lean proof, peer review, or Mathlib inclusion, arriving untyped at the border through the crossing that is built, and earning community standing through that community's process. This is an illustration of joining an existing community. The math kernel is out of scope for the EpiStack community negative space below, and the two are distinct.

## The community negative space (an invitation, nothing implied to exist)

Distinct from the math kernel's illustrative handoff, this submission ships the negative space for an EpiStack community over its own three subjects, framed explicitly as an invitation. Nothing here implies a community exists, has members, or expects traffic.

The honest form is not a demonstrated crossing, which would be the author playing both producer and community and faking the multi-party thing, and not a pre-populated door, which would presuppose the community's own decisions. It is the frame a community would form through, with the constitutive decisions left open:

- **The fixed invariants are stated.** The non-negotiable properties any kernel must hold to stay composable (the untyped-type crossing, monotone contamination, producer-agnostic grading, the grounding rule) are inherited from the protocol and already built. They are not up for a vote; they are what make it a kernel at all.
- **The free parameters are named and left open.** The choices a founding community sets for itself (the time-lock cost and decay, the standing rules, the grade policy beyond the ordering, the moderation) are the community's first job, not the founder's.
- **The first act is constituting the community by setting the free parameters together.** A founder who set the parameters and invited claims would have made the community's most important decisions for it, contradicting the forkable, no-central-adjudicator design. The honest first act is joint parameter-setting, not claim submission.

The register is a specification of how one would begin plus a genuine open door: here is what is fixed, here is what is open, here is how the open parts get decided, here is how to take part. The door being open and honestly specified is complete on its own; it does not need traffic to be valid. This is the coordination layer made tangible without claiming it operational: the invariants built and stated, the parameter-setting and the community that results specified and invited. The hard part of coordination is the legitimate constitution of shared rules, and the honest move is to fix the invariants, open the parameters, and invite, rather than to pre-decide.

## The prompt set as the on-ramp

The Claude Code prompts that instantiate this workflow are shipped artifacts, not only build instructions: the prompt set is the community on-ramp. Run them as written and they rebuild the math kernel; change the settings block in the first prompt and they build a kernel of another domain. The settings are the variable a reader changes for their domain; the procedure is the constant.

The prompt set lowers the barrier to producing a kernel, not to a community existing. Running the prompts yields a kernel of a domain; a community still requires the constitutive parameter-setting the invitation describes. The on-ramp is how a producer stands up a kernel; the community is the separate, invited thing that forms when people set shared parameters together.

## Worked instance: the math kernel

The math kernel is the worked instance of this workflow, built in place through the prompts appended below as they run.

### Prompt A: configure and generate (stages zero and one)

Prompt A is the inline worked example: the config-and-generate step, written to be adapted. It opens with a settings block carrying this kernel's choices (the kernel id `math`, the adopted shared kinds, the local kinds and their ceilings, the sources, the axioms), which a reader changes for their own domain. It emits the config validated by `scaffolder/kernel-config.schema.json`, runs the generator to produce the empty kernel, and enters the stage-zero axioms (the grade set, its partial order, the incomparability of the empirical and constitutive modes) as declaration-claims at the foundation.

**The first decision this stage raises: the source class.** The substrate source-class menu is fixed at `primary-measurement`, `peer-reviewed`, `preprint`, `dataset`, `institutional-report`, and `testimony` (the schema's `x-substrate-menu`). The math kernel's grounding evidence is different in kind: a claim grounded by exhaustion, by a differential-test harness, or by a formal proof. None of the menu classes obviously names these. This is a fixed-tier question, because the source-class menu is substrate-inherited, so adding a class is a change to the shared substrate, not a local config edit. Prompt A surfaces this decision rather than forcing it: it reports whether an existing class honestly covers the math sources, or whether the substrate menu genuinely lacks a math-grounding class, and it stops for the maintainer to decide openly rather than smuggling the change. The kernel's grounding tiers depend on the support structure and the checks, not on the source-class name, so this decision is about honest source labeling, not about whether the grounding works.

Prompt B (the bare claims), Prompt C (the grounding), Prompt D (embed and wire the exhibit), and Prompt E (this guide's later sections and the community invitation) are appended here as appendices when each runs.

## Appendix: Prompt B, the bare claims (stage two)

Stage two entered the foundational properties the code computes as bare claims with no supporting structure, so the gate floors them: the honest before-state that stage three grounds. No support links were attached. Eighteen properties were entered, in two groups by the tier their grounding will honestly reach.

The **grade-lattice laws**, which ground later by exhaustion (a proof, reaching the constitutive proof-floor), entered as `theorem` claims: `thm.meet-commutative`, `thm.meet-associative`, `thm.meet-idempotent`, `thm.join-commutative`, `thm.join-associative`, `thm.join-idempotent`, `thm.absorption`, `thm.lattice`, and `thm.mode-incomparable-welldefined`.

The **earned-grade recurrence, contamination, and crossing** properties, which ground later by differential testing (empirical, reaching the checked tier), entered as `measurement` claims: `thm.earned-recurrence`, `thm.earned-linear`, `thm.ungrouped-singleton`, `thm.cycle-guard`, `thm.settled-not-inherited`, `thm.determinism`, `thm.contamination-monotone`, `thm.crossing-min`, and `thm.untyped-floor`.

**The real edge this stage met.** Prompt A declared a single local kind `theorem` at ceiling `constitutive`, and the prompt for stage two proposed entering every property as a `theorem`. The gate's grade rule made two things concrete. First, a bare `theorem` does not floor low: because the kernel confers the constitutive proof-floor by a constitutive-mode kind rather than earning it from support, an unsupported `theorem` self-grounds to `constitutive` (its support delivery is still bare, `asserted`, so the grade is conferred by the kind, not by evidence). Second, the recurrence, contamination, and crossing properties are grounded empirically by differential testing, which reaches the `checked` tier, so they belong to the `measurement` kind (bare floor `asserted`), not `theorem`; a `theorem` kind would both cap them at `constitutive` and self-ground them, mislabeling an empirically checked property as a self-grounding proof. So the correction was to split the kinds by the tier each property's grounding reaches: lattice laws as theorems, the rest as measurements. The observable floor-to-grounded lift in stage three will be on the measurement claims (`asserted` to `checked`); for the lattice-law theorems, stage three attaches the exhaustion proof that justifies the constitutive grade the kind already confers, replacing bare kind-assertion with an auditable proof.

The gate accepted all 21 claims (the 3 axioms plus the 18 properties) with zero links: the theorems at `constitutive`, the measurements at `asserted`, every one with bare support delivery. `check-math` was evolved to assert this stage-two floor state.
