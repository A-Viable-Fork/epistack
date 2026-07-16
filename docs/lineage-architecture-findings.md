---
Type: record
Purpose: Records the two results the modding lineage surfaced that bear on the kernel's own design, each stated as a finding with its source and the open question it poses, for a human decision rather than as case claims.
Depends on: docs/composition-spec.md, docs/parameters-register.md
Depended on by: nothing
---

# Lineage Architecture Findings

The lineage case (fourth case, `corpora/lineage/`) is authored from four deep-research reports on how
the kernel's mechanisms already run, informally and by hand, in mature institutions. Most of what the
reports found is case content, priced by the gate in `build/check-lineage.mjs`. The game-modding report
is authored as its own branch there (the `mod.*` claims), and it is the distinctive branch of the
lineage: where the other branches exhibit the kernel's patterns socially, run by analysts and by hand,
the modding communities built and deployed working mechanical tools for them, a topological linter with
cycle detection (LOOT), a conflict-visualization compiler (xEdit), mechanical composition where
composition is possible (Wrye Bash), and hash-verified patching (BPS), and have run them at ecosystem
scale for two decades. It is the one branch that mechanized its coordination. The decentralized-finance branch (the `defi.*`
claims) is the lineage's most adversarially tested: its coordination mechanisms ran under sustained,
financially motivated attack at scale, so its near-misses (slashing, light clients, governance
time-locks, commit-reveal, inter-chain handshakes) are prior art and its failures (bridge custody,
restaking contagion) are measured demonstrations, not speculation. Two further results from
the game-modding report are different again: they bear on the kernel's own design rather than on the lineage claim,
so they are recorded here as findings, not authored as case claims. Each names its source and the open
question it poses; neither is resolved here.

## Finding 1: the unmergeable-overlap result

**Source.** The Bethesda Creation Engine modding ecosystem (Wrye Bash, xEdit, the "Rule of One"
last-writer-wins load order), reported in `Game_Modding_Community_Mechanisms`.

**The result.** Modding distinguishes a mergeable overlap from a "hard conflict." Two plugins editing a
leveled list can be auto-composed: Wrye Bash extracts the arrays and synthesizes a unified table. Two
plugins editing the exact placement coordinates of the same reference cannot, because averaging a
doorway's position puts it inside a solid wall, and averaging a navigation mesh severs an AI path. The
ecosystem's settled answer is that such overlaps are structurally unmergeable: the engine does not
blend them, it applies last-writer-wins and demands a human author a compatibility patch by hand. This
is empirical evidence, from a decades-old ecosystem at scale, that some overlaps cannot be composed by
any blend and composition must degrade to human-authored resolution.

**The open question for the composition spec.** `docs/composition-spec.md` defines how kernels compose
at the untyped-type crossing, and it should be checked against this result: does the spec anywhere
claim to compose overlaps that are structurally unmergeable? If it does, that is a gap this case found,
and the spec should name the unmergeable-overlap class explicitly and route it to an owned human fork
(a signed crossing) rather than to any automatic merge. The kernel's honest position is likely already
this, since standing crosses only through an owned local fork and nothing auto-merges across the
boundary, but the spec should say so against the modding evidence rather than leaving it implicit.

## Finding 2: the hard-delete and supersession answer

**Source.** Nexus Mods' August 2021 Terms of Service change and the "Cathedral versus Parlor" modding
philosophy, reported in `Game_Modding_Community_Mechanisms`.

**The result.** Nexus Mods removed the ability for an author to hard-delete a file, replacing it with
archiving: a withdrawn file is hidden from the interface but keeps a live API endpoint. The reason was
empirical and painful. Under unrestricted delete, when a popular author removed a file, every module
and compatibility patch listing it as a hard dependency broke at once, cascading execution failures
across the whole platform. The community chose the "Cathedral" view, the survival of the collective
dependency graph, over the "Parlor" view, the individual author's right to withdraw. Their open
question was whether a shared platform must strip contributors of the right to hard-delete in order to
hold a complex dependency graph together.

**The answer the architecture already carries.** This is a real tension with the trust market's exit
promise, and the kernel's content-addressed supersession is the answer modding lacked. Because standing
is content-addressed and a claim's dependents re-point rather than break, a withdrawn claim does not
shatter its downstream: the exit is a re-point over a history, not a deletion that severs edges. The
tension modding resolved by removing a right, the kernel resolves by making the right safe: an author
may withdraw, and the dependents re-derive against the superseded claim's replacement or fall to the
untyped type honestly, rather than crashing. This is the answer to the modding community's open
question, and the register view or the composition spec should say so where the trust market's exit
right is described, so a reader who knows the Nexus Mods story sees the kernel already carries what
that platform had to legislate away.
