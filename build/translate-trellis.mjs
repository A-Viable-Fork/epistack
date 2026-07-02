// Role: the trellis-to-v3 ingestion path (intake data model v3; docs/trellis-to-v3.md). A pure,
//   deterministic translator from an authored trellis case graph (a node map + instances) to v3
//   claim and link records the kernel holds. The trellis stays the authoring source; this produces
//   the records, it does not replace the corpus. It changes no grounding verdict: a node's declared
//   grade is what its terminal already earned, so the v3 earned grade reproduces the trellis floor.
// Contract: translateTrellis(caseGraph, opts) -> { claims, links, sources, kinds, byNode }. Pure;
//   imports only kernel/schema (build may import kernel). Two runs over the same input produce
//   byte-identical records (same identities, same hashes, same sorted order).
// Invariant: DETERMINISM, no floats on the path (body values enter as text in a statement, never as
//   canonical decimals); one canonical form per record. Composition is the meet/join selector:
//   conjunction and sequence fold children into one weakest-of support group, disjunction spreads
//   them across strongest-of groups. Settledness is not inherited: a measurement leaf carries its
//   own basis, a claim resting on it earns corroborated, never the settled tier.
"use strict";
import { claimRecord, linkRecord } from "../kernel/schema/records.mjs";

// ------------------------------------------------------------------------------------------------
// The terminal-to-grade table (docs/trellis-to-v3.md). A trellis node's terminal (or, absent one,
// its kind) fixes the v3 kind, the declared grade, and whether the node carries its own basis (a
// synthesized checking record). "own basis" reaches the settled tier; everything else stays on the
// open line, so a derived node tops out at corroborated no matter how settled its supports are.
// ------------------------------------------------------------------------------------------------
export const KIND_TABLE_ROWS = [
  // leaves that reach the settled tier by their own basis
  { kind: "measurement", ceiling: "independently-rechecked" }, // a measured body property (empirical floor)
  { kind: "primitive", ceiling: "checked" }, // a cited standard result (mathematical floor)
  { kind: "observation", ceiling: "checked" }, // a measured world fact
  // the open line: derived nodes, capped at corroborated (settledness is not inherited)
  { kind: "transformation", ceiling: "corroborated" },
  { kind: "claim", ceiling: "corroborated" },
  { kind: "prediction", ceiling: "corroborated" },
  { kind: "comparison", ceiling: "corroborated" },
  { kind: "question", ceiling: "corroborated" },
  { kind: "forum", ceiling: "corroborated" }, // an irreducible-prior / priced-prior terminal: refuses to reach measurement
  // the floor of the open line, and the constitutive point off it
  { kind: "assumption", ceiling: "asserted" }, // a perturbable premise, asserted only
  { kind: "constitutive", ceiling: "constitutive" }, // a definitional / framework claim
];

// a distinct-party checking record synthesized from a leaf's citation: the world (a measurement) or
// a cited source (a standard result) is the distinct party that discharged the leaf. This is the
// leaf's OWN basis, which is what reaches the settled tier; a derived node never gets one.
function citationCheck(method_class, checker_id) {
  return { checker_id, method_class, method: "migrated from the trellis citation", checked_at_state: "trellis", outcome: "confirms", independence: "distinct-party" };
}

// classify a node: its v3 kind, declared grade, and own-basis checking records. terminal_type wins
// over kind (a leaf terminal fixes the grade); a chain node with a "measurement" terminal is a claim
// that REACHES measurement through its supports, not a measurement leaf itself.
function classifyNode(node) {
  const t = node.terminal_type;
  if (t === "irreducible-prior" || t === "forum")
    return { kind: "forum", declared_grade: "corroborated", checking_records: undefined };
  if (t === "constitutive")
    return { kind: "constitutive", declared_grade: "constitutive", checking_records: undefined };
  switch (node.kind) {
    case "primitive":
      return { kind: "primitive", declared_grade: "checked", checking_records: [citationCheck("derivation-audit", "cited-source")] };
    case "observation":
      return { kind: "observation", declared_grade: "checked", checking_records: [citationCheck("direct-measurement", "the-world")] };
    case "assumption":
      return { kind: "assumption", declared_grade: "asserted", checking_records: undefined };
    case "prediction":
      return { kind: "prediction", declared_grade: "corroborated", checking_records: undefined };
    case "comparison":
      return { kind: "comparison", declared_grade: "corroborated", checking_records: undefined };
    case "question":
      return { kind: "question", declared_grade: "corroborated", checking_records: undefined };
    case "claim":
      // terminal_type "measurement" here declares the CHAIN reaches measurement; the node earns
      // corroborated resting on its (measurement-grounded) supports. Settledness is not inherited.
      return { kind: "claim", declared_grade: "corroborated", checking_records: undefined };
    case "transformation":
    default:
      return { kind: "transformation", declared_grade: "corroborated", checking_records: undefined };
  }
}

