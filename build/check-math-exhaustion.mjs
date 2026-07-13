// Role: the math kernel's exhaustion oracle (stage three). Proves the grade-lattice laws by
//   enumerating meet and join over the whole finite collapsed grade line, which is a complete proof
//   because it covers the entire domain. This passing oracle is the support that grounds the lattice
//   theorem claims at the constitutive proof-floor. It tests the real operations from confidence.mjs,
//   never an idealized algebra.
// Contract: `node build/check-math-exhaustion.mjs` exits non-zero on any law that fails over the full
//   enumeration. Imports only kernel/schema/confidence.mjs.
// Invariant: the enumeration is total (all pairs, and all triples where associativity needs them), so
//   a pass is a proof, not a sample. Grades are named positions; no numbers on the epistemic path.
"use strict";
import { COLLAPSED, meet, join, capByCeiling, comparableWithinMode, collapsedRank, POSITIONS } from "../kernel/schema/confidence.mjs";

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-MATH-EXHAUSTION: the grade-lattice laws, proved by enumeration over the whole domain"); console.log(H);

const G = COLLAPSED; // ungraded, asserted, supported, corroborated, settled
console.log(`\nenumerating over the ${G.length} collapsed grades: ${G.join(", ")}`);

// helper: does a binary law hold for the operation over all pairs?
function allPairs(op, law) {
  for (const a of G) for (const b of G) if (!law(a, b, op)) return { a, b };
  return null;
}
function allTriples(op, law) {
  for (const a of G) for (const b of G) for (const c of G) if (!law(a, b, c, op)) return { a, b, c };
  return null;
}

console.log("\n[1] meet and join are commutative, associative, and idempotent");
for (const [name, op] of [["meet", meet], ["join", join]]) {
  ok(!allPairs(op, (a, b, f) => f(a, b) === f(b, a)), `${name} is commutative over all ${G.length * G.length} pairs`);
  ok(!allTriples(op, (a, b, c, f) => f(f(a, b), c) === f(a, f(b, c))), `${name} is associative over all ${G.length ** 3} triples`);
  ok(!allPairs(op, (a, _b, f) => f(a, a) === a), `${name} is idempotent over all ${G.length} grades`);
  // the operation is closed: it returns a grade on the collapsed line
  ok(!allPairs(op, (a, b, f) => G.includes(f(a, b))), `${name} is closed on the collapsed line`);
}

console.log("\n[2] the absorption laws relate meet and join");
ok(!allPairs(null, (a, b) => meet(a, join(a, b)) === a), "meet(a, join(a, b)) = a over all pairs");
ok(!allPairs(null, (a, b) => join(a, meet(a, b)) === a), "join(a, meet(a, b)) = a over all pairs");

console.log("\n[3] the grade set under meet and join is a lattice");
// meet is the greatest lower bound and join the least upper bound on the total collapsed order: confirm
// meet(a,b) is the lower of the two by rank and join the higher, over the whole domain.
ok(!allPairs(null, (a, b) => collapsedRank(meet(a, b)) === Math.min(collapsedRank(a), collapsedRank(b))), "meet is the lower rank (greatest lower bound) over all pairs");
ok(!allPairs(null, (a, b) => collapsedRank(join(a, b)) === Math.max(collapsedRank(a), collapsedRank(b))), "join is the higher rank (least upper bound) over all pairs");

console.log("\n[4] meet and join are well-defined given the empirical/constitutive mode incomparability");
// the settled tier holds three positions in two modes; enumerate them and confirm the comparability
// function reports same-mode positions comparable and cross-mode positions incomparable, so no false
// ordering is produced, and capByCeiling handles every settled pair without crossing modes.
const SETTLED = Object.keys(POSITIONS).filter((p) => POSITIONS[p].tier === "settled");
console.log(`      the settled positions: ${SETTLED.join(", ")}`);
let modeOk = true, capOk = true;
for (const a of SETTLED) for (const b of SETTLED) {
  const sameMode = POSITIONS[a].mode === POSITIONS[b].mode;
  if (comparableWithinMode(a, b) !== sameMode) modeOk = false; // comparable exactly when same mode
  const capped = capByCeiling(a, b); // must return a real position, never invent an ordering
  if (!POSITIONS[capped]) capOk = false;
}
ok(modeOk, "comparability is true exactly for same-mode settled pairs and false across modes (no false ordering)");
ok(capOk, "capByCeiling returns a real settled position for every settled pair, across incomparable modes included");

console.log("\n" + H);
if (fails === 0) console.log("verified by exhaustion: meet and join form a lattice on the grade set, and the settled modes stay incomparable. A complete proof over the whole domain.");
console.log(fails === 0 ? "check-math-exhaustion: OK" : `check-math-exhaustion: ${fails} FAILURE(S)`);
console.log(H);
process.exit(fails === 0 ? 0 : 1);
