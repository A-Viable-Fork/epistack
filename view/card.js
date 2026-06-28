// Role: the node card. Renders one schema node from all three structures: the break block
//   featured, takes->produces as context, the math line (or a primitive's citation as a
//   walled basis), and the motion affordances. See docs/architecture-spec.md section 3.
// Contract: renderCard(node, ctx)->Element and renderChildCard(entry, onClick)->Element.
//   ctx = { motions, atlas }. Reads the engine (classify/motions); owns no data.
// Invariant: view depends on engine depends on data, never the reverse (T0-2). Per-kind
//   variation lives in the math/footer slots; everything else is shared.
"use strict";

// -- small DOM helpers, shared across the v1 view modules (function decls hoist) --
function vEl(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}
function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const KIND_BADGE = {
  claim: "claim",
  transformation: "transformation",
  primitive: "primitive",
  assumption: "assumption",
  observation: "observation",
  prediction: "prediction",
  comparison: "comparison",
};

// display state for the dot (v1 is as-argued; perturbation is v3)
function displayState(node) {
  if (node.kind === "comparison") return node.state || "consistent";
  if (node.kind === "observation") return "given";
  if (node.kind === "primitive") return "basis";
  return "sound";
}

function formalBadge(node) {
  const f = node.formal_status;
  if (!f) return "";
  const label = f === "lean_verified" ? "lean ✓" : f;
  return `<span class="fbadge fbadge-${f}">${esc(label)}</span>`;
}

function renderCard(node, ctx) {
  ctx = ctx || {};
  const m = ctx.motions || {};
  const kind = node.kind;
  const card = vEl("article", "card kind-" + kind);

  // 1. header: label, kind badge, state dot, motion affordances
  const head = vEl("header", "card-head");
  head.innerHTML =
    `<span class="state-dot state-${displayState(node)}" title="${esc(displayState(node))}"></span>` +
    `<h2 class="card-label">${esc(node.label || node.id)}</h2>` +
    `<span class="kind-badge kb-${kind}">${esc(KIND_BADGE[kind] || kind)}</span>`;
  const aff = vEl("span", "affordances");
  if (m.decompose) aff.innerHTML += `<span class="aff aff-down" title="decomposes">↓</span>`;
  if (m.compare && m.compare.available)
    aff.innerHTML += `<span class="aff aff-side" title="compare (v2)">↔</span>`;
  if (m.perturb) aff.innerHTML += `<span class="aff aff-flip" title="perturb (v3)">↻</span>`;
  head.appendChild(aff);
  card.appendChild(head);

  // 2. what it is: role
  if (node.role) card.appendChild(vEl("p", "card-role", esc(node.role)));

  // 3. what it does: takes -> produces (context, not the headline)
  if (node.takes || node.produces) {
    const t = (node.takes || []).map(esc).join(", ");
    const p = (node.produces || []).map(esc).join(", ");
    card.appendChild(vEl("p", "card-io", `<span class="io-takes">${t}</span><span class="io-arrow">→</span><span class="io-produces">${p}</span>`));
  }

  // 4. the break (the card's center of gravity). cancel nodes show what they remove instead.
  if (kind === "transformation" || kind === "assumption") {
    if (node.function === "cancel" && node.load_bearing) {
      const b = vEl("div", "break-block cancel-block");
      b.innerHTML = `<span class="bb-lab">removes a dependency</span><p class="bb-why">${esc(node.load_bearing)}</p>`;
      card.appendChild(b);
    } else if (node.breaks || node.why_breaks) {
      const b = vEl("div", "break-block");
      b.innerHTML =
        `<span class="bb-lab">the break</span>` +
        (node.breaks ? `<p class="bb-when">${esc(node.breaks)}</p>` : "") +
        (node.why_breaks ? `<p class="bb-why">${esc(node.why_breaks)}</p>` : "");
      card.appendChild(b);
    }
  }

  // 5. math, or for a primitive the citation as a deliberate wall
  if (kind === "primitive" && node.citation) {
    const c = vEl("div", "basis-block");
    const src = esc(node.citation.source || "");
    const tgt = node.citation.target ? ` <span class="basis-target">(${esc(node.citation.target)})</span>` : "";
    c.innerHTML = `<span class="basis-tag">coordinate basis</span><p>Proof: ${src}${tgt}. Not built here.</p>`;
    card.appendChild(c);
  } else if (node.math) {
    const mm = vEl("div", "math-block");
    mm.innerHTML = `<code class="math">${esc(node.math)}</code>${formalBadge(node)}`;
    card.appendChild(mm);
  } else if (kind === "observation" && node.world_value) {
    const w = vEl("div", "world-block");
    w.innerHTML = `<span class="basis-tag">world-fact</span><p>${esc(node.world_value)}</p>`;
    card.appendChild(w);
  } else if (kind === "prediction" && node.value) {
    card.appendChild(vEl("div", "world-block", `<span class="basis-tag">prediction</span><p>${esc(node.value)}</p>`));
  } else if (kind === "comparison" && node.test) {
    card.appendChild(vEl("div", "math-block", `<code class="math">${esc(node.test)}</code>`));
  }

  // 6. footer: the three motions (only decompose is wired in v1)
  const foot = vEl("footer", "card-foot");
  if (m.decompose) {
    const n = (node.children || []).length;
    foot.innerHTML += `<span class="motion motion-on">made of ${n} step${n === 1 ? "" : "s"}, below</span>`;
  } else if (kind === "primitive") {
    foot.innerHTML += `<span class="motion motion-wall">basis reached</span>`;
  } else {
    foot.innerHTML += `<span class="motion motion-wall">given</span>`;
  }
  if (m.compare && m.compare.available)
    foot.innerHTML += `<span class="motion motion-later">also in ${m.compare.count} cases (compare: v2)</span>`;
  if (m.perturb) foot.innerHTML += `<span class="motion motion-later">flip this (perturb: v3)</span>`;
  card.appendChild(foot);

  return card;
}

// the collapsed one-line child card; clicking promotes it to focused
function renderChildCard(entry, onClick) {
  const node = entry.node;
  const row = vEl("button", "child-card child-" + entry.kind);
  const meta =
    entry.kind === "primitive" ? "basis" : entry.expandable ? "decomposes" : "given";
  row.innerHTML =
    `<span class="child-dot dot-${entry.kind}"></span>` +
    `<span class="child-label">${esc(node.label || node.id)}</span>` +
    `<span class="child-meta">${meta}</span>`;
  row.addEventListener("click", () => onClick(node.id));
  return row;
}

if (typeof module !== "undefined" && module.exports) module.exports = { renderCard, renderChildCard };
