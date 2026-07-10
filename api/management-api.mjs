// Role: the management contract, the sibling of the propose/read contract for kernel-level operations
//   the manager probe proved missing. Where the claim contract is claim-shaped (propose a claim, read
//   claims), this is kernel-shaped: list kernels, read a kernel's pins and crossings, and adopt, fork,
//   and cross, each write returning a receipt the way propose returns a gate receipt. Like the claim
//   contract it names a provider and delegates, so a local management provider (runs the federation and
//   adoption layer in process) and a remote one are interchangeable behind one seam.
// Contract: createManagementApi(provider) -> { listKernels, readKernel(id), readCrossings(id?),
//   adopt(id, typeHash) -> receipt, fork(id, atPoint?) -> receipt, cross(originKernel, originClaim,
//   targetKernel) -> receipt, providerKind() }. provider must implement all six operations. ESM; this
//   contract touches no kernel, no federation, and no adoption layer directly.
// Invariant: this layer holds no adoption or crossing logic. It validates the shape of a call and
//   forwards it; every kernel object, pin, crossing status, and receipt is produced by the provider's
//   real machinery (the adoption layer and the crossing rule), never here.
"use strict";

const OPERATIONS = ["listKernels", "readKernel", "readCrossings", "adopt", "fork", "cross"];

export function createManagementApi(provider) {
  if (!provider) throw new Error("createManagementApi: a provider is required");
  for (const op of OPERATIONS)
    if (typeof provider[op] !== "function") throw new Error(`createManagementApi: provider must implement ${op}`);
  return {
    // reads: real kernel state from the federation and adoption layer, never a vendored snapshot.
    listKernels: () => provider.listKernels(),
    readKernel: (kernelId) => provider.readKernel(kernelId),
    readCrossings: (kernelId) => provider.readCrossings(kernelId),
    // writes: each returns a receipt of what it did and the real resulting state, computed by the
    // delegated machinery. adopt pins a shared type-hash; fork derives a child kernel; cross makes a
    // crossing and reports whether it arrived native or untyped.
    adopt: (kernelId, typeHash) => provider.adopt(kernelId, typeHash),
    fork: (kernelId, atPoint) => provider.fork(kernelId, atPoint),
    cross: (originKernel, originClaim, targetKernel) => provider.cross(originKernel, originClaim, targetKernel),
    // which world are we in: "local" or "remote". Diagnostic only.
    providerKind: () => provider.kind || "unknown",
  };
}
