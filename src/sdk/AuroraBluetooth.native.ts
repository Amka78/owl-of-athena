//#region Import modules
import { EventEmitter } from "events";
import { PermissionsAndroid, Platform } from "react-native";
import {
    BleManager,
    type Characteristic,
    type Device,
    State,
    type Subscription,
} from "react-native-ble-plx";

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

const INIT_DELAY_MS = 5000;
const DISCONNECT_RETRY_DELAY_MS = 3000;

// Convert 32-char hex UUID to standard 8-4-4-4-12 format
function toStandardUUID(hex: string): string {
    const h = hex.toLowerCase();
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

const BLE_SERVICE_UUID = toStandardUUID(BleAuroraService);

const BLE_CHAR_UUIDS: Record<string, string> = {};
for (const [key, value] of Object.entries(BleAuroraChars)) {
    BLE_CHAR_UUIDS[key] = toStandardUUID(value);
}

// Map from standard UUID back to the original short UUID used by the parser keying
const standardToOriginalUUID: Record<string, string> = {};
for (const [, value] of Object.entries(BleAuroraChars)) {
    standardToOriginalUUID[toStandardUUID(value)] = value;
}

function bufferToBase64(buffer: Buffer): string {
    return buffer.toString("base64");
}

function base64ToBuffer(base64: string): Buffer {
    return Buffer.from(base64, "base64");
}

/**
 * Manage Bluetooth connections with Aurora devices on React Native.
 * Uses react-native-ble-plx instead of noble.
 */
export class AuroraBluetooth extends EventEmitter {
    private initializing: boolean;
    private connectionState: ConnectionStates;
    private disconnectPending: boolean;
    private bluetoothParser: AuroraBluetoothParser;
    private bleManager: BleManager;
    private device?: Device;
    private connectPromise?: any;
    private connectTimer?: any;
    private subscriptions: Subscription[];
    private disconnectSubscription?: Subscription;
    private stateSubscription?: Subscription;

    constructor() {
        super();

        this.initializing = false;
        this.connectionState = ConnectionStates.INIT;
        this.disconnectPending = false;
        this.subscriptions = [];

        this.bluetoothParser = new AuroraBluetoothParser();
        this.bluetoothParser.on("parseError", this.onParseError);
        this.bluetoothParser.on("cmdResponseRead", this.onParseCmdResponseRead);
        this.bluetoothParser.on("cmdResponseWrite", this.onParseCmdResponseWrite);
        this.bluetoothParser.on("cmdInputRequested", this.onParseCmdInputRequested);
        this.bluetoothParser.on("cmdOutputReady", this.onParseCmdOutputReady);
        this.bluetoothParser.on("auroraEvent", this.onParseAuroraEvent);
        this.bluetoothParser.on("streamData", this.onParseStreamData);

        this.bleManager = new BleManager();
        this.watchBluetoothAdapter();
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

    public async connect(timeoutMs = 30000): Promise<Device | void> {
        if (this.initializing) return;

        if (this.connectionState == ConnectionStates.INIT) {
            this.initializing = true;
            await sleep(INIT_DELAY_MS);
            this.initializing = false;

            if (this.connectionState == ConnectionStates.INIT) {
                return Promise.reject("No bluetooth adapter found. Is bluetooth disabled?");
            }

            return this.connect(timeoutMs);
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

        await this.requestPermissions();
        this.setConnectionState(ConnectionStates.CONNECTING);

        try {
            const device = await this.connectDevice(timeoutMs);
            this.device = device;

            this.disconnectSubscription = this.bleManager.onDeviceDisconnected(
                device.id,
                this.onPeripheralDisconnect,
            );

            await this.setupConnection(device);
            return this.device;
        } catch (error) {
            console.error(`Occurred connection error ${error}`);
            this.setConnectionState(ConnectionStates.DISCONNECTED);
            return Promise.reject(error);
        }
    }

    private async requestPermissions(): Promise<void> {
        if (Platform.OS === "android") {
            const apiLevel = Platform.Version;
            if (apiLevel >= 31) {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                ]);
                if (
                    granted["android.permission.BLUETOOTH_SCAN"] !==
                        PermissionsAndroid.RESULTS.GRANTED ||
                    granted["android.permission.BLUETOOTH_CONNECT"] !==
                        PermissionsAndroid.RESULTS.GRANTED
                ) {
                    throw new Error("Bluetooth permissions not granted.");
                }
            } else {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    throw new Error("Location permission not granted.");
                }
            }
        }
    }

    private async setupConnection(device: Device): Promise<void> {
        const discovered = await device.discoverAllServicesAndCharacteristics();
        const services = await discovered.services();
        const auroraService = services.find(
            (s) => s.uuid.toLowerCase() === BLE_SERVICE_UUID.toLowerCase(),
        );

        if (!auroraService) {
            throw new Error("Aurora BLE service not found on device.");
        }

        const characteristics = await auroraService.characteristics();

        // Key characteristics by their original (short) UUID for compatibility
        const charMap: Record<string, Characteristic> = {};
        for (const char of characteristics) {
            const originalUUID = standardToOriginalUUID[char.uuid.toLowerCase()];
            if (originalUUID) {
                charMap[originalUUID] = char;
            }
        }

        // Subscribe to stream data notifications (route through parser)
        await this.charSubscribe(BleAuroraChars.STREAM_DATA_NOTIFIED, (data: Buffer): void => {
            this.bluetoothParser.onStreamDataCharNotification(data);
        });

        // Subscribe to aurora event notifications
        await this.charSubscribe(BleAuroraChars.AURORA_EVENT_NOTIFIED, (data: Buffer): void => {
            this.bluetoothParser.onAuroraEventCharNotification(data);
        });

        // Subscribe to command status notifications
        await this.charSubscribe(BleAuroraChars.CMD_STATUS, (status: Buffer): void => {
            this.bluetoothParser.onCmdStatusCharNotification(status);
        });

        // Subscribe to command output notifications
        await this.charSubscribe(BleAuroraChars.CMD_OUTPUT_INDICATED, (output: Buffer): void => {
            this.bluetoothParser.onCmdOutputCharNotification(output);
        });

        this.setConnectionState(ConnectionStates.IDLE);
    }

    public async disconnect(): Promise<void> {
        if (this.connectionState == ConnectionStates.DISCONNECTED || this.disconnectPending) {
            return;
        }

        this.disconnectPending = true;

        if (this.connectionState == ConnectionStates.CONNECTING) {
            this.bleManager.stopDeviceScan();
            await sleep(20);

            // @ts-expect-error
            if (this.connectionState !== ConnectionStates.DISCONNECTED) {
                return Promise.reject("Failed to disconnect. Scanning not stopped.");
            }
        } else if (this.connectionState == ConnectionStates.BUSY) {
            await sleep(DISCONNECT_RETRY_DELAY_MS);
        }

        // @ts-expect-error
        if (this.connectionState === ConnectionStates.DISCONNECTED) return;

        try {
            this.cleanupSubscriptions();
            if (this.device) {
                await this.bleManager.cancelDeviceConnection(this.device.id);
            }
        } finally {
            this.setConnectionState(ConnectionStates.DISCONNECTED);
        }
    }

    public async writeCmd(cmd: string): Promise<any> {
        if (this.connectionState != ConnectionStates.IDLE) {
            switch (this.connectionState) {
                case ConnectionStates.DISCONNECTED:
                    return Promise.reject("No idle serial connection.");
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
                    return Promise.reject("No idle serial connection.");
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

    private async connectDevice(timeoutMs: number): Promise<Device> {
        if (this.connectPromise) {
            throw new Error("Already have a pending connection.");
        }

        return new Promise<Device>((resolve, reject) => {
            this.connectPromise = { resolve, reject };

            console.debug("bluetooth scanning start.");

            this.bleManager.startDeviceScan([BLE_SERVICE_UUID], null, (error, device) => {
                if (error) {
                    console.error("Scan error:", error);
                    this.connectPromise = undefined;
                    this.setConnectionState(ConnectionStates.DISCONNECTED);
                    reject(error.message);
                    return;
                }

                if (device) {
                    this.onPeripheralFound(device);
                }
            });

            clearTimeout(this.connectTimer!);

            if (timeoutMs > 0) {
                console.log(`waiting scanning:${timeoutMs}ms`);
                this.connectTimer = setTimeout(() => {
                    this.connectPromise = undefined;
                    this.bleManager.stopDeviceScan();
                    this.setConnectionState(ConnectionStates.DISCONNECTED);
                    reject("Timeout waiting for bluetooth connection.");
                }, timeoutMs);
            }
        });
    }

    private async charWrite(charKey: string, buffer: Buffer): Promise<void> {
        if (!Buffer.isBuffer(buffer)) throw "Buffer parameter is not a valid buffer.";

        if (!buffer.length) return;

        if (!this.device) throw "No device connected.";

        const charUUID = BLE_CHAR_UUIDS[charKey];
        if (!charUUID) throw `Unknown characteristic key: ${charKey}`;

        for (
            let i = 0;
            i < buffer.length + BLE_CMD_MAX_PACKET_LENGTH;
            i += BLE_CMD_MAX_PACKET_LENGTH
        ) {
            const packet = buffer.slice(i, i + BLE_CMD_MAX_PACKET_LENGTH);
            if (!packet.length) break;

            await this.bleManager.writeCharacteristicWithResponseForDevice(
                this.device.id,
                BLE_SERVICE_UUID,
                charUUID,
                bufferToBase64(packet),
            );
        }
    }

    public async charRead(charKey: string, numBytes: number): Promise<Buffer> {
        if (numBytes <= 0) throw "Trying to read less than 1 byte.";
        if (!this.device) throw "No device connected.";

        const charUUID = BLE_CHAR_UUIDS[charKey];
        if (!charUUID) throw `Unknown characteristic key: ${charKey}`;

        const packets: Buffer[] = [];
        let packetCount = Math.ceil(numBytes / BLE_CMD_MAX_PACKET_LENGTH);

        while (packetCount--) {
            const result = await this.bleManager.readCharacteristicForDevice(
                this.device.id,
                BLE_SERVICE_UUID,
                charUUID,
            );
            await sleep(10);
            if (result.value) {
                packets.push(base64ToBuffer(result.value));
            }
        }

        return Buffer.concat(packets, numBytes);
    }

    private async charSubscribe(
        charKey: string,
        onNotification: (data: Buffer) => void,
    ): Promise<void> {
        if (!this.device) throw "No device connected.";

        const charUUID = BLE_CHAR_UUIDS[charKey];
        if (!charUUID) throw `Unknown characteristic key: ${charKey}`;

        const subscription = this.bleManager.monitorCharacteristicForDevice(
            this.device.id,
            BLE_SERVICE_UUID,
            charUUID,
            (error, characteristic) => {
                if (error) {
                    console.error(`Notification error on ${charKey}:`, error);
                    return;
                }
                if (characteristic?.value) {
                    const buffer = base64ToBuffer(characteristic.value);
                    onNotification(buffer);
                }
            },
        );

        this.subscriptions.push(subscription);
    }

    private watchBluetoothAdapter(): void {
        this.unwatchBluetoothAdapter();

        this.stateSubscription = this.bleManager.onStateChange((state) => {
            this.onAdapterStateChange(state);
        }, true);
    }

    private unwatchBluetoothAdapter(): void {
        if (this.stateSubscription) {
            this.stateSubscription.remove();
            this.stateSubscription = undefined;
        }
    }

    private onAdapterStateChange = (state: State): void => {
        if (state === State.PoweredOn) {
            if (this.connectionState == ConnectionStates.INIT) {
                this.connectionState = ConnectionStates.DISCONNECTED;
            }
        } else if (state === State.PoweredOff) {
            this.connectionState = ConnectionStates.INIT;
        }
    };

    private onPeripheralDisconnect = (error: Error | null, _device: Device | null): void => {
        console.debug("onPeripheralDisconnect called.");

        if (error) {
            console.error("Disconnect error:", error);
        }

        this.cleanupSubscriptions();

        if (this.disconnectPending || !this.reconnect()) {
            this.setConnectionState(ConnectionStates.DISCONNECTED);
        }
    };

    private reconnect(): boolean {
        if (!this.device) return false;

        let reconnectResult = false;
        const deviceId = this.device.id;

        this.exponentialBackoff(
            3,
            2,
            async () => {
                console.log("Called toTry - reconnecting.");
                this.time("Connecting to Bluetooth Device... ");

                const device = await this.bleManager.connectToDevice(deviceId, {
                    requestMTU: 185,
                });
                this.device = device;

                this.disconnectSubscription = this.bleManager.onDeviceDisconnected(
                    device.id,
                    this.onPeripheralDisconnect,
                );

                await this.setupConnection(device);
                reconnectResult = true;
            },
            () => {
                console.log("> Bluetooth Device reconnected.");
            },
            () => {
                this.time("Failed to reconnect.");
            },
        );

        return reconnectResult;
    }

    private exponentialBackoff(
        max: number,
        delay: number,
        toTry: any,
        success: () => void,
        fail: () => void,
    ): void {
        toTry()
            .then(() => success())
            .catch(() => {
                if (max === 0) {
                    return fail();
                }
                this.time("Retrying in " + delay + "s... (" + max + " tries left)");
                setTimeout(() => {
                    this.exponentialBackoff(--max, delay * 2, toTry, success, fail);
                }, delay * 1000);
            });
    }

    private time(text: string): void {
        console.log("[" + new Date().toJSON().substr(11, 8) + "] " + text);
    }

    private onPeripheralFound = async (device: Device): Promise<void> => {
        console.debug("onPeripheralFound called:", device.name || device.id);

        this.bleManager.stopDeviceScan();

        try {
            const connectedDevice = await this.bleManager.connectToDevice(device.id, {
                requestMTU: 185,
            });

            if (!this.connectPromise) {
                throw new Error("Peripheral found event fired without valid connection promise.");
            }

            clearTimeout(this.connectTimer!);
            this.connectPromise.resolve(connectedDevice);
            this.connectPromise = undefined;
        } catch (error) {
            console.error("Connection to device failed:", error);
            if (this.connectPromise) {
                this.connectPromise.reject(error);
                this.connectPromise = undefined;
            }
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

    private cleanupSubscriptions(): void {
        for (const sub of this.subscriptions) {
            sub.remove();
        }
        this.subscriptions = [];

        if (this.disconnectSubscription) {
            this.disconnectSubscription.remove();
            this.disconnectSubscription = undefined;
        }
    }
}
