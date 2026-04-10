//#region Import Modules
import { EventEmitter } from "events";
import _ from "lodash";
import Stream from "stream";

import type { AuroraEvent } from "../model/AuroraEvent";
import { AuroraBluetooth } from "./AuroraBluetooth";
import AuroraCmdDownloadFile from "./AuroraCmdDownloadFile";
import AuroraCmdDownloadStream from "./AuroraCmdDownloadStream";
import AuroraCmdFileInfo from "./AuroraCmdFileInfo";
import AuroraCmdFlashFile from "./AuroraCmdFlashFile";
import AuroraCmdGetProfiles from "./AuroraCmdGetProfiles";
import AuroraCmdGetSessions from "./AuroraCmdGetSessions";
import AuroraCmdGetUnSyncedSessions from "./AuroraCmdGetUnsyncedSessions";
import AuroraCmdPlayBuzzSong from "./AuroraCmdPlayBuzzSong";
import AuroraCmdPlayLedEffect from "./AuroraCmdPlayLedEffect";
import AuroraCmdReadFile from "./AuroraCmdReadFile";
import AuroraCmdSetProfiles from "./AuroraCmdSetProfiles";
import AuroraCmdSyncTime from "./AuroraCmdSyncTime";
import AuroraCmdUploadFile from "./AuroraCmdUploadFile";
import AuroraCmdWriteFile from "./AuroraCmdWriteFile";
import * as AuroraConstants from "./AuroraConstants";
import { AuroraEventList } from "./AuroraEventList";
import type { Command, CommandResolverType, CommandResult, EventResponse } from "./AuroraTypes";
import { AuroraOSInfo } from "./models/AuroraOSInfo";
import { Event } from "./models/Event";
import { stringToVersion, versionToString } from "./util";

//#endregion

type PlayLedEffect = typeof AuroraCmdPlayLedEffect;
type GetSessions = typeof AuroraCmdGetSessions;
type SyncTime = typeof AuroraCmdSyncTime;
type WriteFile = typeof AuroraCmdWriteFile;
type ReadFile = typeof AuroraCmdReadFile;
type DownloadFile = typeof AuroraCmdDownloadFile;
type DownloadStream = typeof AuroraCmdDownloadStream;
type GetProfiles = typeof AuroraCmdGetProfiles;
type SetProfiles = typeof AuroraCmdSetProfiles;
type FlashFile = typeof AuroraCmdFlashFile;
type PlayBuzzSong = typeof AuroraCmdPlayBuzzSong;
type UploadFile = typeof AuroraCmdUploadFile;
type ReadFileInfo = typeof AuroraCmdFileInfo;
type GetUnsyncedSessions = typeof AuroraCmdGetUnSyncedSessions;

/**
 * Shared Aurora SDK class used on all platforms (web, Android, iOS).
 * Uses Bluetooth-only connectivity.
 */
class Aurora extends EventEmitter {
    private bluetooth: AuroraBluetooth;
    private cmdQueue: Command[];
    private cmdCurrent?: Command;
    private isFlashing: boolean;
    private info?: AuroraOSInfo;
    private isAutoConnectBluetooth: boolean;
    private enabledEventList: Array<AuroraConstants.EventIds>;

    constructor() {
        super();

        this.bluetooth = new AuroraBluetooth();
        this.bluetooth.on(
            AuroraConstants.DeviceEventList.connectionStateChange,
            this.onBluetoothConnectionStateChange,
        );
        this.bluetooth.on(AuroraConstants.DeviceEventList.Error, this.onAuroraError);
        this.bluetooth.on(AuroraConstants.DeviceEventList.streamData, this.onAuroraStreamData);
        this.bluetooth.on(AuroraConstants.DeviceEventList.auroraEvent, this.onAuroraEvent);
        this.bluetooth.on(
            AuroraConstants.DeviceEventList.cmdInputRequested,
            this.onCmdInputRequested,
        );
        this.bluetooth.on(AuroraConstants.DeviceEventList.cmdOutputReady, this.onCmdOutputReady);

        this.cmdQueue = [] as Command[];

        this.isAutoConnectBluetooth = false;
        this.isFlashing = false;
        this.info = undefined;
        this.enabledEventList = [] as AuroraConstants.EventIds[];
    }

    public isConnected(): boolean {
        return this.isBluetoothConnected();
    }

    public isUsbConnected(): boolean {
        return false;
    }

    public isBluetoothConnected(): boolean {
        return this.bluetooth.isConnected();
    }

    public isMsdAttached(): boolean {
        return false;
    }

