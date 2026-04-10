/**
 * Entry point – pure CJS so polyfills execute before ANY module loads.
 * (ESM `import` statements are hoisted above inline code by Metro/Babel,
 *  so we must use require() to guarantee execution order.)
 */

// ---- Node.js global polyfills for web ----
if (typeof globalThis.process === "undefined" || globalThis.process === null) {
    globalThis.process = {};
}
if (typeof globalThis.process.nextTick !== "function") {
    globalThis.process.nextTick = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        Promise.resolve().then(function () {
            fn.apply(null, args);
        });
    };
}
if (typeof globalThis.process.env === "undefined") globalThis.process.env = {};
if (typeof globalThis.process.browser === "undefined") globalThis.process.browser = true;
if (typeof globalThis.process.version === "undefined") globalThis.process.version = "";
if (typeof globalThis.process.versions === "undefined") globalThis.process.versions = {};

if (typeof globalThis.Buffer === "undefined") {
    globalThis.Buffer = require("buffer").Buffer;
}
// ---- end polyfills ----

var { registerRootComponent } = require("expo");
var App = require("./App").default;
registerRootComponent(App);
