// Vite alias target for the CJS package "invariant".
// The vitest browser pre-bundler (rolldown) breaks the default-export interop
// of invariant/browser.js (module.exports without __esModule), so serve a
// self-contained ESM implementation instead. Story tests never rely on the
// message/format variants beyond the throw-on-false behavior.
export default function invariant(
    condition: unknown,
    message?: string | (() => string),
): asserts condition {
    if (condition) return;
    throw new Error(typeof message === "function" ? message() : (message ?? "Invariant violation"));
}
