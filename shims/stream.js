// Stream shim for web: ensures process.nextTick and Buffer are available
// before readable-stream is loaded, since readable-stream v3
// uses bare `process.nextTick` global references, and the Aurora SDK
// uses `Buffer` as a global throughout.

// --- process polyfill ---
if (typeof globalThis.process === "undefined" || globalThis.process === null) {
    globalThis.process = {};
}
if (typeof globalThis.process.nextTick !== "function") {
    globalThis.process.nextTick = function (fn) {
        var args = [];
        for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
        Promise.resolve().then(function () {
            fn.apply(null, args);
        });
    };
}
if (typeof globalThis.process.env === "undefined") {
    globalThis.process.env = {};
}
if (typeof globalThis.process.browser === "undefined") {
    globalThis.process.browser = true;
}
if (typeof globalThis.process.version === "undefined") {
    globalThis.process.version = "";
}
if (typeof globalThis.process.versions === "undefined") {
    globalThis.process.versions = {};
}

// --- Buffer polyfill ---
if (typeof globalThis.Buffer === "undefined") {
    globalThis.Buffer = require("buffer").Buffer;
}

module.exports = require("readable-stream");
