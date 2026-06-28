// Role: the view-side renderers for registered visual components. A node references a visual
//   by id (data/components/visuals.js); the card resolves the descriptor and calls the
//   renderer here with the node's params. Ported from card-prototype.html (the searchlight).
// Contract: VISUAL_RENDERERS[id](params)->Element. renderVisual(component, params)->Element
//   dispatches by id. Owns DOM/SVG; reads no data of its own.
// Invariant: view depends on engine depends on data (T0-2). Each render is self-contained:
//   it scopes its own state to the element it returns, no globals, no shared mutable state.
"use strict";

// The searchlight. Truth is uniform; the searchlight is a detection bump you sweep,
// detect(x). What you SEE is observed(x) = true(x) * detect(x), normalized to the truth's
// area, so it rises where the light points and sinks where it does not. "Look everywhere
// equally" flattens detect and the observed becomes the truth. The dot field is fixed.
function renderSearchlight(params) {
  const P = Object.assign({ sigma: 0.085, marker: 0.68, markerLabel: "the market" }, params || {});
  const X0 = 40, X1 = 560, FYc = 108, FY0 = 40, FY1 = 176;
  const BASE = 312, OBSTOP = 224;
  const SIGMA = P.sigma, MARKET = P.marker, NPTS = 120, NDOTS = 150;

  const root = document.createElement("div");
  root.className = "scope";
  root.innerHTML =
    '<div class="scope-head">Cases are spread <b>evenly</b> across the area. Sweep your searchlight and watch what you <b>see</b>.</div>' +
    '<svg viewBox="0 0 600 340" role="img" aria-label="A field of evenly spread cases at night. A searchlight you can move brightens part of the field, and the cases you see pile up wherever the light points, even though the field is even.">' +
    '<defs><filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>' +
    '<linearGradient id="obsfill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#E8A33D" stop-opacity=".55"/><stop offset="1" stop-color="#E8A33D" stop-opacity=".05"/></linearGradient></defs>' +
    '<text x="40" y="26" fill="#7E8A94" font-family="sans-serif" font-size="12">the field: where cases actually are</text>' +
    '<g class="beam"></g><g class="dots"></g>' +
    '<line x1="40" y1="186" x2="560" y2="186" stroke="#2C353D" stroke-width="1"/>' +
    '<text x="40" y="208" fill="#7E8A94" font-family="sans-serif" font-size="12">what you see: where the counted cases pile up</text>' +
    '<line x1="40" y1="312" x2="560" y2="312" stroke="#3A444D" stroke-width="1"/>' +
    '<path class="truthline" fill="none" stroke="#7E8A94" stroke-width="1.5" stroke-dasharray="5 5"/>' +
    '<path class="obs" fill="url(#obsfill)" stroke="#E8A33D" stroke-width="2"/>' +
    '<text class="truthlabel" x="46" fill="#8A96A0" font-family="sans-serif" font-size="11">the even truth</text>' +
    '<g class="market"><line y1="30" y2="312" stroke="#5A6670" stroke-width="1" stroke-dasharray="2 4"/>' +
    '<text y="332" fill="#9AA6B0" font-family="sans-serif" font-size="11" text-anchor="middle">' + esc(P.markerLabel) + "</text></g>" +
    "</svg>" +
    '<div class="scope-controls"><div class="slider-row"><label>where you looked</label>' +
    '<input class="sweep" type="range" min="0" max="1000" value="680" aria-label="move the searchlight across the area"/></div>' +
    '<button class="btn flat" aria-pressed="false">Look everywhere equally</button></div>' +
    '<p class="scope-caption" aria-live="polite"></p>';

  const q = (s) => root.querySelector(s);
  const gDots = q(".dots"), gBeam = q(".beam"), obsPath = q(".obs"), truthPath = q(".truthline");
  const truthLabel = q(".truthlabel"), market = q(".market"), sweep = q(".sweep"), flatBtn = q(".flat"), cap = q(".scope-caption");

  let flat = false, c = MARKET;
  const mapX = (u) => X0 + u * (X1 - X0);
  const detect = (u) => (flat ? 1 : Math.exp(-((u - c) * (u - c)) / (2 * SIGMA * SIGMA)));

  let seed = 20260628;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff), seed / 0x7fffffff);
  const DOTS = [];
  for (let i = 0; i < NDOTS; i++) DOTS.push({ u: rnd(), y: FY0 + 8 + rnd() * (FY1 - FY0 - 16) });

  market.querySelector("line").setAttribute("x1", mapX(MARKET));
  market.querySelector("line").setAttribute("x2", mapX(MARKET));
  market.querySelector("text").setAttribute("x", mapX(MARKET));

  const lerp = (a, b, t) => a + (b - a) * t;
  const SLATE = [100, 118, 130], LAMP = [232, 163, 61];
  const mix = (c1, c2, t) => "rgb(" + Math.round(lerp(c1[0], c2[0], t)) + "," + Math.round(lerp(c1[1], c2[1], t)) + "," + Math.round(lerp(c1[2], c2[2], t)) + ")";

  function renderDots() {
    let s = "";
    for (const d of DOTS) {
      const b = detect(d.u), x = mapX(d.u), r = (1.5 + 2.4 * b).toFixed(2), op = (0.16 + 0.84 * b).toFixed(2);
      s += '<circle cx="' + x.toFixed(1) + '" cy="' + d.y.toFixed(1) + '" r="' + r + '" fill="' + mix(SLATE, LAMP, b) + '" opacity="' + op + '"/>';
    }
    gDots.innerHTML = s;
  }
  function renderBeam() {
    if (flat) { gBeam.innerHTML = '<rect x="' + X0 + '" y="' + FY0 + '" width="' + (X1 - X0) + '" height="' + (FY1 - FY0) + '" fill="#E8A33D" opacity="0.07"/>'; return; }
    const cx = mapX(c).toFixed(1);
    gBeam.innerHTML =
      '<ellipse cx="' + cx + '" cy="' + FYc + '" rx="78" ry="74" fill="#E8A33D" opacity="0.16" filter="url(#soft)"/>' +
      '<ellipse cx="' + cx + '" cy="' + FYc + '" rx="30" ry="62" fill="#F2C078" opacity="0.18" filter="url(#soft)"/>';
  }
  function renderCurves() {
    const ds = []; let sum = 0;
    for (let i = 0; i <= NPTS; i++) { const dv = detect(i / NPTS); ds.push(dv); sum += dv; }
    const mean = sum / (NPTS + 1), H = BASE - OBSTOP, scale = H * 0.42;
    const yOf = (val) => BASE - val * scale;
    const truthY = yOf(1);
    truthPath.setAttribute("d", "M " + X0 + " " + truthY.toFixed(1) + " L " + X1 + " " + truthY.toFixed(1));
    truthLabel.setAttribute("y", (truthY - 6).toFixed(1));
    let p = "M " + X0 + " " + BASE;
    for (let j = 0; j <= NPTS; j++) p += " L " + mapX(j / NPTS).toFixed(1) + " " + yOf(ds[j] / mean).toFixed(1);
    p += " L " + X1 + " " + BASE + " Z";
    obsPath.setAttribute("d", p);
  }
  function renderCaption() {
    if (flat) { cap.innerHTML = 'Look everywhere the same, and what you see <span class="key">is</span> the truth: cases are spread evenly, with no special place. This is the assumption holding.'; return; }
    if (Math.abs(c - MARKET) < 0.07) cap.innerHTML = 'You looked hardest at <span class="key">' + esc(P.markerLabel) + '</span>, so that is where the cases pile up. But the field is even. The cluster is your searchlight, not the source.';
    else if (c < 0.18) cap.innerHTML = 'Your searchlight is off to one edge, and the cases appear to gather there. Move it and the cluster follows, because the field underneath is even.';
    else cap.innerHTML = 'The cases appear to cluster <span class="key">wherever your searchlight points</span>, not where they actually are. Slide it to the marker and the cluster jumps there.';
  }
  const render = () => { renderBeam(); renderDots(); renderCurves(); renderCaption(); };

  sweep.addEventListener("input", () => {
    if (flat) { flat = false; flatBtn.setAttribute("aria-pressed", "false"); flatBtn.textContent = "Look everywhere equally"; }
    c = +sweep.value / 1000;
    render();
  });
  flatBtn.addEventListener("click", () => {
    flat = !flat;
    flatBtn.setAttribute("aria-pressed", flat ? "true" : "false");
    flatBtn.textContent = flat ? "Use a searchlight" : "Look everywhere equally";
    render();
  });
  render();
  return root;
}

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const VISUAL_RENDERERS = { "viz.searchlight": renderSearchlight };

function renderVisual(component, params) {
  const fn = VISUAL_RENDERERS[component];
  if (!fn) {
    const warn = document.createElement("div");
    warn.className = "visual-missing";
    warn.textContent = "[visual " + component + " not registered]";
    return warn;
  }
  return fn(params);
}
