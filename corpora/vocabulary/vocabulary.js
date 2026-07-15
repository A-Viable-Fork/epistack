// Role: the vocabulary kernel (the fifth exhibit). The submission's own terms as declaration
//   claims, each grounding by adoption in the document that defines it. Core terms are the vocabulary a
//   reader must hold to follow the argument and ground in their home region inside the submission;
//   reference terms are used but not owned and ground in an external citation, the honest floor for a
//   term the submission does not coin. Overloaded terms carry one entry per sense, each with its own home
//   region, so a locality layer can disambiguate by where the word is read.
// Contract: exports VOCABULARY = { store_id, terms:[...] }. A core term carries home (a submission doc);
//   a reference term carries source_id (a row in tables.js SOURCES). Verified by build/check-vocabulary.mjs.
//   Pure data; corpora imports nothing.
// Invariant: every core term's home region contains the term (the oracle checks presence, the drift guard
//   the register-fidelity failure taught). declared_grade reflects adoption honestly: constitutive for a
//   term adopted throughout, supported for a narrower one. A declaration whose home does not define it, or
//   a reference term with no honest citation, is a failure, not a paper-over. No leakage term is authored.
"use strict";

const D = "declaration";
// grade shorthand: c = constitutive (adopted throughout, at the declaration floor), s = supported (narrower adoption).
const t = (ref, term, statement, home, grade, extra) => Object.assign({ ref, term, tier: "core", kind: D, statement, home, declared_grade: grade }, extra || {});
const r = (ref, term, statement, source_id, extra) => Object.assign({ ref, term, tier: "reference", kind: D, statement, source_id, declared_grade: "s" }, extra || {});

