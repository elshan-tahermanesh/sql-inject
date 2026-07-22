/**
 * Utility functions for terminal animation rendering and progressive progress phase mapping
 */

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const isErrorLine = (line) => {
  if (!line) return false;
  const lower = line.toLowerCase();
  return (
    lower.includes("[error]") ||
    lower.includes("error") ||
    lower.includes("exception") ||
    lower.includes("traceback") ||
    lower.includes("connection refused") ||
    lower.includes("timeout") ||
    lower.includes("failed to connect") ||
    lower.includes("internal server error")
  );
};

export const getLineDelay = (line) => {
  return 500;
};

export const getPhaseAfterLine = (line, currentPhase, context) => {
  if (!line) return currentPhase;
  const lower = line.toLowerCase();

  // Phase 1 after first separator following [TIME]
  if (context.sawTimeLine && line.includes("----") && currentPhase < 1) {
    return 1;
  }

  // Phase 2 after DNS resolved line
  if (lower.includes("[dns] resolved") && currentPhase < 2) {
    return 2;
  }

  // Phase 3 after TCP connection established
  if (
    (
      lower.includes("connection successfully established") ||
      lower.includes("ssl handshake complete")
    ) &&
    currentPhase < 3
  ) {
    return 3;
  }

  // Phase 4 after payload preparation/testing appears
  if (
    (
      lower.includes("[payload] preparing") ||
      lower.includes("[payload] testing") ||
      lower.includes("injecting payload")
    ) &&
    currentPhase < 4
  ) {
    return 4;
  }

  // Phase 5 when analysis/result/summary starts
  if (
    (
      lower.includes("[analysis]") ||
      lower.includes("[result]") ||
      lower.includes("summary")
    ) &&
    currentPhase < 5
  ) {
    return 5;
  }

  return currentPhase;
};
