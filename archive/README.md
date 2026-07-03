# archive/

Kept for reference, not built by default, and outside the trust-boundary layers so the linter and
`check-map` do not track it.

## `submission-classic.html`

A frozen, self-contained snapshot of the pre-shell submission: the bespoke "What Closes, and What
Does Not" narrative, the full "A Typed Substrate" specification, and the interactive demonstrations,
all hand-authored as one long document. It opens standalone from `file://`. It was the deliverable
through Prompt 16.

## `classic-submission-template.html`

The build template that produced `submission-classic.html`. Its `@@INCLUDE` paths are resolved from
the repo root, so it remains buildable if re-added to `build/bundle.js`'s `TARGETS`.

## Why it is here

Prompt 17 replaced the single hand-authored document with a modular **presentation shell**
(`periphery/navigate/shell/`) that composes registered modules (prose, case, demonstration) into one
navigable surface, `submission.html`. The shell is content-agnostic and takes new content as modules,
so the eggs and farming expansion plugs in without a rewrite. The classic document is preserved here
so its prose can be referenced or lifted into prose modules later, but it is no longer the live
deliverable.
