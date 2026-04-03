// Mock for serialport which requires native bindings not available in Jest/jsdom.
const EventEmitter = require("events");

class SerialPort extends EventEmitter {
    constructor() { super(); }
    open(cb) { if (cb) cb(null); }
    close(cb) { if (cb) cb(null); }
    write(data, cb) { if (cb) cb(null); }
    read() { return null; }
    pipe() { return this; }
    list() { return Promise.resolve([]); }
}

SerialPort.list = () => Promise.resolve([]);
module.exports = SerialPort;
module.exports.SerialPort = SerialPort;
module.exports.default = SerialPort;
