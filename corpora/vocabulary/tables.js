// Role: the vocabulary kernel's reference tables (the fifth exhibit). The kind table gives
//   the one kind this kernel uses, declaration, whose ceiling is the constitutive floor: a definition
//   grounds by a public act of adoption, exactly the eggs case's constitutive floor. The source table
//   carries the external citations that reference terms ground in, the honest floor for a term the
//   submission does not own (a physics reference for cross-section, a logic reference for modus tollens).
// Contract: exports KINDS and SOURCES. Pure data; corpora imports nothing.
// Invariant: core terms ground in a submission document (their home region), verified by the oracle to
//   contain the term; reference terms ground in a source row here. A reference term with no honest
//   external source is marked ungrounded, never given an invented citation.
"use strict";

const KINDS = [
  { kind: "declaration", ceiling: "constitutive" },
];

// external citations for the reference tier: domain vocabulary the cases cite, and infrastructure terms.
const SOURCES = [
  { source_id: "src:pdg", source_class: "institutional-report", description: "Particle Data Group, Review of Particle Physics (pdg.lbl.gov): cross-section as the effective interaction area setting a reaction's probability" },
  { source_id: "src:copi-logic", source_class: "institutional-report", description: "Copi, Cohen, McMahon, Introduction to Logic: modus tollens, if P then Q and not Q therefore not P" },
  { source_id: "src:dunning-natexp", source_class: "peer-reviewed", description: "Dunning, Natural Experiments in the Social Sciences (2012): an observational setting where nature, not the experimenter, assigns the treatment" },
  { source_id: "src:sampling-theory", source_class: "institutional-report", description: "standard survey-sampling theory (Lohr, Sampling: Design and Analysis): representative draw and exchangeability" },
  { source_id: "src:whatwg-web", source_class: "institutional-report", description: "WHATWG and W3C web-platform specifications: API, DOM, HTML, CSS as the interface, document object model, and styling standards" },
  { source_id: "src:ecma-262", source_class: "institutional-report", description: "ECMA-262, the ECMAScript Language Specification: JavaScript and its module system (ESM, the .mjs/.js file forms)" },
  { source_id: "src:json-spec", source_class: "institutional-report", description: "ECMA-404 / RFC 8259, the JSON data-interchange format" },
  { source_id: "src:nodejs", source_class: "institutional-report", description: "Node.js and npm documentation (nodejs.org, docs.npmjs.com): the server-side JavaScript runtime and its package manager" },
  { source_id: "src:mcp", source_class: "institutional-report", description: "Model Context Protocol specification (modelcontextprotocol.io): a tool interface between a model and external capabilities" },
  { source_id: "src:pyodide", source_class: "institutional-report", description: "Pyodide documentation (pyodide.org): CPython compiled to WebAssembly for in-browser execution" },
  { source_id: "src:fowler-ci", source_class: "institutional-report", description: "Fowler, Continuous Integration (martinfowler.com): the practice of validating each change against an automated check suite" },
];

module.exports = { KINDS, SOURCES };
