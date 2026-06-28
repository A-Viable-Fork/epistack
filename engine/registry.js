// Role: assemble the one registry. Merge every addressable component (primitives, case
//   nodes, atlas entries, instances, and presentation components) into a single id-keyed
//   map that the resolver reads. This is the address space the composition claim rests on.
// Contract: buildRegistry({primitives, atlas, cases, components})->{ id -> component }.
//   Pure and DOM-free; throws on a duplicate id (two definitions of one address).
// Invariant: one id, one definition (reference-not-inline). A case contributes its nodes
//   and instances; nothing shared is copied. Adding a case never edits this file.
"use strict";

function buildRegistry(sources) {
  sources = sources || {};
  const registry = Object.create(null);
  const put = (id, c, origin) => {
    if (!id) throw new Error("component with no id (from " + origin + ")");
    if (registry[id]) throw new Error("duplicate id '" + id + "' (from " + origin + ")");
    registry[id] = c;
  };

  const { primitives, atlas, cases, components } = sources;
  if (primitives) for (const id of Object.keys(primitives)) put(id, primitives[id], "primitives");
  if (atlas) for (const id of Object.keys(atlas)) put(id, atlas[id], "atlas");
  if (Array.isArray(cases))
    for (const c of cases) {
      if (c.nodes) for (const id of Object.keys(c.nodes)) put(id, c.nodes[id], "case:" + c.id);
      if (Array.isArray(c.instances)) for (const inst of c.instances) put(inst.id, inst, "case:" + c.id);
    }
  if (components) for (const id of Object.keys(components)) put(id, components[id], "components");

  return registry;
}

if (typeof module !== "undefined" && module.exports) module.exports = { buildRegistry };
