//#region Imports
import { EventEmitter } from "events";

import { AuroraBluetoothParser } from "../AuroraBluetoothParser";
import { BleCmdStates, ConnectionStates, DeviceEventList } from "../AuroraConstants";
import type { AuroraEvent, BluetoothStream, CommandResult } from "../AuroraTypes";
import { sleep } from "../util";
import type { DeviceResponse } from "./VirtualAuroraDevice";
import { VirtualAuroraDevice } from "./VirtualAuroraDevice";

//#endregion

/**
 * 実機 AuroraBluetooth（ble-plx / noble / Web Bluetooth）と同形の接続層。
 *
 * 仮想端末（VirtualAuroraDevice）の応答・イベントを、実機と同じ経路で
 * AuroraBluetoothParser へ流し込む。UI / Aurora / AuroraManager は
 * 実機接続と区別せずに利用できる。
 *
 * 実機の BLE 書き込み（20 バイト + ack）を模した送信レート調整や権限リクエストは
 * 仮想モードでは行わない（実 Bluetooth を一切使わないため）。
 */
export class VirtualAuroraBluetooth extends EventEmitter {
    private connectionState: ConnectionStates;
    private disconnectPending: boolean;
    private bluetoothParser: AuroraBluetoothParser;
    private device: VirtualAuroraDevice;
    private pendingResponseBuffer?: Buffer;

    constructor(device?: VirtualAuroraDevice) {
        super();

        this.connectionState = ConnectionStates.INIT;
        this.disconnectPending = false;

        this.device = device ?? new VirtualAuroraDevice();
        this.bluetoothParser = new AuroraBluetoothParser();
        this.bluetoothParser.on("parseError", this.onParseError);
        this.bluetoothParser.on("cmdResponseRead", this.onParseCmdResponseRead);
        this.bluetoothParser.on("cmdInputRequested", this.onParseCmdInputRequested);
        this.bluetoothParser.on("cmdOutputReady", this.onParseCmdOutputReady);
        this.bluetoothParser.on("auroraEvent", this.onParseAuroraEvent);
        this.bluetoothParser.on("streamData", this.onParseStreamData);

        // 仮想アダプタは起動直後から Bluetooth アダプタ電源 ON とみなす。
        // 実機の初期化待ち（INIT → 5 秒 → DISCONNECTED）に相当する状態遷移を飛ばす。
        this.connectionState = ConnectionStates.DISCONNECTED;

        this.device.on("deviceEvent", this.onDeviceEvent);
        this.device.on("writeFinished", this.onDeviceWriteFinished);
    }

    public isConnected(): boolean {
        return (
            this.connectionState === ConnectionStates.IDLE ||
            this.connectionState === ConnectionStates.BUSY
        );
    }

    public isConnecting(): boolean {
        return this.connectionState === ConnectionStates.CONNECTING;
    }

    public async connect(_timeoutMs = 30000): Promise<void> {
        if (this.connectionState !== ConnectionStates.DISCONNECTED) {
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
            this.device.connect();
            // スキャン → 発見 → 接続 → 特性購読 に相当する部分は仮想端末が即時完了する
            this.setConnectionState(ConnectionStates.IDLE);
        } catch (error) {
            console.error(`Occurred connection error ${error}`);
            this.setConnectionState(ConnectionStates.DISCONNECTED);
            return Promise.reject(error);
        }
    }

    public async disconnect(): Promise<void> {
        if (this.connectionState === ConnectionStates.DISCONNECTED || this.disconnectPending) {
            return;
        }

        this.disconnectPending = true;

        if (this.connectionState === ConnectionStates.BUSY) {
            await sleep(3000);
        }

        // @ts-expect-error 実機実装と同じく、切断待機中に接続状態へ戻る可能性があるため再確認する
        if (this.connectionState === ConnectionStates.DISCONNECTED) return;

        this.device.disconnect();
        this.setConnectionState(ConnectionStates.DISCONNECTED);
    }