// ------------------------------------------------------------------------------------------------
// The edge-kind mapping (docs/trellis-to-v3.md). Composition is the meet/join selector over the
// support_group partition; a dependence on a premise is depends-on, which records the rest without
// lifting the grade (only supports links deliver).
//   children (conjunction | sequence) -> supports, one group  g:<node>        (weakest-of)
//   children (disjunction)            -> supports, group per child g:<node>/<child>  (strongest-of)
//   body_refs                         -> supports, the node's group g:<node>  (empirical floor)
//   prediction.produced_by            -> supports, group g:<node>
//   guard.assumption_id               -> depends-on
//   inputs -> an assumption           -> depends-on
//   inputs -> a non-assumption        -> (dataflow; the children edge already carries it)
//   outputs                           -> (dataflow; not emitted)
// ------------------------------------------------------------------------------------------------
const SUPPORT_LINK_GRADE = "corroborated"; // the link grade does not cap a support below its child's earned grade
const DEPENDS_LINK_GRADE = "asserted"; // a dependence on a premise; depends-on does not deliver anyway

function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

// a stable statement carrying the node id, so distinct nodes get distinct content identities and the
// migration round-trips (byNode maps node id -> claim identity).
function nodeStatement(node) {
  return `${node.id}: ${node.label || node.role || node.kind}`;
}

