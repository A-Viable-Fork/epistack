#!/usr/bin/env python3
"""compose_gate.py - the membrane: mechanical compose-and-gate over independent typed
contributions. No model runs here. Judgment lives in the registries and the RULES below;
everything else is deterministic over the typed fields the emitters wrote. Hardened to
tolerate malformed / partial contributions (e.g. pasted LLM output): bad nodes are
reported as violations, never crash the run.

The gate logic exists in exactly one place: compose_and_gate(contributions, incumbent,
registries). It reads no files and prints nothing. Two callers drive it:
  - main(): the browser/CWD convention. Loads incumbent.json + every contribution_*.json
    from the working directory (the in-browser Pyodide harness writes these, then calls
    main()), composes, and prints the report. Behavior-preserving; the judge's demo run
    is unchanged.
  - __main__: the command-line demo. Loads the fixtures beside this module
    (fixtures/incumbent.json + fixtures/<id>.json) and prints the same report, so
    `python compose_gate.py` composes the demo (incumbent + A + B + C) directly.
"""
import json, glob, os
from collections import defaultdict

# ---- the registries: the trusted judgment the gate reads, passed to compose_and_gate ----
SOURCE_REGISTRY = {
    "DS-EARLYCASE-DEC2019": {"withheld": True},  "DS-ENVSAMPLES-HSM": {"withheld": False},
    "DS-PHYLO-EARLY":       {"withheld": False}, "DS-BASERATE-HIST":  {"withheld": False},
    "DS-FCS-MOLEC":         {"withheld": False}, "DS-DEFUSE-2018":    {"withheld": False},
    "DS-SARBECO-SURVEY":    {"withheld": False}, "DS-LABRECORDS-WIV": {"withheld": True},
}
ONTOLOGY   = {"measurement", "irreducible-prior", "withheld-record", "question-set", "pending"}
NODE_SPACE = {"Q-PIVOT-MARKET","Q-GEO-WHYWUHAN","Q-FCS-DEFUSE","Q-BASERATE","Q-METHOD","Q-LAYER0"}
REGISTRIES = {"sources": SOURCE_REGISTRY, "ontology": ONTOLOGY, "node_space": NODE_SPACE}

def names_withheld_resolver(n, source_registry=SOURCE_REGISTRY):
    r = n.get("namesWithheldResolver")
    return bool(r) and source_registry.get(r, {}).get("withheld", False)
def idents(n):
    return {s["ident"] for s in (n.get("sources") or []) if isinstance(s, dict) and "ident" in s}
def load(p):
    with open(p) as f: return json.load(f)

def validate(n, registries=REGISTRIES):
    ontology, node_space, source_registry = registries["ontology"], registries["node_space"], registries["sources"]
    e = []
    if n.get("terminal") not in ontology:
        e.append(f"{n['_src']}:{n['addr']}: bad/missing terminal {n.get('terminal')!r}")
    if n["addr"] not in node_space and not str(n["addr"]).startswith("Q-NEW-"):
        e.append(f"{n['_src']}:{n['addr']}: addr off-space (not a registered question)")
    for s in (n.get("sources") or []):
        if not isinstance(s, dict) or s.get("ident") not in source_registry:
            bad = s.get("ident") if isinstance(s, dict) else s
            e.append(f"{n['_src']}:{n['addr']}: unregistered/malformed source {bad!r}")
    return e

def ingest(arr, src, violations, nodes, registries=REGISTRIES):
    if not isinstance(arr, list):
        violations.append(f"{src}: top-level JSON must be an array of nodes"); return
    for n in arr:
        if not isinstance(n, dict):
            violations.append(f"{src}: a node is not a JSON object -> skipped"); continue
        n["_src"] = src
        if "addr" not in n:
            violations.append(f"{src}: a node is missing 'addr' -> skipped"); continue
        violations += validate(n, registries); nodes.append(n)

