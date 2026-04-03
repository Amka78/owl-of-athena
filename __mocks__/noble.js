// Mock for noble (Bluetooth LE library) which requires native bindings not
// available in the Jest/jsdom environment.
const EventEmitter = require("events");

class Noble extends EventEmitter {
    startScanning() {}
    stopScanning() {}
    on() { return this; }
}

const noble = new Noble();
module.exports = noble;
module.exports.default = noble;
