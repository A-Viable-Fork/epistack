---
Type: argument
Purpose: "Orients a reader by the submission's own function-and-contract split: what the repository is, the reading paths to choose from by context, and the shared map. The index."
Depends on: [docs/on-transparency.md, docs/parameters-register.md, docs/the-climb-of-synthesis.md, docs/the-minimum-constitution.md]
Depended on by: []
---

# EpiStack

EpiStack is a knowledge kernel: a typed claim graph whose gate admits a claim only if it grounds, with every claim's standing recomputable by anyone from the public graph. The function of this documentation is to get you to understand that system, and the pointers below are the contracts provided to satisfy it. The system itself is built the same way, functions any community's knowledge infrastructure must fill and contracts chosen by the community that holds the context, and the reading path is the first instance of it you touch: the order and depth are your contract, chosen by what you came for, and the map below is for making that choice.

**A competition judge follows one path, in order.** Six stops, each an artifact already in this repository, from the frame to a check you run yourself:

1. **The frame.** [The Minimum Constitution](docs/the-minimum-constitution.md): what EpiStack is and why the accounting basis for trust needs rebasing, the basis well-calibrated, the regime shifted, and this the shared structure the shift calls for.
2. **What you are evaluating.** [The Submission Overview](docs/submission-overview.md), the "What you are evaluating" box at its top: the evaluation object stated once, then the three architectural claims (producer-independence, authority-free crossing, view-inertness), each naming the check that would falsify it, and the fixed/free boundary read off [the contract register](docs/contract-register.md) and [the parameters register](docs/parameters-register.md).
3. **One worked case slice.** [The Climb of Synthesis](docs/the-climb-of-synthesis.md)'s three counterexamples, or one corpus room in full ([`corpora/`](corpora/), eggs is the most visceral): a real claim graph graded through the gate.
4. **One crossing.** [The Composition Specification](docs/composition-spec.md) and its runnable demo, `node build/gate-demo.mjs`: two contributors compose through the gate, an imported claim arriving untyped at the floor until a local fork re-types it.
5. **Run the checks.** [Quickstart](docs/quickstart.md): clone to green in about two minutes, each oracle stating the invariant it verified, so the three claims in stop 2 are ones you confirm rather than trust.
6. **Optional: hold the app.** [The Knowledge Game](https://a-viable-fork.github.io/Knowledge-Game), one non-privileged reference client over the same graph.

The constitution is the frame and the overview is the evidence; [On Transparency](docs/on-transparency.md) says why the open form is the one the problem forces. The three reading paths below are alternates, ordered for a reader who arrives as a person, with a machine, or for an institution, and each inherits the same frame:

- **For a person: start with the critique.** [The Climb of Synthesis](docs/the-climb-of-synthesis.md), two pages: the tool everyone will build, where it stops, the three counterexamples, and the protocol they force, and everything else in the repository is that protocol, actualized.
- **By machine: point a synthesizer at [`llms.txt`](llms.txt).** Its order is the vocabulary kernel, then the math kernel, then the status ledger, then the specification and the rest.
- **For an institution: start with the entrance.** [For the Institutional Adopter](docs/for-the-institutional-adopter.md), what a public typed claim graph offers an organization that must make defensible decisions in contested domains; an institution deciding whether this infrastructure serves defensible decision-making starts here.

Each path leads with what its reader loses without it: a person without the argument loses why the mechanism matters, a synthesizer without the types loses the distinctions the mechanism draws, and an institution without the entrance loses the account of what a decision routed through the graph can defend.

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
