---
Type: specification
Purpose: Specifies the trellis-to-v3 ingestion translator, the source the ledger cites for the migration path.
Depends on: docs/knowledge-system-how.md, docs/population-pipeline.md
Depended on by: docs/status-ledger.md
---

# Trellis to v3: the ingestion path

`build/translate-trellis.mjs` is a pure, deterministic translator from an authored trellis case
graph to the v3 claim and link records the kernel holds. It is an **ingestion path**, not a one-off
conversion: the trellis case data stays the authoring source, and the translator produces the v3
records on demand. Two runs over the same input are byte-identical (same content identities, same
record hashes, same sorted order).

It changes no grounding verdict. A node's declared grade is what its terminal already earned in the
trellis, and the v3 earned grade reproduces that floor. Where a trellis node and its v3 claim
disagree on what was grounded, that is a divergence to **report**, not to paper over (Phase B).

The acceptance oracle is `build/check-translate.mjs` (the fragment test below).

## The terminal-to-grade table

A node's terminal (or, absent one, its kind) fixes the v3 kind, the declared grade, and whether the
node carries **its own basis**: a synthesized distinct-party checking record. Own basis is what
reaches the settled tier. Everything else stays on the open line, so a derived node tops out at
`corroborated` no matter how settled its supports are. **Settledness is not inherited.**

| trellis node                          | v3 kind         | ceiling                   | declared grade | own basis (checking record)        |
|---------------------------------------|-----------------|---------------------------|----------------|------------------------------------|
| body property (measurement terminal)  | `measurement`   | `independently-rechecked` | `checked`      | direct-measurement, distinct-party |
| cited primitive (math floor)          | `primitive`     | `checked`                 | `checked`      | derivation-audit, distinct-party   |
| observation (measured world fact)     | `observation`   | `checked`                 | `checked`      | direct-measurement, distinct-party |
| transformation (a derivation step)    | `transformation`| `corroborated`            | `corroborated` | none (earned from supports)        |
| claim, terminal `measurement`         | `claim`         | `corroborated`            | `corroborated` | none (the chain reaches measurement)|
| prediction                            | `prediction`    | `corroborated`            | `corroborated` | none (earned from its producer)    |
| comparison                            | `comparison`    | `corroborated`            | `corroborated` | none                               |
| question                              | `question`      | `corroborated`            | `corroborated` | none (earned from its children)    |
| terminal `irreducible-prior`/`forum`  | `forum`         | `corroborated`            | `corroborated` | none (a priced prior, never settled)|
| assumption (a perturbable premise)    | `assumption`    | `asserted`                | `asserted`     | none                               |
| terminal `constitutive`               | `constitutive`  | `constitutive`            | `constitutive` | constitutive kind                  |

Two readings are load-bearing and named here so they are not mistaken for losses:

- **A `measurement` terminal on a chain node is not a measurement leaf.** `lhc.claim` carries a
  `measurement` terminal, but it is supported by the whole cascade; it earns `corroborated` resting
  on measurement-grounded leaves, never `checked` itself. "Reaches measurement" is a property of the
  support chain bottoming out in `measurement` leaves, not a grade the conclusion inherits. The
  actual measurement terminals are the synthesized body leaves.
- **A `forum` terminal is corroborated, capped.** A priced prior (the COVID irreducible-prior
  closure) reaches `corroborated` through the analysis that priced it, but the `forum` ceiling holds
  it there: it never reaches the settled/measurement tier, which is exactly the refusal to close on
  a measurement.

## The edge-kind mapping

Composition is the meet/join selector, and it maps directly onto the `support_group` partition.
Within a group the delivery is weakest-of (a meet); across groups it is strongest-of (a join). A
conjunction (all conjuncts needed, the weakest limits) folds into one group; a disjunction
(alternatives, the strongest carries) spreads across one group per child.

| trellis edge                         | v3 link       | grouping                              | rationale                          |
|--------------------------------------|---------------|---------------------------------------|------------------------------------|
| `children`, composition conjunction  | `supports`    | one group `g:<node>`                  | all needed -> weakest-of           |
| `children`, composition sequence     | `supports`    | one group `g:<node>`                  | a chain -> weakest link limits     |
| `children`, composition disjunction  | `supports`    | one group per child `g:<node>/<child>`| alternatives -> strongest-of       |
| `body_refs`                          | `supports`    | the node's group `g:<node>`           | the empirical floor, conjunctive   |
| `prediction.produced_by`             | `supports`    | `g:<node>`                            | the producer grounds the value     |
| `guard.assumption_id`                | `depends-on`  | (none)                                | a condition, not evidence          |
| `inputs` -> an assumption            | `depends-on`  | (none)                                | a condition, not evidence          |
| `children` -> an assumption          | `depends-on`  | (none)                                | a premise child grounds nothing    |
| `inputs` -> a non-assumption         | (not emitted) |                                       | dataflow; the `children` edge carries it |
| `outputs`                            | (not emitted) |                                       | dataflow annotation                |

