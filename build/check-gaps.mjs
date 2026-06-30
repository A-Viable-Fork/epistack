// Role: the gap detector's oracle. Tests each predicate in isolation on fixtures, then runs the
//   detector over the real cases and asserts it reproduces the sorry-ledger structural markers
//   plus the un-populated atlas, adds no false ones, and ranks nothing (the A2 discharge check).
// Contract: `node build/check-gaps.mjs`. Exits 0 if every assertion holds, 1 with a report.
// Invariant: read-only over the data and the engine; asserts the objective/subjective boundary
//   (no gap carries importance/score/weight/rank/priority) rather than trusting it.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const G = require("../engine/gaps.js");
const { PRIMITIVES } = require("../data/primitives/primitives.js");
const { ATLAS } = require("../data/atlas/atlas.js");
const { BODIES } = require("../data/bodies/bodies.js");
const cases = ["../data/cases/population-pipeline.js", "../data/cases/lhc-cascade.js"].map((f) => require(f).CASE);

const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); };
const RANK_KEYS = ["importance", "score", "weight", "rank", "priority"];
const noRank = (gaps) => gaps.every((g) => RANK_KEYS.every((k) => !(k in g)));

// ---- predicate isolation tests, on fixtures ----

// GROUNDING: a childless transformation reached as a child is ungrounded; a cited primitive is not.
{
  const nodeMap = {
    root: { id: "root", kind: "transformation", children: ["leaf", "prim"] },
    leaf: { id: "leaf", kind: "transformation" }, // childless, no citation -> gap
    prim: { id: "prim", kind: "primitive", citation: { source: "x" } }, // grounded
  };
  const g = G.groundingGaps(nodeMap, []);
  ok(g.length === 1 && g[0].at === "leaf" && g[0].kind === "grounding", "grounding: flags the un-cited childless leaf only");
  // provenance sub-rule: a TODO_verify on an otherwise-grounded node
  const g2 = G.groundingGaps({ n: { id: "n", kind: "transformation", children: ["prim"], TODO_verify: "confirm the factor" }, prim: nodeMap.prim }, []);
  ok(g2.some((x) => x.at === "n" && x.sorry_ref === "n#TODO_verify"), "grounding: provenance sub-rule flags a deferred verification with its ledger key");
}

// FRESHNESS: a node resting on a source marked stale, and only such a node.
{
  const nodeMap = {
    fresh: { id: "fresh", kind: "primitive", citation: { source: "x", status: "current" } },
    stale: { id: "stale", kind: "primitive", citation: { source: "y", status: "superseded" } },
    plain: { id: "plain", kind: "primitive", citation: { source: "z" } },
  };
  const g = G.freshnessGaps(nodeMap, []);
  ok(g.length === 1 && g[0].at === "stale" && g[0].kind === "freshness", "freshness: flags the superseded-source node only");
}

// COVERAGE: un-populated atlas; explicit un-done rebuttal search; undrawn question-set branch.
{
  const atlas = {
    bare: { id: "bare", clones: [{ case: "c", node_id: "n" }] }, // clones, no preconditions -> gap
    full: { id: "full", clones: [{ case: "c", node_id: "n" }], preconditions: [{ name: "p" }] },
  };
  const nodeMap = {
    cl: { id: "cl", kind: "claim", rebuttal_search: { done: false } },
    clok: { id: "clok", kind: "claim", rebuttal_search: { done: true } },
    q: { id: "q", kind: "question", branches_expected: 4, children: ["a"] },
  };
  const g = G.coverageGaps(nodeMap, atlas);
  ok(g.some((x) => x.at === "bare" && x.ledger_ref === "A1"), "coverage: flags the un-populated atlas entry (ledger A1)");
  ok(!g.some((x) => x.at === "full"), "coverage: a populated atlas entry is not a gap");
  ok(g.some((x) => x.at === "cl") && !g.some((x) => x.at === "clok"), "coverage: flags only the explicit un-done rebuttal search");
  ok(g.some((x) => x.at === "q"), "coverage: flags the undrawn question-set branch");
}

