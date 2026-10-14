---
Type: argument
Purpose: "Says what EpiStack is: a typed claim graph with a gate and recomputable standing, its three architectural claims, its layers, the reading paths to choose from by context, and the shared map. The index."
Depends on: [docs/on-transparency.md, docs/parameters-register.md, docs/protocol-spec.md, docs/status-ledger.md, docs/the-climb-of-synthesis.md, docs/the-minimum-constitution.md]
Depended on by: []
---

# EpiStack

EpiStack is a knowledge kernel: a typed claim graph whose gate admits a claim only if it grounds, with every claim's standing recomputable by anyone from the public graph. Every claim is a node carrying its kind, its verification state, its provenance and its history (its origin, the crossings between regions, and the forks that retyped it), so a standing is a traceable chain back to a floor rather than a bare verdict. One shared typed schema lets uncoordinated investigations accrete onto a single map, and lets independently governed communities compose through the gate without trusting each other.

The machinery is general. A domain is data: a corpus of typed claims and edges, and the parameters a community chooses for itself (its type system, standing rules, origin stance, identity policy). The schema, the gate, the grounding rule and the crossing stay the same whatever the domain, and the worked cases in `corpora/` are instances, the kernel's own mathematics among them.

What is built and what is specified is in [the Status Ledger](docs/status-ledger.md), the single source of build truth. The normative protocol is [the Protocol Specification](docs/protocol-spec.md).

## Three architectural claims

Each is falsifiable by a check you run rather than an argument you weigh.

**Standing is a function of support, not of the producer.** Who proposed a claim never enters the grade computation, so the same graph grades to the same result on anyone's machine and for any producer (`build/check-gate.mjs`, `build/check-math-differential.mjs`).

**A claim crosses a community boundary without importing the source's authority.** An imported claim arrives untyped at the floor and grounds nothing until an owned local fork re-types it, so no kernel can launder standing into another by exporting it (`build/check-crossing.mjs`, `build/check-composition.mjs`; `node build/gate-demo.mjs` runs a crossing between two contributors).

**A view cannot modify trust.** Reading, ranking, filtering, rendering and contesting move no grade; admitting a contest leaves every pre-existing grade byte-identical (`build/check-fork-contest.mjs`).

## Fixed and free

The protocol fixes a thin required tier, the composition contract ([the Contract Register](docs/contract-register.md), the `CR-*` invariants), and leaves everything else to the communities and applications that build on it ([the Parameters Register](docs/parameters-register.md), the `PR-*` free parameters). `build/check-boundary.mjs` holds the two sets disjoint.

## One trust boundary

Dependency arrows run one way. `kernel/` is the trusted core: pure logic with no DOM, holding the one schema and its lattice, the gate and the grounding rule. `api/` is the sole membrane: it imports the kernel and never the periphery. `periphery/` is fallible: every AI component and every render surface, reaching the kernel only through `api/`. `corpora/` is pure data, imported by nothing. Gaps are first-class: every unverified node carries a `sorry` or `TODO_verify` marker, each listed in [the Sorry Ledger](docs/sorry-ledger.md), and a claim states whether it was generated or verified.

## Reading paths

The order and depth are the reader's contract, chosen by what they came for. Each path inherits the same frame, [The Minimum Constitution](docs/the-minimum-constitution.md), and [On Transparency](docs/on-transparency.md) says why the open form is the one the problem forces.

- **For a person: start with the critique.** [The Climb of Synthesis](docs/the-climb-of-synthesis.md): the tool everyone will build, where it stops, the counterexamples, and the protocol they force. Everything else in the repository is that protocol, actualized.
- **By machine: point a synthesizer at [`llms.txt`](llms.txt).** Its order is the vocabulary kernel, then the math kernel, then the status ledger, then the specification and the rest.
- **For an institution: start with the entrance.** [For the Institutional Adopter](docs/for-the-institutional-adopter.md): what a public typed claim graph offers an organization that must make defensible decisions in contested domains.
- **For an evaluator: follow the judging path** in [the Submission Overview](docs/submission-overview.md), six stops from the frame to a check you run yourself.

## The map

- **Implement the protocol without the argument:** [The Protocol Specification](docs/protocol-spec.md), the record formats, the grounding computation, the gate, and the crossing.
- **See what is built and what is specified:** [The Status Ledger](docs/status-ledger.md).
- **See where fixed ends and free begins:** [The Parameters Register](docs/parameters-register.md).
- **Run the checks:** [Quickstart](docs/quickstart.md), clone, install and run the suite, each oracle stating the invariant it verified.
- **Walk the worked cases:** [`corpora/`](corpora/), each carried to its own termination.
- **Read the kernel's own mathematics, grounded through its gate:** [`corpora/math/`](corpora/math/), the grade lattice, the earned-grade recurrence, contamination, and the crossing, each carrying its computed grade.
- **Open the assembled surface:** [`submission.html`](submission.html), a standalone page that runs from `file://`, every case claim carrying its live grade.
- **Build a kernel of your own domain:** [The Kernel Workflow Guide](docs/kernel-workflow-guide.md), the lifecycle with the math kernel as its worked instance.
- **Read the operating design for a community:** [The Community Backend](docs/community-backend.md), and the [Community Invitation](docs/community-invitation.md) to constitute one.
- **Have a language model read the repository:** anything a synthesis asserts about it is recomputable here; the checks run locally and every grade recomputes from the public graph.

## Checks

    node .infra/run.mjs

This runs the shared kit in `.infra/` (configured by `infra.json`, each disabled check with its reason) and the local gate, `node build/check-all.mjs`. There is no dependency to install. Agents start from `CLAUDE.md` (or `AGENTS.md`).
