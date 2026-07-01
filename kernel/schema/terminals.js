// Role: the terminal-type registry. One place that names the closures a claim can reach
//   and the promotion condition each implies (design axiom T1-6: a registry, not a switch).
// Contract: TERMINAL_REGISTRY (type -> {promotes}); promotionFor(type) -> string.
// Invariant: DOM-free. Adding a terminal type for a new domain is an entry here plus an
//   ontology entry in the data, never a switch buried in the engine.
"use strict";

// Mirrors the promotion semantics the artifact already encodes (view/app: promotionFor)
// and docs/executive-overview.md (terminal types). Kept here as the single registry.
const TERMINAL_REGISTRY = {
  measurement: { promotes: "promotes on engineering or domain-standard by independent confirmation" },
  "irreducible-prior": { promotes: "does not promote; priced, not resolved" },
  "withheld-record": { promotes: "does not promote while sealed; converts to measurement when the record opens" },
  "question-set": { promotes: "promotes when a missing branch is named or the set is shown complete" },
  constitutive: { promotes: "does not promote; closes by adopting or refusing a framework" },
  derivation: { promotes: "promotes when a proof compiles (formal track)" },
  "simulation-bound": { promotes: "promotes against a bounded simulation" },
};

function promotionFor(type) {
  const e = TERMINAL_REGISTRY[type];
  return e ? e.promotes : "terminal pending";
}

if (typeof module !== "undefined" && module.exports)
  module.exports = { TERMINAL_REGISTRY, promotionFor };
