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

// ---- the reproduction check: run on the real cases ----

const sources = { primitives: PRIMITIVES, atlas: ATLAS, cases };
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

// no false ones: every gap corresponds to a sorry-ledger marker or a status-ledger entry
const ok_correspondent = (g) => !!g.sorry_ref || !!g.ledger_ref;
const orphans = gaps.filter((g) => !ok_correspondent(g));
ok(orphans.length === 0, "adds no false ones: every gap carries a sorry_ref or a ledger_ref" + (orphans.length ? " (orphans: " + orphans.map((o) => o.kind + "@" + o.at).join(", ") + ")" : ""));

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
