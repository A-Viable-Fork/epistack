# Architecture: Storage, a Typed API, and Many Clients (superseded)

**This doc is retired. It is folded into the full current architecture,
`docs/architecture-the-unownable-graph.md`, which supersedes it.**

The storage-API-clients framing this file carried is now Sections 1 through 5 and 10 of the
unownable-graph doc: storage as the canonical typed graph (held as a tamper-evident patch
history), the engine as a typed API with open reads and a gated write, and clients as the open,
forkable, read-only layer in two tiers (thin and fat). The "objective structure, subjective
assessment" split this file introduced is carried forward there and realized in the gap detector
(`engine/gaps.js`): the substrate detects gaps objectively and never ranks them.

The filename is kept so existing in-code references (`docs/architecture-storage-api-clients.md`)
still resolve. New text should cite `docs/architecture-the-unownable-graph.md`. Build status for
every component is graded in `docs/status-ledger.md`, not here.
