// Role: the Stage 1 lattice demonstrator's oracle. Asserts modeOf is total over the seven
//   terminals, that the effective-grounding fold reproduces the current structural detector at the
//   boolean level on every real case, and that the contamination check bites on a throwaway fixture
//   while the three real cases report their honest state (no contamination).
// Contract: `node build/check-lattice.mjs`. Exits 0 if every assertion holds, 1 with a report.
// Invariant: read-only over the data and the kernel; changes no case data and no marker. The
//   fixture is built inline and thrown away; it never touches the corpus.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const T = require("../kernel/schema/terminals.js");
const L = require("../kernel/schema/lattice.js");
const C = require("../kernel/grounding/contamination.js");
const G = require("../kernel/analysis/gaps.js");
const { PRIMITIVES } = require("../corpora/_primitives/primitives.js");
const { ATLAS } = require("../corpora/_shared/atlas/atlas.js");
const { BODIES } = require("../corpora/_shared/bodies/bodies.js");
const CASE_FILES = ["../corpora/population/population-pipeline.js", "../corpora/lhc/lhc-cascade.js"];
const cases = CASE_FILES.map((f) => require(f).CASE);

const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); };

// ---- 1. modeOf is total over the seven registered terminals ----
const { TERMINALS } = require("../kernel/schema/schema.js");
for (const t of TERMINALS) ok(T.MODES.includes(T.modeOf(t)), `modeOf('${t}') = ${JSON.stringify(T.modeOf(t))} is not a mode`);
ok(TERMINALS.length === 7, `expected 7 terminals, found ${TERMINALS.length}`);
// the declared partition
ok(T.modeOf("measurement") === "formal" && T.modeOf("derivation") === "formal" && T.modeOf("withheld-record") === "formal" && T.modeOf("simulation-bound") === "formal", "formal partition wrong");
ok(T.modeOf("constitutive") === "constitutive", "constitutive partition wrong");
ok(T.modeOf("irreducible-prior") === "forum" && T.modeOf("question-set") === "forum", "forum partition wrong");

// ---- lattice sanity: floor collapse, forum pulls the meet down, sufficient wins the join ----
ok(L.floorRank("proof") === L.floorRank("measurement") && L.floorRank("measurement") === L.floorRank("declaration"), "the three floors do not share a rank");
ok(L.meet("proof", "measurement") === "floor", "meet of two distinct floors should collapse to 'floor'");
ok(L.meet("measurement", "structured") === "structured", "a forum necessary support should pull the meet down to forum");
ok(L.join("structured", "measurement") === "measurement", "a sufficient floor path should win the join");
ok(L.regionOf("structured") === "forum" && L.regionOf("measurement") === "floor" && L.regionOf("untyped") === "untyped", "regionOf wrong");

// ---- 2. reproduction: the effective-grounding boolean matches the current structural detector ----
// For each case, over the support domain (every id reached as a child), a node is structurally
// grounded iff its effective grounding is above untyped. Compare to groundingGaps' structural
// verdicts (the "support bottoms out here" sub-rule) read straight off the current detector.
for (const c of cases) {
  const { nodeMap, instances } = G.collect({ primitives: PRIMITIVES, atlas: ATLAS, cases: [c], bodies: BODIES });
  const childOf = new Set();
  for (const n of Object.values(nodeMap)) for (const ch of n.children || []) childOf.add(ch);

  const detectorUngrounded = new Set(
    G.groundingGaps(nodeMap, instances)
      .filter((g) => /support bottoms out here/.test(g.missing))
      .map((g) => g.at)
  );
  const latticeUngrounded = new Set(
    [...childOf].filter((id) => C.effectiveGrounding(nodeMap, id) === "untyped")
  );

  const same = detectorUngrounded.size === latticeUngrounded.size && [...detectorUngrounded].every((id) => latticeUngrounded.has(id));
  ok(same, `${c.id}: lattice boolean disagrees with the detector. detector=${JSON.stringify([...detectorUngrounded])} lattice=${JSON.stringify([...latticeUngrounded])}`);
}

// ---- 3a. the contamination check bites on a throwaway fixture ----
// A claim declared with a measurement (formal) terminal whose NECESSARY decomposition includes a
// child terminating in irreducible-prior (forum). The declared floor is contaminated by the prior.
const fixture = {
  "fix.claim": { id: "fix.claim", kind: "claim", terminal_type: "measurement", composition: "conjunction", children: ["fix.support", "fix.prior"] },
  "fix.support": { id: "fix.support", kind: "primitive", citation: { source: "std" } },
  "fix.prior": { id: "fix.prior", kind: "claim", terminal_type: "irreducible-prior" },
};
const fixFlags = C.contaminationGaps(fixture);
ok(fixFlags.length === 1 && fixFlags[0].at === "fix.claim", `fixture: expected exactly fix.claim flagged, got ${JSON.stringify(fixFlags.map((f) => f.at))}`);
ok(fixFlags[0] && fixFlags[0].forum_support === "fix.prior", `fixture: expected forum support named as fix.prior, got ${fixFlags[0] && fixFlags[0].forum_support}`);
ok(fixFlags[0] && fixFlags[0].declared_floor === "measurement" && L.regionOf(fixFlags[0].effective) === "forum", "fixture: declared floor / effective region wrong");

// ---- 3b. the three real cases report their honest state: no contamination ----
// The corpus uses only measurement (formal) terminals; nothing formal rests on a forum support, so
// the honest result is empty. (See the checkpoint note: forum/constitutive terminals are unused in
// the current data, so there are no "forum by declaration" claims to distinguish here.)
const allNodeMap = G.collect({ primitives: PRIMITIVES, atlas: ATLAS, cases, bodies: BODIES }).nodeMap;
const realContam = C.contaminationGaps(allNodeMap);
ok(realContam.length === 0, `real cases should report no contamination, got ${JSON.stringify(realContam.map((f) => f.at))}`);

// ---- report ----
console.log(`lattice: modeOf total over ${TERMINALS.length} terminals; reproduction checked on ${cases.length} cases; contamination fixture bit, real cases clean.`);
if (fails.length) {
  console.error(`\n${fails.length} assertion(s) failed:`);
  for (const f of fails) console.error("  - " + f);
  process.exit(1);
}
console.log("OK: modes and the lattice are explicit, the fold reproduces the detector, contamination bites the fixture and spares the honest cases.");
process.exit(0);
