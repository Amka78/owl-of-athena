// Process polyfill — loaded before ALL other modules by Metro serializer.
// readable-stream uses bare `process.nextTick` global, so it must exist
// before any module evaluation begins.

if (typeof globalThis.process === "undefined" || globalThis.process === null) {
    globalThis.process = {};
}

if (typeof globalThis.process.nextTick !== "function") {
    globalThis.process.nextTick = function nextTick(fn) {
        var args = new Array(arguments.length - 1);
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
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

if (typeof globalThis.process.on !== "function") {
    var noop = function () {};
    globalThis.process.on = noop;
    globalThis.process.addListener = noop;
    globalThis.process.once = noop;
    globalThis.process.off = noop;
    globalThis.process.removeListener = noop;
    globalThis.process.removeAllListeners = noop;
    globalThis.process.emit = noop;
    globalThis.process.prependListener = noop;
    globalThis.process.prependOnceListener = noop;
    globalThis.process.listeners = function () { return []; };
}