const terms = [
  // ===================== the thesis and its parts =====================
  t("vt.knowledge", "knowledge", "knowledge: the invariant left as the model is attenuated, knower-independent warranted standing rather than truth.", "docs/trust-and-view.md", "c"),
  t("vt.model.map", "model", "model: the representation of the territory, the map a reasoner holds, as in the thesis that knowledge is the invariant left as the model is attenuated.", "docs/trust-and-view.md", "c", { sense: "representation", departure: "medium" }),
  t("vt.model.verb", "model", "model: the verb sense, to model other claim-makers, as in recursive modelers, entities that model each other.", "docs/what-stands-without-trust.md", "s", { sense: "verb", departure: "medium" }),
  t("vt.attenuation", "attenuation", "attenuation: driving a claim's dependence on whoever asserted it down toward a floor where the claim stands without its author.", "docs/trust-and-view.md", "c", { departure: "small" }),
  t("vt.typing", "typing", "typing: subjecting a claim to a type's attenuation, driving its dependence on its author down and staking the agent's standing on the claim holding.", "docs/trust-and-view.md", "c", { departure: "large" }),
  t("vt.self-securing", "self-securing", "self-securing: a type whose attenuation completes to zero, so a single checked claim removes its author entirely, as a proof does.", "docs/trust-and-view.md", "c", { departure: "small" }),
  t("vt.subtraction", "subtraction", "subtraction: attenuation's complete form, reached only by self-securing types, where the prover is removed entirely from what establishes the claim.", "docs/trust-and-view.md", "c", { departure: "small" }),
  t("vt.convergence", "convergence", "convergence: the attenuation of non-self-securing types, many independent measurements driving dependence on any one measurer down toward a floor.", "docs/trust-and-view.md", "c", { departure: "small" }),
  t("vt.verification", "verification", "verification: the attenuation form for self-securing types, where checking a single claim plus its review removes its author, made mechanical by the gate.", "docs/trust-and-view.md", "c"),
  t("vt.structural-attenuation", "structural attenuation", "structural attenuation: the kernel's half, driving trust in the producer to zero with respect to structure so a claim's grade recomputes from its cited support by arithmetic anyone can check.", "docs/the-asymmetric-weapon.md", "s", { departure: "small" }),
  t("vt.semantic-attenuation", "semantic attenuation", "semantic attenuation: the community's function, judging whether the cited support is true of the world (whether a measurement happened, a checker exists, claimed independence is real), which the kernel makes checkable rather than performs.", "docs/the-asymmetric-weapon.md", "s", { departure: "small" }),
  t("vt.floor", "floor", "floor: a terminal in the grounding ordering where attenuation bottoms out, a proof, a measurement, or a declaration.", "docs/the-climb-of-synthesis.md", "c", { departure: "large" }),
  t("vt.hold", "hold", "hold: knowledge that bears weight independent of the line that found it, the established ground each new synthesis starts from.", "docs/the-climb-of-synthesis.md", "c"),
  t("vt.reach", "reach", "reach: a single viewpoint's act of reading the record and arriving at a view, one measurement's worth, not knowledge until the synthesizer is attenuated out.", "docs/the-climb-of-synthesis.md", "c"),
  t("vt.synthesis", "synthesis", "synthesis: a single reasoner's integrated answer, reading everything and tying each claim to its source, but still one viewpoint's reach.", "docs/the-climb-of-synthesis.md", "c", { departure: "small" }),
  t("vt.view", "view", "view: the presentation of a claim fitted to a reader, register, and purpose, separated from the trust that makes the claim hold.", "docs/trust-and-view.md", "c", { departure: "large" }),
  t("vt.trust", "trust", "trust: the grounding that survives as trust in the author is attenuated, the part a second party can check without taking the author's word.", "docs/trust-and-view.md", "c", { departure: "large" }),

  // ===================== the kernel machinery =====================
  t("vt.knowledge-kernel", "knowledge kernel", "knowledge kernel: a fixed core of typed claims, a gate that checks them, and shared subtrees others fork, opening two markets over one grounding.", "docs/the-climb-of-synthesis.md", "c"),
  t("vt.typed-claim-graph", "typed claim graph", "typed claim graph: claims labeled by what kind of thing they are and connected to what they rest on, with one rule doing the work.", "docs/the-climb-of-synthesis.md", "c"),
  t("vt.grounding-rule", "grounding rule", "grounding rule: a claim is as grounded as its weakest necessary support, recomputable by any party trusting no one.", "docs/what-stands-without-trust.md", "c"),
  t("vt.contamination-rule", "contamination rule", "contamination rule: the guarantee that weakness flows downward, so a claim never advertises more grounding than its necessary supports provide.", "docs/what-stands-without-trust.md", "c"),
  t("vt.gate", "gate", "gate: the sole write path, admitting a contribution only if it holds together with what is already there and rechecking every declared grade on every change.", "docs/the-climb-of-synthesis.md", "c", { departure: "large" }),
  t("vt.gate-check", "gate check", "gate check: the headless run of the gate over its fixtures and migrated cases, verifying that admission holds to the grounding rule.", "docs/quickstart.md", "s"),
  t("vt.standing", "standing", "standing: a claim's grounded grade in the ordering, computed from the structure rather than granted by an authority.", "docs/the-climb-of-synthesis.md", "c", { departure: "large" }),
  t("vt.declared-grade", "declared grade", "declared grade: the grade a claim advertises for itself, admitted only when at or below the earned grade.", "docs/status-ledger.md", "c"),
  t("vt.earned-grade", "earned grade", "earned grade: the grade a claim actually achieves given what it rests on, computed from the graph alone by the grounding rule.", "docs/status-ledger.md", "c"),
  t("vt.ceiling", "ceiling", "ceiling: the highest grade a kind can ever reach, fixed per kind, so a claim cannot earn past its ceiling however strong its supports.", "docs/knowledge-system-how.md", "c"),
  t("vt.kind", "kind", "kind: a claim type in the schema, such as proof, measurement, estimate, definition, or forum, with its own ceiling and rules.", "docs/what-stands-without-trust.md", "c", { departure: "small" }),
  t("vt.grade", "grade", "grade: a claim's position in the confidence ordering, computed from its supports and kind, not granted by an authority.", "docs/what-stands-without-trust.md", "c", { departure: "small" }),
  t("vt.oracle", "oracle", "oracle: a build script that verifies a property mechanically and stops with a named cause if it fails, the proof a claim is checked rather than trusted.", "docs/the-climb-of-synthesis.md", "c"),
  t("vt.check-suite", "check suite", "check suite: the grounding linter run in continuous integration, admitting a claim only when the grade it declares is covered by the grade it earns.", "docs/kernel-taxonomy.md", "s"),

  // ===================== the agent axis =====================
  t("vt.agent", "agent", "agent: any entity that makes claims and models other claim-makers, a person, an organization, a model, or a pipeline of these.", "docs/what-stands-without-trust.md", "c", { departure: "large" }),
  t("vt.producer", "producer", "producer: anything that emits claims into the kernel, whether a person, an organization, a model, or a pipeline of these.", "docs/what-stands-without-trust.md", "c", { departure: "large" }),
  t("vt.consumer", "consumer", "consumer: any entity that queries the kernel's read terminus, reading what stands and recomputing it.", "docs/workflow-atlas.md", "c", { departure: "large" }),
  t("vt.llm", "LLM", "LLM: a language model, a machine-learning system considered as an agent, a producer or consumer of claims, checked by the gate like any other agent.", "docs/compost-ledger.md", "s"),
  t("vt.periphery", "periphery", "periphery: the interface layer around the kernel, views and teaching walks and inspection consoles, reading through one contract.", "docs/the-climb-of-synthesis.md", "c", { departure: "large" }),
  t("vt.contract", "contract", "contract: the typed interface boundary that separates the kernel from the periphery, and the crossing protocol between kernels, not a legal agreement.", "docs/the-climb-of-synthesis.md", "c", { departure: "large" }),
  t("vt.trust-boundary", "trust boundary", "trust boundary: the one-way flow across a single gate separating the trusted core from the fallible periphery, purity surviving as the direction of dependency.", "docs/knowledge-system-how.md", "c"),
  t("vt.write-terminus", "write terminus", "write terminus: the face of the kernel boundary where any producer submits typed claims and the gate admits them only if they ground.", "docs/workflow-atlas.md", "s"),
  t("vt.read-terminus", "read terminus", "read terminus: the face of the kernel boundary where any consumer queries the graph and receives read-only values that never mutate.", "docs/workflow-atlas.md", "s"),

  // ===================== floors and kinds =====================
  t("vt.declaration", "declaration", "declaration: a constitutive floor type where a claim bottoms out in a public act of defining, grounding by adoption rather than by evidence.", "docs/what-stands-without-trust.md", "c", { departure: "large" }),
  t("vt.proof", "proof", "proof: a self-securing floor type where attenuation completes to zero, so a single checked proof removes its author entirely.", "docs/trust-and-view.md", "c", { departure: "small" }),
  t("vt.measurement", "measurement", "measurement: a floor type where attenuation approaches a floor without reaching zero, so one measurement is testimony and many independent ones are knowledge.", "docs/trust-and-view.md", "c", { departure: "small" }),
  t("vt.primitive", "primitive", "primitive: a basic floor element that needs no further support, cited to an external source anyone can recheck.", "docs/status-ledger.md", "s", { departure: "large" }),
  t("vt.cited-primitive", "cited primitive", "cited primitive: a floor leaf carrying a citation to an external source, grounding the claim in something anyone can recheck.", "docs/status-ledger.md", "s"),
  t("vt.empirical-axis", "empirical axis", "empirical axis: the branch of the settled tier running from checked through independently-rechecked, for claims grounded in evidence.", "docs/status-ledger.md", "s"),
  t("vt.constitutive-position", "constitutive position", "constitutive position: the branch of the settled tier for declarations and definitions, incomparable to the empirical axis because it grounds by public act.", "docs/status-ledger.md", "s"),
  t("vt.forum", "forum", "forum: the contested region of the ordering, tiered from raw through structured, where claims are weighed rather than verified.", "docs/knowledge-system-how.md", "c", { departure: "large" }),
  t("vt.forum-grades", "forum grades", "forum grades: the grades carried by the open line, for contested claims that have not reached the settled tier.", "docs/status-ledger.md", "s"),

  // ===================== federation and crossing =====================
  t("vt.federation", "federation", "federation: a composition of independent kernels that keep their own schemas, joined at the untyped type, so they compose without first agreeing.", "docs/what-stands-without-trust.md", "c", { departure: "small" }),
  t("vt.composite", "composite", "composite: a selection of member kernels assembled for a question with the crossings its author has built between them, itself a kernel in the trust sense.", "docs/what-stands-without-trust.md", "c"),
  t("vt.meta-kernel", "meta kernel", "meta kernel: either a bottom-up or top-down arrangement of domain kernels, the two types points on one axis rather than separate boxes.", "docs/what-stands-without-trust.md", "c"),
  t("vt.bottom-up", "bottom-up meta kernel", "bottom-up meta kernel: independent domain kernels that keep their own schemas, joined at the untyped type, with a composite selecting which to include.", "docs/what-stands-without-trust.md", "c"),
  t("vt.top-down", "top-down meta kernel", "top-down meta kernel: one schema designed to span the domains, instantiating them as regions within it so composition is native.", "docs/what-stands-without-trust.md", "c"),
  t("vt.domain-specific", "domain-specific kernel", "domain-specific kernel: content over the core for one subject with its own schema and floors, the base unit of the taxonomy.", "docs/kernel-taxonomy.md", "c"),
  t("vt.untyped-type", "untyped type", "untyped type: the one type every schema shares, holding foreign imports and locally untyped claims alike, not a floor, so nothing grounds through it.", "docs/composition-spec.md", "c"),
  t("vt.crossing", "crossing", "crossing: a claim moving from one kernel into another, arriving as the untyped type and losing its local attenuation.", "docs/composition-spec.md", "c", { departure: "small" }),
  t("vt.content-addressed-crossing", "content-addressed crossing", "content-addressed crossing: a crossing keyed on a hash of the type bundle, so two kernels that mean the same thing by a type compose native and lossless.", "docs/composition-spec.md", "c"),
  t("vt.type-bundle", "type bundle", "type bundle: the kind with its ceiling and rules, the floor with its rank, and the source class with its footings, hashed so meaning rather than label matches.", "docs/composition-spec.md", "c"),
  t("vt.type-hash", "type hash", "type hash: the deterministic, meaning-sensitive fingerprint of a type bundle, so two kernels that perform the same attenuation pin the same hash.", "docs/composition-spec.md", "c"),
  t("vt.retail-fork", "retail fork", "retail fork: casting a single untyped claim into a local type and signing the cast, one author subjecting the claim to that type's attenuation and owning it.", "docs/what-stands-without-trust.md", "c"),
  t("vt.wholesale-fork", "wholesale fork", "wholesale fork: extending a schema so a whole category of crossings types natively, ratifying a practice many retail forks have proven in use.", "docs/what-stands-without-trust.md", "c"),
  t("vt.type-fork", "type fork", "type fork: a new type-hash deriving from a parent bundle by a named departure, snapshot-only because a hash that changed under its adopters would break shared-meaning-is-shared-hash, adopted or ignored kernel by kernel through the crossing.", "docs/composition-spec.md", "s", { departure: "small" }),
  t("vt.type-contest", "type contest", "type contest: a gate-admitted forum claim whose subject is a type-hash, recording a semantic disagreement the kernel never adjudicates, and changing no grade because it references a type rather than supporting any claim typed under it.", "docs/composition-spec.md", "s", { departure: "small" }),
  t("vt.fork", "fork", "fork: casting a claim into a local type, retail per claim or wholesale per category, the owned act by which standing crosses a boundary.", "docs/composition-spec.md", "c", { sense: "claim fork" }),
  t("vt.shared-subtree", "shared subtree", "shared subtree: types and subtrees another kernel adopts by pinning them, so nothing is enrolled and no one owns the result.", "docs/kernel-taxonomy.md", "s"),
  t("vt.composition-invariant", "composability invariant", "composability invariant: a property of the required tier a crossing depends on, such as the untyped type grounding nothing or claims carrying their history.", "docs/composition-spec.md", "s"),

  // ===================== openness mechanisms =====================
  t("vt.characterized-gap", "characterized gap", "characterized gap: an open claim carrying its location, its bounds, and the instance that would close it, so an open line is a located object.", "docs/on-transparency.md", "c"),
  t("vt.sorry-ledger", "sorry ledger", "sorry ledger: the machine-checked record of open deferred-verification obligations, one line per marker, kept in one-to-one correspondence with the markers.", "docs/on-transparency.md", "c"),
  t("vt.compost-ledger", "compost ledger", "compost ledger: the record of approaches killed while building, each with its kill-reason and reactivation condition, so a reader can audit the kills.", "docs/on-transparency.md", "c"),
  t("vt.built-vs-specified", "built-versus-specified line", "built-versus-specified line: the boundary between what is coded and verified and what is designed but unbuilt, so the frontier does not leak into the core's warrant.", "docs/on-transparency.md", "c"),
  t("vt.open-line", "open line", "open line: the middle region of the confidence ordering, carrying contested claims whose ceiling is below the settled tier.", "docs/status-ledger.md", "s"),
  t("vt.open-seam", "open seam", "open seam: a named risk in the coordination design paired with what would resolve it, so the openness is located rather than vague.", "docs/status-ledger.md", "s"),
  t("vt.closing-condition", "closing condition", "closing condition: the statement of what one measurement, proof, or direct study would close a characterized gap.", "docs/status-ledger.md", "s"),
  t("vt.exclusion-reservoir", "exclusion reservoir", "exclusion reservoir: the record of patterns rejected during building, each with the condition that would reactivate it, so a killed pattern meets its own obituary.", "docs/exclusion-reservoir.md", "s"),
  t("vt.exclusion-record", "exclusion record", "exclusion record: the store that keeps refuted claims with the reason each fell, so a killed claim meets its own obituary on any attempt at revival.", "docs/what-stands-without-trust.md", "c"),
  t("vt.reactivation-condition", "reactivation condition", "reactivation condition: the statement of what would bring back a killed approach, so a kill without it is a kill you cannot revisit.", "docs/exclusion-reservoir.md", "s"),
  t("vt.kill-reason", "kill-reason", "kill-reason: the specific characterized reason an approach was killed and moved to the compost ledger.", "docs/compost-ledger.md", "s"),
  t("vt.debt", "debt", "debt: an open question whose ceiling is a floor, a real obligation that would close with one measurement, proof, or direct study.", "docs/status-ledger.md", "s", { departure: "large" }),
  t("vt.unsettleable-judgment", "unsettleable judgment", "unsettleable judgment: a forum claim whose ceiling is structured forum, settled once structured but never reaching the empirical or constitutive floors.", "docs/status-ledger.md", "s"),
  t("vt.frontier", "frontier", "frontier: the boundary between the built core and the specified design, the open edge marked in the status ledger.", "docs/status-ledger.md", "s"),

  // ===================== uplift and the argument =====================
  t("vt.epistemic-uplift", "epistemic uplift", "epistemic uplift: the improvement in knowledge quality from separating trust from view so claims compound and survive scrutiny.", "docs/epistemic_uplift.md", "c"),
  t("vt.teaching-uplift", "teaching uplift", "teaching uplift: the improvement in how well a reader learns, delivered by a market of views over one shared trust rather than by a single synthesis.", "docs/epistemic_uplift.md", "c"),
  t("vt.claim-uplift", "claim uplift", "claim uplift: the improvement in the knowledge itself as a checkable composable object, delivered by the kernel's typed structure and mechanical grounding.", "docs/what-stands-without-trust.md", "c"),
  t("vt.two-sided-boundary", "two-sided boundary", "two-sided boundary: the thesis that the kernel is a boundary with a write face and a read face, each independent and untrusted by the other.", "docs/workflow-atlas.md", "s"),
  t("vt.unownable-graph", "unownable graph", "unownable graph: the design where the value lives in the substrate and capture of any single gate is capture of an empty shell.", "docs/architecture-the-unownable-graph.md", "s"),
  t("vt.substrate", "substrate", "substrate: the commons layer beneath everything that survives any fork, hosting adversarial experiments as readily as honest ones.", "docs/architecture-the-unownable-graph.md", "s"),
  t("vt.narrow-waist", "narrow waist", "narrow waist: the substrate as the thin shared layer everything else builds on, unownable because it is forkable.", "docs/architecture-the-unownable-graph.md", "s"),
  t("vt.commons", "commons", "commons: the shared substrate that survives any fork, unownable by its author and forkable against its author.", "docs/architecture-the-unownable-graph.md", "c", { departure: "large" }),

  // ===================== registers and surface =====================
  t("vt.precise-register", "precise register", "precise register: the canonical reading of the judges document, carrying exact terminology and live claim-references.", "docs/status-ledger.md", "c"),
  t("vt.accessible-register", "accessible register", "accessible register: a plainer reading of every section of the judges document, carrying a delta note, source links, and links back.", "docs/status-ledger.md", "c"),
  t("vt.delta-note", "delta note", "delta note: a note per section stating the difference between the accessible register and the precise register.", "docs/status-ledger.md", "s"),
  t("vt.register-view", "register view", "register view: a reading surface presenting the argument in either register over the same underlying claims, the market-of-views thesis shown.", "docs/register-view.md", "c"),
  t("vt.fidelity-discipline", "fidelity discipline", "fidelity discipline: the rule that the accessible register ends by handing over the exact statement, so precision is the destination and not softened.", "docs/register-view.md", "s"),
  t("vt.node-card", "node card", "node card: the interactive interior of a derivation segment, a node you can decompose down, perturb along, and compare sideways.", "docs/architecture-spec.md", "s"),
  t("vt.perturbation-overlay", "perturbation overlay", "perturbation overlay: a non-destructive computed layer showing what happens when an assumption is flipped, propagating along support edges only.", "docs/status-ledger.md", "s"),
  t("vt.atlas", "atlas", "atlas: a structural pattern made queryable, carrying typed preconditions and variants, so the detector finds no coverage gap on it.", "docs/status-ledger.md", "s"),
  t("vt.on-ramp", "on-ramp", "on-ramp: the entry path naming the generator, the self-contained kernel file, and the connectors, guiding a new user into the system.", "docs/status-ledger.md", "s"),

  // ===================== the coordination layer (specified) =====================
  t("vt.coordination-layer", "coordination layer", "coordination layer: the specified frontier extending the kernel's grade computation from claims to participants, governing writes to a federation at scale.", "docs/coordination-layer-spec.md", "c"),
  t("vt.function", "function", "function: an abstract job-slot in the coordination layer, the set of contracts that do a job, such as gaming-resistant validation.", "docs/coordination-layer-spec.md", "s", { sense: "job-slot" }),
  t("vt.standard", "standard", "standard: a body's declaration of which contracts it accepts for which function, hashable and forkable, ranging from permissive to restrictive.", "docs/coordination-layer-spec.md", "s", { departure: "large" }),
  t("vt.validation-economy", "validation economy", "validation economy: the self-scaling system where writing a claim requires validation work on others' claims, so supply scales with demand without an assigner.", "docs/coordination-layer-spec.md", "s"),
  t("vt.gaming-resistant-validation", "gaming-resistant validation", "gaming-resistant validation: the function that every claim be covered by opposed scrutiny so lazy or captured validation exposes itself.", "docs/coordination-layer-spec.md", "s"),
  t("vt.sybil-resistant-weighting", "Sybil-resistant weighting", "Sybil-resistant weighting: the function that standing weight newcomers below established participants without locking them out, by concave threshold-free curves.", "docs/coordination-layer-spec.md", "s"),
  t("vt.sleeper-resistance", "sleeper-resistance", "sleeper-resistance: the defense against a participant who ages a dormant identity and activates it, by decay that bleeds standing away with inactivity.", "docs/coordination-layer-spec.md", "s"),
  t("vt.self-scaling-scrutiny", "self-scaling scrutiny", "self-scaling scrutiny: the function that the supply of validation scale with the supply of claims without an authority assigning validators.", "docs/coordination-layer-spec.md", "s"),
  t("vt.up-hill-cap", "up-hill cap", "up-hill cap: the limit on standing flowing from a looser standard to a stricter one, requiring re-earning under accepted contracts before full grounding transfers.", "docs/coordination-layer-spec.md", "s"),
  t("vt.damage-cap", "damage cap", "damage cap: the limit on harm from a gamed or captured gate, achieved by forkability so an honest minority exits with the substrate intact.", "docs/adversarial-robustness.md", "s"),

  // ===================== move vocabulary (adversarial only) =====================
  t("vt.non-move", "non-move", "non-move: an attempted action the gate never recognizes as standing, a gamed claim admitted at the floor or demoted rather than treated as a valid move.", "docs/adversarial-robustness.md", "c"),
  t("vt.admissible-move", "admissible move", "admissible move: a claim the gate's checks recognize as grounded, the only kind of move that earns standing.", "docs/adversarial-robustness.md", "s"),

  // ===================== the name =====================
  t("vt.epistack", "EpiStack", "EpiStack: the submission, a top-down meta kernel that is the first working instance of the knowledge kernel type.", "docs/on-transparency.md", "s"),

  // ===================== reference tier: case-domain vocabulary (external floors) =====================
  r("vt.cross-section", "cross-section", "cross-section: the effective area describing the probability of a particle interaction, used in the LHC collision-count calculation.", "src:pdg"),
  r("vt.modus-tollens", "modus tollens", "modus tollens: if hazard then destruction, no destruction, therefore no hazard, the logical form of the LHC safety argument.", "src:copi-logic"),
  r("vt.natural-experiment", "natural experiment", "natural experiment: an already-occurring test, cosmic-ray collisions standing in for the LHC hazard since nature has run higher-energy collisions for billions of years.", "src:dunning-natexp"),
  r("vt.faithful-draw", "faithful draw", "faithful draw: a random and representative sample from the population it claims to describe, so the statistic transfers validly.", "src:sampling-theory"),
  r("vt.non-exchangeable", "non-exchangeable", "non-exchangeable: a sample whose inclusion is correlated with the quantity being estimated, so the draw is not random and the statistic is biased.", "src:sampling-theory"),

  // ===================== reference tier: technical and infrastructure =====================
  r("vt.api", "API", "API: an application programming interface, the typed boundary through which clients read and write, here the sole membrane over the kernel.", "src:whatwg-web"),
  r("vt.ci", "CI", "CI: continuous integration, validating each change against an automated check suite before it lands.", "src:fowler-ci"),
  r("vt.json", "JSON", "JSON: a plain-text data-interchange format used for the vendored readings and manifests.", "src:json-spec"),
  r("vt.js", "JS", "JS: JavaScript, the language the kernel, API, and periphery are written in, with .mjs and .js the module file forms.", "src:ecma-262"),
  r("vt.esm", "ESM", "ESM: ECMAScript modules, the import system the build uses.", "src:ecma-262"),
  r("vt.html", "HTML", "HTML: the markup language of the assembled surface, submission.html.", "src:whatwg-web"),
  r("vt.css", "CSS", "CSS: the styling language a thin client reskins through custom properties.", "src:whatwg-web"),
  r("vt.dom", "DOM", "DOM: the document object model a browser exposes, forbidden inside the trusted core so the kernel runs headless.", "src:whatwg-web"),
  r("vt.mcp", "MCP", "MCP: the Model Context Protocol, the tool interface the producer connector exposes propose through.", "src:mcp"),
  r("vt.node", "Node", "Node: the server-side JavaScript runtime the oracles and builds run under, with npm its package manager.", "src:nodejs"),
  r("vt.pyodide", "Pyodide", "Pyodide: CPython compiled to WebAssembly, a retired in-browser runner named in the compost ledger.", "src:pyodide"),
];

const VOCABULARY = { store_id: "vocabulary", terms };

module.exports = { VOCABULARY };
