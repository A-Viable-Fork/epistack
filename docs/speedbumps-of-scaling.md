---
Type: reference
Purpose: The per-operation complexity map of the kernel, deriving how each operation scales from the code or from a math-kernel claim the gate has graded, marking each operation built or a named speedbump with its lever, so the scaling question is answered by derivation rather than reassurance.
Depends on: docs/protocol-spec.md, docs/design-axioms.md, docs/status-ledger.md
Depended on by: nothing
---

# The Speedbumps of Scaling

A technical reader asks whether this scales to 100,000 claims. The honest answer is a derivation, not a number. Different operations scale in different variables, and a single "it is linear" would be false precision, so this document states each operation's variable and complexity separately, marks each as built or as a speedbump with a named lever, and cites its evidence: a math-kernel claim the gate has graded where one covers the operation, or the code the derivation was read from where none does.

The title is literal. The known-expensive operations are named here as speedbumps, bumps with levers, not walls, and saying which is which is the point. A speedbump is an operation whose implemented shape is worse than its natural shape, fixable by shape-preserving engineering that the math kernel's differential harness guards against regressing. It is not a wall, which would be an operation with no better shape available.

## What the linearity rests on

The core is fast because the earned grade is a memoized recurrence and is derived, never stored. Resolving a claim descends its support graph and resolves each node exactly once, caching the result (`earnedOf` in `kernel/gate/gate.mjs`, and `derivedGrade` in `kernel/store/decay.mjs`, both memoized), and a grade held in the store short-circuits the descent through `storeView.earnedByIdentity`. So one claim resolves in its own support closure and the whole store resolves in V plus E, each node once. That these described recurrences are exactly what the code computes is the sixth exhibit's contribution: the math kernel states the recurrence and its linearity as claims and the differential harness confirms code-versus-recurrence agreement over random graphs, so the complexity rows below that cite `thm.earned-recurrence` and `thm.earned-linear` rest on a checked-tier verification, not on a reading of the code alone.

## The table

Each row states one operation, the variable it scales in, its complexity, the evidence, and whether it is built as-is or a speedbump with its lever. V is the entry count, E the link count, and a claim's closure is the set of claims reachable from it through support edges.

| Operation | Scales in | Complexity | Evidence | Status |
| --- | --- | --- | --- | --- |
| Grounding one claim | the claim's support closure | O(closure), each node resolved once | `thm.earned-recurrence`, `thm.earned-linear` (both checked); memoized `earnedOf` (`gate.mjs`) | Built |
| Full-store resolution | V plus E | O(V + E), each node once | `thm.earned-linear` (checked); shared-cache `storeViewOf` (`decay.mjs`) | Built |
| A write (gate decision) | the contribution, plus the store for context and commit | decision proper O(contribution reach); context build O(V + E); state-commit O(V + E log(V + E)) as implemented | derivation: `storeViewOf` resolves every entry (`decay.mjs`), `stateHash`/`canonSet` sorts every set (`state.mjs`), stored grades short-circuit (`gate.mjs` line 104) | Speedbump: scoped store-view build and an incremental state hash |
| Contamination propagation | support edges | monotone, single pass on the acyclic graph, O(E) | `thm.contamination-monotone` (checked) | Built |
| Robustness (worst single removal) | the support closure, squared | O(closure^2) as implemented, one fresh re-derivation per removal | derivation: `analyzeRobustness` calls `computeEarned` with a fresh memo per removed claim (`robustness.mjs`) | Speedbump: incremental removal (recompute only the affected sub-cone) |
| Perturbation (flipped-assumption overlay) | the affected forward cone per flip | O(V + E) to build the adjacency, plus the sum of the affected cones over the flips | derivation: `forwardEdges` plus the cascade (`perturb.js`), audited by `check-perturb.mjs` | Built |
| Reconciliation (all disagreements) | the number of contradicts links, not claim pairs | O(C * (E + cone)) for C contradicts links | derivation: `disagreements` iterates contradicts links, two `supportCone` builds per record (`reconciliation.mjs`) | Built (a shared cone index is a minor lever) |
| The crossing | the necessary citations of the composite | O(citations) fold, plus O(cone) to copy each cited domain grade; `isStale` is O(1) | `thm.crossing-min` (checked); `compositeGrade`, `citeDomainClaim`, `isStale` (`transfer.mjs`) | Built |
| Hashing and canonicalization | the record size | O(record) per record on the write path, the one named hash | derivation: `canonicalize`, `hashOf` (`canonical.mjs`) | Built |
| The certificate | the bundle size | O(bundle) to compute (one hash over data the gate already assembled), O(bundle) verify short-circuit, O(1) mark-stale per certificate, a linear sweep at most on a parameter change | `thm.certificate-seals-bundle` (checked); the CERT-1 design rules, `certificateSeal` (`gate.mjs`), `isStale` (`transfer.mjs`) | Built |

## The speedbumps

Two operations are honestly expensive as implemented, and each has a lever that is shape-preserving engineering. Because the differential harness pins the earned-grade recurrence and the certificate seal at the checked tier, a lever can be pulled and the harness re-run to confirm the verified behavior is unchanged, so these are changes to how the same result is computed, not changes to what is computed.

- **Robustness, the worst single removal.** `analyzeRobustness` derives the base grade once, then for each claim in the target's support closure re-derives the grade from scratch with that claim removed, one fresh memo per removal (`robustness.mjs`, `computeEarned`). That is O(closure^2). It is the honestly-expensive read, named plainly. The lever is incremental removal: a removal only changes the grades of claims on the path from the removed node to the target, so recomputing the affected sub-cone rather than the whole closure per removal reduces the repeated work. The natural shape is strictly better than the implemented shape, which makes this a candidate for a separate fix prompt rather than a change made here.

- **The write context and commit.** A gate decision runs against a store view that `storeViewOf` builds by resolving every entry in the store (O(V + E)), and a committed write recomputes the state hash by canonicalizing and sorting every set (O(V + E log(V + E)) in `state.mjs`). The decision proper is scoped to the contribution, because stored grades short-circuit the descent, but the context build and the commit are full-store as implemented. The levers are a scoped store-view build (resolve only the stored claims the contribution reaches into, or cache the store view across decisions and update it incrementally) and an incremental or Merkle state hash (hash the changed sets against a rolling accumulator rather than re-sorting the whole state). Both preserve the derived-not-stored discipline: the store view and the state hash stay derivations, computed more cheaply.

Reconciliation is not a speedbump. It iterates the contradicts links, one disagreement record per link, not every pair of claims, so it is linear in the number of contradicts links rather than quadratic in the claim count; the only inefficiency is rebuilding the cone index per record, which a shared index removes without changing the complexity class.

## What is not claimed

These are derived facts about the protocol's computations, not measured facts about a tuned deployment. The claim is that the operations have the complexity stated; the claim is not that the implementation is tuned for a 100,000-claim live deployment, and the line between those two statements is this document's honesty. Deployment tuning, load testing at scale, and the multi-participant write economics (concurrent writers, contention, the cost of coordination across communities) are not addressed here. The multi-participant economics are the coordination layer's territory, specified and not built, and the built-versus-specified line for every operation above is the one the status ledger draws.
