---
Type: reference
Purpose: "States which license covers which layer of the repository and why, the per-layer licensing the operator ruled in on 2026-10-12."
Depends on: [CLAUDE.md]
Depended on by: []
---

# Licensing

Licensing here is set per layer, by what each layer is for, rather than chosen once for the whole tree [ruling: operator, 2026-10-12]. The scheme is A-Viable-Fork/EpiTrellis's, adopted with its reasons: a format nobody can freely implement is not a waist, the kernel should be embeddable with a patent grant, data wants reuse with attribution, methodology should propagate and stay open, and network copyleft belongs on the layer where a provider could host a closed fork.

| Path | License | Why |
|---|---|---|
| `docs/` documents whose header says `Type: specification`, and `docs/schema-revisions.md` | CC0-1.0 | The protocol: anyone may implement it, with nothing to clear |
| `kernel/`, `api/`, `build/`, `scaffolder/`, `linter.js`, and anything not otherwise marked | Apache-2.0 | Embeddable in any client, with a patent grant |
| `corpora/` | CC-BY-4.0 | Case data, reused with attribution; quoted third-party text stays its authors' |
| `docs/` (the rest), `archive/` | CC-BY-SA-4.0 | Arguments, records and methodology, propagating open |
| `periphery/`, `submission.html`, `v1.html`, `card-prototype.html`, `manager-probe.html` | AGPL-3.0-or-later | The application layer, where a provider could host a closed fork |
| `vendor/katex/` | MIT, its own (`vendor/katex/LICENSE`) | Third-party, vendored |
| `vendor/` (the rest) | as its source | Generated from `kernel/`, `api/` and `corpora/`, carrying their licenses |

The texts: `LICENSE` (Apache-2.0), `LICENSE-AGPL.txt`, `LICENSE-CC0.txt`, `LICENSE-CC-BY.txt`, `LICENSE-CC-BY-SA.txt`. Each layer directory carries a `LICENSE` file naming its license and text. `build/check-licensing.mjs` holds the layout to this table.

Every commit up to the one that introduced this file, the competition submission among them (tag `competition-2026-07`, commit `b778f35`), was published under AGPL-3.0-or-later, and stays available under it. The relicensing applies from this commit on; the repository's authors are the operator and Claude sessions working for the operator.
