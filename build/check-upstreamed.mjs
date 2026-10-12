// Role: the oracle for what the consumers built and this repository took back: Physics's source classes and
//   computation pack, its staleness reading (computeCurrency) and lineage lint (lintSourceTable); Knowledge-
//   Game's governance hash, contribution ladder and scaffolder options; EpiTrellis's reader tolerance and
//   instrument stamp. It also holds this repository's own
//   corpora to the currency, decay and lineage readings.
// Contract: `node build/check-upstreamed.mjs` exits non-zero on any failure. The scaffolder case runs in a
//   temporary copy of the tree, so nothing here writes to this one.
// Invariant: every fixture is invented here; the corpus readings use the committed snapshot.
"use strict";
import { readFileSync, mkdtempSync, cpSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { makeSourceTable, makeKindTable, lintSourceTable } from "../kernel/schema/tables.mjs";
import { makeRegister } from "../kernel/compute/transforms.mjs";
import { claimRecord, linkRecord, withdrawnClaimRecord } from "../kernel/schema/records.mjs";
import { killRecord } from "../kernel/schema/standing.mjs";
import { genesis } from "../kernel/store/state.mjs";
import { apply } from "../kernel/store/apply.mjs";
import { computeCurrency } from "../kernel/store/currency.mjs";
import { computeDecay } from "../kernel/store/decay.mjs";
import { hashOf } from "../kernel/schema/canonical.mjs";
import { governanceHash, canonicalParameterRecord } from "../api/governance-hash.js";
import { LADDER, exportContribution, importContribution } from "../api/contribution.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const throws = (f) => { try { f(); return false; } catch { return true; } };
const H = "=".repeat(80);
console.log(H + "\nCHECK-UPSTREAMED: what the consumers built, taken back and held here\n" + H);

console.log("\n[1] Physics D0 to D2: source classes and the computation pack");
const src = makeSourceTable([{ source_id: "a", source_class: "ai-audit" }, { source_id: "f", source_class: "formal-artifact" }]);
ok(src.byId.get("a").source_class === "ai-audit" && src.byId.get("f").source_class === "formal-artifact", "ai-audit and formal-artifact are source classes");
const reg = makeRegister();
const base = { id: "c.trace", pack: "computation", consumes: "values", emits: "value", reversibility: "lossy", assumptions: [{ id: "a", statement: "an invented assumption" }] };
ok(!throws(() => reg.register({ ...base, run: () => ({ value: "1" }) })), "a computation entry over values that emits a value registers");
ok(throws(() => makeRegister().register({ ...base, id: "c.k", emits: "kernel", run: () => ({}) })), "a computation entry never emits a kernel");
ok(throws(() => makeRegister().register({ ...base, id: "c.g", consumes: "kernel", run: () => ({}) })), "a computation entry consumes values only");
const graded = makeRegister(); graded.register({ ...base, id: "c.grade", run: () => ({ value: "1", grade: "settled" }) });
ok(throws(() => graded.run("c.grade", [])), "a computation's output carrying a grade field is refused at run time");

console.log("\n[2] the source row keeps its landing fields, and the lineage lint");
const h = (c) => c.repeat(64);
const landed = makeSourceTable([{ source_id: "s", source_class: "dataset", sha256: h("a"), files: [{ path: "x.txt", sha256: h("b"), method: "pdftotext" }], read_depth: "receipted" }]).byId.get("s");
ok(landed.sha256 === h("a") && landed.files[0].method === "pdftotext" && landed.read_depth === "receipted", "sha256, files and read depth survive the table");
ok(throws(() => makeSourceTable([{ source_id: "s", source_class: "dataset", read_depth: "skimmed" }])), "an unknown read depth is refused");
const rules = (rows) => lintSourceTable(rows).map((v) => v.rule).sort().join(",");
ok(rules([{ source_id: "a", rests_on: ["ghost"] }]) === "dangling", "a rests_on target with no row is dangling");
ok(rules([{ source_id: "a", rests_on: ["a"] }]) === "self-loop", "a source resting on itself is a self-loop");
ok(rules([{ source_id: "p", rests_on: ["q"] }, { source_id: "q", rests_on: ["p"] }]) === "cycle", "two sources resting on each other are a cycle");
ok(rules([{ source_id: "a" }, { source_id: "a" }]) === "duplicate-id", "one id on two rows is a duplicate");
ok(rules([{ source_id: "m1", sha256: h("c") }, { source_id: "m2", sha256: h("c") }]) === "artifact-twice", "one artifact under two unlinked ids is caught");
ok(rules([{ source_id: "m1", sha256: h("c") }, { source_id: "m2", sha256: h("c"), rests_on: ["m1"] }]) === "", "the same artifact under linked ids is a declared relation, not a mirror");

console.log("\n[3] currency: an in-force claim depending on an input no longer standing");
const c = (st) => claimRecord({ kind: "claim", statement: "an invented claim " + st, source_id: "s", contributor_id: "lab", declared_grade: "asserted" });
const frame = c("frame"), dep = c("dependent"), other = c("other");
const on = (to) => linkRecord({ link_kind: "depends-on", from_identity: dep.identity, to_identity: to, source_id: "s", contributor_id: "lab", declared_grade: "asserted" });
const s0 = apply(genesis(), { entries: [frame, dep, other], links: [on(frame.identity)], applied_contribution_hash: "U0" });
ok(computeCurrency(s0).length === 0, "a dependent on a standing frame is current");
const s1 = apply(s0, { withdrawn_records: [withdrawnClaimRecord({ claim_identity: frame.identity, withdrawn_at_state: s0.state_hash, withdrawn_by: "lab", reason: "invented", reinstatement_condition: { condition_kind: "entry-of-kind", required_kind: "claim" } })], applied_contribution_hash: "U1" });
ok(computeCurrency(s1).length === 1 && computeCurrency(s1)[0].cause === `out-of-force:${frame.identity}`, "a withdrawn frame makes its dependent's edge a currency finding");
const s2 = apply(s0, { links: [on("never-entered")], applied_contribution_hash: "U2" });
ok(computeCurrency(s2).some((f) => f.cause === "absent:never-entered"), "a depends-on into an absent identity is a finding, never a pass");
const s3 = apply(s0, { links: [on(other.identity)], kill_records: [killRecord({ killed_identity: other.identity, by_identity: "barrier", scope: "global", receipts: ["R1"] })], applied_contribution_hash: "U3" });
ok(computeCurrency(s3).some((f) => f.cause === `killed:${other.identity}`), "a globally killed input is a finding too");

console.log("\n[4] the governance hash");
const cfg = { kernel_id: "invented", frame: "x", identity_thresholds: { min: "2" }, standing_economy: {}, null_objective_order: "recency", corpus_content_license: "gift" };
ok(governanceHash(cfg, { k: "h" }) === hashOf(canonicalParameterRecord(cfg, { k: "h" })), "the hash is the canonical hash of the parameter record");
ok(governanceHash({ ...cfg, kernel_id: "renamed", frame: "y", fetch_locations: ["z"] }, { k: "h" }) === governanceHash(cfg, { k: "h" }), "labels and transport hints never move it");
ok(governanceHash({ ...cfg, corpus_content_license: "share-alike" }, { k: "h" }) !== governanceHash(cfg, { k: "h" }), "a governance parameter moves it");
ok(canonicalParameterRecord({}, {}).corpus_content_license === "unspecified" && canonicalParameterRecord({}, {}).null_objective_order === "unspecified", "an absent parameter is the honest unspecified");
ok(throws(() => governanceHash({ standing_economy: { decay_rate: 0.1 } }, {})), "a numeric parameter as a float is refused, never truncated");

console.log("\n[5] the contribution ladder");
ok(LADDER.map((s) => s.id).join(",") === "gate-passed,admitted,semantically-accepted", "three states, in order");
ok(LADDER.slice(0, 2).every((s) => !/\b(true|validated|verified|accepted)\b/i.test(s.label + " " + s.caption)), "the first two states never say true, validated, verified or accepted");
ok(throws(() => { LADDER[0].label = "Accepted"; }) || LADDER[0].label === "Gate-passed", "the ladder is frozen");

console.log("\n[6] the scaffolder: every claim-spec key reaches the record; the import paths are options");
const tmp = mkdtempSync(join(tmpdir(), "epistack-scaffold-"));
try {
  for (const d of ["kernel", "scaffolder", "corpora/_shared"]) cpSync(join(ROOT, d), join(tmp, d), { recursive: true });
  cpSync(join(ROOT, "kernel"), join(tmp, "vendor/kernel"), { recursive: true });
  const cfgPath = join(tmp, "scaffolder/examples/valid-empty.json");
  const id = JSON.parse(readFileSync(cfgPath, "utf8")).kernel_id;
  const run = (...a) => { try { execFileSync("node", [join(tmp, "scaffolder/new-kernel.mjs"), cfgPath, ...a], { cwd: tmp, stdio: "pipe" }); return 0; } catch (e) { return e.status || 1; } };
  ok(run("--kernel-import", "../vendor/kernel", "--corpus-import", "../communities/x/corpus") === 0, "a vendored layout generates and passes its own check");
  const gen = readFileSync(join(tmp, `build/${id}-build.mjs`), "utf8");
  ok(gen.includes('from "../vendor/kernel/schema/records.mjs"') && gen.includes('"../communities/x/corpus/tables.js"'), "the generated files import from the layout named");
  writeFileSync(join(tmp, `communities/x/corpus/${id}-data.js`), `"use strict";\nexports.STORE = { store_id: "invented", claims: [{ ref: "c1", kind: "claim", statement: "an invented claim with an extension", source_id: "S", contributor_id: "P", declared_grade: "asserted", artifact_hash: "abc" }], links: [] };\n`);
  const mod = await import(pathToFileURL(join(tmp, `build/${id}-build.mjs`)).href);
  let ext = null; try { ext = mod.buildKernel().claims[0].rec.canonical.extensions; } catch (e) { console.log("      " + e.message); }
  ok(!!ext && ext.artifact_hash === "abc" && ext.ref === undefined, "an extension key reaches the record; the local ref does not");
  ok(run("--kernel-import", "../nowhere") === 2, "an import path that does not resolve in the tree is refused before anything is written");
} finally { rmSync(tmp, { recursive: true, force: true }); }

console.log("\n[7] this repository's corpora under the upstreamed readings");
const snap = JSON.parse(readFileSync(join(ROOT, "vendor/gate/snapshot.json"), "utf8"));
const lint = lintSourceTable(snap.sources);
ok(lint.length === 0, `the source table passes the lineage lint (${lint.map((v) => v.rule + " " + v.source_id).join("; ") || "clean"})`);
ok(computeCurrency(snap.state).length === 0, "no in-force claim depends on an input no longer standing");
ok(computeDecay(snap.state, { sourceTable: makeSourceTable(snap.sources), kindTable: makeKindTable(snap.kinds) }).length === 0, "no claim is declared above its re-derived grade");

console.log("\n[8] from EpiTrellis: readers tolerate what they do not know; bundles name their instrument");
const tc = claimRecord({ kind: "claim", statement: "an invented claim from a newer writer", source_id: "s", contributor_id: "p", declared_grade: "asserted", future_field: "v" });
const bundle = JSON.parse(JSON.stringify(exportContribution({ entries: [tc], links: [] }, null, { kernel_id: "k", instrument: "sha256:" + "e".repeat(64) })));
ok(bundle.origin.instrument === "sha256:" + "e".repeat(64), "an exported bundle names the instrument that decided it");
ok(bundle.contribution_id === exportContribution({ entries: [tc], links: [] }).contribution_id, "the instrument stays outside the contribution id");
const newer = { ...bundle, future_top_level: { anything: "x" }, proposal: { ...bundle.proposal, entries: [{ ...bundle.proposal.entries[0], future_record_field: "z" }] } };
let read = null; try { read = importContribution(newer); } catch (e) { console.log("      " + e.message); }
ok(!!read && read.entries[0].canonical.extensions.future_field === "v", "a bundle with fields this reader does not know imports, its unknown extension kept and hashed");
const tampered = JSON.parse(JSON.stringify(bundle)); tampered.proposal.entries[0].canonical.extensions.future_field = "changed";
ok(throws(() => importContribution(tampered)), "while a change inside the hashed form is still refused: tolerant on read, strict on content");

console.log("\n" + H + "\n" + (fails ? `check-upstreamed: ${fails} FAILURE(S)` : "check-upstreamed: OK") + "\n" + H);
process.exit(fails ? 1 : 0);
