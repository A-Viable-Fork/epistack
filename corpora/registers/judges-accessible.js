// Role: the accessible register of the judges document (Prompt: register view, phase B). Pure data,
//   an ordered list of section records, one per precise section of docs/what-stands-without-trust.md.
//   The precise register stays the canonical markdown, untouched; this is the second reading over the
//   same claims, authored against docs/register-view.md and the three worked slices. Regenerated in
//   full from the rewritten precise document (rewrite pass, July 2026); each accessible section is
//   re-derived from its final precise section, not edited in parallel.
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
// HASH NOTE: precise_version values below are sha256 (first 16 hex) of each precise section, taken
//   from its anchor heading line through the line before the next anchor heading, trailing separator
//   lines stripped, trimmed, UTF-8. If build/check-registers.mjs extracts or hashes differently,
//   regenerate these values with the checker's own hasher before shipping.
(function () {
  "use strict";

  var SECTIONS = [
    {
      section_id: "opening",
      precise_anchor: "How to read this submission",
      precise_version: "8b66d8c6be881bd1",
      register_link: "paper-0",
      accessible:
        "How to read this submission. It is two of the shapes the brief names: a critique with counterexamples, and the protocol it forces.\n\n" +
        "Start where the competition starts, with synthesis, what the best deep-research tools produce. The brief asks for work that compounds across teams, survives adversarial reading, and grows with more contributors. A synthesis is one viewpoint's reach, so on its own it gives none of these, and what the brief asks for rules out the thing almost everyone will build. The critique is what is left once those demands are taken seriously: knowledge has to be what stands when trust in the author is removed, because everything the brief wants is a property of claims that survive without their author. Three cases show what one viewpoint's reading smooths flat: a reified dependency in physics, a hidden prior in epidemiology, a swappable frame in nutrition.\n\n" +
        "That forces the protocol, and the protocol is a climb. If knowledge is what stands once the author is removed, something has to do the removing mechanically, and building it is where the critique leads. First the type: a knowledge kernel, a fixed core that grounds claims and lints them in CI, with two markets over it, kernels to trust and surfaces to read and write through. Then one built instance, this submission's top-down meta kernel, one schema over the three domains. Then the generator, which builds a working kernel from a config. Then the proof the generator makes real kernels: the same four cases federated bottom-up as standalone members. Each link proves the one before it, each has an oracle, and above the built climb sits the specified frontier, the coordination fabric a large federation needs to govern its writes, designed and marked as such. The same three cases run the whole way up: the critique's counterexamples, then the instance's demonstration, then the generator's output, then the federation's members. A fourth exhibit, the lineage, shows these mechanisms already run by hand in mature institutions, and that composing them is new. A fifth exhibit, the vocabulary kernel, turns the substrate on its own terms: each word the submission uses is a declaration that stands by adoption, grounding in the document that defines it or, for a borrowed word, in an outside citation.\n\n" +
        "If you read one thing, read the critique and its three cases, because it is why the rest exists. If you then run one thing, run the oracles, each of which states the invariant it checked.\n\n" +
        "Most submissions here will be excellent syntheses of the three cases, and I mean excellent without reservation: ingesting the messy record, tying each claim to its source, telling one claim in different words apart from two claims that only sound alike, separating force from evidence, surfacing the real disagreements, naming what is missing, and rendering all of it fast, across more sources than a person can hold, checkable and forkable. I would use a tool like that. The argument that follows depends on this strength being real, not on it being overstated.\n\n" +
        "A synthesis is the most a single model can do, and that is real. Its limit is structural, not a weakness: a synthesis is one viewpoint's reach, and from inside a single view you cannot separate what is the world from what is the vantage, because the synthesizer is woven through it and cannot be removed from within. Every consequence the brief cares about follows. The next person has to trust it or redo it, because its judgments, this claim is solid, that one is just rhetoric, this is the crux, are the synthesizer's own conclusions, not a structure you can check and extend. Two syntheses of the same question do not combine; merging them puts a person back in the loop. Against someone who disputes a claim it offers the synthesizer's authority, not a floor the disputant also stands on. Cheap generation sharpens this rather than softening it: the better and cheaper the synthesis, the clearer that even the best is still one viewpoint, and the trust it asks for is the whole of what it offers. So a synthesis is read, and then it ends, because being one viewpoint's reach is what it is.\n\n" +
        "Why the best synthesis stops short comes down to what \"knowledge\" has to mean once more than one reasoner is involved.",
      delta:
        "The precise register opens with the how-to-read frame that names the submission as a critique with counterexamples and the protocol it forces; this keeps the frame and its honesty line (the critique complete, the protocol a built climb through the generator and its federation with the coordination fabric the specified frontier), preserves the brief's quoted shape-labels, and collapses only the frame's repetition. The precise register now states the consequence-triple once, in the critique paragraph, with the opening carrying only 'gives none of these'; this mirrors that placement. It enacts the concession through cadence and first-person address; this states the commitment plainly and collapses the capability ramp to one list. The precise register locates the synthesis limit structurally, one viewpoint's reach, then lets the consequences follow; this keeps that order in plainer words.",
      source_links: ["docs/trust-and-view.md"],
      node_links: [],
      verify: [
        "frame: the critique-and-protocol reading carries its honesty line (critique complete; protocol a built climb through the generator and its federation, coordination fabric specified); check built-versus-specified stays unblurred",
        "structural limit: the precise locates the synthesis limit as being one viewpoint's reach, not a list of failures; check the accessible carries the limit-first-then-consequences order and does not read as a takedown",
        "enacted commitment promoted to a stated commitment ('the argument depends on this strength being real'); check it does not read glib about synthesis"
      ]
    },
    {
      section_id: "what-knowledge-is",
      precise_anchor: "What knowledge is, among reasoners who model each other",
      precise_version: "984dc21126160c1a",
      register_link: "paper-1",
      accessible:
        "The definition this submission runs on: knowledge is what is left of a claim as trust in whoever produced it is turned down. For a single claim, that remainder is the floor the kernel measures against. Taken all the way, it says how the turning-down is actually done: trust in the knower is replaced by a warrant that does not need the knower, and giving a claim a type is how. To type a claim as a measurement is to put it through the measurement's turning-down, driving how much the claim depends on its author toward the measurement floor. The type sets the form this takes, and there are two forms, split by whether the type can secure itself.\n\n" +
        "When a type secures itself, the turning-down goes all the way to zero, and a mathematical proof is the pure case. A valid proof asks you to trust nothing about who wrote it; it asks you to check the steps. One review removes the prover completely: the theorem stands on the check, not on the prover, who could be anyone or no one. That complete removal is subtraction, the limit only self-securing types reach, and it is what the gate does to any checkable claim: it verifies instead of trusting, which is peer review made mechanical.\n\n" +
        "When a type cannot secure itself, the turning-down approaches a floor without reaching zero, and a measurement is the case. One physicist's measurement is a declaration you either trust or not, and no single measurement removes the measurer. Agreement across independent measurements does the work instead: dependence on any one measurer is driven down toward a floor that still rests on the measurements, and the knowledge is what survives any one of them being wrong. A collider's safety is not any one team's finding; it is what still stands when every team's authority has been turned down and only the structure of their agreement is left. One measurement is testimony; many, composed so that no measurer is load-bearing, are knowledge. This is the LHC case's own shape.\n\n" +
        "The same operation places synthesis. Knowledge is a hold, a synthesis a reach. Knowledge is what stands across viewpoints, made of syntheses and equal to none of them, and the settled ground each new synthesis starts from, so the two are a cycle: every hold was once a reach, every reach starts from holds, and no reach is itself a hold, because a hold bears weight independent of the line that found it. A synthesis stands to knowledge as one measurement stands to the measured constant. So the complaint that a synthesis ends is not that it is weak but that it is one viewpoint, and one viewpoint is not knowledge until the synthesizer's part has been turned down out of it, which a lone synthesis cannot do to itself. One case is the exception: where a claim carries its own check, a proof, the removal completes from inside a single synthesis, because anyone can check the steps, so one reasoner establishes knowledge with no agreement across others needed, and formal domains are where the synthesizer self-eliminates. Everywhere else, empirical and contested, a synthesis cannot secure itself, so knowledge is the cross-viewpoint invariant.\n\n" +
        "Verification and agreement are two forms of the one typing operation, differing because the types differ in whether they secure themselves. That says what the composition is and is not: not statistical averaging of noisy reports, which is only the weaker fallback where individual checking is impossible, but the replacement of trust with a warrant that needs no knower. A synthesis can perform neither form, and this is the critique at its sharpest: a synthesis composes by having a synthesizer read the declarations and write a new one, so the synthesizer is never verified and never removed, only trusted, and removing them destroys the result. The structure performs both: the gate verifies what secures itself, and composition turns the knower down out of the rest, so a synthesis enters as claims to be grounded and a view to be chosen among, and the individual reading becomes part of what stands without its author.\n\n" +
        "The bound is exact. This produces knowledge in the specific sense of standing that does not depend on the knower, not truth. The structure does not manufacture true claims; it mechanizes the verifying and the agreement a scientific community already treats as where knowledge lives, so what review and replication achieve over years becomes a property the structure carries. And knower-independence is the axis the competition's own goal names: a thing that survives the removal of its producer is exactly a thing that travels, combines, and survives scrutiny.\n\n" +
        "Read the definition operationally and two requirements fall out. Justification that lives outside the agent has to live somewhere a second agent can point at: a typed structure, the claims and the reasons between them on a shared map, each labeled by what it is and what it rests on. Justification a distrusting party can check has to be decidable without appeal to the asserter, because anything settled by authority is exactly what someone who rejects the authority cannot check: mechanical grounding, where whether a claim holds is a property of the structure, computed rather than granted, the same answer for everyone. Grant the definition and you have already granted these two, and they are what this submission builds, with the build state of every part graded in the status ledger.",
      delta:
        "The precise register's constitutive figure is now 'knowledge is the invariant left as the model is attenuated', with typing as the attenuation; this renders attenuation as 'turning down' trust, a plainer figure of the same kind that keeps the mechanism (a dial driven down, not a switch), and keeps 'subtraction' by name as the zero-limit only self-securing types reach. The precise register splits the warrants by whether the type self-secures; this keeps that split and each payoff line ('peer review made mechanical,' 'one measurement is testimony; many are knowledge'). The bound, knower-independent standing and not truth, is stated plainly.",
      source_links: ["docs/trust-and-view.md", "docs/knowledge-system-why.md", "docs/knowledge-system-how.md"],
      node_links: [
        { phrase: "A collider's safety", node_key: "lhc.claim" }
      ],
      verify: [
        "constitutive figure: 'the invariant left as the model is attenuated' -> 'what is left of a claim as trust in whoever produced it is turned down'; a plainer figure of the same kind that keeps attenuation as gradual, with subtraction named as the zero-limit of the proof case only",
        "earned analogy kept verbatim: 'one measurement is testimony; many are knowledge'; check it still reads as the claim at its tightest",
        "synthesis-placement paragraph (one viewpoint, the hold-and-reach cycle, the self-securing-proof exception); check it carries the whole placement, honoring synthesis, not a dismissal"
      ]
    },
    {
      section_id: "kernel-watched-at-work",
      precise_anchor: "The kernel, watched at work",
      precise_version: "69172f3c3c18242f",
      register_link: "paper-2",
      accessible:
        "Take a real claim from the tree: that LHC collisions carry no black-hole catastrophe risk. In the graph it is a typed record. Its support runs down to the claim that nature has run higher-energy versions of the same collision for billions of years, which runs down through the measured flux of cosmic rays that strike the moon and the dense stars that survive them, and bottoms out in an astronomical measurement, a floor, a place where the claim's standing rests on something anyone can recheck. The engine computes how far the claim's support actually reaches toward that floor, from the graph alone, and someone who trusts none of the authors in the record recomputes the same answer, because the answer is a property of the structure and the structure is public.\n\n" +
        "Now watch what the machinery knows while it does this. It knows the claim's type, the edges below it, and the kind of floor those edges reach. It has no idea the claim is about physics. Hand it a claim about early COVID case clustering and it runs the same computation down to an epidemiological estimate. Hand it the claim that eggs are healthy and it runs the same computation down to a declaration, because \"healthy\" bottoms out in a public act of defining what the word will mean. The floor differs by domain, a measurement in physics, a contested estimate in epidemiology, a declaration for a definition. Treating every floor the same way is the whole of what the kernel does.\n\n" +
        "Here one word has been doing two jobs, and separating them is the point. One job is trust: the deterministic, checkable core on one side, the fallible producers around it on the other. A producer is anything that emits claims, a person, a model, or a pipeline, and the core checks the claim's structure, not the producer's nature, so the real boundary is checkable-core against fallible-producer, and every producer is checked the same way. The other job is domain: whether a body of claims covers one subject or several. \"Kernel\" has meant both, and that is a confusion worth ending, because the trusted core is about no subject at all. There is one kernel in the trust sense, the schema and the gate and the grounding rule, and it is domain-agnostic by design: its job is to be the part that stays fixed no matter what the claims are about. Domain lives in the content and its floors. Agnosticism lives in the kernel.\n\n" +
        "Because the core checks the claim and not the claimant, any difference in how producers are treated, whether agents may do a given step, whether a model is trusted like a person or held back, is a setting a community configures, not something the architecture fixes. The parameters register draws that line, putting agent policy in the free tier, and the standing system makes a chosen policy enforceable. This says where the decision lives, not that agent behavior is unconstrained: the architecture makes agent policy explicit and enforceable instead of baking one in, which is safer.",
      delta:
        "Small. The precise register says \"descends\" as a ramp of one descent; this keeps one descent verb and trims the restatement. The near-figure \"a word carrying two loads\" becomes \"doing two jobs,\" which over-commits to nothing. No claim and no figure is dropped; the parallel closing (\"Domain lives in the content ... Agnosticism lives in the kernel\") is kept because that compression is the claim at its tightest.",
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
      precise_version: "d81b8455486bd2a0",
      register_link: "paper-3",
      accessible:
        "The kinds of kernel line up on one axis: who holds authority over the schema.\n\n" +
        "A domain-specific kernel is content over the core for one subject, with its own schema and its own floors. It is the base unit; the other two are ways of arranging several of them.\n\n" +
        "A bottom-up meta kernel is assembled from independent domain kernels that already exist. Each keeps its own schema. They join at one shared type, and a composite picks which kernels to include for a question. Standards grow upward from use, and authority stays with the domain kernels: the composite proposes, the members decide.\n\n" +
        "A top-down meta kernel starts from one schema built to span the domains and instantiates them as regions inside it. Authority lives in the single schema, and composition is native, because everything was one type system from the start. Under bottom-up, the LHC analysis is its own physics kernel joined after the fact to an independent epidemiology kernel; under top-down, it is a region of a larger tree whose claims compose with epidemiological claims by the same rule as two physics claims.\n\n" +
        "The hinge that makes this an axis rather than three boxes is the untyped type: one type every schema shares. It holds two things and treats them the same, a claim imported from another kernel whose foreign type the local schema does not understand, and a claim a local author declined to type. The rule for both is severe in one exact way: the untyped type is not a floor, so nothing grounds through it, and a claim resting on an untyped claim is untyped in turn, which closes the laundering channel. An untyped claim is one the turning-down has not touched, so standing cannot be imported, only earned, and it is earned by forking, at two scales: a retail fork casts one untyped claim into a local type and signs the cast, one author putting the claim through that type's turning-down and owning the assertion; a wholesale fork extends the schema itself, so a whole category of crossings types natively from then on. Enough retail forks of the same kind are the evidence the category should exist: that is how a shared vocabulary grows from use rather than by decree, and it is why the axis is continuous. A top-down kernel is the point where every crossing is an identity, a federation is the point where every crossing is a lossy untyped bridge, and both ends drift toward the other. Neither end is better; each suits its regime, top-down for one author over a unified analysis, bottom-up for many authors who will never agree on types.",
      delta:
        "The precise register develops the untyped type and the two fork scales in compressed form after the rewrite; this keeps the payoff of each (nothing grounds through the untyped type; standing is earned not imported; the fork subjects the claim to the local type's turning-down; the axis is continuous) in plainer words. The two per-arrangement LHC illustrations are one comparative sentence in the precise register now, mirrored here. No claim is dropped.",
      source_links: ["docs/kernel-taxonomy.md"],
      node_links: [],
      verify: [
        "ramp collapse: the untyped-type and fork material is compressed to payoff lines; confirm no distinct claim (retail vs wholesale, the continuity of the axis, regime-suitability) was lost",
        "the fork is now stated as subjecting a claim to the local type's turning-down; confirm this reads as the same earning-of-standing mechanism, not a new one"
      ]
    },
    {
      section_id: "what-was-built",
      precise_anchor: "What was built: a knowledge kernel, arranged top-down",
      precise_version: "27cea95a318c1edc",
      register_link: "paper-4",
      accessible:
        "The contribution is the knowledge kernel type: a fixed core that declares grounding, a linter that checks the declared grades on every change, and shared subtrees others opt into, opening the two markets named above. The top-down meta kernel is the instance built here, chosen for a stated reason: a sole author spanning three domains under a competition asking for one checkable analysis fits the top-down setting, and the same type arranged bottom-up is what a different entrant, many labs federating knowledge bases they already keep, would build instead.\n\n" +
        "The instance is one designed schema, shown to span three domains that share nothing in subject matter, physics measurement, epidemiological contestation, normative weighing. \"Shown\" is the word doing the work: a schema for all things would be an unfalsifiable boast, a schema for these three, with the tree in the repository, is checkable.\n\n" +
        "The schema is small. Every claim sits at a position in one ordering, from the untyped type at the bottom, through the tiers of a still-contested claim, to three floors at the top: proof, measurement, and declaration. The ordering measures one thing, how much a downstream claim may lean on this one. Two positions ride on each claim, the highest its kind could ever reach and the grounding it actually reaches given what it rests on, and a claim is as settled as its kind allows exactly when the two meet. Each claim also carries its history, its origin and its crossings and the forks that retyped it, so its standing is a chain back to a floor, not a bare verdict.\n\n" +
        "Grounding propagates by one rule. A claim that needs several parts is as grounded as its weakest necessary part; a claim with several sufficient paths takes its strongest; support that leans on a contested assumption carries the contest forward. The gate admits a contribution only when the grounding it declares is covered by the grounding it can show, so the graph never holds more standing than it earned. The floor is the only anchor, every claim above it inherits its standing from what it rests on, never from who asserted it, and the rule that prices a physics assumption prices an epidemiological prior by the same arithmetic.\n\n" +
        "The proof that this does real epistemic work is the three cases, and each yields the counterexample a good synthesis would have smoothed flat.\n\n" +
        "The LHC safety argument looks robust: several independent lines of evidence, all converging on \"safe.\" It looks that way until the graph makes the dependency those lines share into its own node, and the convergence reprices as one assumption wearing several coats. In the tree this is one operation, the shared node made explicit and the contamination rule doing the rest. In prose it is a subtlety that lasts only as long as the writer remembers to mention it.\n\n" +
        "The COVID origins evidence looks decisive, in whichever direction the teller wants. It looks that way until the prior each verdict turns on is named as a claim in its own right, and the debate resolves into a disagreement over a single weighing, held in the open where a reader can reprice it. The engine traces the loudest statistical dispute to a method pushed past the range it was built for, prices what each side assumes, and leaves the verdict where it belongs, with the reader.\n\n" +
        "The egg nutrition verdict reads like a plain fact. It reads that way until you swap the frame it takes for granted, which population, which health outcome, which food the egg is replacing, and the verdict swaps with it. The engine splits the casual question into the several questions hiding inside it, answers the ones a measurement can settle, and follows the definitional one down to its floor: a declaration, a public act of settling what \"healthy\" will mean here, which is where a question about what counts as healthy honestly ends.\n\n" +
        "Three domains, three floors, three counterexamples, one schema. That sentence is the demonstration: the same grounding arithmetic exposed a reified dependency in physics, a hidden prior in epidemiology, and a swappable frame in nutrition, and it could do so because the kernel never knew the difference.\n\n" +
        "The submission's second job follows from the first. A top-down kernel whose schema is public is a base others can fork, retail per crossing and wholesale per category, and the untyped type already sits at the bottom of this tree's ordering, so the artifact demonstrates the top-down type and ships the hinge the other direction needs.\n\n" +
        "That the contribution is the type and not this instance is a checked fact, because the type is carried up four steps and each step has an oracle. The type is the kernel, built here and shown on the three cases. Then the content-addressed crossing: a type is a bundle whose hash freezes its meaning, so two kernels that mean the same thing by a type pin the same hash, and check-crossing proves a same-hash crossing composes native and lossless while an unpinned one arrives untyped and grounds nothing until a fork restores standing. Then check-agreement confirms the four cases agree on the common kinds, which lets those kinds be shared. Then the generator builds a kernel from a config and runs the real gate and real check over it, proven by regenerating a case's schema exactly. Then the proof the generated kernels are real: the four cases federated bottom-up as standalone members, and check-bottomup confirms adversarially that each owns its schema, that standing crosses only through an owned fork so no member's authority reaches another, and that same-hash crossings compose native. The generator regenerating the cases and the cases federating as standalone members is what turns \"the contribution is the type\" from a sentence into a checked property. Above this built climb sits the specified frontier, the coordination fabric that governs writes at scale.",
      delta:
        "The three case figures are kept verbatim and grounded, not translated: their precision lives in the nodes they point at. \"One assumption wearing several coats,\" \"a method pushed past the range it was built for,\" and the frame-swap are compressions of claims the graph holds literally, so they stay and the link discharges them. The one constitutive tail, that a definitional claim \"honestly terminates\" at a declaration, is made plainer (\"a public act of settling what healthy will mean\") and the delta is that this floor is proper, not a shortfall, which the linked declaration node supplies. The precise register now names the markets once, in the opening, and points back (\"the two markets named above\"); this mirrors that. The gate discipline, exclusion record, and periphery detail live in the precise register's disciplines paragraph; here the gate's admit-rule is folded into the grounding paragraph and the periphery detail is left to the precise reading.",
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
        "type-first reframe: the opening states the contribution is the knowledge kernel type and the top-down meta kernel is its fitted instance; confirm the accessible opening matches the reframed precise opening and holds the both-markets-unpopulated honesty",
        "earned case-figures kept verbatim and grounded (no delta): 'one assumption wearing several coats' -> lhc.claim robustness; confirm the reprice is the read the reader lands on",
        "the shared LHC dependency grounds to the reified framework-choice node and the COVID move to a named prior, both resolved through the read contract after the full-merge snapshot; confirm 'framework choice' and \"Miller's prior\" are the faithful finer nodes",
        "eggs frame-swap mapped to eggs.comparison (mean vs individual) and eggs.prediction (mean applied to an individual); confirm these are the faithful framing nodes",
        "constitutive tail 'honestly terminates' -> 'honestly ends' + 'a public act of settling what healthy will mean'; delta names the floor as proper, not a shortfall",
        "enumeration kept whole: the closing 'three domains ... one schema' carries three grounding links, one per case",
        "flagged compression: the disciplines paragraph (gate, exclusion record, periphery) is carried here only as the gate's admit-rule; confirm the exclusion record and periphery are not load-bearing for this section's accessible reading, since the precise register keeps them in full"
      ]
    },
    {
      section_id: "where-it-points",
      precise_anchor: "Where it points",
      precise_version: "831dc8ccdd524339",
      register_link: "paper-5",
      accessible:
        "The bottom-up meta kernel is built, the four cases federated as standalone members and verified as the climb's last step, and it is the arrangement for the other regime, many authors who will never share a schema. Independent kernels, each owning its own types, join at the untyped type; composites pick members per question; standing crosses only by owned forks; and retail forks pile up into wholesale ones, so a federation grows a shared vocabulary out of use, the way a path becomes a road because people kept walking it. The mechanics, the composite, the transfer semantics, and the standards-from-use dynamics are detailed in the appendix and run by the bottom-up build. What a community sets for itself and what every kernel must hold to stay composable is drawn by the parameters register: a free tier a community configures, time locks, standing rules, agent policy, type system, and a thin required tier of composition invariants no kernel may break without leaving the protocol. Diversity in the free tier, unity in the required tier, is the same taxonomy read as governance.\n\n" +
        "Where this goes past the built work, the continuation and why the next phase is worth funding, is set out in Where This Goes: the destination, the roadmap that begins at a present problem, and why the commercial path aligns with the commons rather than capturing it.",
      delta:
        "The precise register no longer repeats the check-bottomup detail here (the climb carries it) and points at the appendix for the mechanics; this mirrors both moves. No mechanism is dropped.",
      source_links: ["docs/parameters-register.md", "docs/kernel-taxonomy.md"],
      node_links: [],
      verify: []
    },
    {
      section_id: "evaluating-an-enabler",
      precise_anchor: "A note on evaluating an enabler",
      precise_version: "003671f286cd7fd1",
      register_link: "paper-6",
      accessible:
        "There is a tension in judging this submission, and it is more honest to name it than to let it settle by default. Uplift runs on two ordered axes. One is teaching: bringing a reader up to speed, which strong synthesis tools do well. The other is claim: improving the knowledge itself as a checkable, composable object that survives the removal of trust. Teaching sits downstream of claim, because a reading stands on a trust-side object and only the claim axis makes such objects: a better synthesis teaches better and makes nothing more checkable, while a checkable claim teaches the shape a synthesis buries and seeds a market of teachers over one trust. This submission works the claim axis, the upstream one, and is deliberately modest on its own direct teaching, so a judge calibrated to teaching will miss that the contribution is what the teaching axis composes over.\n\n" +
        "On the claim axis the uplift has a present part, what the artifact does directly, grounding a claim's standing checkably, making refutations stick, tracing provenance, locating a disagreement's frontier; and an enabled part, larger, which is why separating trust from view matters: because trust is set once and shared, a market of interfaces can form over it, each improving the claim axis for a different reader, none of them having to be trusted about the grounding, claim uplift compounded across many readers rather than delivered by one.\n\n" +
        "The enabled part is where the scoping choice lives: judge the artifact alone, or the architecture as an enabler. A submission whose contribution is an enabler is, by the competition's own compounding and scaling criteria, meant to be judged on what it enables, so judging the artifact in isolation applies those criteria incompletely. The bound is the one the whole submission keeps: the market is enabled, not guaranteed, so the claim is to the enablement, which the external contract's feasibility shows, not to the realized uplift of interfaces not yet built. Whether to credit enablement is the judge's call; naming it is the submission making the structure of its own evaluation explicit, the way it makes structure explicit everywhere.",
      delta:
        "The precise register merged the present and enabled components into one paragraph; this mirrors the merge. No claim is dropped.",
      source_links: ["docs/epistemic_uplift.md"],
      node_links: [],
      verify: [
        "this section is offered as a finding, not a bid; confirm the accessible reading keeps the enabled-not-guaranteed bound and does not overclaim a market"
      ]
    },
    {
      section_id: "reading-on",
      precise_anchor: "Reading on from here",
      precise_version: "35e212b5975be4cd",
      register_link: "paper-7",
      accessible:
        "Two companion documents sit beside this argument, and three supporting ones behind it, all below the core reading budget. Where Each Criterion Lives maps each evaluation criterion to the part of the architecture that answers it and its place in the repository. Robustness Under Adversaries answers the one objection this argument invites, a capable adversary gaming the gate or capturing the write path, with the honest split between the recoverable half that runs today and the cost half specified in the open. Epistemic Uplift argues generalizability, that the three cases show a general shape rather than a fitted one, on the competition's own list of strong examples and on the market of views a checkable structure unlocks. The Adversarial Walkthrough runs the solution type through five concrete attacks. And Reading the Brief quotes the competition's guidance and shows the decision that followed from each, marking where a choice came first and the guidance merely confirmed it.",
      delta: null,
      source_links: [],
      node_links: [],
      verify: []
    },
    {
      section_id: "postscript",
      precise_anchor: "Postscript: a dated note on scaling",
      precise_version: "11e1418285c6d7be",
      register_link: "paper-8",
      accessible:
        "A dated observation, added after the argument above, which stands on its own.\n\n" +
        "In late June 2026, during the competition window, a new AI workbench for scientific research, Claude Science, was released: a working environment with artifact generation, a reviewer agent, session forking, and integrated tools. It does not interoperate with this kernel, and this note does not claim it does. The point is structural: a purpose-built science workbench occupies exactly the periphery slot this architecture predicts. Its generating and reviewing is producer-and-consumer work; its own design already routes that work through a gate into a store and back out through a contract, converging on a core that stays fixed while the surface changes. The discipline is the same whether the producer is a person, a general model, or a purpose-built workbench: the periphery is where capability accrues, and the membrane is what holds. This is the scaling criterion shown by an event in the world rather than argued on paper: as the tools improve, the periphery improves, and the kernel does not move. It is dated as a structural observation, not a claim about the product's current features, so it does not decay as those features change.",
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
      precise_version: "65ed6e203b9216b2",
      register_link: "paper-10",
      accessible:
        "The main argument places the bottom-up meta kernel as built, the four cases federated as standalone members and verified by check-bottomup. This appendix documents the federation the bottom-up build runs, and states its trade-offs as design, not deficiency.\n\n" +
        "The members are domain kernels that already exist and were built without coordination, a physics kernel with proof and measurement floors, an epidemiology kernel whose floors are estimates with stated methods, a policy kernel whose floors are declarations. Each is standalone; nothing in the federation can change a member's types from outside, and that independence is what lets a community adopt the protocol without first agreeing with anyone.\n\n" +
        "A composite is a named set of member kernels assembled for a question, plus the crossings its author built between them. It is itself a kernel in the trust sense, its selection and crossings are gated typed records, and it holds no authority over its members; two composites can disagree about which crossings to make and both stand, the disagreement itself recorded structure.\n\n" +
        "A claim entering a composite from a member arrives as the untyped type. Nothing grounds through it, and everything resting on it is untyped in turn. This deliberately weak default is the honest price of federation: transferred standing starts at zero because the receiving schema has no basis for more. The alternative, automatic translation between schemas, would make the protocol understand every member's types, which puts back at the seam the trusted authority the kernel exists to remove.\n\n" +
        "A retail fork is one author casting one untyped claim into a local type and signing the cast, with their own standing behind it, gated and recorded like any claim. If the source changes in its home kernel, the fork points at a version and does not silently follow, so staleness is a checkable fact. Retail forks are cheap, local, and reversible, which is why they are the unit of adoption. A wholesale fork extends a schema so a category of crossings types natively; it is heavier, a schema change under the receiving kernel's own governance, and its justification is empirical: when many authors have independently cast the same kind of foreign claim into the same local type, the category has proven itself in use, and the wholesale fork ratifies a practice rather than legislating one. That is standards from use: the shared vocabulary of a federation is grown, crossing by crossing, out of the public record of what people actually needed to carry over.\n\n" +
        "As wholesale forks accumulate, member schemas grow shared regions and the federation drifts toward the top-down end; a region whose authors want different types can fork back out across an untyped bridge, so the axis stays open both ways, per the taxonomy. And the untyped type, already at the bottom of this submission's ordering, is the single piece of machinery the two arrangements share.",
      delta:
        "The precise appendix is organized under bold sub-labels (the members, the composite, transfer semantics, retail forks, wholesale forks, convergence); this keeps each as a plain paragraph and drops the labels. The precise register's convergence entry now points back to the taxonomy for the regime distinction rather than restating it; this mirrors that. No mechanism is dropped.",
      source_links: ["docs/kernel-taxonomy.md", "docs/parameters-register.md"],
      node_links: [],
      verify: [
        "the federation is built and the coordination fabric that governs writes at scale is specified; confirm the accessible reading keeps that built-versus-specified line and reads the federation as run by check-bottomup"
      ]
    }
  ];

  var API = { judgesAccessible: SECTIONS };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  if (typeof window !== "undefined") window.EpiRegisters = API;
})();
