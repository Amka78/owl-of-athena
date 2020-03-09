import EventEmitter from "events";
import SerialPort from "serialport";
import AuroraSerialParser from "./AuroraSerialParser";
import * as AuroraConstants from "./AuroraConstants";
import { sleep, promisify } from "./util";
import { AuroraEvent } from "./AuroraTypes";

const CONNECT_RETRY_DELAY_MS = 1500;
const DISCONNECT_RETRY_DELAY_MS = 3000;
export class AuroraUsb extends EventEmitter {
    // @ts-ignore
    static discoverAuroraPorts(): Promise<any[]> {
        return promisify(SerialPort.list, SerialPort)().then(ports => {
            const auroraPorts = [];

            // @ts-ignore
            for (const port of ports) {
                //simplify these conditions when old
                //units are no longer in circulation
                if (
                    (port.pnpId && port.pnpId.indexOf("5740") !== -1) ||
                    (port.pnpId && port.pnpId.indexOf("0483") !== -1) ||
                    (port.productId && port.productId.indexOf("5740") !== -1) ||
                    (port.vendorId &&
                        port.vendorId.indexOf(
                            AuroraConstants.AURORA_USB_VID
                        ) !== -1) ||
                    port.manufacturer == "iWinks"
                ) {
                    auroraPorts.push(port.comName.replace("cu.", "tty."));
                }
            }

            return auroraPorts;
        });
    }

    private serialParser: AuroraSerialParser;
    private connectionState: AuroraConstants.ConnectionStates;
    private disconnectPending: boolean;
    private serialPort?: SerialPort;
    constructor() {
        super();

        this.serialParser = new AuroraSerialParser();

        this.connectionState = AuroraConstants.ConnectionStates.DISCONNECTED;
        this.disconnectPending = false;

        this.serialParser.on("auroraEvent", this.onParseAuroraEvent);
        this.serialParser.on("log", this.onParseLog);
        this.serialParser.on("streamData", this.onParseStreamData);
        this.serialParser.on("streamTimestamp", this.onParseStreamTimestamp);
        this.serialParser.on(
            "cmdInputRequested",
            this.onParseCmdInputRequested
        );
        this.serialParser.on("cmdOutputReady", this.onParseCmdOutputReady);
        this.serialParser.on("parseError", this.onParseError);
    }

    public isConnected(): boolean {
        return (
            this.connectionState == AuroraConstants.ConnectionStates.IDLE ||
            this.connectionState == AuroraConstants.ConnectionStates.BUSY
        );
    }

    public isConnecting(): boolean {
        return (
            this.connectionState == AuroraConstants.ConnectionStates.CONNECTING
        );
    }

    public async connect(port = "detect", retryCount = 3): Promise<unknown> {
        //at this point state should be disconnected
        //otherwise, this is an error case.
        if (
            this.connectionState !=
            AuroraConstants.ConnectionStates.DISCONNECTED
        ) {
            switch (this.connectionState) {
                case AuroraConstants.ConnectionStates.CONNECTING:
                    return Promise.reject("Already connecting...");

                case AuroraConstants.ConnectionStates.BUSY:
                case AuroraConstants.ConnectionStates.IDLE:
                    return Promise.reject("Already connected.");

                default:
                    return Promise.reject("Unknown USB connection state.");
            }
        }

        this.setConnectionState(AuroraConstants.ConnectionStates.CONNECTING);

        let connectionAttempts = 0;

        do {
            if (connectionAttempts) {
                await sleep(CONNECT_RETRY_DELAY_MS);
            }

            connectionAttempts++;

            try {
                if (port == "detect") {
                    const auroraPorts = await AuroraUsb.discoverAuroraPorts();

                    if (!auroraPorts.length) {
                        throw new Error("No Aurora devices found.");
                    }

                    for (const auroraPort of auroraPorts) {
                        if (this.disconnectPending) break;

                        try {
                            this.serialPort = (await this.connectSerialPort(
                                auroraPort
                            )) as SerialPort;

                            this.setConnectionState(
                                AuroraConstants.ConnectionStates.IDLE
                            );

                            return auroraPort;
                        } catch (error) {
                            //console.log('detect error', error);
                        } //swallow this error
                    }

                    throw new Error(
                        `Failed connecting to Aurora on port(s): ${auroraPorts.join(
                            ","
                        )}`
                    );
                } else {
                    this.serialPort = (await this.connectSerialPort(
                        port
                    )) as SerialPort;

                    this.setConnectionState(
                        AuroraConstants.ConnectionStates.IDLE
                    );

                    return port;
                }
            } catch (error) {
                //console.log('main error', error);

                continue;
            }
        } while (
            connectionAttempts <= retryCount &&
            // @ts-ignore
            this.connectionState ==
                AuroraConstants.ConnectionStates.CONNECTING &&
            !this.disconnectPending
        );

        //if we are here, all connection attempts failed
        this.setConnectionState(AuroraConstants.ConnectionStates.DISCONNECTED);

        return Promise.reject(`Failed connecting to Aurora on port "${port}".`);
    }