// DANGLING: an edge to an absent id, and only that.
{
  const nodeMap = {
    a: { id: "a", kind: "transformation", children: ["b", "ghost"] },
    b: { id: "b", kind: "primitive", citation: { source: "x" } },
  };
  const known = G.knownIds(nodeMap, [], {});
  const g = G.danglingGaps(nodeMap, [], {}, known);
  ok(g.length === 1 && g[0].at === "a" && /ghost/.test(g[0].missing), "dangling: flags the edge to the absent id only");
}

// BODY: a populated body property, flattened, is a grounded measurement terminal.
{
  const bodies = { sun: { id: "sun", name: "the Sun", properties: { mass: { value: 2e30, unit: "kg", citation: { source: "std" }, terminal_type: "measurement" } } } };
  const { nodeMap } = G.collect({ bodies });
  ok(nodeMap["body.sun.mass"] && nodeMap["body.sun.mass"].kind === "primitive" && !!nodeMap["body.sun.mass"].citation, "body: a populated property flattens to a cited primitive leaf");
  nodeMap.model = { id: "model", kind: "transformation", children: ["body.sun.mass"] };
  ok(!G.groundingGaps(nodeMap, []).some((x) => x.at === "body.sun.mass"), "body: a populated body leaf grounds (no grounding gap)");
}

// BODY: a stub does not flatten into a node (it cannot accidentally ground).
{
  const bodies = { wd: { id: "wd", name: "a white dwarf", properties: { accretion_regime: { sorry: "deferred" } } } };
  const { nodeMap } = G.collect({ bodies });
  ok(!nodeMap["body.wd.accretion_regime"], "body: a stub property does not become a node");
}

// BODY: a model node whose body_refs names an existing body but a stub/missing property fires
// exactly one populate-on-demand coverage gap, carrying neither sorry_ref nor ledger_ref.
{
  const bodies = { wd: { id: "wd", name: "a white dwarf", properties: {
    mean_density: { value: 1e9, unit: "kg/m^3", citation: { source: "x" }, terminal_type: "measurement" },
    accretion_regime: { sorry: "deferred to Giddings-Mangano" },
  } } };
  const gs = G.coverageGaps({ stub: { id: "stub", kind: "transformation", body_refs: ["wd#accretion_regime"] } }, {}, bodies);
  ok(gs.length === 1 && gs[0].kind === "coverage" && gs[0].at === "stub" && /not populated to the floor/.test(gs[0].missing) && /measure and cite/.test(gs[0].discharge), "body: a stub property -> one populate-on-demand coverage gap");
  ok(gs[0].sorry_ref === undefined && gs[0].ledger_ref === undefined, "body: the populate-on-demand gap carries no sorry_ref or ledger_ref");
  ok(G.coverageGaps({ miss: { id: "miss", kind: "transformation", body_refs: ["wd#luminosity"] } }, {}, bodies).length === 1, "body: a property the body lacks -> one coverage gap");
  ok(G.coverageGaps({ pop: { id: "pop", kind: "transformation", body_refs: ["wd#mean_density"] } }, {}, bodies).length === 0, "body: a populated property -> no coverage gap");
}

// BODY: a model node whose body_refs names an absent body fires a dangling gap, not a coverage gap;
// an existing body's unpopulated property never dangles (coverage owns it).
{
  const bodies = { wd: { id: "wd", name: "a white dwarf", properties: {} } };
  const nm = { m: { id: "m", kind: "transformation", body_refs: ["ghost#mass"] } };
  ok(G.coverageGaps(nm, {}, bodies).length === 0, "body: an absent body fires no coverage gap");
  const d = G.danglingGaps(nm, [], {}, G.knownIds(nm, [], {}, bodies));
  ok(d.length === 1 && d[0].kind === "dangling" && /body\.ghost/.test(d[0].missing), "body: an absent body fires a dangling gap (broken edge)");
  const nm2 = { m2: { id: "m2", kind: "transformation", body_refs: ["wd#mass"] } };
  ok(G.danglingGaps(nm2, [], {}, G.knownIds(nm2, [], {}, bodies)).length === 0, "body: an existing body's missing property does not dangle");
}

