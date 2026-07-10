// Role: a minimum-interval rate limiter for the ingestion connectors, enforced by construction. arXiv's
//   terms require no more than one programmatic request every three seconds across all access; this
//   limiter guarantees that spacing rather than approximating it. OpenAlex is more permissive but is
//   given a smaller polite interval through the same limiter.
// Contract: createRateLimiter({ minIntervalMs, now?, sleep? }) -> { acquire() -> Promise<scheduledMs> }.
//   The clock (now) and the delay (sleep) are injectable so the spacing is testable against a virtual
//   clock, not by waiting. Periphery: imports nothing but has no kernel or DOM dependency.
// Invariant: consecutive acquire() calls resolve at monotonic times spaced at least minIntervalMs apart;
//   the first is immediate. The spacing holds regardless of how fast acquire is called.
"use strict";

// arXiv's published terms: at most one request every three seconds across all programmatic access.
export const ARXIV_MIN_INTERVAL_MS = 3000;
// OpenAlex has no hard cap; a one-second polite interval keeps the client well inside courtesy.
export const OPENALEX_MIN_INTERVAL_MS = 1000;

function defaultSleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createRateLimiter(opts) {
  const o = opts || {};
  const minIntervalMs = o.minIntervalMs != null ? o.minIntervalMs : ARXIV_MIN_INTERVAL_MS;
  const now = o.now || (() => Date.now());
  const sleep = o.sleep || defaultSleep;
  if (!(minIntervalMs >= 0)) throw new Error("rate-limit: minIntervalMs must be a non-negative number");

  // the earliest time the next request is allowed. Each acquire claims a slot and advances it, so the
  // spacing is a property of the schedule, not of how promptly the caller fires.
  let nextAllowed = -Infinity;

  async function acquire() {
    const t = now();
    const scheduled = Math.max(t, nextAllowed);
    nextAllowed = scheduled + minIntervalMs;
    const wait = scheduled - t;
    if (wait > 0) await sleep(wait);
    return scheduled;
  }

  return { acquire, minIntervalMs };
}