def compose_and_gate(contributions, incumbent, registries=REGISTRIES):
    """The gate, pure. contributions: {src -> [node, ...]}; incumbent: [node, ...]; registries:
    the source registry, ontology, and node space. Returns the gate result (violations, the
    composed graph, the independence pass, the typing/imputed/ontology linters, the cruxes).
    Reads no files and prints nothing; ingestion order is incumbent then sorted contributor src."""
    nodes, violations = [], []
    ingest(incumbent, "incumbent", violations, nodes, registries)
    for src in sorted(contributions):
        ingest(contributions[src], src, violations, nodes, registries)
    emitters = sorted({n["_src"] for n in nodes if n["_src"] != "incumbent"})

    by_addr = defaultdict(list)
    for n in nodes: by_addr[n["addr"]].append(n)

    composed = {}
    for addr, grp in sorted(by_addr.items()):
        srcs = sorted({n["_src"] for n in grp})
        terms = defaultdict(set)
        for n in grp: terms[n["_src"]].add(n.get("terminal", "(none)"))
        terms = {k: sorted(v) for k, v in terms.items()}
        distinct = {n.get("terminal") for n in grp}
        inc = next((n for n in grp if n["_src"] == "incumbent"), None)
        wr  = [n for n in grp if names_withheld_resolver(n, registries["sources"])]
        rec = {"contributors": srcs, "relation": None, "resolution": None, "notes": []}
        if len(distinct) > 1:
            if inc and inc.get("terminal") == "irreducible-prior" and wr:
                named = sorted({n["namesWithheldResolver"] for n in wr}); who = sorted({n["_src"] for n in wr})
                rec["relation"] = "typing-disagreement -> WITHHELD-RECORD REFINE"
                rec["resolution"] = "adopt withheld-record typing; incumbent's irreducible-prior elides a registered sealed resolver"
                rec["notes"] += [f"incumbent: irreducible-prior, no resolver named",
                                 f"{who}: withheld-record-gated, resolver={named}",
                                 "sealed-but-existing resolver is not irreducible-in-principle (correction)"]
            else:
                rec["relation"] = "typing-disagreement"; rec["resolution"] = "surface competing typings with provenance; do not silently overwrite"
                rec["notes"].append(f"terminals by contributor: {terms}")
            if len(distinct) > 2: rec["notes"].append("3+ terminals at one address -> candidate for decomposition")
        leans = {n["_src"]: n.get("assertedLean") for n in grp if n.get("assertedLean")}
        if len(set(leans.values())) > 1:
            rec["relation"] = (rec["relation"]+" ; reading-fork") if rec["relation"] else "reading-fork"
            rec["resolution"] = (rec["resolution"] or "") + " | fork: expose both leans, price asymmetry, do NOT average"
            rec["notes"].append(f"incompatible leans: {leans}")
        if rec["relation"] is None:
            rec["relation"] = "merge / accumulate" if len(grp) > 1 else "single-contributor"
            rec["resolution"] = "union of complementary claims" if len(grp) > 1 else f"sole contribution: {srcs[0]}"
        composed[addr] = rec

    emit = {e: set() for e in emitters}
    for n in nodes:
        if n["_src"] in emit: emit[n["_src"]] |= idents(n)
    ds_emitters = defaultdict(set)
    for e in emitters:
        for d in emit[e]: ds_emitters[d].add(e)
    # sorted by dataset id so the report line is deterministic (set iteration order otherwise
    # varies with the hash seed; the composition is deterministic, and so now is its rendering).
    shared_cross = {d: sorted(ds_emitters[d]) for d in sorted(ds_emitters) if len(ds_emitters[d]) > 1}
    indep = {}
    for addr, grp in by_addr.items():
        per = defaultdict(set)
        for n in grp:
            if n["_src"] in emit: per[n["_src"]] |= idents(n)
        if len(per) < 2: continue
        common = set.intersection(*per.values()) if per else set()
        indep[addr] = ({"verdict": "SHARED-INPUT agreement (count once)", "shared": sorted(common)} if common
                       else {"verdict": "INDEPENDENT corroboration (weight up)", "by_emitter": {k: sorted(v) for k, v in per.items()}})

    tstats = defaultdict(lambda: defaultdict(int)); verified = []
    for n in nodes:
        if n["_src"] == "incumbent": continue
        for s in (n.get("sources") or []):
            if not isinstance(s, dict): continue
            tstats[n["_src"]][s.get("typing")] += 1
            if s.get("typing") == "author-verified": verified.append((n["_src"], n["addr"], s.get("ident")))
    wterms = defaultdict(set)
    for n in nodes:
        if names_withheld_resolver(n, registries["sources"]): wterms[n.get("terminal")].add(f"{n['_src']}:{n['addr']}")
    imputed = [(n["_src"], n["addr"], n.get("status")) for n in nodes if n.get("conjecture") and n["_src"] != "incumbent"]
    crux = [(n["_src"], n["addr"], n.get("namesWithheldResolver")) for n in nodes if n.get("loadBearing") and n["_src"] in emit]
    sealed = sorted({d for _, _, d in crux if d})

    return {"emitters": emitters, "violations": violations, "composed": composed,
            "shared_cross": shared_cross, "indep": indep, "tstats": tstats,
            "verified": verified, "imputed": imputed, "wterms": wterms, "crux": crux, "sealed": sealed}

