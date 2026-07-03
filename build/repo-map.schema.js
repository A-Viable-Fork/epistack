// Role: the schema for the typed repository map. A typed graph of the repository itself, in the
//   same form the system uses for knowledge: typed nodes, typed edges, invariants enforced. It
//   defines the node types (the trust-boundary layer), the groups, the edge types, and the
//   import-legality table that states the trust boundary as a machine-checkable property.
// Contract: exports NODE_TYPES, KERNEL_GROUPS, PERIPHERY_GROUPS, EDGE_TYPES, IMPORT_RULES, and the
//   helpers typeForPath / groupForPath / importLegal / validateNode. Pure, DOM-free.
// Invariant: the layer of a node is checkable against its top-level directory; `imports` legality
//   is decided only by the endpoint layers. This file is data + pure functions; it is not generated.
"use strict";

// the trust-boundary layer a node sits in. Checkable against a file's top-level directory.
const NODE_TYPES = ["kernel", "api", "corpus", "periphery", "build", "doc"];

// the component role within a layer. Kernel groups are its sub-parts; periphery splits into
// producers and consumers; the rest are open (any string, or null).
const KERNEL_GROUPS = ["schema", "store", "grounding", "gate", "analysis", "composition", "motions"];
const PERIPHERY_GROUPS = ["producer", "consumer"];

// edge kinds. `imports` is a static code dependency derived from source; the rest are runtime
// flows declared per node because they cannot be read from imports alone.
const EDGE_TYPES = ["imports", "reads-through-api", "gated-write", "loads-corpus", "checked-by"];

// THE TRUST BOUNDARY, as which `imports` edges are legal by endpoint layer (design axiom T0-2).
//   kernel imports only kernel; api imports kernel and api; periphery imports api and periphery
//   and NEVER kernel; corpus imports nothing; build may import any layer; doc imports nothing.
const IMPORT_RULES = {
  kernel: ["kernel"],
  api: ["kernel", "api"],
  periphery: ["api", "periphery"],
  corpus: [],
  build: ["kernel", "api", "corpus", "periphery", "build"],
  doc: [],
};

// the layer a path belongs to, from its top-level directory. Root-level tooling (linter.js) is
// build. Returns null for a path outside the mapped layers.
function typeForPath(rel) {
  rel = rel.replace(/\\/g, "/").replace(/^\.\//, "");
  const top = rel.split("/")[0];
  if (top === "kernel") return "kernel";
  if (top === "api") return "api";
  if (top === "corpora") return "corpus";
  if (top === "periphery") return "periphery";
  if (top === "build") return "build";
  if (top === "docs") return "doc";
  if (rel === "linter.js") return "build"; // root tooling
  return null;
}

// the group of a path within its layer. Kernel: its sub-directory. Periphery: producer for the
// producing surfaces (ingest, author, redteam), consumer for the rest. Open elsewhere.
function groupForPath(rel, type) {
  rel = rel.replace(/\\/g, "/").replace(/^\.\//, "");
  const parts = rel.split("/");
  if (type === "kernel") return parts[1] || null;
  if (type === "periphery") return ["ingest", "author", "redteam"].includes(parts[1]) ? "producer" : "consumer";
  return null; // open
}

function importLegal(fromType, toType) {
  const allowed = IMPORT_RULES[fromType];
  return Array.isArray(allowed) && allowed.includes(toType);
}

// validate one node record against the schema.
function validateNode(n) {
  const p = [];
  if (!n || typeof n !== "object") return ["node is not an object"];
  if (!n.path || typeof n.path !== "string") p.push("node missing a string 'path'");
  if (!NODE_TYPES.includes(n.type)) p.push(`${n.path}: bad type '${n.type}'`);
  // the declared type must match the file's actual top-level directory
  const actual = typeForPath(n.path || "");
  if (actual && n.type !== actual) p.push(`${n.path}: declared type '${n.type}' but sits in a '${actual}' directory`);
  if (n.type === "kernel" && n.group && !KERNEL_GROUPS.includes(n.group))
    p.push(`${n.path}: bad kernel group '${n.group}'`);
  if (n.type === "periphery" && n.group && !PERIPHERY_GROUPS.includes(n.group))
    p.push(`${n.path}: bad periphery group '${n.group}'`);
  if (n.flows)
    for (const f of n.flows) {
      if (!EDGE_TYPES.includes(f.type) || f.type === "imports")
        p.push(`${n.path}: a declared flow must be a runtime edge type, not '${f.type}'`);
      if (!f.to || typeof f.to !== "string") p.push(`${n.path}: a flow needs a string 'to'`);
    }
  return p;
}

const OUT = {
  NODE_TYPES, KERNEL_GROUPS, PERIPHERY_GROUPS, EDGE_TYPES, IMPORT_RULES,
  typeForPath, groupForPath, importLegal, validateNode,
};
if (typeof module !== "undefined" && module.exports) module.exports = OUT;