    public async executeBluetoothAutoConnection(): Promise<void | never> {
        this.isAutoConnectBluetooth = true;

        if (!this.bluetooth.isConnected() && !this.bluetooth.isConnecting()) {
            await this.bluetooth.connect(0);
        }
    }

    public async connectBluetooth(timeoutMs = 20000): Promise<AuroraOSInfo | never> {
        if (this.bluetooth.isConnected()) {
            return Promise.reject("Already connected over bluetooth.");
        }

        if (this.bluetooth.isConnecting()) {
            return Promise.reject("Already connecting over bluetooth.");
        }

        return new Promise((resolve, reject) => {
            this.once(AuroraEventList.findBluetoothDevice, (fwInfo) => {
                console.debug("Found Aurora device.");
                if (!fwInfo) return reject();

                resolve(new AuroraOSInfo(fwInfo));
            });

            this.bluetooth.connect(timeoutMs).catch(reject);
        });
    }

    public async disconnectBluetooth(): Promise<unknown | never> {
        this.isAutoConnectBluetooth = false;

        if (!this.bluetooth.isConnected() && !this.bluetooth.isConnecting()) {
            return;
        }

        return this.bluetooth.disconnect();
    }

    public async flash(
        fwFile: string,
        fwVersion: number | false = false,
        fwType = "app",
    ): Promise<unknown> {
        if (this.isFlashing) return Promise.reject("Already flashing.");

        if (!this.isConnected()) return Promise.reject("Must be connected to perform flash.");

        const wasBluetoothAutoConnectOff = !this.isAutoConnectBluetooth;
        const wasBluetoothConnected = this.isBluetoothConnected();

        if (this.isBluetoothConnected()) {
            this.isAutoConnectBluetooth = true;
        }

        let flashCmd =
            fwType == "bootloader" || fwType == "bootloader-and-bootstrap"
                ? "os-flash-bootloader"
                : fwType == "ble"
                  ? "ble-flash"
                  : "os-flash";

        if (this.info!.version! >= 20100) {
            flashCmd += ` ${fwFile} /`;

            if (fwType == "bootloader-and-bootstrap") {
                flashCmd += " 1";
            }
        }

        return this.queueCmd(flashCmd).then(() => {
            this.isFlashing = true;

            return new Promise((resolve, reject) => {
                // eslint-disable-next-line prefer-const
                let onFlashConnectionChange: (fwInfo: AuroraOSInfo) => void | undefined;
                // eslint-disable-next-line prefer-const
                let flashTimeout: NodeJS.Timeout | undefined;

                const finish = (): void => {
                    if (wasBluetoothAutoConnectOff && this.isAutoConnectBluetooth) {
                        this.isAutoConnectBluetooth = false;
                    }

                    this.isFlashing = false;

                    clearTimeout(flashTimeout!);

                    this.removeListener(
                        AuroraEventList.flashConnectionChange,
                        onFlashConnectionChange,
                    );

                    if (wasBluetoothConnected && !this.isBluetoothConnected()) {
                        setTimeout(() => {
                            if (!this.isBluetoothConnected()) {
                                this.emit(AuroraEventList.bluetoothConnectionChange, false);
                            }
                        }, 3000);
                    }
                };

                onFlashConnectionChange = (fwInfo: AuroraOSInfo): void => {
                    if (fwInfo) {
                        finish();

                        const version =
                            fwType == "bootloader" || fwType == "bootloader-and-bootstrap"
                                ? fwInfo.bootloaderVersion
                                : fwType == "ble"
                                  ? fwInfo.bleVersion
                                  : fwInfo.version;

                        if (!fwVersion || version === fwVersion) {
                            resolve(fwInfo);
                        } else {
                            reject(
                                `Flash failed. Expected ${fwType} version ${versionToString(
                                    fwVersion,
                                )} but have ${versionToString(version!)}.`,
                            );
                        }
                    }
                };

                this.on("flashConnectionChange", onFlashConnectionChange);

                flashTimeout = setTimeout(() => {
                    finish();
                    reject("Unable to verify flash. Timeout waiting for reconnection.");
                }, 50000);
            });
        });
    }

    public async queueCmd<T>(
        commandStr: string,
        connectorType = AuroraConstants.ConnectorTypes.ANY,
        onCmdBegin?: (cmd: T) => void,
        onCmdEnd?: () => void,
    ): Promise<T> {
        if (!this.bluetooth.isConnected()) {
            return Promise.reject(`Not connected to Aurora over bluetooth.`);
        }

        return new Promise((resolve, reject) => {
            const commandResolver = resolve as CommandResolverType;
            this.cmdQueue.push({
                commandStr,
                connectorType,
                onCmdBegin,
                onCmdEnd,
                resolve: commandResolver,
                reject,
            });

            if (!this.cmdCurrent) {
                this.processCmdQueue();
            }
        });
    }

