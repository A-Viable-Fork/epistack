// Role: the node card. v2 learning-first (docs/teaching-layer.md, matching card-prototype.html):
//   hook, intuition, the communicated math (typeset, glossed, read as a sentence, assumption
//   shown), the visual, the break as a scenario, the stakes, then "see the precise version"
//   which discloses the terse inspect layer, then the motions. A node with no explain block
//   falls back to a compact terse card (primitives, closure nodes).
// Contract: renderCard(node, ctx)->Element; renderChildCard(entry, onClick)->Element.
//   ctx = { motions, resolve, reveal }. Reads the engine and the visual renderer; owns no data.
// Invariant: view depends on engine depends on data (T0-2). Precision is not lost, it is
//   relocated one tap deeper into the inspect layer (generation on top, verification beneath).
"use strict";

function vEl(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}
function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
// typeset TeX into el via KaTeX if it is loaded; otherwise fall back to the plain string.
function typeset(el, tex, plain, display) {
  if (typeof katex !== "undefined" && katex.render) {
    try { katex.render(tex, el, { displayMode: !!display, throwOnError: false }); return; }
    catch (e) { /* fall through */ }
  }
  el.textContent = plain != null ? plain : tex;
}

const KINDLINE = {
  question: "a question to take apart",
  transformation: "a step in the reasoning",
  assumption: "an assumption you can flip",
  primitive: "a basis you already trust",
  observation: "a fact from the world",
  prediction: "what the reasoning predicts",
  comparison: "the test that closes it",
  claim: "a claim",
};

// the card is a registered component: pick its layout id (an explicit `card` ref, else a
// default by whether the node teaches), resolve the descriptor for existence, and dispatch
// to the matching renderer. Forkable like any component (a fork of card.teaching renders here).
const CARD_RENDERERS = { "card.teaching": renderTeachingCard, "card.terse": renderTerseCard };

function renderCard(node, ctx) {
  ctx = ctx || {};
  const layoutId = node.card || (node.explain ? "card.teaching" : "card.terse");
  if (ctx.resolve) ctx.resolve(layoutId); // route the layout lookup through the resolver too
  const render = CARD_RENDERERS[layoutId] || renderTerseCard;
  return render(node, ctx);
}

// ---- the learning-first card ----
function renderTeachingCard(node, ctx) {
  const e = node.explain;
  const card = vEl("article", "card teaching kind-" + node.kind);

  card.appendChild(vEl("div", "kindline", `<span class="dot"></span> ${esc(KINDLINE[node.kind] || "a step")}`));
  card.appendChild(vEl("h1", "hook", esc(e.hook)));
  if (e.intuition) card.appendChild(vEl("p", "intuition", esc(e.intuition)));

  // the math, communicated (only when the node carries an equation and reads as a sentence)
  if (node.math && typeof node.math === "object" && e.in_words) {
    const sec = vEl("section");
    sec.appendChild(vEl("p", "eyebrow", "The one line of math"));
    const wrap = vEl("div", "math-wrap");
    const disp = vEl("div", "math-display");
    typeset(disp, node.math.tex, node.math.plain, true);
    wrap.appendChild(disp);
    wrap.appendChild(vEl("p", "math-says", esc(e.in_words)));
    if (Array.isArray(e.symbols) && e.symbols.length) {
      const gl = vEl("div", "glosses");
      e.symbols.forEach((s) => {
        const g = vEl("div", "gloss");
        const sym = vEl("span", "sym");
        typeset(sym, s.sym, s.sym, false);
        g.appendChild(sym);
        g.appendChild(vEl("span", "def", esc(s.plain)));
        gl.appendChild(g);
      });
      wrap.appendChild(gl);
    }
    if (node.math.assumes) wrap.appendChild(vEl("p", "assumes", `<b>This only works if</b> ${esc(node.math.assumes)}.`));
    sec.appendChild(wrap);
    card.appendChild(sec);
  }

  // the visual, resolved by reference and handed its params
  if (node.visual && node.visual.component && typeof renderVisual === "function") {
    const sec = vEl("section");
    sec.appendChild(vEl("p", "eyebrow", "See it"));
    sec.appendChild(renderVisual(node.visual.component, node.visual.params));
    sec.appendChild(vEl("p", "viz-aside", "The field underneath never changes. Only your searchlight moves."));
    card.appendChild(sec);
  }

  // the break, as a concrete scenario
  if (e.scenario) {
    const br = vEl("section", "break");
    br.appendChild(vEl("p", "eyebrow", node.kind === "question" ? "The catch" : "Where it breaks"));
    br.appendChild(vEl("p", null, esc(e.scenario)));
    card.appendChild(br);
  }

  // the stakes
  if (e.stakes) {
    const sec = vEl("section");
    sec.appendChild(vEl("p", "eyebrow", "Why it matters"));
    sec.appendChild(vEl("p", "stakes", esc(e.stakes)));
    card.appendChild(sec);
  }

  // the precise version: the inspect layer behind a disclosure (the terse, audit-grade fields)
  if (hasInspect(node)) card.appendChild(renderInspect(node));

  card.appendChild(renderMotions(node, ctx));
  return card;
}

function hasInspect(node) {
  return node.role || node.breaks || node.why_breaks || (node.children && node.children.length) || node.math;
}

