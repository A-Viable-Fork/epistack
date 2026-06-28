# Node Card and Architecture Spec

*The interactive interior of a derivation segment: a node you can decompose down, perturb along, and compare sideways. This spec defines the data model, the card, the click semantics, the perturbation overlay, the UI mechanics, how it attaches to the existing artifact, and the build order.*

---

## 0. The one idea

Every node lives in three structures, and the UI is those three made navigable.

- **Decomposition (down).** What this step is made of. Edges run parent to child, terminating at primitives.
- **Inference (along).** What this step depends on and what it drives. Edges run input to output, terminating at an observation that closes the claim.
- **Instantiation (sideways).** Where this transformation appears elsewhere and how it diverges there. Edges run instance to abstract entry to sibling instances, carrying departure metadata.

Decomposition and inference are orthogonal graphs over the same nodes. Decompose walks decomposition edges; perturb walks inference edges; compare walks instantiation edges. The card is one node seen from all three.

Two commitments inherited from the design so far:

1. **Decomposition is a DAG, not a tree.** A shared primitive is a single node with several parents. The sharing is the metric basis: two branches that "share a primitive" point at the same node, and the node's back-references are how that sharing is read. This is what lets the UI replace-with-context rather than render the whole tree.
2. **Perturbation is authored before it is computed.** Flipping an assumption looks up a stored, typed consequence. The consequence is a recorded fact in the graph, not a simulation. A computed propagation engine is a later, optional layer.

---

## 1. Node kinds

| Kind | Role in the model | Decomposes? | Perturbable? | Carries |
|------|-------------------|-------------|--------------|---------|
| `claim` | A case-level assertion with a terminal type. The root of an inference path. | Into its inference path | No | terminal_type |
| `transformation` | A mid-level derivation step: takes inputs, produces outputs. The retrieval target. | Yes, to children | No | full schema + atlas_ref |
| `primitive` | A named standard transformation. The coordinate basis. | No. Shows a citation. | No | full schema + citation |
| `assumption` | A perturbable proposition: a hypothesis under test, or a transformation's precondition. | Sometimes (if itself derived) | Yes | truth-value + perturb payload |
| `observation` | A world-fact or measurement that closes a claim. The boundary the cascade meets. | No, or to its measurement source | No, it is the target | terminal_type = measurement, world-value |

`assumption` covers both the top hypothesis ("black hole stable and dangerously accreting") and a mid-cascade precondition ("the projectile stops in this body"). They differ by `position` in the inference graph (`hypothesis` at a root, `precondition` mid-graph), not by kind.

---

## 2. The node schema

Every node carries the fields its kind supports. The schema is the dual representation: a linguistic layer (what it is, does, breaks) and a mathematical layer (the transformation itself).

```
Node {
  id            : string
  kind          : claim | transformation | primitive | assumption | observation
  label         : string                       // short name, shown in rail and child cards
  position      : hypothesis | precondition | step | terminal   // place in the inference graph

  // Linguistic layer
  role          : string    // "what it is": the functional description; the query target
  takes         : [Type]    // inputs (objects / typed quantities)
  produces      : [Type]    // outputs
  preserves     : [string]  // invariants kept across the step
  breaks        : string    // the condition under which the step fails (the trigger)
  why_breaks    : string    // the mechanism by which that condition invalidates the output. FEATURED.

  // Mathematical layer
  math          : string                       // the equation / operation
  formal_status : nl | typed | lean_verified   // migrates toward a Lean 4 type signature
  lean_sig      : string?                       // the type signature when it exists

  // Decomposition (down)
  children      : [node_id]                     // ordered sub-steps. Empty for primitives.
  parents       : [node_id]                     // back-references. DAG: a shared node has many.

  // Instantiation (sideways)
  atlas_ref     : entry_id?                     // transformation -> its abstract atlas entry
  citation      : Ref?                          // primitive -> "basis, not built here"

  // Inference (along)
  inputs        : [node_id]                     // upstream nodes this consumes
  outputs       : [node_id]                     // downstream nodes this feeds
  perturb       : Perturbation?                 // assumption nodes only (see section 5)

  // Render state (derived, not stored)
  state         : sound | broken | consistent | contradicted | flipped
}
```