    public async enableEvents(
        enableEvent: AuroraConstants.EventIds[],
    ): Promise<CommandResult<EventResponse>> {
        this.enabledEventList.concat(enableEvent);

        this.enabledEventList = _.concat(this.enabledEventList, enableEvent);
        const mask = Event.toMask(enableEvent);

        return await this.queueCmd(
            `${AuroraConstants.CommandNames.EVENT_OUTPUT_ENABLE}${mask} ${16}`,
        );
    }

    public async disableEvents(disableEvent: AuroraConstants.EventIds[]): Promise<void> {
        this.enabledEventList = _.pullAll(this.enabledEventList, disableEvent);

        const mask = Event.toMask(disableEvent);

        return await this.queueCmd(
            `${AuroraConstants.CommandNames.EVENT_OUTPUT_DISABLE}${mask} ${16}`,
        );
    }

    public get playLedEffect(): PlayLedEffect {
        return AuroraCmdPlayLedEffect;
    }

    public get writeFile(): WriteFile {
        return AuroraCmdWriteFile;
    }

    public get readFileInfo(): ReadFileInfo {
        return AuroraCmdFileInfo;
    }

    public get syncTime(): SyncTime {
        return AuroraCmdSyncTime;
    }

    public get getUnsyncedSessions(): GetUnsyncedSessions {
        return AuroraCmdGetUnSyncedSessions;
    }

    public get getSessions(): GetSessions {
        return AuroraCmdGetSessions;
    }

    public get readFile(): ReadFile {
        return AuroraCmdReadFile;
    }

    public get downloadFile(): DownloadFile {
        return AuroraCmdDownloadFile;
    }

    public get uploadFile(): UploadFile {
        return AuroraCmdUploadFile;
    }

    public get flashFile(): FlashFile {
        return AuroraCmdFlashFile;
    }

    public get getProfiles(): GetProfiles {
        return AuroraCmdGetProfiles;
    }

    public get setProfiles(): SetProfiles {
        return AuroraCmdSetProfiles;
    }

    public get downloadStream(): DownloadStream {
        return AuroraCmdDownloadStream;
    }

    public get playBuzzSong(): PlayBuzzSong {
        return AuroraCmdPlayBuzzSong;
    }

    private async getOsInfo(connectorType: AuroraConstants.ConnectorTypes): Promise<unknown> {
        return await this.queueCmd("os-info 1", connectorType)
            .catch((cmdWithResponse) => {
                if (cmdWithResponse.response.error === 3) {
                    return this.queueCmd("os-info", connectorType);
                }

                return Promise.reject(cmdWithResponse);
            })
            .then((cmdWithResponse: any) => {
                if (cmdWithResponse.response.error === 3) {
                    return this.queueCmd("os-info", connectorType);
                }

                return cmdWithResponse;
            })
            .then((cmdWithResponse) => {
                if (typeof cmdWithResponse.response.version == "string") {
                    cmdWithResponse.response.version = stringToVersion(
                        cmdWithResponse.response.version,
                    );
                }

                this.info = new AuroraOSInfo(cmdWithResponse.response);

                return cmdWithResponse;
            });
    }

    private processCmdQueue(): void {
        this.cmdCurrent = this.cmdQueue.shift();

        if (!this.cmdCurrent) {
            return;
        }

        // On mobile, always use bluetooth
        this.cmdCurrent.connector = this.bluetooth;

        if (!this.cmdCurrent.connector.isConnected()) {
            this.cmdCurrent.reject!(`No longer connected to Aurora over bluetooth.`);
            return;
        }

        const [command, ...args] = this.cmdCurrent.commandStr!.split(" ");

        this.cmdCurrent.inputStream = new Stream.Writable();
        this.cmdCurrent.inputStream._write = (data, _encoding, done): void => {
            this.cmdCurrent!.connector!.writeCmdInput(data).then(() => done());
        };

        this.cmdCurrent.outputStream = new Stream.Readable();
        this.cmdCurrent.outputStream._read = (): void => {
            return;
        };

        const cmd: CommandResult<unknown> = {
            command,
            args,
            connectorType: this.cmdCurrent.connectorType,
            outputStream: this.cmdCurrent.outputStream,
            beginTime: Date.now(),
        };

        this.emit(AuroraEventList.cmdBegin, cmd);

        if (this.cmdCurrent.onCmdBegin) {
            this.cmdCurrent.onCmdBegin(cmd);
        }

        this.cmdCurrent.connector
            .writeCmd(this.cmdCurrent.commandStr!)
            .then((cmdWithResponse: CommandResult<unknown>): CommandResult<unknown> => {
                cmd.endTime = Date.now();
                cmd.origin = cmdWithResponse.origin;
                cmd.error = cmdWithResponse.error;
                cmd.response = cmdWithResponse.response;

                return cmd;
            })
            .catch((error: string): CommandResult<unknown> => {
                cmd.origin = "bluetooth";
                cmd.error = true;
                cmd.response = {
                    error: -99,
                    message: `Fatal error: ${error}`,
                };
                this.cmdQueue = [];

                return cmd;
            })
            .then(async (cmd: CommandResult<unknown>): Promise<void> => {
                cmd.outputStream!.push(null);

                if (cmd.error) {
                    console.error("Rejected command:", cmd);
                    this.cmdCurrent!.reject!(cmd);
                } else {
                    console.debug("Succeed command:", cmd);
                    this.cmdCurrent!.resolve(cmd);
                }

                if (this.cmdCurrent!.onCmdEnd) {
                    console.debug("onCmdEnd has been executed.");
                    this.cmdCurrent!.onCmdEnd(cmd);
                }

                this.emit(AuroraEventList.cmdEnd, cmd);

                setTimeout(() => {
                    this.cmdCurrent = undefined;
                    this.processCmdQueue();
                }, 200);
            });
    }