function renderInspect(node) {
  const d = vEl("details", "precise");
  d.appendChild(vEl("summary", null, '<span class="chev">▸</span> See the precise version'));
  const box = vEl("div", "inspect");
  const row = (k, v) => `<div class="row"><span class="k">${esc(k)}</span><span class="v">${v}</span></div>`;
  let rows = "";
  const kindMeta = [node.kind, node.composition, node.function].filter(Boolean).join(" · ");
  rows += row("kind", esc(kindMeta) + (node.formal_status ? ` <span class="fbadge">${esc(node.formal_status)}</span>` : ""));
  if (node.role) rows += row("role", esc(node.role));
  if (node.takes || node.produces) rows += row("takes", esc((node.takes || []).join(", ")) + " &rarr; " + esc((node.produces || []).join(", ")));
  if (node.breaks) rows += row("breaks", esc(node.breaks));
  if (node.why_breaks) rows += row("why", esc(node.why_breaks));
  if (node.math) rows += row("math", esc(typeof node.math === "object" ? node.math.plain : node.math));
  if (node.children && node.children.length) rows += row("floor", "decomposes to " + node.children.map(esc).join(", "));
  box.innerHTML = rows;
  d.appendChild(box);
  return d;
}

// ---- the terse fallback card (primitives, closure nodes; no teaching layer) ----
function renderTerseCard(node, ctx) {
  const card = vEl("article", "card terse kind-" + node.kind);
  card.appendChild(vEl("div", "kindline", `<span class="dot"></span> ${esc(KINDLINE[node.kind] || node.kind)}`));
  card.appendChild(vEl("h1", "hook small", esc(node.label || node.id)));
  if (node.role) card.appendChild(vEl("p", "intuition", esc(node.role)));
  if (node.kind === "primitive" && node.citation) {
    const c = vEl("div", "basis-block");
    const tgt = node.citation.target ? ` <span class="basis-target">(${esc(node.citation.target)})</span>` : "";
    c.innerHTML = `<span class="basis-tag">coordinate basis</span><p>Proof: ${esc(node.citation.source || "")}${tgt}. Not built here.</p>`;
    card.appendChild(c);
  } else if (node.world_value) {
    card.appendChild(vEl("div", "basis-block", `<span class="basis-tag">world-fact</span><p>${esc(node.world_value)}</p>`));
  } else if (node.value) {
    card.appendChild(vEl("div", "basis-block", `<span class="basis-tag">prediction</span><p>${esc(node.value)}</p>`));
  } else if (node.test) {
    card.appendChild(vEl("div", "basis-block", `<span class="basis-tag">the test</span><p>${esc(node.test)}</p>`));
  }
  card.appendChild(renderMotions(node, ctx));
  return card;
}

function renderMotions(node, ctx) {
  const m = ctx.motions || {};
  const foot = vEl("div", "motions");
  if (m.decompose) {
    const n = (node.children || []).length;
    foot.innerHTML += `<span class="motion on"><span class="g">↓</span> ${node.kind === "question" ? "take it apart" : "made of " + n + " step" + (n === 1 ? "" : "s")}</span>`;
  } else if (node.kind === "primitive") {
    foot.innerHTML += `<span class="motion wall"><span class="g">■</span> basis reached</span>`;
  } else {
    foot.innerHTML += `<span class="motion wall">given</span>`;
  }
  if (ctx.reveal) {
    const r = vEl("button", "motion reveal");
    r.innerHTML = `<span class="g">↗</span> ${esc(ctx.reveal.label)}`;
    r.addEventListener("click", ctx.reveal.onReveal);
    foot.appendChild(r);
  }
  if (m.compare && m.compare.available) foot.innerHTML += `<span class="motion later"><span class="g">↔</span> also in ${m.compare.count} cases <span class="tag">compare</span></span>`;
  if (m.perturb) foot.innerHTML += `<span class="motion later"><span class="g">↻</span> flip this <span class="tag">perturb</span></span>`;
  return foot;
}

// the collapsed one-line child card; clicking promotes it to focused
function renderChildCard(entry, onClick) {
  const node = entry.node;
  const row = vEl("button", "child-card child-" + entry.kind);
  const meta = entry.kind === "primitive" ? "basis" : entry.expandable ? "open" : "given";
  const label = (node.explain && node.explain.hook) || node.label || node.id;
  row.innerHTML =
    `<span class="child-dot dot-${entry.kind}"></span>` +
    `<span class="child-label">${esc(label)}</span>` +
    `<span class="child-meta">${meta}</span>`;
  row.addEventListener("click", () => onClick(node.id));
  return row;
}

if (typeof module !== "undefined" && module.exports) module.exports = { renderCard, renderChildCard };
// Role: (v1) the node card. Renders one schema node from all three structures: the break
//   block featured, takes->produces as context, the math line, and the three motion
//   affordances (decompose / compare / perturb). See docs/architecture-spec.md section 3.
// Contract: (planned) renderCard(node, handlers) -> DOM element. Reads the engine; owns
//   no data.
// Invariant: view depends on engine depends on data, never the reverse (T0-2).
//
// SORRY: seam only at this checkpoint. The migrated artifact's node rendering lives in
//   view/app.js (renderNode); the typed-schema card is the v1 build on the population
//   pipeline. Not built here yet (task non-goal).
"use strict";
