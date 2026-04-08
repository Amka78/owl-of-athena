//#region Import modules
import { EventEmitter } from "events";
import { AuroraBluetoothParser } from "./AuroraBluetoothParser";
import {
    BLE_CMD_MAX_PACKET_LENGTH,
    BleAuroraChars,
    BleAuroraService,
    BleCmdStates,
    ConnectionStates,
    DeviceEventList,
} from "./AuroraConstants";
import type { AuroraEvent, BluetoothStream, CommandResult } from "./AuroraTypes";
import { sleep } from "./util";

//#endregion

const DISCONNECT_RETRY_DELAY_MS = 3000;

// Convert 32-char hex UUID to standard 8-4-4-4-12 format
function toStandardUUID(hex: string): string {
    const h = hex.toLowerCase();
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(
        16,
        20,
    )}-${h.slice(20, 32)}`;
}

const BLE_SERVICE_UUID = toStandardUUID(BleAuroraService);

// Map hex UUID values to standard UUID format for Web Bluetooth API
const BLE_CHAR_STANDARD_UUIDS: Record<string, string> = {};
for (const [, value] of Object.entries(BleAuroraChars)) {
    BLE_CHAR_STANDARD_UUIDS[value] = toStandardUUID(value);
}

/**
 * Manage Bluetooth connections with Aurora devices on the Web platform.
 * Uses the Web Bluetooth API (navigator.bluetooth).
 */
export class AuroraBluetooth extends EventEmitter {
    private connectionState: ConnectionStates;
    private disconnectPending: boolean;
    private bluetoothParser: AuroraBluetoothParser;
    private device?: BluetoothDevice;
    private server?: BluetoothRemoteGATTServer;
    private characteristics: Map<string, BluetoothRemoteGATTCharacteristic>;

    constructor() {
        super();

        this.connectionState = ConnectionStates.DISCONNECTED;
        this.disconnectPending = false;
        this.characteristics = new Map();

        this.bluetoothParser = new AuroraBluetoothParser();
        this.bluetoothParser.on("parseError", this.onParseError);
        this.bluetoothParser.on("cmdResponseRead", this.onParseCmdResponseRead);
        this.bluetoothParser.on("cmdResponseWrite", this.onParseCmdResponseWrite);
        this.bluetoothParser.on("cmdInputRequested", this.onParseCmdInputRequested);
        this.bluetoothParser.on("cmdOutputReady", this.onParseCmdOutputReady);
        this.bluetoothParser.on("auroraEvent", this.onParseAuroraEvent);
        this.bluetoothParser.on("streamData", this.onParseStreamData);
    }

    public isConnected(): boolean {
        return (
            this.connectionState == ConnectionStates.IDLE ||
            this.connectionState == ConnectionStates.BUSY
        );
    }

    public isConnecting(): boolean {
        return this.connectionState == ConnectionStates.CONNECTING;
    }

    public async connect(_timeoutMs = 30000): Promise<void> {
        if (typeof navigator === "undefined" || !navigator.bluetooth) {
            return Promise.reject(
                "Web Bluetooth API is not available. Use HTTPS and a supported browser.",
            );
        }

        if (this.connectionState != ConnectionStates.DISCONNECTED) {
            switch (this.connectionState) {
                case ConnectionStates.CONNECTING:
                    return Promise.reject("Already connecting...");
                case ConnectionStates.BUSY:
                case ConnectionStates.IDLE:
                    return Promise.reject("Already connected.");
                default:
                    return Promise.reject("Unknown Bluetooth connection state.");
            }
        }

        this.setConnectionState(ConnectionStates.CONNECTING);

        try {
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: [BLE_SERVICE_UUID] }],
                optionalServices: [BLE_SERVICE_UUID],
            });

            if (!device.gatt) {
                throw new Error("GATT not available on device.");
            }

            this.device = device;
            device.addEventListener("gattserverdisconnected", this.onDeviceDisconnected);

            const server = await device.gatt.connect();
            this.server = server;

            await this.setupConnection(server);
        } catch (error) {
            console.error(`Web Bluetooth connection error: ${error}`);
            this.setConnectionState(ConnectionStates.DISCONNECTED);
            return Promise.reject(error);
        }
    }

    private async setupConnection(server: BluetoothRemoteGATTServer): Promise<void> {
        const service = await server.getPrimaryService(BLE_SERVICE_UUID);

        // Discover and store characteristics keyed by their hex UUID
        for (const [, hexUUID] of Object.entries(BleAuroraChars)) {
            const standardUUID = BLE_CHAR_STANDARD_UUIDS[hexUUID];
            try {
                const char = await service.getCharacteristic(standardUUID);
                this.characteristics.set(hexUUID, char);
            } catch (e) {
                console.warn(`Characteristic ${hexUUID} not found:`, e);
            }
        }

        await this.charSubscribe(BleAuroraChars.STREAM_DATA_NOTIFIED, (data: Buffer): void => {
            this.bluetoothParser.onStreamDataCharNotification(data);
        });

        await this.charSubscribe(BleAuroraChars.AURORA_EVENT_NOTIFIED, (data: Buffer): void => {
            this.bluetoothParser.onAuroraEventCharNotification(data);
        });

        await this.charSubscribe(BleAuroraChars.CMD_STATUS, (status: Buffer): void => {
            this.bluetoothParser.onCmdStatusCharNotification(status);
        });

        await this.charSubscribe(BleAuroraChars.CMD_OUTPUT_NOTIFIED, (output: Buffer): void => {
            this.bluetoothParser.onCmdOutputCharNotification(output);
        });

        this.setConnectionState(ConnectionStates.IDLE);
    }

    public async disconnect(): Promise<void> {
        if (this.connectionState == ConnectionStates.DISCONNECTED || this.disconnectPending) {
            return;
        }

        this.disconnectPending = true;

        if (this.connectionState == ConnectionStates.BUSY) {
            await sleep(DISCONNECT_RETRY_DELAY_MS);
        }

        // Re-check: state may have changed during await
        if ((this.connectionState as ConnectionStates) === ConnectionStates.DISCONNECTED) return;

        try {
            if (this.server && this.server.connected) {
                this.server.disconnect();
            }
        } finally {
            this.cleanup();
            this.setConnectionState(ConnectionStates.DISCONNECTED);
        }
    }

    public async writeCmd(cmd: string): Promise<any> {
        if (this.connectionState != ConnectionStates.IDLE) {
            switch (this.connectionState) {
                case ConnectionStates.DISCONNECTED:
                    return Promise.reject("No idle connection.");
                case ConnectionStates.BUSY:
                    return Promise.reject("Another command is already in progress.");
                default:
                    return Promise.reject("Unknown Bluetooth connection state.");
            }
        }

        if (this.disconnectPending) {
            return Promise.reject("Bluetooth currently disconnecting.");
        }

        this.setConnectionState(ConnectionStates.BUSY);

        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                this.bluetoothParser.once("cmdResponse", (cmdResponse: CommandResult<unknown>) => {
                    this.setConnectionState(ConnectionStates.IDLE);
                    cmdResponse.origin = "bluetooth";
                    resolve(cmdResponse);
                });

                await this.charWrite(BleAuroraChars.CMD_STATUS, Buffer.from([BleCmdStates.IDLE]));
                await sleep(10);

                await this.charWrite(BleAuroraChars.CMD_DATA, Buffer.from(cmd, "ascii"));
                await sleep(10);

                this.bluetoothParser.setCmd(cmd);

                await this.charWrite(
                    BleAuroraChars.CMD_STATUS,
                    Buffer.from([BleCmdStates.CMD_EXECUTE]),
                );
                await sleep(10);
            } catch (error) {
                this.bluetoothParser.reset();
                this.bluetoothParser.removeAllListeners("cmdResponse");
                this.setConnectionState(ConnectionStates.IDLE);
                reject(error);
            }
        });
    }

    public async writeCmdInput(data: Buffer): Promise<any> {
        if (this.connectionState != ConnectionStates.BUSY) {
            switch (this.connectionState) {
                case ConnectionStates.DISCONNECTED:
                    return Promise.reject("No idle connection.");
                case ConnectionStates.IDLE:
                    return Promise.reject("Command input can only be written during a command.");
                default:
                    return Promise.reject("Unknown Bluetooth connection state.");
            }
        }

        return this.charWrite(BleAuroraChars.CMD_DATA, data);
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

        this.emit(DeviceEventList.connectionStateChange, connectionState, previousConnectionState);
    }

    private async charWrite(charKey: string, buffer: Buffer): Promise<void> {
        if (!Buffer.isBuffer(buffer)) throw "Buffer parameter is not a valid buffer.";

        if (!buffer.length) return;

        const char = this.characteristics.get(charKey);
        if (!char) throw `Characteristic not found: ${charKey}`;

        for (
            let i = 0;
            i < buffer.length + BLE_CMD_MAX_PACKET_LENGTH;
            i += BLE_CMD_MAX_PACKET_LENGTH
        ) {
            const packet = buffer.slice(i, i + BLE_CMD_MAX_PACKET_LENGTH);
            if (!packet.length) break;

            await char.writeValueWithResponse(new Uint8Array(packet));
        }
    }

    public async charRead(charKey: string, numBytes: number): Promise<Buffer> {
        if (numBytes <= 0) throw "Trying to read less than 1 byte.";

        const char = this.characteristics.get(charKey);
        if (!char) throw `Characteristic not found: ${charKey}`;

        const packets: Buffer[] = [];
        let packetCount = Math.ceil(numBytes / BLE_CMD_MAX_PACKET_LENGTH);

        while (packetCount--) {
            const value = await char.readValue();
            await sleep(10);
            packets.push(Buffer.from(value.buffer));
        }

        return Buffer.concat(packets, numBytes);
    }

    private async charSubscribe(
        charKey: string,
        onNotification: (data: Buffer) => void,
    ): Promise<void> {
        const char = this.characteristics.get(charKey);
        if (!char) {
            console.warn(`Cannot subscribe to ${charKey}: characteristic not found.`);
            return;
        }

        char.addEventListener("characteristicvaluechanged", (event: Event) => {
            const target = event.target as BluetoothRemoteGATTCharacteristic;
            if (target.value) {
                onNotification(Buffer.from(target.value.buffer));
            }
        });

        await char.startNotifications();
    }

    private cleanup(): void {
        this.characteristics.clear();
        if (this.device) {
            this.device.removeEventListener("gattserverdisconnected", this.onDeviceDisconnected);
        }
        this.device = undefined;
        this.server = undefined;
    }

    private onDeviceDisconnected = (): void => {
        this.cleanup();
        if (!this.disconnectPending) {
            this.setConnectionState(ConnectionStates.DISCONNECTED);
        }
    };

    private onParseCmdResponseRead = (
        bytesToRead: number,
        cbAfterRead: (value: Buffer) => void,
    ): void => {
        this.charRead(BleAuroraChars.CMD_DATA, bytesToRead).then(cbAfterRead);
    };

    private onParseCmdResponseWrite = (
        buffer: Buffer,
        cbAfterWrite: (value: void) => Buffer,
    ): void => {
        this.charWrite(BleAuroraChars.CMD_DATA, buffer).then(() => {
            this.charWrite(BleAuroraChars.CMD_STATUS, Buffer.from([BleCmdStates.IDLE])).then(
                cbAfterWrite,
            );
        });
    };

    private onParseCmdInputRequested = (): void => {
        this.emit(DeviceEventList.cmdInputRequested);
    };

    private onParseCmdOutputReady = (output: unknown): void => {
        this.emit(DeviceEventList.cmdOutputReady, output);
    };

    private onParseAuroraEvent = (auroraEvent: AuroraEvent): void => {
        auroraEvent.origin = "bluetooth";
        this.emit(DeviceEventList.auroraEvent, auroraEvent);
    };

    private onParseStreamData = (streamData: BluetoothStream): void => {
        streamData.origin = "bluetooth";
        this.emit(DeviceEventList.streamData, streamData);
    };

    private onParseError = (error: string): void => {
        this.emit(DeviceEventList.Error, "Parse Error: " + error);
    };
}
