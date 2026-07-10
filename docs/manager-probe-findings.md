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
