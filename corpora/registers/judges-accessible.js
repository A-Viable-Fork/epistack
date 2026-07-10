// Role: the accessible register of the judges document (Prompt: register view, phase B). Pure data,
//   an ordered list of section records, one per precise section of docs/what-stands-without-trust.md.
//   The precise register stays the canonical markdown, untouched; this is the second reading over the
//   same claims, authored against docs/register-view.md and the three worked slices.
// Contract: exposes REGISTERS.judgesAccessible (a global for the browser periphery, read the way the
//   shell reads the inlined snapshot and readings) and module.exports for Node (the drift oracle).
//   Each record: { section_id, precise_anchor, precise_version, accessible, delta, source_links,
//   node_links: [{phrase, node_key}], verify, register_link }. node_key values resolve through the
//   propose/read contract (api.read/{contains}), invariant across registers.
// Invariant: data only, imports nothing (corpus convention). No grounding here: node_links name the
//   node, the shell reads its live grade and robustness through the contract. Every figure translation
//   and every constitutive-figure delta is listed in `verify` as an authored-fidelity obligation the
//   structural drift check does NOT discharge; a passed check is scaffolding, not fidelity.
// DEPARTURE: the worked slices name fine node ids (lhc.safe, covid.ev.clustering, prior.miller-zoo,
//   F-throughput, ...) that are not real nodes in the tree. node_links here use the real resolvable
//   keys whose statement the prose claim matches (lhc.claim, lhc.branch1, lhc.observation,
//   covid.instance, eggs.instance, eggs.comparison, eggs.prediction). Where the slice named a finer
//   grounding than the tree yet exposes through the contract, the coarser real node carries the claim
//   and the finer obligation is listed in `verify`.
(function () {
  "use strict";

  var SECTIONS = [
    {
      section_id: "opening",
      precise_anchor: "How to read this submission",
      precise_version: "1b0437c95c7e5917",
      register_link: "paper-0",
      accessible:
        "How to read this submission. It is two of the shapes the brief names: a critique with counterexamples, and the protocol it forces.\n\n" +
        "Start where the competition starts, with synthesis, what the best deep-research tools produce. The brief asks for work that compounds across teams, survives adversarial reading, and grows with more contributors. A synthesis does none of these: the next person has to trust it or redo it, it dissolves under a determined challenge, and two of them over one question do not combine. What the brief asks for rules out the thing almost everyone will build. The critique is what is left once those demands are taken seriously: knowledge has to be what stands when trust in the author is removed, because everything the brief wants is a property of claims that survive without their author. Three cases show synthesis failing right here, a reified dependency in physics, a hidden prior in epidemiology, a swappable frame in nutrition, each one it would smooth flat.\n\n" +
        "That forces the protocol. If knowledge is what stands once the author is removed, something has to do the removing, mechanically. The knowledge kernel is that machine: a fixed core that grounds claims and lints them in CI, with two markets over it, kernels to trust and surfaces to read and write through. It is where analyses compound instead of ending as prose to re-trust.\n\n" +
        "The critique is complete, its argument made and its three cases worked and checked. The protocol is its answer under construction, a built core with a specified frontier, and it says which is which throughout. The same three cases are the critique's counterexamples and the protocol's demonstration at once, and a fourth exhibit, the lineage, shows the protocol's mechanisms already run by hand in mature institutions and that composing them is new, evidence for both at once. If you read one thing, read the critique and its three cases, because it is why the rest exists. If you then run one thing, run the protocol's oracles, each of which states the invariant it checked.\n\n" +
        "Most submissions here will be excellent syntheses of the three cases, and I mean excellent without reservation: ingesting the messy record, tying each claim to its source, telling apart claims that differ from claims that only sound different, sorting which claims support which, separating force from evidence, surfacing the real disagreements, naming what is missing, and rendering all of it fast, across more sources than a person can hold, checkable and forkable. I would use a tool like that. The argument that follows depends on this strength being real, not on it being overstated.\n\n" +
        "A synthesis still falls short of knowledge, for a plain reason: the next person who wants to build on it has to trust it or redo it. Its judgments, this claim is solid, that one is just rhetoric, this is the crux, are the synthesizer's own conclusions, not a structure you can check and extend. The organization lives in the prose, which carries an argument by asking to be believed. Two syntheses of the same question do not combine into one; merging them puts a person back in the loop. And against someone who disputes a claim, a synthesis can offer only the synthesizer's authority, not a floor the disputant also has to stand on. When a plausible synthesis costs nothing to produce, the trust it asks for is the whole of what it offers, and that trust has nothing underneath it. So a synthesis is read, and then it ends.\n\n" +
        "Why the best synthesis stops short comes down to what \"knowledge\" has to mean once more than one reasoner is involved.",
      delta:
        "The precise register opens with the how-to-read frame that names the submission as a critique with counterexamples and the protocol it forces; this keeps the frame and its honesty line (the critique complete, the protocol a built core with a specified frontier), preserves the brief's quoted shape-labels, and collapses only the frame's repetition. It enacts the concession through cadence and first-person address; this states the commitment plainly and loses the enacted sincerity, and it collapses the capability ramp to one list. It calls the second move \"the clearing\" and figures the lost trust as \"hanging on air\"; the plainer figure \"nothing underneath it\" keeps the image but drops \"clearing,\" which in the precise register also sets up the kernel as what fills the cleared ground.",
      source_links: ["docs/trust-and-view.md"],
      node_links: [],
      verify: [
        "frame: the critique-and-protocol reading carries its honesty line (critique complete; protocol a built core with a specified frontier); check built-versus-specified stays unblurred",
        "constitutive figure: 'the clearing' -> 'nothing underneath it'; check the delta names the right non-local loss (the kernel filling the cleared ground)",
        "enacted commitment promoted to a stated commitment ('the argument depends on this strength being real'); check it does not read glib about synthesis"
      ]
    },
    {
      section_id: "what-knowledge-is",
      precise_anchor: "What knowledge is, among reasoners who model each other",
      precise_version: "2d3d801a966c7783",
      register_link: "paper-1",
      accessible:
        "The definition this submission runs on: knowledge is the part of a claim that stays standing when you stop trusting whoever made it. For a single claim, that standing is the floor the kernel measures against. Taken all the way, it says how the \"stop trusting\" is actually done: you replace trust in the knower with a warrant that does not need the knower. There are two such warrants, and which one applies depends on whether you can check a single instance of the claim.\n\n" +
        "When a claim can be checked, you subtract the knower by verifying, and a mathematical proof is the pure case. A valid proof asks you to trust nothing about who wrote it; it asks you to check the steps. One review removes the prover completely, because the theorem stands on the check, not on the prover, who could be anyone or no one. This is the strongest form of subtraction, done in one step, and it is what the gate does to any checkable claim: it verifies instead of trusting, which is peer review made mechanical.\n\n" +
        "When a claim cannot be checked in a single instance, you subtract the knower by independent agreement, and a measurement is the case. One physicist's measurement is a declaration you either trust or not, and no single measurement removes the measurer. The measurer is removed instead across many independent measurements, and the knowledge is what survives any one of them being wrong. A collider's safety is not any one team's finding; it is what still stands when every team's authority is subtracted and only the structure of their agreement is left. One measurement is testimony; many, arranged so no single measurer holds up the result, are knowledge. This is the LHC case's shape: its safety is known not because any one measurement is trusted, but because what survives the composition holds no matter which one you drop.\n\n" +
        "The same subtraction places synthesis, and generously. A synthesis is one reasoner reading the record and reaching a view, the individual act any body of knowledge is built from, and it stands to knowledge as one measurement stands to the measured constant. So the complaint that a synthesis ends is not that it is weak but that it is generation, and generation alone is not knowledge until the knower is subtracted, which a lone synthesis cannot do to itself. The kernel does not replace that act; it composes many of them, so a synthesis enters as claims to be grounded and a view to be chosen among, and the individual reading becomes part of what stands without its author.\n\n" +
        "Read the definition operationally and two requirements fall out, one from each half. Justification that lives outside the agent has to live somewhere a second agent can point at: a typed structure, the claims and the reasons between them on a shared map, each labeled by what it is and what it rests on. Justification a distrusting party can check has to be decidable without appeal to the asserter, because anything settled by authority is exactly what someone who rejects the authority cannot check: mechanical grounding, where whether a claim holds is a property of the structure, computed rather than granted, the same answer for everyone. Grant the definition and you have already granted these two, and they are what this submission builds.",
      delta:
        "The precise register says trust in the knower is \"subtracted,\" and \"subtracted\" is exact: the two warrants are two ways of performing that one operation, which \"stop trusting\" keeps as an image but loses as a mechanism. It ramps each warrant across more restatements; this keeps each payoff line (\"peer review made mechanical,\" \"one measurement is testimony; many are knowledge\") and trims the rest. The bound the precise register states, that this is knower-independent warranted standing and not truth, is carried into the operational requirements rather than restated.",
      source_links: ["docs/trust-and-view.md", "docs/knowledge-system-why.md", "docs/knowledge-system-how.md"],
      node_links: [
        { phrase: "A collider's safety", node_key: "lhc.claim" }
      ],
      verify: [
        "constitutive figure: 'knowledge is what stands when trust in the knower is subtracted' -> 'stays standing when you stop trusting whoever made it'; a plainer figure of the same kind, not a literal paraphrase",
        "earned analogy kept verbatim: 'one measurement is testimony; many are knowledge'; check it still reads as the claim at its tightest",
        "synthesis-placement paragraph (generosity + generation-is-not-knowledge); check it carries the whole placement, not a dismissal"
      ]
    },
    {
      section_id: "kernel-watched-at-work",
      precise_anchor: "The kernel, watched at work",
      precise_version: "aea1e959f12d452e",
      register_link: "paper-2",
      accessible:
        "Take a real claim from the tree: that LHC collisions carry no black-hole catastrophe risk. In the graph it is a typed record. Its support runs down to the claim that nature has run higher-energy versions of the same collision for billions of years, which runs down through the measured flux of cosmic rays that strike the moon and the dense stars that survive them, and bottoms out in an astronomical measurement, a floor, a place where the claim's standing rests on something anyone can recheck. The engine computes how far the claim's support actually reaches toward that floor, from the graph alone. Someone who trusts none of the authors in the record recomputes the same number, because the number is a property of the structure and the structure is public.\n\n" +
        "Now watch what the machinery knows while it does this. It knows the claim's type, the edges below it, and the kind of floor those edges reach. It has no idea the claim is about physics. Hand it a claim about early COVID case clustering and it runs the same computation down to an epidemiological estimate. Hand it the claim that eggs are healthy and it runs the same computation down to a declaration, because \"healthy\" bottoms out in a public act of defining what the word will mean. The floor differs by domain, a measurement in physics, a contested estimate in epidemiology, a declaration for a definition. Treating every floor the same way is the whole of what the kernel does.\n\n" +
        "Here one word has been doing two jobs, and separating them is the point. One job is trust: the deterministic, checkable core on one side, the fallible producers around it on the other. A producer is anything that emits claims, a person, a model, or a pipeline, and the core checks the claim's structure, not the producer's nature, so the real boundary is checkable-core against fallible-producer, and every producer is checked the same way. The other job is domain: whether a body of claims covers one subject or several. \"Kernel\" has meant both, and that is a confusion worth ending, because the trusted core is about no subject at all. There is one kernel in the trust sense, the schema and the gate and the grounding rule, and it is domain-agnostic by design: its job is to be the part that stays fixed no matter what the claims are about. Domain lives in the content and its floors. Agnosticism lives in the kernel.\n\n" +
        "Because the core checks the claim and not the claimant, any difference in how producers are treated, whether agents may do a given step, whether a model is trusted like a person or held back, is a setting a community configures, not something the architecture fixes. The register that draws that line puts agent policy in the free tier, and the standing system is what makes a chosen policy enforceable. This says where the decision lives, not that agent behavior is unconstrained: the architecture makes agent policy explicit and enforceable instead of assuming one, which is safer than baking one in.",
      delta:
        "Small. The precise register says \"descends\" three times as a ramp of the same descent; this keeps one descent verb and trims the restatement. The near-figure \"a word carrying two loads\" becomes \"doing two jobs,\" which over-commits to nothing, so it needs no delta. No claim and no figure is dropped; the parallel closing (\"Domain lives in the content ... Agnosticism lives in the kernel\") is kept because that compression is the claim at its tightest.",
      source_links: ["docs/kernel-taxonomy.md", "docs/knowledge-system-how.md", "docs/trust-and-view.md", "docs/parameters-register.md"],
      node_links: [
        { phrase: "LHC collisions carry no black-hole catastrophe risk", node_key: "lhc.claim" },
        { phrase: "nature has run higher-energy versions of the same collision for billions of years", node_key: "lhc.branch1" },
        { phrase: "the dense stars that survive them", node_key: "lhc.observation" },
        { phrase: "early COVID case clustering", node_key: "covid.instance" },
        { phrase: "eggs are healthy", node_key: "eggs.instance" }
      ],
      verify: [
        "claim-to-node on case moves is an upgrade, not a crutch: the linked node shows the floor the prose asserts, so the accessible reader lands on live grounding",
        "the LHC leg 'nature has run it' maps to lhc.branch1 (Production: has nature already run it?), the survival measurement to lhc.observation (Neutron stars survive); confirm these are the faithful nodes for the two clauses",
        "the three domains stay as three (enumeration, not a ramp): each links to its own case floor"
      ]
    },
    {
      section_id: "three-kernels",
      precise_anchor: "Three kernels",
      precise_version: "43f5c928dde9fafe",
      register_link: "paper-3",
      accessible:
        "The kinds of kernel line up on one axis: who holds authority over the schema.\n\n" +
        "A domain-specific kernel is content over the core for one subject, with its own schema and its own floors. It is the base unit; the other two are ways of arranging several of them.\n\n" +
        "A bottom-up meta kernel is assembled from independent domain kernels that already exist. Each keeps its own schema. They join at one shared type, and a composite picks which kernels to include for a question. Standards grow upward from use, and authority stays with the domain kernels: the composite proposes, the members decide.\n\n" +
        "A top-down meta kernel starts from one schema built to span the domains and instantiates them as regions inside it. Authority lives in the single schema, and composition is native, because everything was one type system from the start. A claim in one region composes with a claim in another by the same rule that composes two claims in the same region.\n\n" +
        "The hinge that makes this an axis rather than three boxes is the untyped type: one type every schema shares. It holds two things and treats them the same, a claim imported from another kernel whose foreign type the local schema does not understand, and a claim a local author declined to type. The rule for both is severe in one exact way: the untyped type is not a floor, so nothing grounds through it. A claim resting on an untyped claim is untyped in turn, which closes the laundering channel: standing cannot be imported, only earned. You earn it out of the untyped type by forking, at two scales. A retail fork casts one untyped claim into a local type and signs the cast. A wholesale fork extends the schema so a whole category of crossings types natively, and enough retail forks of the same kind are the evidence that the category should exist. That is how a shared vocabulary grows from use rather than by decree, and it is why the axis is continuous: a top-down kernel is the point where every crossing is an identity, a federation is the point where every crossing is a lossy untyped bridge, and both ends drift toward the other. Neither end is better; each suits its regime, top-down for one author over a unified analysis, bottom-up for many authors who will never agree on types.",
      delta:
        "The precise register develops the untyped type and the two fork scales across several paragraphs, each restating the crossing rule at rising precision; this keeps the payoff of each (nothing grounds through the untyped type; standing is earned not imported; the axis is continuous) and trims the restatement. No claim is dropped.",
      source_links: ["docs/kernel-taxonomy.md"],
      node_links: [],
      verify: [
        "ramp collapse: the untyped-type paragraph and the fork paragraphs are compressed to their payoff lines; confirm no distinct claim (retail vs wholesale, the continuity of the axis, regime-suitability) was lost"
      ]
    },
    {
      section_id: "what-was-built",
      precise_anchor: "What was built: a knowledge kernel, arranged top-down",
      precise_version: "4b02094ef905e2ac",
      register_link: "paper-4",
      accessible:
        "The contribution is the knowledge kernel type: a fixed core that declares grounding, a linter that checks the declared grades on every change, and shared subtrees others opt into, which open two independent markets, one of kernels to trust and fork and one of surfaces to read and write through. The top-down meta kernel is the instance built here, chosen for a stated reason: a sole author spanning three domains under a competition asking for one checkable analysis fits the top-down setting, and the same type arranged bottom-up is what a different entrant, many labs federating knowledge bases they already keep, would build instead. What follows is evidence the type works, shown on the arrangement this author fitted.\n\n" +
        "This submission is a top-down meta kernel, and that is its exact description: one designed schema, shown to span three domains that share nothing in subject matter, physics measurement, epidemiological contestation, normative weighing. \"Shown\" is the word doing the work: a schema for all things would be an unfalsifiable boast, a schema for these three, with the tree in the repository, is checkable.\n\n" +
        "The schema is small. Every claim sits at a position in one ordering, from the untyped type at the bottom, through the tiers of a still-contested claim, to three floors at the top: proof, measurement, and declaration. The ordering measures one thing, how much a downstream claim may lean on this one. Two positions ride on each claim, the highest its kind could ever reach and the grounding it actually reaches given what it rests on, and a claim is as settled as its kind allows exactly when the two meet. Each claim also carries its history, its origin and its crossings and the forks that retyped it, so its standing is a chain back to a floor that any reader can walk, not a bare verdict.\n\n" +
        "Grounding propagates by one rule. A claim that needs several parts is as grounded as its weakest necessary part; a claim with several sufficient paths takes its strongest; support that leans on a contested assumption carries the contest forward. The gate admits a contribution only when the grounding it declares is covered by the grounding it can show, so the graph never holds more standing than it earned. The floor is the only anchor, and every claim above it inherits its standing by this rule from what it rests on, never from who asserted it, and the rule that prices a physics assumption prices an epidemiological prior by the same arithmetic.\n\n" +
        "The proof that this does real epistemic work is the three cases, and each yields the counterexample a good synthesis would have smoothed flat.\n\n" +
        "The LHC safety argument looks robust: several independent lines of evidence, all converging on \"safe.\" It looks that way until the graph makes the dependency those lines share into its own node, and the convergence reprices as one assumption wearing several coats. In the tree this is one operation, the shared node made explicit and the contamination rule doing the rest. In prose it is a subtlety that lasts only as long as the writer remembers to mention it.\n\n" +
        "The COVID origins evidence looks decisive, in whichever direction the teller wants. It looks that way until the prior each verdict turns on is named as a claim in its own right, and the debate resolves into a disagreement over a single weighing, held in the open where a reader can reprice it. The engine traces the loudest statistical dispute to a method pushed past the range it was built for, prices what each side assumes, and leaves the verdict where it belongs, with the reader.\n\n" +
        "The egg nutrition verdict reads like a plain fact. It reads that way until you swap the frame it takes for granted, which population, which health outcome, which food the egg is replacing, and the verdict swaps with it. The engine splits the casual question into the several questions hiding inside it, answers the ones a measurement can settle, and follows the definitional one down to its floor: a declaration, a public act of settling what \"healthy\" will mean here, which is where a question about what counts as healthy honestly ends.\n\n" +
        "Three domains, three floors, three counterexamples, one schema. That sentence is the demonstration: the same grounding arithmetic exposed a reified dependency in physics, a hidden prior in epidemiology, and a swappable frame in nutrition, and it could do so because the kernel never knew the difference between them.\n\n" +
        "The submission's second job follows from the first. A top-down kernel whose schema is public is a base schema others can fork, retail per crossing and wholesale per category, and the untyped type already sits at the bottom of the ordering, so the artifact demonstrates the top-down type and ships the hinge the other direction needs.",
      delta:
        "The three case figures are kept verbatim and grounded, not translated: their precision lives in the nodes they point at, not in a plainer phrasing. \"One assumption wearing several coats,\" \"a method pushed past the range it was built for,\" and the frame-swap are compressions of claims the graph holds literally, so they stay and the link discharges them. The one constitutive tail, that a definitional claim \"honestly terminates\" at a declaration, is made plainer (\"a public act of settling what healthy will mean\") and the delta is that this floor is proper, not a shortfall, which the linked declaration node supplies. The schema and grounding-rule paragraphs are ramps trimmed to their payoffs.",
      source_links: ["docs/kernel-taxonomy.md", "docs/knowledge-system-how.md"],
      node_links: [
        { phrase: "several independent lines of evidence, all converging on \"safe\"", node_key: "lhc.claim" },
        { phrase: "the dependency those lines share", node_key: "framework choice" },
        { phrase: "one assumption wearing several coats", node_key: "framework choice" },
        { phrase: "The COVID origins evidence looks decisive", node_key: "covid.instance" },
        { phrase: "a single weighing, held in the open", node_key: "Miller's prior" },
        { phrase: "swap the frame it takes for granted", node_key: "eggs.comparison" },
        { phrase: "the verdict swaps with it", node_key: "eggs.prediction" },
        { phrase: "The egg nutrition verdict reads like a plain fact", node_key: "eggs.instance" }
      ],
      verify: [
        "type-first reframe: the opening now states the contribution is the knowledge kernel type and the top-down meta kernel is its fitted instance; confirm the accessible opening matches the reframed precise opening and holds the both-markets-unpopulated honesty",
        "earned case-figures kept verbatim and grounded (no delta): 'one assumption wearing several coats' -> lhc.claim robustness; confirm the reprice is the read the reader lands on",
        "the shared LHC dependency now grounds to the reified framework-choice node and the COVID move to a named prior, both resolved through the read contract after the full-merge snapshot; confirm 'framework choice' and \"Miller's prior\" are the faithful finer nodes",
        "eggs frame-swap mapped to eggs.comparison (mean vs individual) and eggs.prediction (mean applied to an individual); confirm these are the faithful framing nodes",
        "constitutive tail 'honestly terminates' -> 'honestly ends' + 'a public act of settling what healthy will mean'; delta names the floor as proper, not a shortfall",
        "enumeration kept whole: the closing 'three domains ... one schema' carries three grounding links, one per case"
      ]
    },
    {
      section_id: "where-it-points",
      precise_anchor: "Where it points",
      precise_version: "9dba71be5a33496a",
      register_link: "paper-5",
      accessible:
        "The bottom-up meta kernel is the future work this artifact already enables, and it is a design for a different regime, many authors who will never share a schema. Independent kernels, each sovereign over its own types, join at the untyped type; composites pick members per question; standing crosses only by owned forks; and retail forks pile up into wholesale ones, so a federation grows a shared vocabulary out of use, the way a path becomes a road because people kept walking it. What a community sets for itself and what every kernel must hold to stay composable is drawn by the parameters register: a free tier a community configures, time locks, standing rules, agent policy, type system, and a thin required tier no kernel may break without leaving the protocol. Diversity in the free tier, unity in the required tier, is the same taxonomy read as governance. The submission built the right thing for one author over three domains, and it names, with its hinge already in the tree, the thing to build for many.",
      delta: null,
      source_links: ["docs/parameters-register.md", "docs/kernel-taxonomy.md"],
      node_links: [],
      verify: []
    },
    {
      section_id: "evaluating-an-enabler",
      precise_anchor: "A note on evaluating an enabler",
      precise_version: "5f69adb7a2a61155",
      register_link: "paper-6",
      accessible:
        "There is a tension in judging this submission, and it is more honest to name it than to let it settle by default. Uplift runs on two axes, and they are ordered, not independent. One is teaching: bringing a reader up to speed, which strong synthesis tools do well. The other is claim: improving the knowledge itself as a checkable, composable object that survives the removal of trust. Teaching sits downstream of claim, because a reading stands on a trust-side object and only the claim axis makes such objects: a better synthesis teaches better and makes nothing more checkable, while a checkable claim teaches the shape a synthesis buries and seeds a market of teachers over one trust. This submission works the claim axis, the upstream one, and is deliberately modest on its own direct teaching, so a judge calibrated to teaching will see little of the contribution and miss that the contribution is what its own teaching axis composes over.\n\n" +
        "On the claim axis the uplift has a present part and an enabled part. The present part is what the artifact does directly: grounding a claim's standing checkably, making refutations stick, tracing provenance, locating a disagreement's frontier. The enabled part is larger and it is why separating trust from view matters: because trust is set once and shared, a market of interfaces can form over it, each improving the claim axis for a different reader, none of them having to be trusted about the grounding. That is claim uplift compounded across many readers rather than delivered by one.\n\n" +
        "The enabled part is where the scoping choice lives: judge the artifact alone, or the architecture as an enabler. A submission whose contribution is an enabler is, by the competition's own compounding and scaling criteria, meant to be judged on what it enables, so judging the artifact in isolation applies those criteria incompletely. The bound is the one the whole submission keeps: the market is enabled, not guaranteed, so the claim is not to the realized uplift of interfaces not yet built, but to the enablement, which the external contract's feasibility shows. Whether to credit enablement is the judge's call; naming it is the submission making the structure of its own evaluation explicit, the way it makes structure explicit everywhere.",
      delta: null,
      source_links: ["docs/epistemic_uplift.md"],
      node_links: [],
      verify: [
        "this section is offered as a finding, not a bid; confirm the accessible reading keeps the enabled-not-guaranteed bound and does not overclaim a market"
      ]
    },
    {
      section_id: "reading-on",
      precise_anchor: "Reading on from here",
      precise_version: "fcfa6fb6e0834773",
      register_link: "paper-7",
      accessible:
        "Two companion documents sit beside this argument. Where Each Criterion Lives maps the competition's criteria to the part of the architecture that answers each and its place in the repository, so this argument can be checked against the tree. Robustness Under Adversaries answers the one objection this argument invites, that a capable adversary games the gate or captures the write path, with the honest split between the recoverable half that runs today and the cost half specified in the open.\n\n" +
        "Two supporting documents work the argument's two hardest claims for the reader who wants them out in full, both below the core reading budget. On generalizability, Epistemic Uplift argues the case on the competition's own list of strong examples and on the market of views a checkable structure unlocks. On adversarial robustness, the Adversarial Walkthrough runs the solution type through five concrete attacks. And Reading the Brief gives the design rationale in the competition's own terms, quoting its guidance and showing the choice that followed, marking where a choice came first and the guidance merely confirmed it.",
      delta: null,
      source_links: [],
      node_links: [],
      verify: []
    },
    {
      section_id: "postscript",
      precise_anchor: "Postscript: a dated note on scaling",
      precise_version: "0c108d2d0e3c2ae5",
      register_link: "paper-8",
      accessible:
        "A dated observation, added after the argument above, which stands on its own.\n\n" +
        "In late June 2026, during the competition window, a new AI workbench for scientific research, Claude Science, was released: a working environment with artifact generation, a reviewer agent, session forking, and integrated tools. It does not interoperate with this kernel, and this note does not claim it does. The point is structural: a purpose-built science workbench occupies exactly the periphery slot this architecture predicts. Its generating and reviewing is producer-and-consumer work, and its own design already has that work enter a store through a gate and be read back through a contract, so a core that stays fixed while the surface around it changes is the shape it converges on too. The discipline is the same whether the producer is a person, a general model, or a purpose-built workbench: the periphery is where capability accrues, and the membrane is what holds. This is the scaling criterion shown by an event in the world rather than argued on paper. It is dated as a structural observation, not a claim about the product's current features, so it does not decay as those features change.",
      delta: null,
      source_links: [],
      node_links: [],
      verify: [
        "enacted-dated-observation framing promoted to a stated caveat; confirm it reads as a structural point, not a product claim"
      ]
    },
    {
      section_id: "provenance",
      precise_anchor: "Provenance",
      precise_version: "5d60dbab54f6d78e",
      register_link: "paper-9",
      accessible:
        "This work began on June 22, 2026, and was developed in close collaboration with AI systems used as generators and verifiers under human direction. The collaboration is disclosed here under the standard the method applies to every claim: state who did the work and how it was checked.",
      delta: null,
      source_links: [],
      node_links: [],
      verify: []
    },
    {
      section_id: "appendix-federation",
      precise_anchor: "Appendix: the federation, and standards from use",
      precise_version: "36d3b2bba6a888fe",
      register_link: "paper-10",
      accessible:
        "The main argument places the bottom-up meta kernel as future work. This appendix specifies it far enough that a builder could start, and far enough that its trade-offs read as design, not deficiency.\n\n" +
        "The members are domain kernels that already exist and were built without coordination, a physics kernel with proof and measurement floors, an epidemiology kernel whose floors are estimates with stated methods, a policy kernel whose floors are declarations. Each is sovereign; nothing in the federation can change a member's types from outside, and that sovereignty is the point, because it lets a community adopt the protocol without first agreeing with anyone.\n\n" +
        "A composite is a named set of member kernels assembled for a question, plus the crossings its author built between them. It is itself a kernel in the trust sense, its selection and crossings are gated typed records, and it holds no authority over its members; two composites can disagree about which crossings to make and both stand.\n\n" +
        "A claim entering a composite from a member arrives as the untyped type. Nothing grounds through it, and everything resting on it is untyped in turn. This is the deliberately weak default, and its weakness is the honest price of federation: transferred standing starts at zero because the receiving schema has no basis for more. The alternative, automatic translation between schemas, would make the protocol understand every member's types, which puts back at the seam the trusted authority the kernel exists to remove.\n\n" +
        "A retail fork is one author casting one untyped claim into a local type and signing the cast, with their own standing behind it, gated and recorded like any claim. If the source changes in its home kernel, the fork points at a version and does not silently follow, so staleness is a checkable fact. A wholesale fork extends a schema so a category of crossings types natively; it is heavier, a schema change under the receiving kernel's own governance, and its justification is empirical, the accumulated retail forks. That is standards from use: the shared vocabulary of a federation is grown, crossing by crossing, out of the public record of what people actually needed to carry over.\n\n" +
        "As wholesale forks accumulate, member schemas grow shared regions and the federation drifts toward the top-down end, native composition over an ever larger common vocabulary; a region whose authors want different types can fork back out across an untyped bridge. The axis stays open both ways, which is what makes it an axis. The top-down kernel this submission builds suits one author over a unified analysis; the federation suits many authors who will never share a schema, and the untyped type, already at the bottom of this submission's ordering, is the single piece of machinery the two arrangements share.",
      delta:
        "The precise appendix is organized under bold sub-labels (the members, the composite, transfer semantics, retail forks, wholesale forks, convergence); this keeps each as a plain paragraph and drops the labels, and it trims the restatement in each. No mechanism is dropped.",
      source_links: ["docs/kernel-taxonomy.md", "docs/parameters-register.md"],
      node_links: [],
      verify: [
        "the federation is specified, not built; confirm the accessible reading keeps that built-versus-specified line and does not read as a running system"
      ]
    }
  ];

  var API = { judgesAccessible: SECTIONS };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  if (typeof window !== "undefined") window.EpiRegisters = API;
})();
