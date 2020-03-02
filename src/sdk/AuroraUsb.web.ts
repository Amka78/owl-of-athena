import EventEmitter from "events";
import SerialPort from "serialport";
import { AuroraEvent } from "./AuroraTypes";

export class AuroraUsb extends EventEmitter {
    private static NOT_SUPPORTED_ERROR =
        "AuroraWeb is not support usb connecting.";
    constructor() {
        super();
    }

    public isConnected(): boolean {
        return false;
    }

    public isConnecting(): boolean {
        return false;
    }

    public async connect(_port = "detect", _retryCount = 3): Promise<unknown> {
        throw Error(AuroraUsb.NOT_SUPPORTED_ERROR);
    }

    public async disconnect(): Promise<void | never> {
        throw Error(AuroraUsb.NOT_SUPPORTED_ERROR);
    }

    public async writeCmd(cmd: string): Promise<void | never> {
        throw Error(AuroraUsb.NOT_SUPPORTED_ERROR);
        Promise.reject(AuroraUsb.NOT_SUPPORTED_ERROR);
    }

    public async writeCmdInput(data: string): Promise<string | never> {
        throw Error(AuroraUsb.NOT_SUPPORTED_ERROR);
        return "mock";
    }
}