The atlas entry (the math map scaffold) is the sideways store the transformations point into:

```
AtlasEntry {                                   // the abstract pattern; the index
  id            : entry_id
  role          : string                        // the functional spec children query by
  signature     : Type -> Type                  // the typed shape
  clones        : [ { case, node_id, departure } ]   // where it instantiates, and how it diverges
  parent_of     : entry_id?                      // for a variant, its family parent
}
```

`departure` is the divergence field: for the population-mismatch family, the COVID clone's departure is "wrong draw, non-exchangeable sample" and the eggs clone's is "lossy reduction, variance discarded." The departures are the content; the pattern is the index.

A grounded example, the stopping condition from the LHC cascade:

```
{ id: "lhc.N2.3", kind: "transformation", label: "Stopping condition",
  position: "step",
  role: "Decide whether a produced black hole halts inside a given body",
  takes: ["stopping_length", "body_radius", "body_density"],
  produces: ["set of bodies whose survival bounds the hazard"],
  preserves: ["the production and accretion physics, unchanged"],
  breaks: "the body is too sparse to stop the object before it exits",
  why_breaks: "a relativistic neutral black hole loses energy only by weak capture, so in low-density matter its stopping length exceeds the body radius and it passes through; the body's survival is then consistent with the object being dangerous, so the body is uninformative",
  math: "stops  iff  lambda_stop < R_body",
  formal_status: "nl",
  children: ["lhc.N2.1", "lhc.N2.2"],
  atlas_ref: "atlas.projectile-stops-in-target",
  inputs: ["lhc.assume.neutral", "lhc.N2.2"],
  outputs: ["lhc.N3.1"] }
```

And a primitive (a floor node), which shows a citation instead of children:

```
{ id: "prim.mandelstam-s-fixed-target", kind: "primitive", label: "Fixed-target CoM energy",
  role: "Convert a lab-frame projectile energy to a center-of-mass energy",
  math: "sqrt(s) ~ sqrt(2 E m_N),  E >> m_N",
  formal_status: "typed",
  children: [],
  citation: { source: "Mandelstam s; standard relativistic kinematics", target: "Mathlib / PDG" },
  parents: ["lhc.N1.1", "..."] }      // many parents: this is basis, shared across the DAG
```

---

## 3. The node card

The card renders one node. Layout top to bottom, with `why_breaks` featured rather than filed in a metadata row.

1. **Header.** `label`, a kind badge (`transformation` / `primitive` / `assumption` / `observation`), a state dot, and the motions available as affordances: down arrow if `children` non-empty, sideways arrow if `atlas_ref` has clones, perturb glyph if `kind = assumption`.
2. **What it is.** `role`, one line, prominent.
3. **What it does.** `takes -> produces`, compact and oriented. This is context, not the headline.
4. **The break.** A visually set-apart block: `breaks` (the when) above `why_breaks` (the mechanism). This is the card's center of gravity. It is the field a reader came to see and the field that does the family discrimination, so it gets weight, color, and separation from the rows above.
5. **The math.** The `math` line with a `formal_status` badge (`nl` / `typed` / `lean ✓`). Collapsible if long. **For a primitive, this slot is the citation instead**, rendered distinctly: "Coordinate basis. Proof: {citation}. Not built here."
6. **Footer, the three motions.**
   - **Decompose.** `transformation`: "Made of N steps" opens the children. `primitive`: no decompose; the citation in slot 5 is the terminus, styled as a wall you have reached on purpose.
   - **Compare.** "Also in N cases" opens the sideways view: the abstract entry and the sibling clones, each with its one-line departure. Absent if the transformation is unique to this case.
   - **Perturb.** `assumption` only: "Flip this" toggles the node and shows the consequence (section 5).

Per-kind variation is entirely in slots 5 and 6: a primitive replaces decompose with a citation, an observation replaces the footer with its world-value and a "what would change this reading" note, an assumption adds the perturb control.

---

## 4. Click semantics

