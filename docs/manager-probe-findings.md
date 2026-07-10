---
Type: record
Purpose: Records what building the first slice of a kernel manager taught about driving writes from a management surface through the read-and-propose contract, as the finding this probe existed to produce.
Depends on: docs/api.md
Depended on by: nothing
---

# Kernel Manager Probe: Findings

This is slice one of a kernel manager, a surface where kernels are operated, not just read. It is a
probe, and its point is not the surface but what the surface taught: whether the contract drives cleanly
from a management surface (which writes: fork, adopt, cross) as well as it drives from the reading shell
(which only reads). Built: `periphery/navigate/shell/modules/manager.js`, the vendored view
`build/vendor-federation.mjs`, and the standalone page `build/build-manager-probe.mjs`. What follows is
written from what actually happened in the build, not from expectation.

## What drove through the contract cleanly

The reading side drove cleanly. For each member the manager reads a representative claim's live grade
through the contract, `api.read({ identity })`, and renders it. That is a real read of real grounding
through the real `read` surface, and it worked without any new machinery. The claim-level reading
contract is enough for a management surface to show live grounding, where the claim exists in the store
the provider reads.

## What did not: the write could not be driven through the contract

The management write, fork-and-adopt, could not be driven through the contract, and this is the probe's
central finding. The contract (`api/client-api.mjs`) exposes `propose` and the reads `read`,
`robustness`, `gaps`, `characterizedGaps`, `reconciliations`, and `providerKind`. It has no management
operation: no adopt, no fork, no cross, and no way to change a kernel's pinned type-hashes. So adopting a
type into a member is not something `propose` can carry.

The shape is the reason. `propose` takes a claim contribution (entries and links) and returns a gate
receipt over that contribution. Adopt takes a kernel and a type-hash and changes what the kernel pins,
returning a new crossing status, not a gate receipt over a claim. A management operation is kernel-shaped
where `propose` is claim-shaped, and the contract fits the second, not the first. The surface therefore
performed the adopt by reaching the adoption model directly: it pins the real type-hash on the target and
recomputes the crossing status by the adoption-layer rule (a type crosses native exactly when the target
pins the source's hash, mirrored from `build/adoption.mjs`). The operation is real, the hash is real, and
the before-and-after is real, but it was driven through the adoption layer, not through the contract.

## The read side is also incomplete for a manager

The reading contract serves claims, not kernels. The federation structure the manager shows, the members
and their authors, the local-versus-shared tiers, the crossings and their native or untyped status, is
not available through the contract; `read` returns claims, not kernels. The manager reads a vendored
federation view (`vendor/federation/federation-view.json`, produced by the real `buildBottomUp` and the
adoption layer) because the contract has no read for a kernel, its pins, or its crossings. A management
surface needs kernel-level reads the contract does not have.

Two smaller facts fell out of the same seam. First, the vendored snapshot the provider reads merges
covid, the densified LHC legs, and the eggs domains, but not lineage, so the live-grade read finds a
grade for lhc, covid, and eggs and honestly reports "not carried in the contract's snapshot" for lineage.
A manager that lists the whole federation cannot get every member's live grounding from the contract as
the snapshot stands. Second, author and provenance are rendered on every kernel (the marketplace shape
from day one), but they are vendored defaults, not contract fields, because the contract models claims
and their grounding, not kernels as authored objects.

## What the next slice needs from the contract

- **Claim authoring (a propose slice) is not blocked.** `propose` is usable from a surface as-is; the
  existing propose widget already drives it. An authoring slice can proceed against the contract today.
- **Management operations (fork, adopt, cross) need a management-write path** that takes a kernel-level
  operation and returns a real receipt, distinct from claim-propose. Until it exists, a management
  surface must reach the adoption layer, which is the boundary this probe found.
- **A manager needs kernel-level reads:** a read for the kernels in a federation, a read for a kernel's
  pinned type-hashes and its local-versus-shared tiers, and a read for the crossings with their native or
  untyped status. These are what the manager vendored instead of read.
- **The kernel object needs an author and provenance in the contract** for the marketplace shape to be
  real rather than rendered, and the snapshot needs to carry every federated member for the live-grade
  read to cover the whole federation.

## The honest one-line summary

The reading shell reads claims through the contract and that generalizes to a manager's grade display; a
management surface needs kernel operations and kernel reads the contract does not yet expose, so the
write was driven through the adoption layer and reported here rather than worked around. That gap, at the
contract's surface and not in the machinery beneath it, is what slice one exists to have found.

## Slice two closed the finding

The gap slice one found is closed. The management contract now exists (`api/management-api.mjs`,
`build/check-management.mjs`) and its local provider (`api/providers/local-management-provider.mjs`) runs
the real adoption logic over a management snapshot. Slice two rewired the manager
(`periphery/navigate/shell/modules/manager.js`) to drive entirely through it: the kernel list, the tiers,
and the crossings with their native-or-untyped status all come from `listKernels`, `readKernel`, and
`readCrossings`, the live grade still comes from the claim contract, and all three writes are real
operations through the contract with their receipts rendered, adopt turning an untyped crossing native,
fork deriving a child kernel, and cross reporting native or untyped. The manager now drives through the
real management contract rather than around it, vendors no answers (the management snapshot is the
provider's raw input, the way the claim snapshot is the claim provider's), and is embeddable as-is. The
central finding, that a management surface must reach around the contract, no longer holds.

## Authoring rides the propose contract

The authoring slice adds the write half of what the manager reads: a person selects a target kernel,
writes a claim, picks its kind from the kinds that kernel declares, points it at a support already in the
store, and proposes it through `ctx.api.propose`, the same propose contract the claim reads run through.
The surface constructs no grade; it gathers the fields and renders the receipt. The receipt is the
payoff: it shows what the claim earned against what the author declared, and the gap between them is what
teaches grounding. Declare corroborated with one support and the gate declines it, earned supported,
because a single support cannot earn corroborated; add a second independent support and it reaches
corroborated. That movement, the declared grade meeting the earned grade as the support changes, is the
on-ramp's first grounded moment. Authoring into a kernel you keep and take away with you is the next
step, the generator-to-download, specified and not built here.
