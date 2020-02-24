import EventEmitter from "events";
import { Dictionary } from "lodash";
import keyBy from "lodash/keyBy";
import { sleep, promisify } from "./util";
import {
    AuroraBluetoothParser,
    AuroraCommand,
    AuroraEvent,
    BluetoothStream
} from "./AuroraBluetoothParser";
import {
    BleAuroraChars,
    BleAuroraService,
    BLE_CMD_MAX_PACKET_LENGTH,
    BleCmdStates
} from "./AuroraConstants";
import noble from "noble";

const INIT_DELAY_MS = 5000;
const DISCONNECT_RETRY_DELAY_MS = 3000;

const enum ConnectionStates {
    INIT = "init",
    DISCONNECTED = "disconnected",
    CONNECTING = "connecting",
    CONNECTED_IDLE = "idle",
    CONNECTED_BUSY = "busy"
}

const enum PoweredStates {
    ON = "poweredOn",
    OFF = "poweredOff"
}

export default class AuroraBluetooth extends EventEmitter {
    private initializing: boolean;
    private connectionState: ConnectionStates;
    private disconnectPending: boolean;
    private bluetoothParser: AuroraBluetoothParser;
    private peripheral?: noble.Peripheral;
    private characteristicsByUUID?: Dictionary<noble.Characteristic>;
    private cmdStatusChar?: noble.Characteristic;
    private cmdDataChar?: noble.Characteristic;
    private cmdOutputChar?: noble.Characteristic;
    private connectPromise?: any;
    private connectTimer?: NodeJS.Timeout;

    constructor() {
        super();

        this.initializing = false;
        this.connectionState = ConnectionStates.INIT;
        this.disconnectPending = false;
        this.bluetoothParser = new AuroraBluetoothParser();
        this.bluetoothParser.on("parseError", this.onParseError);
        this.bluetoothParser.on("cmdResponseRead", this.onParseCmdResponseRead);
        this.bluetoothParser.on(
            "cmdResponseWrite",
            this.onParseCmdResponseWrite
        );
        this.bluetoothParser.on(
            "cmdInputRequested",
            this.onParseCmdInputRequested
        );
        this.bluetoothParser.on("cmdOutputReady", this.onParseCmdOutputReady);
        this.bluetoothParser.on("auroraEvent", this.onParseAuroraEvent);
        this.bluetoothParser.on("streamData", this.onParseStreamData);

        this.watchBluetoothAdapter();
    }

    public isConnected(): boolean {
        return (
            this.connectionState == ConnectionStates.CONNECTED_IDLE ||
            this.connectionState == ConnectionStates.CONNECTED_BUSY
        );
    }

    public isConnecting(): boolean {
        return this.connectionState == ConnectionStates.CONNECTING;
    }