A click resolves to one of three motions, and decompose has three terminal states that must look different so the user knows what kind of node they hit before and after clicking.

**Decompose (down).**
- On `transformation` -> reveal `children` as collapsed cards below the focused card. The node stays focused; children appear one level down.
- On `primitive` -> no expansion. The citation is shown. Rendered with a distinct basis treatment (border, fill, a small "basis" tag) so the terminus reads as deliberate, not as a dead link. The wall is the point: you have reached a coordinate.
- On `assumption` with structure -> behaves like a transformation. On atomic `assumption` or `observation` -> terminal, like a primitive, showing the given/world-fact rather than a citation.

Two visually distinct terminals, then: `primitive` (citation, "basis") and `given` (an atomic assumption or an observation, "world-fact / input"). One expanding state: `transformation`.

**Compare (sideways).** Jumps to the atlas entry. Renders the abstract pattern at the top, then the clones, each as a compact card showing its case, its instance, and its `departure`. This is the departure visualization: the family made visible, and the place a reader sees the same step recur and sees exactly where it diverges. Different destination from decompose; it leaves the decomposition path and enters the instantiation structure, with a clear way back.

**Perturb (along).** Section 5.

Pre-click legibility: kind badges and the basis treatment mean a user can tell a decomposable transformation from a terminal primitive from a perturbable assumption without clicking. The motions a node offers are visible on its card header before any interaction.

---

## 5. Perturbation

Perturbation runs on the inference graph, forward, and renders as a non-destructive overlay.

**The payload (authored, v1).** Each `assumption` carries:

```
Perturbation {
  flips    : truth-value        // the value it takes when perturbed
  cascade  : [ { target: node_id, new_state, consequence: string } ]
}
```

Flipping the LHC danger assumption sets:

```
{ flips: true,
  cascade: [
    { target: "lhc.N3.2", new_state: "sound",
      consequence: "destruction time computes to t_destroy << tau_NS" },
    { target: "lhc.obs.neutron-star-survives", new_state: "contradicted",
      consequence: "the cascade predicts the neutron star should already be gone" }
  ] }
```

The consequence is stored, typed, and inspectable. It is an assertion in the graph, not a black-box computation, which is honest in the same way the rest of the submission is.

**The overlay.** The active perturbation is a set of flipped assumptions. Default is the empty set: every node `sound`, every observation `consistent`. Flipping adds to the set and applies the authored `cascade`: targets take their `new_state`, the inference path from the flipped assumption to each affected observation renders as a highlighted trail, and contradicted observations turn red with their consequence text. A reset clears the set and returns to as-argued. Nothing is edited; the overlay sits on top of the default graph.

**Why it runs independently of decompose.** Perturbation walks `inputs`/`outputs`; decompose walks `children`. You can drill into the stopping branch, flip the danger assumption, and still see the neutron-star observation go red, because the flip propagates along inference regardless of decomposition depth. The observation node is shared between the case-level path and the internal cascade (it is the terminal of both), which is why the perturbation reaches it from inside.

**Computed (v2, optional, later).** Give each transformation a propagation rule mapping input-states to output-state (at minimum: a required input going `broken` forces the output `broken`). A flip then propagates by rule along inference edges to the observations, which render `consistent` or `contradicted` by comparing the propagated prediction to their stored world-value. More impressive, and a real honesty risk: a wrong rule misleads silently. It earns its way in against the authored version or stays out.

---

## 6. UI mechanics

The hybrid resolves expand-in-place versus replace: replace the focused card, but keep the path and one level of children, and recover the shared-basis gestalt through the sideways links rather than by rendering the whole tree.

- **Spine rail (top).** The decomposition path from the root claim to the focused node, horizontal, each segment a `label` and clickable to jump back up. It also marks which case and which claim the current node sits under. This is "where am I and how do I get back," always visible.
- **Focused card (center).** The open node's full schema, section 3.
- **Collapsed children (below).** The immediate `children` as collapsed one-line cards. Always exactly one level down is visible. Clicking a child promotes it to focused and pushes the rail. Deep trees never sprawl, because only one level renders at a time.
- **Sideways panel (compare).** Invoked from the footer, slides in over the children without losing the rail: the abstract entry and the clones with departures. Dismissing returns to the decomposition position.

