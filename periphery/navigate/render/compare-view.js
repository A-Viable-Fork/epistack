// Role: the cross-case compare view (the SIDEWAYS reveal). Renders the shared pipeline ONCE
//   with both instances overlaid and the break marked on different children: COVID lit at
//   stage 1, eggs at stage 2. The distance between the cases is the distance between the two
//   lit stages, shown rather than asserted. Learning-first, then the precise version on demand.
// Contract: renderCompareView(model, ctx)->Element. model is engine/compare.js's output;
//   ctx = { onStage(id), resolve }. Reads the engine output; owns no data.
// Invariant: view depends on engine depends on data (T0-2). Plain copy that frames the reveal
//   is one-off and stays inline (the floor principle); the case-specific lines come from data
//   (instance.plain), referenced not duplicated.
"use strict";

function cvEl(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}
function cvEsc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderCompareView(model, ctx) {
  ctx = ctx || {};
  const root = cvEl("section", "compare");

  root.appendChild(cvEl("div", "kindline", '<span class="dot"></span> the surprising part'));
  root.appendChild(cvEl("h1", "hook", "The same machine, twice"));
  root.appendChild(
    cvEl(
      "p",
      "intuition",
      "Two arguments that look unrelated turn out to run the same little pipeline: take a sample, boil it to a number, draw a conclusion. They do not fail the same way. They break at <em>different steps</em>, and that is exactly what the disagreement is about.",
    ),
  );

  // the shared pipeline, once: a row of stage boxes with the breaks lit on different stages
  const row = cvEl("div", "pipeline-row");
  model.stages.forEach((stage, i) => {
    const box = cvEl("button", "pstage");
    const breaksHere = model.instances.filter((inst) => inst.brokenNode === stage.id);
    if (breaksHere.length) box.classList.add("lit");
    const hook = (stage.explain && stage.explain.hook) || stage.label || stage.id;
    let inner =
      `<span class="pstage-step">step ${i + 1}${stage.tag ? " &middot; " + cvEsc(stage.tag) : ""}</span>` +
      `<span class="pstage-name">${cvEsc(hook)}</span>`;
    breaksHere.forEach((inst) => {
      inner +=
        `<span class="break-mark"><span class="bm-dot"></span>` +
        `<b>${cvEsc(inst.caseLabel)}</b> breaks here</span>` +
        `<span class="break-plain">${cvEsc(inst.plain || inst.departure || "")}</span>`;
    });
    box.innerHTML = inner;
    if (ctx.onStage) box.addEventListener("click", () => ctx.onStage(stage.id));
    row.appendChild(box);
    if (i < model.stages.length - 1) row.appendChild(cvEl("span", "pipe-arrow", "&rarr;"));
  });
  root.appendChild(row);

  // the one-line takeaway, the distance made explicit
  const cov = model.instances.find((x) => x.coordinate === 0);
  const egg = model.instances.find((x) => x.coordinate === 1);
  if (cov && egg) {
    root.appendChild(
      cvEl(
        "p",
        "stakes compare-takeaway",
        `One pipeline, two break points: <b>${cvEsc(cov.caseLabel)}</b> at step ${cov.coordinate + 1}, ` +
          `<b>${cvEsc(egg.caseLabel)}</b> at step ${egg.coordinate + 1}. The gap between the two cases is the gap between those two steps.`,
      ),
    );
  }

  // the precise version: the departure coordinates, the stage preconditions, the closures
  const d = cvEl("details", "precise");
  d.appendChild(cvEl("summary", null, '<span class="chev">&#9656;</span> See the precise version'));
  const box = cvEl("div", "inspect");
  let rows = "";
  const row2 = (k, v) => `<div class="row"><span class="k">${cvEsc(k)}</span><span class="v">${v}</span></div>`;
  rows += row2("atlas", cvEsc(model.atlas.id));
  rows += row2("pipeline", cvEsc(model.pipeline ? model.pipeline.id : "") + " &nbsp; [" + model.stages.map((s) => cvEsc(s.id)).join(", ") + "]");
  model.instances.forEach((inst) => {
    rows += row2(
      cvEsc(inst.caseLabel),
      "broken node <b>" + cvEsc(inst.brokenNode) + "</b> (coordinate " + inst.coordinate + ")" +
        (inst.departure ? "<br>departure: " + cvEsc(inst.departure) : "") +
        (inst.closure ? "<br>closure: " + cvEsc(inst.closure) : ""),
    );
  });
  box.innerHTML = rows;
  d.appendChild(box);
  root.appendChild(d);

  // a hint that the stages are clickable, back into the decomposition
  root.appendChild(cvEl("p", "viz-aside", "Tap a step to take it apart."));
  return root;
}

const VIEW_RENDERERS = { "view.compare": renderCompareView };

function renderView(component, model, ctx) {
  const fn = VIEW_RENDERERS[component];
  if (!fn) {
    const w = document.createElement("div");
    w.textContent = "[view " + component + " not registered]";
    return w;
  }
  return fn(model, ctx);
}

if (typeof module !== "undefined" && module.exports) module.exports = { renderCompareView, renderView };