`depends-on` records the dependence without lifting the grade: only `supports` links deliver, so an
assumption a node rests on can never ground it. This is the intended reading of a perturbable
premise, it is a condition the derivation is contingent on, not a piece of evidence for it.

## Surfaced edge decisions

These are the choices the mapping makes that a reviewer should see rather than have to reverse-
engineer:

1. **Sequence is a meet, not a chain of separate deliveries.** A trellis sequence is a pipeline, so
   its grade is set by its weakest step. That is a weakest-of over one group, identical to a
   conjunction. The two compositions collapse to the same grouping on purpose; the distinction they
   carry (ordered vs unordered) is authoring metadata the grade does not depend on.
2. **`inputs`/`outputs` are dataflow, and mostly redundant with `children`.** Where an input is a
   non-assumption (e.g. `lhc.N2.3` inputs `lhc.N2.2`, which is already a child), the translator does
   not emit a second edge. Only assumption-valued inputs and `guard` become `depends-on`, because
   those are the dependences the `children` edges do not already carry.
3. **Each body is an independent measurement.** A body leaf's source id is `src:body:<body>`, so a
   white dwarf and a neutron star supporting the same node have **disjoint footprints**, which is
   what earns the independence lift when both survive. Primitives citing one source share a
   footprint (`src:cite:<target>`): they are the same standard theory, not independent measurements.
4. **Measured values enter as text, never as canonical decimals.** A body leaf's statement carries
   `earth#radius = 6000000 m` as a plain string, so no floating-point value ever touches the
   canonical path (which throws on a JS number). The value is content, not a graded quantity.
5. **A node id lives in the claim statement.** A claim statement is `"<node id>: <label>"`, which
   guarantees distinct nodes get distinct content identities and lets the migration round-trip
   (`byNode` maps node id -> claim identity).

## Instances: the break position fixes the terminal

An instance instantiates a pipeline (`pipe.root`) and breaks at one stage. The break's **position
in the instantiated sequence** fixes the case's terminal, which is the whole content of the two
population cases:

- **Break at the first stage** (COVID, at `pipe.stage1`, representativeness): the inference refuses
  to a **priced prior**. The conclusion is a `forum` claim, grounded by that stage's own (sound)
  analysis, so it earns `corroborated` but is capped at the forum ceiling: it returns a priced prior,
  not a measurement. Its support closure contains no measurement leaf.
- **Break at a later stage** (eggs, at `pipe.stage2`, sufficiency): the inference **splits**. The
  sound prefix (stage 1) closes on a measurement, so a population `claim` conclusion earns
  `corroborated`; the broken suffix does not follow, so an individual `claim` conclusion is
  **refused**, left unsupported at `asserted`. The split is real: the individual side sits strictly
  below the population side.

This reads the closure from the structured `broken_node` and the instantiated pipeline's child order,
never from the free-text `closure` string.

## Grounding is reproduced, not re-established (Phase B)

The trellis gap detector (`kernel/analysis/gaps.js`) grades a node for grounding **only if it is
reached as a child**; a childless node nobody points at is not a grounding target. So the migration's
job is not to make every claim earn a high grade, it is to reproduce that exact verdict:

- every claim **reached as a support** bottoms out, through the graph, in grounded leaves (it earns
  above `asserted`), which is the v3 form of "no support bottoms out in nothing";
- a root or closure claim earns from its own basis, and an unsupported closure annotation (the
  refused individual side of a split, `eggs.comparison`) honestly reads as `asserted`, which is not a
  gap because the trellis never graded it either.

`build/check-migrate.mjs` translates the three real cases and confirms: 0 open grounding gaps
preserved, no claim declares a grade it cannot earn (60 claims), no support-reached claim stuck at
asserted, the LHC cascade grounds in 10 measured body leaves, COVID terminates at the forum, eggs
splits, and the gate accepts both cases. **No divergence surfaced**: where a trellis node overlaps a
v3 claim, the earned grade agrees with what the terminal implies.

## The fragment test (Phase A acceptance)

`build/check-translate.mjs` translates a fragment covering the four required shapes and asserts:

- **conjunction** -> two supports in one group `g:frag.conj` (weakest-of);
- **disjunction** -> two supports in two per-child groups, and the `guard` becomes one `depends-on`
  (strongest-of, the premise does not deliver);
- **a cited measurement leaf** -> a `measurement` claim, declared `checked`, with one distinct-party
  checking record, its value carried as text;
- **a forum terminal** -> a `forum` claim, declared `corroborated`, with no checking record (it does
  not reach the settled tier);
- **determinism** -> a second translation is byte-identical (same record hashes, same order);
- **grounding** -> every fragment claim's declared grade is covered by its earned grade (no gap).
