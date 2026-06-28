// Role: the atlas. Abstract transformation patterns (the index) that case nodes point into
//   via atlas_ref. Each entry lists its clones with the departure that diverges them.
// Contract: exports { id -> AtlasEntry }. An AtlasEntry has { id, role, signature, clones }.
//   A clone is { case, node_id, departure }; departure is the coordinate of the diverging
//   node in the shared decomposition, not a description of resemblance.
// Invariant: pure data. The pattern is the index; the departures are the content
//   (docs/family-discrimination.md, schema-revisions.md S4).
"use strict";

const ATLAS = {
  // The earned shared object from docs/family-discrimination.md: not a transformation with
  // variants, but a two-stage pipeline whose two cases fail at different stages.
  "atlas.statistic-supports-conclusion": {
    id: "atlas.statistic-supports-conclusion",
    role: "a statistic computed from a sample supports a conclusion about a target",
    signature: "sample -> statistic -> conclusion",
    parent_of: null,
    clones: [
      {
        case: "COVID origin",
        node_id: "covid.instance",
        departure:
          "stage-1 (representativeness) failure: surveillance is spatially concentrated, so sample inclusion correlates with the location being estimated; the draw is non-exchangeable",
      },
      {
        case: "eggs, individual dietary response",
        node_id: "eggs.instance",
        departure:
          "stage-2 (sufficiency) failure: responders are heterogeneous and the mean discards the within-population variance the individual conclusion needs",
      },
    ],
  },

  // LHC Branch 2, N2.3: the reusable "does the projectile stop in the target" pattern.
  // Within-case for now (one clone); the nature-vs-LHC scenario departure on the frame
  // boost (N2.1) is the S4 within-case instantiation, recorded on the case node.
  "atlas.projectile-stops-in-target": {
    id: "atlas.projectile-stops-in-target",
    role: "decide whether a projectile halts inside a given target before it can act",
    signature: "(stopping_length, target_radius, target_density) -> stops?",
    parent_of: null,
    clones: [
      {
        case: "LHC safety",
        node_id: "lhc.N2.3",
        departure:
          "dense-object selection: Earth is too sparse to stop a fast neutral object, so its survival is uninformative; white-dwarf and neutron-star densities are required",
      },
    ],
  },
};

if (typeof module !== "undefined" && module.exports) module.exports = { ATLAS };
