// Role: the propose/read contract (Prompt 10). The API is a contract, not a location: it names a
//   provider and delegates. A client calls propose and read and never learns which provider answers,
//   so a local provider (runs the gate in-process over a snapshot) and a remote provider (calls a
//   hosted kernel) are interchangeable behind this one seam. Swapping providers changes one import;
//   the client is untouched.
// Contract: createClientApi(provider) -> { propose(proposedClaim) -> receipt, read(query) -> [claim],
//   glossary() -> { GRADES, KINDS, LINKS, CONCEPTS }, providerKind() -> string }. provider must
//   implement propose and read. ESM; the contract touches no kernel and no provider directly, so it
//   is provider-agnostic by construction.
// Invariant: this layer holds no grounding logic. It validates the shape of a call and forwards it;
//   every grade, price, and refusal is produced by the provider's gate, never here. glossary() is the
//   one exception that touches no truth field at all: static schema vocabulary (DESCRIBE-1), served
//   directly from kernel/schema/glossary.mjs when the provider does not override it.
"use strict";
import { glossary as kernelGlossary } from "../kernel/schema/glossary.mjs";

export function createClientApi(provider) {
  if (!provider || typeof provider.propose !== "function" || typeof provider.read !== "function")
    throw new Error("createClientApi: provider must implement propose(proposedClaim) and read(query)");
  return {
    // propose a typed claim; returns the full receipt (data model Section 11) the provider produced.
    propose: (proposedClaim) => provider.propose(proposedClaim),
    // read claims with their grounding; query filters, {} or no argument returns all.
    read: (query) => provider.read(query || {}),
    // read claims with their robustness and fragility, obtained the same way grounding is (Prompt 13).
    robustness: (query) => (provider.robustness ? provider.robustness(query || {}) : []),
    // read the open gaps in the graph (a claim whose declared grade is not covered by its earned grade).
    gaps: (query) => (provider.gaps ? provider.gaps(query || {}) : []),
    // read the characterized gaps: honest leaps, each with the closing condition that would ground it.
    characterizedGaps: (query) => (provider.characterizedGaps ? provider.characterizedGaps(query || {}) : []),
    // read the reconciliations: each contradicts-linked disagreement with its computed crux, obtained
    // the same way grounding and robustness are (Prompt 22). The crux is a candidate, not a verdict.
    reconciliations: (query) => (provider.reconciliations ? provider.reconciliations(query || {}) : []),
    // the self-describing vocabulary: what every grade, claim kind, and link kind means, plus the
    // declared-vs-earned concept. One source of truth; a client renders this, it never authors it.
    glossary: () => (provider.glossary ? provider.glossary() : kernelGlossary()),
    // which world are we in: "local" or "remote". Diagnostic only; the client renders identically.
    providerKind: () => provider.kind || "unknown",
  };
}