    public async connect(timeoutMs = 30000): Promise<noble.Peripheral | void> {
        //if we are waiting for initialization, we'll ignore
        //any further connection attempts silently
        if (this.initializing) return;

        //has the system booted up yet? If not, we'll
        //wait for a bit and try again
        if (this.connectionState == ConnectionStates.INIT) {
            this.initializing = true;

            //sleep for a little bit
            await sleep(INIT_DELAY_MS);

            this.initializing = false;

            //if the state hasn't changed since we waited for
            //initialization to complete, something is wrong
            if (this.connectionState == ConnectionStates.INIT) {
                return Promise.reject(
                    "No bluetooth adapter found. Is bluetooth disabled?"
                );
            }

            //try connecting now that the system is initialized
            return this.connect(timeoutMs);
        }

        if (this.connectionState != ConnectionStates.DISCONNECTED) {
            switch (this.connectionState) {
                case ConnectionStates.CONNECTING:
                    return Promise.reject("Already connecting...");

                case ConnectionStates.CONNECTED_BUSY:
                case ConnectionStates.CONNECTED_IDLE:
                    return Promise.reject("Already connected.");

                default:
                    return Promise.reject(
                        "Unknown Bluetooth connection state."
                    );
            }
        }

        this.setConnectionState(ConnectionStates.CONNECTING);

        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            const [peripheral, characteristics] = await this.connectDevice(
                timeoutMs
            );

            this.peripheral = peripheral;
            this.peripheral!.once("disconnect", this.onPeripheralDisconnect);

            this.characteristicsByUUID = keyBy(characteristics, "uuid");

            //these get used a lot, so let's store references
            this.cmdStatusChar = this.characteristicsByUUID[
                BleAuroraChars.CMD_STATUS
            ];
            this.cmdDataChar = this.characteristicsByUUID[
                BleAuroraChars.CMD_DATA
            ];
            this.cmdOutputChar = this.characteristicsByUUID[
                BleAuroraChars.CMD_OUTPUT_INDICATED
            ];

            await this.charSubscribe(
                this.characteristicsByUUID[BleAuroraChars.STREAM_DATA_NOTIFIED],
                this.onParseStreamData
            );

            await this.charSubscribe(
                this.characteristicsByUUID[
                    BleAuroraChars.AURORA_EVENT_NOTIFIED
                ],
                (event: Buffer): void => {
                    this.bluetoothParser.onAuroraEventCharNotification(event);
                }
            );

            await this.charSubscribe(
                this.cmdStatusChar,
                (status: Buffer): void => {
                    this.bluetoothParser.onCmdStatusCharNotification(status);
                }
            );
            await this.charSubscribe(
                this.cmdOutputChar,
                (output: unknown): void => {
                    this.bluetoothParser.onCmdOutputCharNotification(output);
                }
            );

            this.setConnectionState(ConnectionStates.CONNECTED_IDLE);

            return this.peripheral;
        } catch (error) {
            this.setConnectionState(ConnectionStates.DISCONNECTED);

            return Promise.reject(error);
        }
    }

    public async disconnect(): Promise<void> {
        if (
            this.connectionState == ConnectionStates.DISCONNECTED ||
            this.disconnectPending
        ) {
            return;
        }

        this.disconnectPending = true;

        //check if we are in the process of connecting, or are processing a command
        if (this.connectionState == ConnectionStates.CONNECTING) {
            noble.stopScanning();

            //give scanning a little time to stop
            await sleep(20);

            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            if (this.connectionState !== ConnectionStates.DISCONNECTED) {
                return Promise.reject(
                    "Failed to disconnect. Scanning not stopped."
                );
            }
        } else if (this.connectionState == ConnectionStates.CONNECTED_BUSY) {
            //let's give the system a little time before we pull the plug
            await sleep(DISCONNECT_RETRY_DELAY_MS);
        }

        //have we disconnected yet?
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        if (this.connectionState === ConnectionStates.DISCONNECTED) return;

        //nope but we can't wait any longer
        return promisify(this.peripheral!.disconnect, this.peripheral!)().then(
            () => {
                //in case disconnected event hasn't fired yet, we fire it here
                this.setConnectionState(ConnectionStates.DISCONNECTED);
            }
        );
    }

    public async writeCmd(cmd: unknown): Promise<AuroraCommand> {
        //check for error condition
        if (this.connectionState != ConnectionStates.CONNECTED_IDLE) {
            switch (this.connectionState) {
                case ConnectionStates.DISCONNECTED:
                    //case ConnectionStates.ADAPTER_FOUND:
                    //case ConnectionStates.DEVICE_FOUND:
                    return Promise.reject("No idle serial connection.");

                case ConnectionStates.CONNECTED_BUSY:
                    return Promise.reject(
                        "Another command is already in progress."
                    );

                default:
                    return Promise.reject(
                        "Unknown Bluetooth connection state."
                    );
            }
        }

        if (this.disconnectPending) {
            return Promise.reject("Bluetooth currently disconnecting.");
        }

        this.setConnectionState(ConnectionStates.CONNECTED_BUSY);

        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                this.bluetoothParser.once(
                    "cmdResponse",
                    (cmdResponse: AuroraCommand) => {
                        this.setConnectionState(
                            ConnectionStates.CONNECTED_IDLE
                        );

                        cmdResponse.origin = "bluetooth";

                        resolve(cmdResponse);
                    }
                );

                //write the status byte, indicating start of command
                await this.charWrite(
                    this.cmdStatusChar!,
                    Buffer.from([BleCmdStates.IDLE])
                );

                //write the actual command string as ascii (max 128bytes)
                await this.charWrite(
                    this.cmdDataChar!,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    Buffer.from(cmd, "ascii")
                );

                //let the parser know the command too
                this.bluetoothParser.setCmd(cmd);

                //write the status byte, indicating end of command
                await this.charWrite(
                    this.cmdStatusChar!,
                    Buffer.from([BleCmdStates.CMD_EXECUTE])
                );
            } catch (error) {
                this.bluetoothParser.reset();
                this.bluetoothParser.removeAllListeners("cmdResponse");

                this.setConnectionState(ConnectionStates.CONNECTED_IDLE);

                reject(error);
            }
        });
    }

    public async writeCmdInput(data: Buffer): Promise<void> {
        //check for error condition
        if (this.connectionState != ConnectionStates.CONNECTED_BUSY) {
            switch (this.connectionState) {
                case ConnectionStates.DISCONNECTED:
                    //case ConnectionStates.ADAPTER_FOUND:
                    //case ConnectionStates.DEVICE_FOUND:
                    return Promise.reject("No idle serial connection.");

                case ConnectionStates.CONNECTED_IDLE:
                    return Promise.reject(
                        "Command input can only be written during a command."
                    );

                default:
                    return Promise.reject(
                        "Unknown Bluetooth connection state."
                    );
            }
        }

        return this.charWrite(this.cmdDataChar!, data);
    }

    private setConnectionState(connectionState: ConnectionStates): void {
        if (this.connectionState == connectionState) {
            return;
        }

        const previousConnectionState = this.connectionState;

        this.connectionState = connectionState;

        if (this.connectionState == ConnectionStates.DISCONNECTED) {
            this.disconnectPending = false;
        }

        //console.log(`${previousConnectionState} --> ${connectionState}`);

        this.emit(
            "connectionStateChange",
            connectionState,
            previousConnectionState
        );
    }

    private async connectDevice(timeoutMs: number): Promise<unknown> {
        if (this.connectPromise) {
            throw new Error("Already have a pending connection.");
        }

        return new Promise((resolve, reject) => {
            this.connectPromise = { resolve, reject };

            //remove any existing listeners just in case
            noble.removeListener("discover", this.onPeripheralFound);
            noble.removeListener("scanStop", this.onPeripheralScanStop);

            noble.on("discover", this.onPeripheralFound);
            noble.on("scanStop", this.onPeripheralScanStop);
            noble.startScanning([BleAuroraService], false);

            clearTimeout(this.connectTimer!);

            if (timeoutMs > 0) {
                this.connectTimer = setTimeout(() => {
                    this.connectPromise = undefined;

                    noble.stopScanning();
                    noble.removeListener("discover", this.onPeripheralFound);

                    reject("Timeout waiting for bluetooth connection.");
                }, timeoutMs);
            }
        });
    }

    private async charWritePacket(
        char: noble.Characteristic,
        packet: Buffer
    ): Promise<unknown> {
        if (!Buffer.isBuffer(packet))
            return Promise.reject("Packet parameter is not a valid buffer.");

        if (!packet.length) return Promise.resolve();

        if (packet.length > BLE_CMD_MAX_PACKET_LENGTH)
            return Promise.reject("Exceeded max write packet length.");

        return new Promise((resolve, reject) => {
            //write a packet, the false here means the callback
            //isn't executed until the other side confirms receipt
            char.write(packet, false, (error: string) => {
                if (error) return reject(error);

                resolve();
            });
        });
    }

    private async charReadPacket(
        char: noble.Characteristic
    ): Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
            //write a packet, the false here means the callback
            //isn't executed until the other side confirms receipt
            char.read((error: string, packet: Buffer) => {
                if (error) return reject(error);

                resolve(packet);
            });
        });
    }

    private async charWrite(
        char: noble.Characteristic,
        buffer: Buffer
    ): Promise<void> {
        if (!Buffer.isBuffer(buffer))
            throw "Buffer parameter is not a valid buffer.";

        if (!buffer.length) return;

        //process at most 20 bytes at a time
        for (
            let i = 0;
            i < buffer.length + BLE_CMD_MAX_PACKET_LENGTH;
            i += BLE_CMD_MAX_PACKET_LENGTH
        ) {
            //create a buffer slice <= 20 bytes
            //slice handles case where buffer < 20
            const packet = buffer.slice(i, i + BLE_CMD_MAX_PACKET_LENGTH);

            //if this slice is empty, nothing to do
            if (!packet.length) break;

            //remember, this happens synchronously
            await this.charWritePacket(char, packet);
        }
    }

    public async charRead(
        char: noble.Characteristic,
        numBytes: number
    ): Promise<Buffer> {
        if (numBytes <= 0) throw "Trying to read less than 1 byte.";

        const packets: Uint8Array[] = [];

        let packetCount = Math.ceil(numBytes / BLE_CMD_MAX_PACKET_LENGTH);

        //read packets until we've read all required bytes
        while (packetCount--) {
            //read the packet, and add it to packet array
            const packet = await this.charReadPacket(char);
            packets.push(packet);
        }

        //waits till the last promise is resolved
        //then return the concatenated buffer
        return Buffer.concat(packets, numBytes);
    }

    private async charSubscribe(
        char: noble.Characteristic,
        onNotification: Function
    ): Promise<unknown> {
        return new Promise((resolve, reject) => {
            char.subscribe((error: string) => {
                if (error) return reject(error);

                char.on("data", onNotification);

                resolve();
            });
        });
    }

    private watchBluetoothAdapter(): void {
        this.unwatchBluetoothAdapter();

        noble.on("stateChange", this.onAdapterStateChange);
    }

    private unwatchBluetoothAdapter(): void {
        noble.removeListener("stateChange", this.onAdapterStateChange);
    }

    private onAdapterStateChange = (state: PoweredStates): void => {
        if (state == PoweredStates.ON) {
            if (this.connectionState == ConnectionStates.INIT) {
                //don't fire event here, just set connection state directly
                this.connectionState = ConnectionStates.DISCONNECTED;
            }
        } else if (state == PoweredStates.OFF) {
            this.connectionState = ConnectionStates.INIT;
        }
    };

    private onPeripheralDisconnect = (): void => {
        this.setConnectionState(ConnectionStates.DISCONNECTED);
    };

    private onPeripheralFound = (peripheral: noble.Peripheral): void => {
        peripheral.connect(error => {
            if (error) {
                return;
            }

            peripheral.discoverSomeServicesAndCharacteristics(
                [BleAuroraService],
                Object.values(BleAuroraChars),
                (error, services, characteristics) => {
                    if (error) {
                        return;
                    }

                    if (!this.connectPromise) {
                        throw new Error(
                            "Peripheral found event fired without valid connection promise."
                        );
                    }

                    this.connectPromise.resolve([
                        peripheral,
                        services[0],
                        characteristics
                    ]);
                    this.connectPromise = null;

                    noble.stopScanning();
                }
            );
        });
    };

    private onPeripheralScanStop = (): void => {
        clearTimeout(this.connectTimer!);

        noble.removeListener("discover", this.onPeripheralFound);

        if (this.connectPromise) {
            this.setConnectionState(ConnectionStates.DISCONNECTED);
            this.connectPromise.reject("Connection cancelled.");
            this.connectPromise = null;
        }
    };

    private onParseCmdResponseRead = (
        bytesToRead: number,
        cbAfterRead: (value: Buffer) => void
    ): void => {
        this.charRead(this.cmdDataChar!, bytesToRead).then(cbAfterRead);
    };

    private onParseCmdResponseWrite = (
        buffer: Buffer,
        cbAfterWrite: (value: void) => Buffer
    ): void => {
        this.charWrite(this.cmdDataChar!, buffer).then(() => {
            this.charWrite(
                this.cmdStatusChar!,
                Buffer.from([BleCmdStates.IDLE])
            ).then(cbAfterWrite);
        });
    };

    private onParseCmdInputRequested = (): void => {
        this.emit("cmdInputRequested");
    };

    private onParseCmdOutputReady = (output: unknown): void => {
        this.emit("cmdOutputReady", output);
    };

    private onParseAuroraEvent = (auroraEvent: AuroraEvent): void => {
        auroraEvent.origin = "bluetooth";

        this.emit("auroraEvent", auroraEvent);
    };

    private onParseStreamData = (streamData: BluetoothStream): void => {
        streamData.origin = "bluetooth";

        this.emit("streamData", streamData);
    };

    private onParseError = (error: string): void => {
        this.emit("bluetoothError", "Parse Error: " + error);
    };
}
