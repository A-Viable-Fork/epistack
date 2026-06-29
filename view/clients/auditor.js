// Role: the auditor client (FAT). A genuinely different USE of the same store: it leads with
//   the inspect layer (the terse audit-grade fields), the dependents query (the blast radius),
//   and the gate's reasoning. Not a reskin of the teaching walk; a different composition over a
//   wider slice of the API (docs/clients.md).
// Contract: renderAuditor(api, mount, client, opts) -> void. Uses api.resolve / decompose /
//   dependents / classify / kinds / submit. Read-only against truth.
// Invariant: a client of the API; it touches no truth field and never imports the store. It
//   trades the render-everything guarantee for depth (it composes its own surface).
"use strict";

function renderAuditor(api, mount, client, opts) {
  opts = opts || {};
  const start = opts.node && api.has(opts.node) ? opts.node : api.entry();
  const state = { id: start };
  const aEl = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function go(id) { if (!api.has(id)) return; state.id = id; render(); }

  function row(k, v) { return `<div class="aud-row"><span class="aud-k">${esc(k)}</span><span class="aud-v">${v}</span></div>`; }

  function render() {
    mount.innerHTML = "";
    const id = state.id;
    const n = api.resolve(id);
    if (!n) { mount.appendChild(aEl("p", "aud-note", "no node at " + esc(id))); return; }

    mount.appendChild(aEl("div", "aud-bar", `<span class="aud-tag">auditor</span> <span class="aud-id">${esc(id)}</span> <span class="aud-kind">${esc((n.presentation && n.presentation.type) || n.kind)}</span>`));

    // the inspect layer, audit-grade, led with (the precise register is the auditor's default)
    const insp = aEl("section", "aud-block");
    insp.appendChild(aEl("h3", "aud-h", "inspect"));
    let rows = "";
    rows += row("label", esc(n.label || ""));
    if (n.role) rows += row("role", esc(n.role));
    if (n.terminal_type) rows += row("terminal", esc(n.terminal_type));
    if (n.function) rows += row("function", esc(n.function));
    if (n.breaks) rows += row("breaks", esc(n.breaks));
    if (n.why_breaks) rows += row("why_breaks", esc(n.why_breaks));
    if (n.math) rows += row("math", esc(typeof n.math === "object" ? n.math.plain : n.math));
    if (n.formal_status) rows += row("formal", esc(n.formal_status));
    if (n.citation) rows += row("citation", esc(n.citation.source || "") + (n.citation.target ? " (" + esc(n.citation.target) + ")" : ""));
    if (n.sorry) rows += row("sorry", esc(n.sorry));
    if (n.TODO_verify) rows += row("TODO_verify", esc(n.TODO_verify));
    insp.appendChild(aEl("div", "aud-rows", rows));
    mount.appendChild(insp);

    // the blast radius: what references this node (the dependents query, exposed)
    const deps = api.dependents(id);
    const dep = aEl("section", "aud-block");
    dep.appendChild(aEl("h3", "aud-h", "dependents (blast radius: " + deps.length + ")"));
    if (deps.length) {
      const ul = aEl("div", "aud-links");
      deps.forEach((d) => { const b = aEl("button", "aud-link", esc(d)); b.addEventListener("click", () => go(d)); ul.appendChild(b); });
      dep.appendChild(ul);
    } else dep.appendChild(aEl("p", "aud-note", "nothing references this node"));
    mount.appendChild(dep);

    // what this is made of (decompose), as flat links
    const fv = api.decompose(id);
    if (fv.children.length) {
      const ch = aEl("section", "aud-block");
      ch.appendChild(aEl("h3", "aud-h", "decomposes to"));
      const ul = aEl("div", "aud-links");
      fv.children.forEach((e) => { const b = aEl("button", "aud-link", esc(e.node.id) + "  [" + esc(e.kind) + "]"); b.addEventListener("click", () => go(e.node.id)); ul.appendChild(b); });
      ch.appendChild(ul);
      mount.appendChild(ch);
    }

    // the gate: the write path, stated, never exercised here (read-only client)
    const gate = aEl("section", "aud-block aud-gate");
    gate.appendChild(aEl("h3", "aud-h", "the write path"));
    const sub = api.submit({ statement: "(example) " + (n.label || id) + " holds" });
    gate.appendChild(aEl("p", "aud-note", "A write is a gated submission, not an insert. " + esc(sub.rule) + ". Gate: " + esc(sub.gate) + "."));
    mount.appendChild(gate);
  }
  render();
}