    public async writeCmd(cmd: string): Promise<any> {
        if (this.connectionState !== ConnectionStates.IDLE) {
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

                this.bluetoothParser.setCmd(cmd);

                const response = this.device.execute(cmd);
                await this.feedResponse(response);
            } catch (error) {
                this.bluetoothParser.reset();
                this.bluetoothParser.removeAllListeners("cmdResponse");

                this.setConnectionState(ConnectionStates.IDLE);

                reject(error);
            }
        });
    }

    public async writeCmdInput(data: Buffer): Promise<any> {
        if (this.connectionState !== ConnectionStates.BUSY) {
            switch (this.connectionState) {
                case ConnectionStates.DISCONNECTED:
                    return Promise.reject("No idle serial connection.");

                case ConnectionStates.IDLE:
                    return Promise.reject("Command input can only be written during a command.");

                default:
                    return Promise.reject("Unknown Bluetooth connection state.");
            }
        }

        this.device.writeInput(data);
    }

    private async feedResponse(response: DeviceResponse): Promise<void> {
        switch (response.kind) {
            case "plain": {
                await this.notifyStatus([BleCmdStates.IDLE, 0]);
                break;
            }

            case "error": {
                await this.notifyStatus([BleCmdStates.IDLE, 1]);
                break;
            }

            case "object": {
                // 実機はオブジェクトの各行を 1 行ずつ OBJECT_READY で送る（line 単位の読み出し）
                for (const line of response.lines) {
                    this.pendingResponseBuffer = Buffer.from(line, "ascii");
                    await this.notifyStatus([BleCmdStates.CMD_RESP_OBJECT_READY, line.length]);
                    await sleep(10);
                }
                await this.notifyStatus([BleCmdStates.IDLE, response.error ? 1 : 0]);
                break;
            }

            case "table": {
                const lines = [
                    response.columns.join("|"),
                    ...response.rows.map((row) => row.join("|")),
                ];
                // テーブルも 1 行ずつ送る（1 行目が列ヘッダー）
                for (const line of lines) {
                    this.pendingResponseBuffer = Buffer.from(line, "ascii");
                    await this.notifyStatus([BleCmdStates.CMD_RESP_TABLE_READY, line.length]);
                    await sleep(10);
                }
                await this.notifyStatus([BleCmdStates.IDLE, 0]);
                break;
            }

            case "output": {
                for (const chunk of response.chunks) {
                    this.bluetoothParser.onCmdOutputCharNotification(chunk);
                }

                for (const line of response.infoLines) {
                    this.pendingResponseBuffer = Buffer.from(line, "ascii");
                    await this.notifyStatus([BleCmdStates.CMD_RESP_OBJECT_READY, line.length]);
                    await sleep(10);
                }
                await this.notifyStatus([BleCmdStates.IDLE, 0]);
                break;
            }

            case "input": {
                // 入力は writeCmdInput → writeFinished（書き込み完了）の順に後から届く
                await this.notifyStatus([BleCmdStates.CMD_INPUT_REQUESTED]);
                break;
            }
        }
    }

    private notifyStatus(status: number[]): Promise<void> {
        return this.bluetoothParser.onCmdStatusCharNotification(Buffer.from(status));
    }

    private setConnectionState(connectionState: ConnectionStates): void {
        if (this.connectionState === connectionState) {
            return;
        }

        const previousConnectionState = this.connectionState;
        this.connectionState = connectionState;

        if (this.connectionState === ConnectionStates.DISCONNECTED) {
            this.disconnectPending = false;
        }

        this.emit(DeviceEventList.connectionStateChange, connectionState, previousConnectionState);
    }

    private onDeviceEvent = (eventId: number, flags: number): void => {
        const eventBuffer = Buffer.alloc(5);
        eventBuffer[0] = eventId;
        eventBuffer.writeUInt32LE(flags, 1);
        this.bluetoothParser.onAuroraEventCharNotification(eventBuffer);
    };

    private onDeviceWriteFinished = (response: DeviceResponse): void => {
        this.feedResponse(response).catch((error) => {
            console.error("Failed to feed the write response:", error);
        });
    };

    private onParseCmdResponseRead = (
        bytesToRead: number,
        cbAfterRead: (value: Buffer) => void,
    ): void => {
        const buffer = this.pendingResponseBuffer?.subarray(0, bytesToRead) ?? Buffer.alloc(0);
        this.pendingResponseBuffer = undefined;
        cbAfterRead(buffer);
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
        this.emit(DeviceEventList.Error, `Parse Error: ${error}`);
    };
}
