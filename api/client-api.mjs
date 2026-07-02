// Role: the propose/read contract (Prompt 10). The API is a contract, not a location: it names a
//   provider and delegates. A client calls propose and read and never learns which provider answers,
//   so a local provider (runs the gate in-process over a snapshot) and a remote provider (calls a
//   hosted kernel) are interchangeable behind this one seam. Swapping providers changes one import;
//   the client is untouched.
// Contract: createClientApi(provider) -> { propose(proposedClaim) -> receipt, read(query) -> [claim],
//   providerKind() -> string }. provider must implement propose and read. ESM; the contract touches
//   no kernel and no provider directly, so it is provider-agnostic by construction.
// Invariant: this layer holds no grounding logic. It validates the shape of a call and forwards it;
//   every grade, price, and refusal is produced by the provider's gate, never here.
"use strict";

export function createClientApi(provider) {
  if (!provider || typeof provider.propose !== "function" || typeof provider.read !== "function")
    throw new Error("createClientApi: provider must implement propose(proposedClaim) and read(query)");
  return {
    // propose a typed claim; returns the full receipt (data model Section 11) the provider produced.
    propose: (proposedClaim) => provider.propose(proposedClaim),
    // read claims with their grounding; query filters, {} or no argument returns all.
    read: (query) => provider.read(query || {}),
    // which world are we in: "local" or "remote". Diagnostic only; the client renders identically.
    providerKind: () => provider.kind || "unknown",
  };
}
