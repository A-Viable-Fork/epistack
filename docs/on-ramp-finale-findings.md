---
Type: record
Purpose: "Records what building the on-ramp finale taught, the self-contained kernel file plus the detached repository, proven end to end on one generated kernel: the path that was built, what it reused, and the one snag the empty generated kernel surfaced, reported rather than forced."
Depends on: []
Depended on by: []
---

# The On-Ramp Finale: Findings

The on-ramp's last step is to hand a person a kernel they keep and take away. This built the two
halves of that step and proved them end to end on one generated kernel (eggs-regen): a self-contained
file that IS the kernel, and a button on it that downloads the same kernel as a detached repository.
What follows is written from what the build did, not from expectation.

## What was built

- `build/vendor-kernel.mjs`, the generic per-kernel analogue of `build/vendor-snapshot.mjs`: it runs
  one generated kernel's own builder and freezes the store the builder already grounded into
  `vendor/<id>/kernel-snapshot.json = { state, sources, kinds }`. It changes no data and no grade.
- `periphery/navigate/shell/kernel.template.html` and `build/build-kernel-file.mjs`: the template and
  its inliner, producing `<id>.kernel.html`. The file inlines the vendored snapshot, the real contract
  bundle (`vendor/gate/gate.bundle.js`, the same gate the oracles run), the reused propose widget, and
  a small surface (`periphery/navigate/render/kernel-file.js`). It opens from `file://` with no server.
- `build/build-detached-kernel.mjs`: assembles the kernel as a detached repository. It vendors the
  whole kernel under `substrate/kernel/` at a real sha256 content-hash pin, copies the kernel's corpora
  and build files, rewrites the build imports from `../kernel/` to `../substrate/kernel/`, and writes
  `substrate/PIN.txt` and a README that names the live git-submodule fetch as the production form the
  vendored pin stands in for.

The surface reuses, and reimplements nothing: the gate and the contract are the vendored bundle, the
authoring form and its receipt are the existing propose widget, the claims-and-grounding view reads
through `api.read`. The one piece of new machinery on the surface is a self-contained store-only zip
encoder, so the download runs offline with no library.

## What the end-to-end proof showed

Proven on eggs-regen, headless in jsdom and on disk:

1. The self-contained file opens with no console error, the contract bundle and the surface both load,
   the claims-and-grounding view renders, and a claim authored through the form returns a real gate
   receipt (graded `asserted` for an unsupported claim, the honest floor).
2. The download hands back a valid zip (PK signature, 45 files). Unzipped, the detached repo has
   **no `../kernel` reference remaining** and **no active fetch or install step**; the substrate pin is
   recorded in `substrate/PIN.txt`; and its check, `node build/check-eggs-regen.mjs`, passes against
   `../substrate/kernel` with no network. The kernel runs on unzip.

The pin is real (a content hash over the vendored substrate bytes), the substrate is real (the whole
kernel, which imports only itself, so it is complete with no extraction), and the gate is real. The
git-submodule fetch is the deferred production mechanism, named in the README, not faked here.

## The snag, reported rather than forced: the generated kernel is empty

The scaffolder generates an *empty* kernel: eggs-regen has 60 sources and 2 adopted kinds but zero
claims. So the self-contained file renders its claims view as honestly empty, and the first authored
claim has no support already in the store to point at, so it enters on its own basis (asserted). This
is not a defect of the path; it is the generator's honest starting state, and the finale surfaces it
rather than papering over it. The file says so in plain words ("This kernel carries no claims yet"),
and the authored receipt is graded correctly for an unsupported claim. The grounded-movement moment,
declared meeting earned as a support is added, is the authoring slice's finding and lives on a kernel
that already has claims to support against; on a freshly generated kernel it waits for the second
claim. The path generalizes; the empty first state is what a generated kernel actually is.

## The honest one-line summary

A generated kernel can be handed over twice: as one self-contained file that opens, renders, and
authors through the real gate, and as a detached repository that runs its check on unzip against a
substrate vendored at a real pin with no fetch. Both were built by reusing the gate, the contract, the
propose widget, and the receipt, and both were proven end to end on eggs-regen; the only snag, that a
freshly generated kernel is empty, is the generator's true starting state and is reported, not hidden.