    public async disconnect(): Promise<void> {
        if (
            this.connectionState ==
                AuroraConstants.ConnectionStates.DISCONNECTED ||
            this.disconnectPending
        ) {
            return;
        }

        this.disconnectPending = true;

        //check if we are in the process of connecting, or are processing a command
        if (
            this.connectionState ==
                AuroraConstants.ConnectionStates.CONNECTING ||
            this.connectionState == AuroraConstants.ConnectionStates.BUSY
        ) {
            //let's give the system a little time before we pull the plug
            await sleep(DISCONNECT_RETRY_DELAY_MS);

            //did it work
            if (
                // @ts-ignore
                this.connectionState ==
                AuroraConstants.ConnectionStates.DISCONNECTED
            )
                return;

            //no but we can't wait any longer...
        }

        return promisify(this.serialPort!.close, this.serialPort)()
            .catch(console.log)
            .then(() => {
                //in case disconnected event hasn't fired yet, we fire it here
                this.setConnectionState(
                    AuroraConstants.ConnectionStates.DISCONNECTED
                );
            });
    }

    public async writeCmd(cmd: string): Promise<void> {
        //check for error condition
        if (this.connectionState != AuroraConstants.ConnectionStates.IDLE) {
            switch (this.connectionState) {
                case AuroraConstants.ConnectionStates.DISCONNECTED:
                case AuroraConstants.ConnectionStates.CONNECTING:
                    return Promise.reject("No idle serial connection.");

                case AuroraConstants.ConnectionStates.BUSY:
                    return Promise.reject(
                        "Another command is already in progress."
                    );

                default:
                    return Promise.reject("Unknown USB connection state.");
            }
        }

        if (this.disconnectPending) {
            return Promise.reject("Serial port currently disconnecting.");
        }

        this.setConnectionState(AuroraConstants.ConnectionStates.BUSY);

        return new Promise((resolve, reject) => {
            const onDisconnect = (
                connectionState: AuroraConstants.ConnectionStates
            ): void => {
                if (
                    connectionState ==
                    AuroraConstants.ConnectionStates.DISCONNECTED
                ) {
                    reject(
                        "Usb disconnected while processing command response."
                    );
                }
            };

            this.serialParser.once("cmdResponse", cmdResponse => {
                this.removeListener("connectionStateChange", onDisconnect);

                if (
                    this.connectionState ==
                    AuroraConstants.ConnectionStates.BUSY
                ) {
                    this.setConnectionState(
                        AuroraConstants.ConnectionStates.IDLE
                    );
                }

                cmdResponse.origin = "usb";

                resolve(cmdResponse);
            });

            this.once("connectionStateChange", onDisconnect);

            cmd = cmd.trim() + "\r";

            this.write(cmd).catch(error => {
                this.serialParser.removeAllListeners("cmdResponse");
                this.removeListener("connectionStateChange", onDisconnect);

                if (
                    this.connectionState ==
                    AuroraConstants.ConnectionStates.BUSY
                ) {
                    this.setConnectionState(
                        AuroraConstants.ConnectionStates.IDLE
                    );
                }

                reject(error);
            });
        });
    }

