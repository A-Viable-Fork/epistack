// Role: resolves a claim's checking records against the trusted tables before the earned-grade rule reads
//   them: whether each check's cited artifacts are located (the fabrication rule, after A-Viable-Fork/PDE
//   check 05), its footprint closed over source dependencies and the checker's own exposure, and its
//   independence from the claim's author computed from the party table (after PDE check 06).
// Contract: resolveChecks(checks, { contributorId, sourceTable, partyTable }) -> resolved checks, each the
//   original record plus { located, footprint, independence, independence_basis, authority_root };
//   canonicalRoot(table, id).
//   Pure, ESM; kernel imports only kernel.
// Invariant: unknown is never read as favourable. An unlocated check carries no footprint, and a footprint of
//   canonical roots alone is empty, so it is unknown and cannot lift; an unknown
//   party is not distinct; without a party table the declared independence stands, marked as declared.
"use strict";
import { footprintClosure, partyOf, sourceClass } from "../schema/tables.mjs";

// a canonical literature root: a peer-reviewed source whose whole ancestry is peer-reviewed. Two checks that
// both consult one are not dependent through it; their own artifacts are what must be disjoint. Upstreamed
// from A-Viable-Fork/Physics (build/independence-core.mjs; governing-conventions Section 5, amended at its
// Stage 3b), which applied it to the corpus before the kernel did.
export function canonicalRoot(table, id) {
  if (!table || sourceClass(table, id) !== "peer-reviewed") return false;
  for (const ancestor of footprintClosure(table, [id])) if (sourceClass(table, ancestor) !== "peer-reviewed") return false;
  return true;
}

export function resolveCheck(c, { contributorId, sourceTable, partyTable }) {
  // a declared footprint names source ids too, so it is read as cited: what a check rests on is what it cites.
  const cited = [...new Set([...(c.cited_artifacts || []), ...(c.footprint || [])])];
  const located = cited.length > 0 && !!sourceTable && cited.every((id) => sourceTable.byId.has(id));
  const checker = partyOf(partyTable, c.checker_id);
  const author = partyOf(partyTable, contributorId);
  let independence = c.independence, basis = "declared";
  if (partyTable) {
    basis = "computed";
    const exposure = checker && author ? footprintClosure(sourceTable || { byId: new Map() }, author.source_footprint) : null;
    const apart = !!(checker && author) && checker.authority_root !== author.authority_root &&
      checker.source_footprint.every((s) => !exposure.has(s));
    independence = apart ? "distinct-party" : "self";
  }
  let footprint;
  if (located) {
    const ids = [...cited, ...(checker ? checker.source_footprint : [])];
    footprint = [...footprintClosure(sourceTable, ids)].filter((id) => !canonicalRoot(sourceTable, id)).sort();
  }
  return { ...c, located, footprint, independence, independence_basis: basis, declared_independence: c.independence, authority_root: checker ? checker.authority_root : null };
}

export function resolveChecks(checks, ctx) {
  return (checks || []).map((c) => resolveCheck(c, ctx));
}
