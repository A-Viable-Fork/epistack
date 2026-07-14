---
Type: argument
Purpose: Orients a reader by the submission's own function-and-contract split: what the repository is, the reading paths to choose from by context, and the shared map. The index.
Depends on: docs/on-transparency.md, docs/parameters-register.md, docs/the-climb-of-synthesis.md
Depended on by: nothing
---

# EpiStack

EpiStack is a knowledge kernel: a typed claim graph whose gate admits a claim only if it grounds, with every claim's standing recomputable by anyone from the public graph. The function of this documentation is to get you to understand that system, and the pointers below are the contracts provided to satisfy it. The system itself is built the same way, functions any community's knowledge infrastructure must fill and contracts chosen by the community that holds the context, and the reading path is the first instance of it you touch: the order and depth are your contract, chosen by what you came for, and the map below is for making that choice.

Some of the system's parameters are required for composition, and breaking them means kernels can no longer compose; the rest are free, a community's to set in its own context. Separating the two is what the transparency in this repository is for. [The Parameters Register](docs/parameters-register.md) draws the line parameter by parameter, and [On Transparency](docs/on-transparency.md) says why the open form is the one the problem forces. A reader deciding what they may change and still compose starts there.

Two reading paths share these destinations but not their order:

- **For a person: start with the critique.** [The Climb of Synthesis](docs/the-climb-of-synthesis.md), two pages: the tool everyone will build, where it stops, the three counterexamples, and the protocol they force, and everything else in the repository is that protocol, actualized.
- **By machine: point a synthesizer at [`llms.txt`](llms.txt).** Its order is the vocabulary kernel, then the math kernel, then the status ledger, then the specification and the rest.

Each path leads with what its reader loses without it: a person without the argument loses why the mechanism matters, and a synthesizer without the types loses the distinctions the mechanism draws.

## The map

- **Implement the protocol without the argument:** [The Protocol Specification](docs/protocol-spec.md), the record formats, the grounding computation, the gate, and the crossing.
- **See what is built and what is specified:** [The Status Ledger](docs/status-ledger.md), the single source of build truth.
- **See where fixed ends and free begins:** [The Parameters Register](docs/parameters-register.md).
- **Read why the open form, and where this repository's production and verification are accounted for:** [On Transparency](docs/on-transparency.md).
- **Run the checks in about two minutes:** [`docs/quickstart.md`](docs/quickstart.md), clone, install, and run the suite.
- **Walk the worked cases:** [`corpora/`](corpora/), LHC safety, COVID origins, and egg nutrition, each carried to its own termination.
- **Read the kernel's own mathematics, grounded through its gate:** [`corpora/math/`](corpora/math/), the grade lattice, the earned-grade recurrence, contamination, and the crossing, each carrying its computed grade.
- **Open the assembled surface:** [`submission.html`](submission.html), the front door, the guided walk, the three cases, and the demonstrations, every case claim carrying its live grade.
- **Build a kernel of your own domain:** [The Kernel Workflow Guide](docs/kernel-workflow-guide.md), the six-stage lifecycle with the math kernel as its worked instance.
- **Read the operating design for a community:** [The Community Backend](docs/community-backend.md), and the [Community Invitation](docs/community-invitation.md) to constitute one.
- **Have an LLM read and synthesize the repository:** contingent on your trust in the synthesizer, anything the synthesis asserts about this repository is recomputable here, the checks run in about two minutes and every grade recomputes from the public graph, and the machine path above is the recommended order.