**The shared-basis gestalt, without the tree.** Two branches sharing a primitive is not shown by rendering both branches. It is shown on the primitive's own card, whose `parents` back-references list every place it is used, across this case and across cases. So the reader reaches Mandelstam s under the production branch and sees "also used in: ..." which is the same node the other branch points at. The sharing is read through instantiation, which works even when the two uses are far apart in a large DAG. This is the gestalt expand-in-place promised, delivered without its sprawl.

**Mobile and scroll.** Rail is a single horizontal strip, focused card is full-width, children stack below. One level plus the rail fits a phone screen; the sideways panel is a full-screen overlay with a back affordance.

---

## 7. Attaching to the existing artifact

This extends the node-view the artifact already has rather than replacing anything.

- **`#nodeview` becomes the node card.** The artifact already drills from a claim word into a per-claim node detail. The card is that view enriched with the three motions and the schema fields.
- **Three coupled stores.**
  - **Case graph** (the existing `kg-graph`): the inference path of each case, claim to measurement, already typed. Add one field to each derivation-segment node: `interior`, the root of its decomposition DAG.
  - **Decomposition DAG** (new): `transformation` and `primitive` nodes with `children`/`parents` edges, shared leaves, authored per case. The LHC cascade is the first instance, already laid out to drill.
  - **Atlas** (the math map scaffold): `AtlasEntry` records with `clones` and `departure`. Transformation nodes carry `atlas_ref` into it. This is the store we already have.
- **Nesting.** The case-level inference path is the coarse view: claim, one derivation segment, measurement. Opening the segment reveals the fine inference graph inside it, which terminates at the same measurement node. Inference is therefore fractal: a segment is one edge at the case level and a sub-graph inside, and the observation is shared across both levels. Perturbation at either level reaches the shared observation.
- **Schema migration.** Extend the `kg-graph` JSON with the node kinds, the field schema, the `children`/`parents` DAG edges, the `inputs`/`outputs` inference edges, the `atlas_ref`/`citation` sideways links, and the `perturb` payloads. The existing wrapping and register machinery is untouched.

---

## 8. Build order

Tractable first, with the hard parts named.

- **v0, the schema, immediate.** Author the LHC cascade as a decomposition DAG with the full field set. No new UI. The test is whether every node gets `role`, `takes`, `produces`, `breaks`, `why_breaks`, `math`, and either `children` or `citation` cleanly. This is "does the schema survive contact," and it is the next step after this spec.
- **v1, decompose.** The spine rail, focused card, and collapsed children, decompose-only, with the primitive-versus-transformation visual distinction. Renders the v0 DAG. This is the core drill-down and answers the original "click an element, see what it is and how it decomposes, all the way down."
- **v2, compare.** The sideways panel and departure view. Requires at least two cases sharing a transformation, so it lands after the population-mismatch family is authored across COVID and eggs. This is where compounding becomes visible, and where the family claim becomes measurable on screen rather than asserted.
- **v3, perturb.** The authored overlay: flip an assumption, apply its stored cascade, highlight the inference trail, turn the contradicted observation red. The LHC counterfactual, delivered. Authored, not computed.
- **v4, computed perturbation, optional.** The propagation engine, only if it earns its way against v3.

**Named gaps, not hidden.**
- The DAG deduplication asks when two sub-steps are "the same primitive." That is the same identity question as the family discrimination, now at the leaf, and it is not free.
- Authoring cost is real and uneven: primitives are cheap (cite), mid-level transformations are work, and `why_breaks` is the expensive field because it is the one that carries the verdict.
- Authored perturbation is honest but manual: every counterfactual is stated by whoever built the entry, so the overlay is only as good as the authoring. Computed perturbation trades that manual honesty for a silent-error risk.

The build is staged so each version is usable alone: v1 is a working drill-down on one case, v2 makes reuse visible across two, v3 makes the load-bearing evidence manipulable. None of them waits on v4.
