import EventEmitter from "events";

export class AuroraUsb extends EventEmitter {
    private static NOT_SUPPORTED_ERROR =
        "USB connections are not supported on this platform.";
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

    public async writeCmd(_cmd: string): Promise<void | never> {
        throw Error(AuroraUsb.NOT_SUPPORTED_ERROR);
    }

    public async writeCmdInput(_data: string): Promise<string | never> {
        throw Error(AuroraUsb.NOT_SUPPORTED_ERROR);
    }
}
