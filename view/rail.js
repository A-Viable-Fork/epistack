// Role: the spine rail. The decomposition path from the root claim to the focused node,
//   horizontal and clickable to jump back up. "Where am I and how do I get back", always
//   visible. See docs/architecture-spec.md section 6.
// Contract: renderRail(pathNodes, onJump, caseLabel)->Element. pathNodes is the ordered
//   list of nodes from root to focused; onJump(index) truncates the path to that node.
// Invariant: view depends on engine depends on data, never the reverse (T0-2). The rail
//   is the navigation trail the app maintains, not a graph computed from parents (the DAG
//   has many parents; the path is the clicks the user took).
"use strict";

function renderRail(pathNodes, onJump, caseLabel) {
  const rail = document.createElement("nav");
  rail.className = "rail";

  if (caseLabel) {
    const tag = document.createElement("span");
    tag.className = "rail-case";
    tag.textContent = caseLabel;
    rail.appendChild(tag);
    const sep = document.createElement("span");
    sep.className = "rail-sep";
    sep.textContent = "/";
    rail.appendChild(sep);
  }

  pathNodes.forEach((node, i) => {
    const last = i === pathNodes.length - 1;
    const seg = document.createElement(last ? "span" : "button");
    seg.className = "rail-seg" + (last ? " rail-current" : "");
    seg.textContent = node.label || node.id;
    if (!last) seg.addEventListener("click", () => onJump(i));
    rail.appendChild(seg);
    if (!last) {
      const sep = document.createElement("span");
      sep.className = "rail-sep";
      sep.textContent = "›";
      rail.appendChild(sep);
    }
  });

  return rail;
}

if (typeof module !== "undefined" && module.exports) module.exports = { renderRail };
// Role: (v1) the spine rail. The decomposition path from the root claim to the focused
//   node, horizontal and clickable, marking which case and claim the node sits under.
//   "Where am I and how do I get back", always visible. architecture-spec.md section 6.
// Contract: (planned) renderRail(path, onJump) -> DOM element. Reads engine state.
// Invariant: view depends on engine depends on data, never the reverse (T0-2).
//
// SORRY: seam only at this checkpoint. Built in v1 alongside view/card.js, on the
//   population pipeline. Not built here yet (task non-goal).
"use strict";
