# Compose-gate demo fixtures

The frozen demo inputs for `kernel/gate/compose_gate.py`, kept beside the module so the
module file is the logic alone. Nothing here is logic; these are data.

- `incumbent.json` - the incumbent map: the typed nodes already on the shared graph.
- `A.json`, `B.json`, `C.json` - three uncoordinated contributions, each a JSON array of
  typed nodes emitted independently against the contract in `prompt.txt`.
- `prompt.txt` - the emitter contract: the instructions a contributor (a person or a model)
  follows to produce a contribution. It is also displayed in the submission's compose-gate
  panel (the "Copy contract" control), so it is live UI content, not scratch.
- `captured.txt` - the frozen output of composing `incumbent + A + B + C`, shown in the
  browser as the offline fallback when the Python runtime cannot be fetched.

## Running the demo

    python compose_gate.py

loads `incumbent.json` plus every other `<id>.json` in this directory as contribution `<id>`,
calls `compose_and_gate`, and prints the report (identical to composing incumbent + A + B + C).

The in-browser runner (`periphery/navigate/render/compose-gate.js`) writes the ticked
contributions into the Pyodide filesystem as `contribution_<id>.json` and calls `main()`,
which reads that working-directory convention. Both paths call the one `compose_and_gate`.

## A note on `captured.txt`

One line of the report, the `[INDEPENDENCE PASS]` "datasets used by >1 emitter" dictionary,
is ordered by Python set iteration and so is not stable across interpreter runs (hash-seed
dependent). `captured.txt` froze one such ordering; a fresh run may reorder that single line
while the content is identical. The compose-and-gate logic is otherwise deterministic.
