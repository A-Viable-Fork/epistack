// Role: the prose modules (Prompt 17). A prose module is a section of the paper with claim-references
//   marked so a reference links into the live graph. Phase A registers one framing module; Phase B
//   weaves the judges document (docs/judges-document.md) as prose modules with cross-linking.
// Contract: registers on window.EpiShell. A prose module's render builds its paragraphs and uses
//   ctx.linkToNode(nodeKey, label) to mark a claim-reference, which resolves to the live node.
// Invariant: periphery; no grounding logic. A claim-reference's grade badge comes from an api read
//   the shell performs, never from text written here.
(function () {
  "use strict";
  if (typeof window === "undefined" || !window.EpiShell) return;

  window.EpiShell.register({
    id: "prose-frame", title: "What this surface is", kind: "prose", order: 0,
    render: function (ctx) {
      var p1 = document.createElement("p"); p1.className = "shell-lede";
      p1.textContent = "This is one navigable surface. The paper, the three cases, and the live demonstrations are composed from registered modules; the shell that frames them holds no case, no claim, and no paragraph of its own. Every grade and robustness reading you see is read live from the graph through the propose/read contract, so the surface reflects the real graph state rather than a description of it.";
      var p2 = document.createElement("p");
      p2.appendChild(document.createTextNode("Where the paper speaks about a case it links into the graph: for instance, "));
      p2.appendChild(ctx.linkToNode("lhc.antecedent", "the LHC survival argument", ctx.moduleId, ctx.moduleTitle));
      p2.appendChild(document.createTextNode(" carries its live grade and robustness beside the words, and the case it names links back to this paragraph."));
      ctx.mount.appendChild(p1); ctx.mount.appendChild(p2);
    },
  });
})();