    private onBluetoothConnectionStateChange = async (
        connectionState: AuroraConstants.ConnectionStates,
        previousConnectionState: AuroraConstants.ConnectionStates,
    ): Promise<void> => {
        console.debug(
            `BluetoothConnectionStateChange ${
                AuroraConstants.ConnectionStatesToNames[previousConnectionState]
            } to ${
                AuroraConstants.ConnectionStatesToNames[connectionState]
            } when ${new Date(Date.now()).toLocaleString()}`,
        );
        if (
            connectionState === AuroraConstants.ConnectionStates.IDLE &&
            previousConnectionState === AuroraConstants.ConnectionStates.CONNECTING
        ) {
            await this.getOsInfo(AuroraConstants.ConnectorTypes.BLUETOOTH)
                .then((cmd: any): void => {
                    console.debug("Start bluetoothConnectionChange:", cmd);
                    this.emit(
                        this.isFlashing
                            ? AuroraEventList.flashConnectionChange
                            : AuroraEventList.findBluetoothDevice,
                        cmd.response,
                    );
                })
                .catch((error: string): void => {
                    console.debug("Bluetooth Connection Error", error);
                    // Emit findBluetoothDevice with falsy value so connectBluetooth
                    // promise rejects instead of hanging forever.
                    this.emit(AuroraEventList.findBluetoothDevice, null);
                    this.disconnectBluetooth();
                });
        } else if (
            connectionState === AuroraConstants.ConnectionStates.DISCONNECTED &&
            previousConnectionState !== AuroraConstants.ConnectionStates.CONNECTING
        ) {
            if (this.isFlashing) this.emit(AuroraEventList.flashConnectionChange, false);

            if (this.isAutoConnectBluetooth) {
                this.bluetooth.connect(0).catch(() => {
                    return;
                });
            }
        }
        this.emit(AuroraEventList.bluetoothConnectionChange, connectionState);
    };

    private onCmdInputRequested = (): void => {
        if (!this.cmdCurrent) return;

        this.emit(AuroraEventList.cmdInputRequested, this.cmdCurrent.inputStream);
    };

    private onCmdOutputReady = (output: { chunk: unknown; encoding?: string }): void => {
        if (!this.cmdCurrent) return;

        this.cmdCurrent.outputStream!.push(output);
    };

    private onAuroraStreamData = (streamData: unknown): void => {
        this.emit(AuroraEventList.streamData, streamData);
    };

    private onAuroraEvent = (auroraEvent: AuroraEvent): void => {
        this.emit(AuroraEventList.auroraEvent, auroraEvent);
    };

    private onAuroraError = (error: unknown): void => {
        this.emit(AuroraEventList.auroraError, error);
    };
}

const AuroraEventIds = AuroraConstants.EventIds;
const AuroraEventOutputIds = AuroraConstants.EventOutputIds;
const AuroraLogTypeIds = AuroraConstants.LogTypeIds;
const AuroraStreamIds = AuroraConstants.StreamIds;
const AuroraStreamOutputIds = AuroraConstants.StreamOutputIds;

export {
    Aurora,
    AuroraConstants,
    AuroraEventIds,
    AuroraEventList,
    AuroraEventOutputIds,
    AuroraLogTypeIds,
    AuroraStreamIds,
    AuroraStreamOutputIds,
};

export default new Aurora();