def format_report(result):
    """Render the gate result as the report text, byte-for-byte as the script has always printed."""
    emitters, violations, composed = result["emitters"], result["violations"], result["composed"]
    shared_cross, indep, tstats = result["shared_cross"], result["indep"], result["tstats"]
    verified, imputed, wterms, crux, sealed = result["verified"], result["imputed"], result["wterms"], result["crux"], result["sealed"]
    lines = []
    P = lines.append
    P("="*74); P(f"COMPOSE-GATE REPORT  (incumbent + {' + '.join(emitters) if emitters else 'no contributions'})"); P("="*74)
    P("\n[VALIDATION] " + ("OK - all nodes schema- and registry-valid" if not violations else f"{len(violations)} issue(s):"))
    for v in violations: P("   - " + v)
    P("\n[COMPOSED MAP]")
    for addr, r in composed.items():
        P(f"\n  {addr}   contributors={r['contributors']}")
        P(f"     relation : {r['relation']}")
        P(f"     resolve  : {r['resolution']}")
        for nt in r["notes"]: P(f"        - {nt}")
    P("\n[INDEPENDENCE PASS]")
    P(f"  datasets used by >1 emitter (cross-run dependency): {shared_cross or 'none'}")
    for addr, v in indep.items():
        P(f"  {addr}: {v['verdict']}  {v.get('shared') or v.get('by_emitter')}")
    P("\n[LINTER: typing honesty]")
    for e, st in tstats.items(): P(f"  emitter {e}: {dict(st)}")
    if verified:
        P("  author-verified claims requiring substantiation:")
        for v in verified: P(f"     {v[0]}  {v[1]}  {v[2]}")
    P("\n[LINTER: imported imputed/conjecture claims -> pending substantiation]")
    if imputed:
        for s, a, st in imputed: P(f"     {s}  {a}  status={st}  -> enters as conjecture, NOT promoted")
    else: P("  none")
    P("\n[LINTER: ontology consistency on withheld-record-gated nodes]")
    if len(wterms) > 1:
        P("  GAP: withheld-gated nodes carry >1 distinct terminal ->")
        for t, who in wterms.items(): P(f"     {t!r}: {sorted(who)}")
        P("  -> ontology has no canonical 'withheld-record' terminal; emitters improvised")
    else: P("  consistent")
    P("\n[STRUCTURAL SUMMARY: load-bearing cruxes]")
    for s, a, d in crux: P(f"  {s}: {a}   withheld-resolver={d}")
    P(f"  -> {len(crux)} load-bearing crux assertion(s) across {len(sealed)} distinct sealed datasets: {sealed}")
    if len(sealed) > 1: P("  -> map shape: SEALED DOORS (one per vantage), not one irreducible fog")
    return "\n".join(lines) + "\n"

def main():
    """Browser/CWD convention: load incumbent.json + every contribution_*.json from the working
    directory (the in-browser harness writes these), compose, and print. Byte-identical to the
    script's long-standing behavior when driven by the Pyodide runner."""
    incumbent, violations = [], []
    try: incumbent = load("incumbent.json")
    except Exception as ex: violations.append(f"incumbent.json: cannot read ({ex})")
    contributions = {}
    for path in sorted(glob.glob("contribution_*.json")):
        src = os.path.basename(path).replace("contribution_", "").replace(".json", "")
        try: contributions[src] = load(path)
        except Exception as ex: violations.append(f"contribution_{src}.json: invalid JSON ({ex})")
    result = compose_and_gate(contributions, incumbent)
    # preserve the incumbent/contribution read-failure messages ahead of the schema violations
    result["violations"] = violations + result["violations"]
    print(format_report(result), end="")

def _run_fixtures(fixtures_dir):
    """CLI demo: incumbent.json + every other <id>.json in fixtures_dir as contribution <id>."""
    incumbent = load(os.path.join(fixtures_dir, "incumbent.json"))
    contributions = {}
    for path in sorted(glob.glob(os.path.join(fixtures_dir, "*.json"))):
        stem = os.path.splitext(os.path.basename(path))[0]
        if stem == "incumbent": continue
        contributions[stem] = load(path)
    print(format_report(compose_and_gate(contributions, incumbent)), end="")

# The command-line demo. Guarded on __file__ so it is inert under the in-browser Pyodide
# harness, which execs this source (also as __main__) and then calls main() itself; there
# __file__ is undefined, so this block is skipped and the browser run is unchanged.
if __name__ == "__main__" and "__file__" in globals():
    _run_fixtures(os.path.join(os.path.dirname(os.path.abspath(__file__)), "fixtures"))