export function translateTrellis(caseGraph, opts = {}) {
  const nodes = caseGraph.nodes || {};
  const primitives = opts.primitives || {};
  const bodies = opts.bodies || {};
  const caseId = opts.caseId || caseGraph.id || "case";
  const contributor = opts.contributorId || caseId;

  const claims = new Map(); // identity -> claim record (dedup by identity)
  const links = new Map(); // identity -> link record
  const sources = new Map(); // source_id -> row
  const byNode = new Map(); // node id -> claim identity

  const addSource = (source_id, source_class) => { if (!sources.has(source_id)) sources.set(source_id, { source_id, source_class, rests_on: [] }); };
  const addClaim = (rec) => { if (!claims.has(rec.identity)) claims.set(rec.identity, rec); return rec.identity; };
  const addLink = (rec) => { if (!links.has(rec.identity)) links.set(rec.identity, rec); return rec.identity; };

  // -- leaf synthesizers (deterministic, keyed by a stable source id) --
  function bodyLeaf(ref) {
    // ref is "<body>#<property>"; synthesize a measurement claim from the populated leaf.
    const [bodyId, prop] = ref.split("#");
    const body = bodies[bodyId];
    const p = body && body.properties && body.properties[prop];
    const source_id = `src:body:${slug(bodyId)}`; // each body is an independent measurement (disjoint footprint)
    addSource(source_id, "primary-measurement");
    const valText = p && p.value !== undefined ? `${String(p.value)} ${p.unit || ""}`.trim() : "measured";
    const rec = claimRecord({
      kind: "measurement", statement: `${bodyId}#${prop} = ${valText}`,
      source_id, contributor_id: contributor, declared_grade: "checked",
      checking_records: [citationCheck("direct-measurement", `body:${bodyId}`)],
    });
    return { identity: addClaim(rec), source_id };
  }
  function primitiveLeaf(prim) {
    const target = (prim.citation && prim.citation.target) || "standard";
    const source_id = `src:cite:${slug(target)}`; // primitives citing one source share a footprint
    addSource(source_id, /arxiv|preprint/i.test(target) ? "preprint" : "peer-reviewed");
    const rec = claimRecord({
      kind: "primitive", statement: nodeStatement(prim),
      source_id, contributor_id: contributor, declared_grade: "checked",
      checking_records: [citationCheck("derivation-audit", "cited-source")],
    });
    byNode.set(prim.id, rec.identity);
    return { identity: addClaim(rec), source_id };
  }

  // -- pass 1: every case node becomes a claim (so children can resolve to identities) --
  const sourceForNode = (node, cls) => {
    let source_id, source_class;
    if (cls.kind === "observation") { source_id = `src:obs:${slug(node.id)}`; source_class = "primary-measurement"; }
    else if (cls.kind === "assumption") { source_id = `src:assumption:${slug(caseId)}`; source_class = "testimony"; }
    else if (cls.kind === "forum") { source_id = `src:forum:${slug(node.id)}`; source_class = "testimony"; }
    else { source_id = `src:derivation:${slug(caseId)}`; source_class = "institutional-report"; }
    addSource(source_id, source_class);
    return source_id;
  };
  for (const id of Object.keys(nodes).sort()) {
    const node = nodes[id];
    if (node.kind === "primitive") continue; // primitives live in their own module; synthesized on demand
    const cls = classifyNode(node);
    const rec = claimRecord({
      kind: cls.kind, statement: nodeStatement(node),
      source_id: sourceForNode(node, cls), contributor_id: contributor,
      declared_grade: cls.declared_grade, checking_records: cls.checking_records,
    });
    byNode.set(id, rec.identity);
    addClaim(rec);
  }

  // -- pass 2: the edges. children -> supports (grouped by composition), body_refs -> supports,
  //    guard / assumption-inputs -> depends-on --
  const resolveChild = (childId) => {
    if (nodes[childId] && nodes[childId].kind !== "primitive") return { identity: byNode.get(childId), assumption: nodes[childId].kind === "assumption" };
    if (primitives[childId]) return { identity: primitiveLeaf(primitives[childId]).identity, assumption: false };
    if (nodes[childId] && nodes[childId].kind === "primitive") return { identity: primitiveLeaf(nodes[childId]).identity, assumption: false };
    return null; // dangling: a lint-clean corpus has none
  };
  const supports = (from_identity, to_identity, group, source_id) => addLink(linkRecord({
    link_kind: "supports", from_identity, to_identity, support_group: group,
    source_id, contributor_id: contributor, declared_grade: SUPPORT_LINK_GRADE,
  }));
  const dependsOn = (from_identity, to_identity, source_id) => addLink(linkRecord({
    link_kind: "depends-on", from_identity, to_identity,
    source_id, contributor_id: contributor, declared_grade: DEPENDS_LINK_GRADE,
  }));

  for (const id of Object.keys(nodes).sort()) {
    const node = nodes[id];
    if (node.kind === "primitive") continue;
    const to = byNode.get(id);
    const derivSource = `src:derivation:${slug(caseId)}`;
    const meetGroup = `g:${node.id}`;

    // children -> supports, grouped by composition
    for (const childId of (node.children || []).slice().sort()) {
      const r = resolveChild(childId);
      if (!r) continue;
      if (r.assumption) { dependsOn(r.identity, to, derivSource); continue; } // an assumption child is a condition, not evidence
      const group = node.composition === "disjunction" ? `g:${node.id}/${childId}` : meetGroup;
      // a support from a body/primitive leaf keeps its own source footprint; a support from another
      // case node carries the derivation source.
      const childSource = primitives[childId] ? `src:cite:${slug((primitives[childId].citation || {}).target || "standard")}` : derivSource;
      supports(r.identity, to, group, childSource);
    }

    // body_refs -> supports from synthesized measurement leaves, in the node's meet group
    for (const ref of (node.body_refs || []).slice().sort()) {
      const leaf = bodyLeaf(ref);
      supports(leaf.identity, to, meetGroup, leaf.source_id);
    }

    // prediction.produced_by -> supports from the producer
    if (node.produced_by && byNode.has(node.produced_by))
      supports(byNode.get(node.produced_by), to, meetGroup, derivSource);

    // guard.assumption_id -> depends-on
    if (node.guard && node.guard.assumption_id && byNode.has(node.guard.assumption_id))
      dependsOn(byNode.get(node.guard.assumption_id), to, derivSource);

    // inputs that resolve to an assumption -> depends-on (non-assumption inputs are dataflow, already
    // carried by a children edge; outputs are dataflow and not emitted)
    for (const inId of (node.inputs || []).slice().sort()) {
      if (nodes[inId] && nodes[inId].kind === "assumption") dependsOn(byNode.get(inId), to, derivSource);
    }
  }

  // deterministic output: records sorted by identity (a content hash, stable across runs)
  const byIdentity = (a, b) => (a.identity < b.identity ? -1 : a.identity > b.identity ? 1 : 0);
  return {
    claims: [...claims.values()].sort(byIdentity),
    links: [...links.values()].sort(byIdentity),
    sources: [...sources.values()].sort((a, b) => (a.source_id < b.source_id ? -1 : a.source_id > b.source_id ? 1 : 0)),
    kinds: KIND_TABLE_ROWS.slice(),
    byNode,
  };
}
