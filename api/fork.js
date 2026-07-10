// Role: the provenance and fork interface: carry signed contributions, retrieve history, fork a kernel, open a merge proposal.
//   forkKernel is the built kernel-level fork: it derives a child kernel from a parent, inheriting the
//   parent's pinned type-hashes so the child can then adopt more or retype, which is the schema-level
//   fork the crossing and adoption machinery already supports. The DURABLE fork over the patch ledger
//   (re-point across the patch history, [4.6]) stays Stage 4, specified not built.
// Contract: forkKernel(parent, opts?) -> fork receipt { new_kernel_id, forked_from, at_point,
//   inherited_pins, persisted, note }. parent = { id, pins }. Pure; api imports kernel and api, never
//   the periphery. STUB remains for the durable patch-history fork.
// Invariant: the fork derives a new kernel object from the parent's real pins and asserts nothing about
//   persistence; persisted is false until the patch ledger ([4.5], [4.6]) is built.
"use strict";

export function forkKernel(parent, opts) {
  if (!parent || !parent.id) throw new Error("forkKernel: parent must have an id");
  const o = opts || {};
  const at_point = o.atPoint || "head";
  // the child inherits the parent's pinned type-hashes; from here it can adopt more or retype locally.
  const inherited_pins = Object.assign({}, parent.pins || {});
  return {
    operation: "fork",
    new_kernel_id: parent.id + "#fork",
    forked_from: parent.id,
    at_point,
    inherited_pins,
    persisted: false,
    note: "the child inherits the parent's pins and can adopt or retype from here; durable persistence over the patch ledger is Stage 4, specified not built",
  };
}
