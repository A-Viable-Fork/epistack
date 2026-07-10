// Role: the on-ramp reach, the reading's terminal turn from operating the existing kernels to making and
//   taking your own. It presents, as built and reachable, the generator (a running empty kernel), the
//   self-contained kernel file and the detached-repo download, and the two connectors (ingestion brings
//   material, the producer connector lets an agent author through the gate). It names each artifact and
//   its check honestly; it does not inline a second running kernel, which would bloat this one file, and
//   says so plainly instead of mocking it.
// Contract: registers on window.EpiShell as a closing section (order 400). Renders static prose over the
//   built artifacts; reads no live data because the on-ramp's proof is its checks, named here.
// Invariant: periphery; it claims only what is built. Every artifact and check named here exists and
//   passes; the live agent session and a full second inlined kernel are named as the deferred forms.
(function () {
  "use strict";
  if (typeof window === "undefined" || !window.EpiShell) return;

  window.EpiShell.register({
    id: "on-ramp", title: "Make and take your own kernel", kind: "prose", order: 400,
    render: function (ctx) {
      var html = "";
      html += '<p class="shell-lede">You have read the argument, walked the cases and the lineage, and operated the four kernels in the manager. The last reach is to make your own kernel and take it with you. This is built and reachable; it is not inlined into this file, because a second running kernel would double the artifact, so the reading reaches it as produced files whose checks pass.</p>';

      html += "<h3>The generator produces a running kernel</h3>";
      html += "<p>The scaffolder (<code>scaffolder/new-kernel.mjs</code>) generates an empty but coherent kernel from a config: its own kind table, its sources, an empty claim store, its builder and its check. The generated kernel passes its own check on creation, so what you get is a running floor, not a template. It is empty on purpose: a generated kernel starts with grounded sources and a live gate, and the first claim is the author's.</p>";

      html += "<h3>The self-contained kernel file, and the detached repository</h3>";
      html += "<p>One build (<code>build/build-kernel-file.mjs</code>) folds a generated kernel into a single <code>&lt;id&gt;.kernel.html</code> that opens from <code>file://</code>, renders its own claims and grounding through the read contract, and authors a claim through the real gate with a graded receipt: the same gate you ran above, scoped to one kernel. A button on that file downloads the kernel as a detached repository (<code>build/build-detached-kernel.mjs</code>): the kernel's own files, the substrate vendored under <code>substrate/kernel/</code> at a real content-hash pin, the build imports rewritten to that path. It runs its check on unzip with no network. The live git-submodule fetch is the production form the vendored pin stands in for, named in the bundle, not faked.</p>";

      html += "<h3>The two connectors: the material half and the labor half</h3>";
      html += '<div class="eggs-recon">';
      html += "<div><b>Ingestion (the material)</b> &nbsp; <code>periphery/ingest/</code>, check <code>build/check-ingest.mjs</code>. It pulls scholarly metadata from arXiv and OpenAlex and maps each work into a kernel source row, honoring arXiv's one-request-per-three-seconds rate limit by construction and the metadata-only legal boundary: it stores metadata and a link back, never full text. An ingested source grounds a real claim through the gate in its check.</div>";
      html += '<div class="eggs-crux-line"><b>The producer connector (the labor)</b> &nbsp; <code>periphery/produce/</code>, check <code>build/check-produce.mjs</code>. It exposes the propose contract as a strict schema-gated MCP tool, so an agent authors a claim through the same gate a human does. The proof shows an agent&#39;s well-formed claim graded identically to a human&#39;s, an over-declared one demoted by the gate, and an invalid one rejected at the schema. The kernel checks the claim, not the claimant.</div>';
      html += "</div>";
      html += '<p class="eggs-frame-note">Both connectors are built at minimum scale and pass their checks. A live agent session over MCP transport, and autonomous multi-claim orchestration, are the named deferred depth: grounding, not volume, is the point, so a more capable producer makes more grounded claims, not more claims.</p>';

      ctx.mount.innerHTML = html;
    },
  });
})();