// BODY: a measurement leaf with no citation does NOT ground (citation required, as for the math floor).
{
  const nodeMap = {
    root: { id: "root", kind: "transformation", children: ["leaf"] },
    leaf: { id: "leaf", kind: "primitive", terminal_type: "measurement" },
  };
  ok(G.groundingGaps(nodeMap, []).some((x) => x.at === "leaf"), "body: an uncited measurement leaf does not ground (grounding gap)");
}

// ---- the reproduction check: run on the real cases (with the body corpus wired in) ----

const sources = { primitives: PRIMITIVES, atlas: ATLAS, cases, bodies: BODIES };
const gaps = G.detectGaps(sources);

ok(noRank(gaps), "no gap carries an importance/score/weight/rank/priority field");

// every gap is well-typed
const KINDS = new Set(["grounding", "freshness", "coverage", "dangling"]);
ok(gaps.every((g) => KINDS.has(g.kind) && g.at && g.missing && g.discharge), "every gap is { kind, at, missing, discharge }");

// the six sorry-ledger structural markers are each reproduced, carrying their ledger key
const EXPECTED_MARKERS = [
  "lhc.branch1#sorry",
  "lhc.branch3#sorry",
  "lhc.N2.1#TODO_verify",
  "lhc.N2.2#TODO_verify",
  "covid.instance#TODO_verify",
  "eggs.instance#TODO_verify",
];
const foundRefs = new Set(gaps.map((g) => g.sorry_ref).filter(Boolean));
for (const k of EXPECTED_MARKERS) ok(foundRefs.has(k), `reproduces the sorry-ledger marker ${k} as a gap`);

// the un-populated atlas is found as a coverage gap
ok(gaps.some((g) => g.kind === "coverage" && g.ledger_ref === "A1"), "reproduces the un-populated atlas as a coverage gap (A1)");

// no false ones: every gap corresponds to a sorry-ledger marker, a status-ledger entry, or is a
// populate-on-demand body coverage gap (ref-less by design: the demand is the gap). The LHC model
// now cites the body corpus (load-bearing), but every cited property is populated, so no
// populate-on-demand gap is present and the set is unchanged.
const isPopulateOnDemand = (g) => g.kind === "coverage" && /not populated to the floor/.test(g.missing);
const ok_correspondent = (g) => !!g.sorry_ref || !!g.ledger_ref || isPopulateOnDemand(g);
const orphans = gaps.filter((g) => !ok_correspondent(g));
ok(orphans.length === 0, "adds no false ones: every gap carries a sorry_ref or a ledger_ref, or is a populate-on-demand body gap" + (orphans.length ? " (orphans: " + orphans.map((o) => o.kind + "@" + o.at).join(", ") + ")" : ""));

// load-bearing and grounded: the LHC nodes that now cite the body corpus carry no coverage gap
// (every cited property is populated) and no dangling gap (every cited body exists).
const BODY_CITERS = ["lhc.N2.3", "lhc.prediction", "lhc.comparison"];
ok(!gaps.some((g) => (g.kind === "coverage" || g.kind === "dangling") && BODY_CITERS.includes(g.at)),
  "the body corpus is load-bearing and fully grounded: no coverage or dangling gap on the citing LHC nodes");

// freshness and dangling are empty on the clean corpus (honest: present, fixture-tested, no instances)
ok(!gaps.some((g) => g.kind === "freshness"), "freshness: zero on the current corpus (no stale source)");
ok(!gaps.some((g) => g.kind === "dangling"), "dangling: zero on the current corpus (lint guarantees resolution)");

// ---- report ----
const byKind = gaps.reduce((a, g) => ((a[g.kind] = (a[g.kind] || 0) + 1), a), {});
console.log(`gap detector: ${gaps.length} gaps on the corpus ` + JSON.stringify(byKind));
for (const g of gaps) console.log(`  [${g.kind}] ${g.at}${g.sorry_ref ? "  <" + g.sorry_ref + ">" : g.ledger_ref ? "  <ledger " + g.ledger_ref + ">" : ""}`);
if (fails.length) {
  console.error(`\n${fails.length} assertion(s) failed:`);
  for (const f of fails) console.error("  - " + f);
  process.exit(1);
}
console.log("\nOK: predicates pass in isolation; the detector reproduces the ledger and ranks nothing.");
process.exit(0);