    public async writeCmdInput(data: string): Promise<string> {
        //check for error condition
        if (this.connectionState != AuroraConstants.ConnectionStates.BUSY) {
            switch (this.connectionState) {
                case AuroraConstants.ConnectionStates.DISCONNECTED:
                case AuroraConstants.ConnectionStates.CONNECTING:
                    return Promise.reject("No idle serial connection.");

                case AuroraConstants.ConnectionStates.IDLE:
                    return Promise.reject(
                        "Command input can only be written during a command."
                    );

                default:
                    return Promise.reject("Unknown USB connection state.");
            }
        }

        //process at most 128 bytes at a time
        for (let i = 0; i < data.length + 128; i += 128) {
            const packet = data.slice(i, i + 128);

            //if this slice is empty, nothing to do
            if (!packet.length) break;

            //remember, this happens synchronously
            await this.write(packet);
        }

        return data;
    }

    private setConnectionState(
        connectionState: AuroraConstants.ConnectionStates
    ): void {
        //don't fire or respond to events when the
        //state doesn't actually change
        if (this.connectionState == connectionState) {
            return;
        }

        const previousConnectionState = this.connectionState;

        this.connectionState = connectionState;

        if (connectionState == AuroraConstants.ConnectionStates.DISCONNECTED) {
            this.disconnectPending = false;

            if (this.serialPort) {
                this.serialPort.removeAllListeners();
            }
        } else if (
            connectionState == AuroraConstants.ConnectionStates.IDLE &&
            previousConnectionState ==
                AuroraConstants.ConnectionStates.CONNECTING
        ) {
            this.serialParser.reset();

            this.serialPort!.removeAllListeners();

            this.serialPort!.on("data", this.onSerialData);
            this.serialPort!.on("close", this.onSerialDisconnect);
            this.serialPort!.on("error", this.onSerialError);
        }

        this.emit(
            "connectionStateChange",
            connectionState,
            previousConnectionState
        );
    }

    private async connectSerialPort(
        port: string
    ): Promise<SerialPort | string> {
        return new Promise((resolve, reject) => {
            const serialPort = new SerialPort(port, error => {
                if (error) return reject(error);

                //flush any bytes in buffer that haven't been read
                serialPort.flush(error => {
                    if (error) return reject(error);

                    if (this.disconnectPending)
                        return reject(
                            "Serial disconnect pending, cancelling connection."
                        );

                    resolve(serialPort);
                });
            });
        });
    }

    private async write(data: string | number[]): Promise<string | number[]> {
        return new Promise((resolve, reject) => {
            this.serialPort!.write(data, writeError => {
                if (writeError) return reject(writeError);

                this.serialPort!.drain(drainError => {
                    if (drainError) return reject(drainError);

                    resolve(data);
                });
            });
        });
    }

    private onSerialDisconnect = (): void => {
        this.setConnectionState(AuroraConstants.ConnectionStates.DISCONNECTED);
    };

    private onSerialData = (chunk: Buffer): void => {
        this.serialParser.parseChunk(chunk);
    };

    private onParseLog = (log: { origin: string }): void => {
        log.origin = "usb";

        this.emit("log", log);
    };

    private onParseAuroraEvent = (auroraEvent: AuroraEvent): void => {
        auroraEvent.origin = "usb";

        this.emit("auroraEvent", auroraEvent);
    };

    private onParseStreamData = (streamData: { origin: string }): void => {
        streamData.origin = "usb";

        this.emit("streamData", streamData);
    };

    private onParseCmdInputRequested = (): void => {
        this.emit("cmdInputRequested");
    };

    private onParseCmdOutputReady = (output: unknown): void => {
        this.emit("cmdOutputReady", output);
    };

    private onParseStreamTimestamp = (streamTimestamp: {
        origin: string;
    }): void => {
        streamTimestamp.origin = "usb";

        this.emit("streamTimestamp", streamTimestamp);
    };

    private onParseError = (error: string): void => {
        this.emit("usbError", "Parse Error: " + error);
    };

    private onSerialError = (error: string): void => {
        this.emit("usbError", "Serial error: " + error);
    };
}
