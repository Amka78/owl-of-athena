import { AuroraUsb } from "./AuroraUsb";
import { AuroraBluetooth } from "./AuroraBluetooth";
import DriveList from "drivelist";
import ejectMedia from "eject-media";
import * as AuroraConstants from "./AuroraConstants";
import { EventEmitter } from "events";
import Stream from "stream";
import { sleep, promisify, versionToString, stringToVersion } from "./util";
//import usbDetect from "usb-detection";
import {
    AuroraResponse,
    CommandResult,
    Command,
    CommandResolverType,
    EventResponse,
} from "./AuroraTypes";
import { AuroraEvent } from "../model/AuroraEvent";
import { isDesktop } from "./Platform";
import AuroraCmdPlayLedEffect from "./AuroraCmdPlayLedEffect";
import AuroraCmdWriteFile from "./AuroraCmdWriteFile";
import AuroraCmdSyncTime from "./AuroraCmdSyncTime";
import AuroraCmdGetSessions from "./AuroraCmdGetSessions";
import { AuroraOSInfo } from "./models/AuroraOSInfo";
import { Event } from "./models/Event";
import _ from "lodash";
import AuroraCmdReadFile from "./AuroraCmdReadFile";
import AuroraCmdDownloadFile from "./AuroraCmdDownloadFile";
import AuroraCmdDownloadStream from "./AuroraCmdDownloadStream";
import AuroraCmdGetProfiles from "./AuroraCmdGetProfiles";
import AuroraCmdSetProfiles from "./AuroraCmdSetProfiles";
import AuroraCmdFlashFile from "./AuroraCmdFlashFile";
import AuroraCmdPlayBuzzSong from "./AuroraCmdPlayBuzzSong";
import AuroraCmdUploadFile from "./AuroraCmdWriteFile";
import AuroraCmdFileInfo from "./AuroraCmdFileInfo";
import AuroraCmdGetUnSyncedSessions from "./AuroraCmdGetUnsyncedSessions";
const MSD_DISCONNECT_RETRY_DELAY_MS = 2000;
const MSD_SCAN_RETRY_DELAY_MS = 2000;
const MSD_CONNECT_DELAY_SEC = 30;

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
enum AuroraEventList {
    usbConnectionChange = "usbConnectionChange",
    bluetoothConnectionChange = "bluetoothConnectionChange",
    cmdBegin = "cmdBegin",
    cmdEnd = "cmdEnd",
    msdAttachmentChange = "msdAttachmentChange",
    flashConnectionChange = "flashConnectionChange",
    cmdInputRequested = "cmdInputRequested",
    cmdOutputReady = "cmdOutputReady",
    log = "log",
    streamData = "streamData",
    auroraEvent = "auroraEvent",
    auroraError = "auroraError",
}
class Aurora extends EventEmitter {
    private auroraUsb: AuroraUsb;
    private bluetooth: AuroraBluetooth;
    private cmdQueue: Command[];
    private cmdCurrent?: Command;
    private msdDrive: boolean;
    private isFlashing: boolean;
    private info?: AuroraOSInfo;
    private isAutoConnectUsb: boolean;
    private isAutoConnectBluetooth: boolean;
    private msdAttaching: boolean;
    private enabledEventList: Array<AuroraConstants.EventIds>;
    constructor() {
        super();

        this.msdAttaching = false;

        this.auroraUsb = new AuroraUsb();
        this.auroraUsb.on(
            AuroraConstants.DeviceEventList.connectionStateChange,
            this.onUsbConnectionStateChange
        );
        this.auroraUsb.on("usbError", this.onAuroraError);
        this.auroraUsb.on("log", this.onAuroraLog);
        this.auroraUsb.on(
            AuroraConstants.DeviceEventList.streamData,
            this.onAuroraStreamData
        );
        this.auroraUsb.on(
            AuroraConstants.DeviceEventList.auroraEvent,
            this.onAuroraEvent
        );
        this.auroraUsb.on(
            AuroraConstants.DeviceEventList.cmdInputRequested,
            this.onCmdInputRequested
        );
        this.auroraUsb.on(
            AuroraConstants.DeviceEventList.cmdOutputReady,
            this.onCmdOutputReady
        );
        this.bluetooth = new AuroraBluetooth();
        this.bluetooth.on(
            AuroraConstants.DeviceEventList.connectionStateChange,
            this.onBluetoothConnectionStateChange
        );
        this.bluetooth.on(
            AuroraConstants.DeviceEventList.Error,
            this.onAuroraError
        );
        this.bluetooth.on(
            AuroraConstants.DeviceEventList.streamData,
            this.onAuroraStreamData
        );
        this.bluetooth.on(
            AuroraConstants.DeviceEventList.auroraEvent,
            this.onAuroraEvent
        );
        this.bluetooth.on(
            AuroraConstants.DeviceEventList.cmdInputRequested,
            this.onCmdInputRequested
        );
        this.bluetooth.on(
            AuroraConstants.DeviceEventList.cmdOutputReady,
            this.onCmdOutputReady
        );

        this.cmdQueue = new Array<Command>();

        this.isAutoConnectUsb = false;
        this.isAutoConnectBluetooth = false;
        this.msdDrive = false;
        this.isFlashing = false;
        this.info = undefined;
        this.enabledEventList = new Array<AuroraConstants.EventIds>();

        //this scans for MSD disks that could potentially be the Aurora
        // @ts-ignore
        //this.findMsdDrive().then(this.msdSetAttached, true);

        this.watchUsb();
    }

    public isConnected(): boolean {
        return this.isUsbConnected() || this.isBluetoothConnected();
    }

    public isUsbConnected(): boolean {
        return this.auroraUsb.isConnected();
    }

    public isBluetoothConnected(): boolean {
        return this.bluetooth.isConnected();
    }

    public isMsdAttached(): boolean {
        return !!this.msdDrive;
    }

    public executeUsbAutoConnection(): void {
        this.isAutoConnectUsb = true;

        if (!this.auroraUsb.isConnected() && !this.auroraUsb.isConnecting()) {
            this.auroraUsb.connect().catch(undefined);
        }
    }

    public async executeBluetoothAutoConnection(): Promise<void | never> {
        this.isAutoConnectBluetooth = true;

        if (!this.bluetooth.isConnected() && !this.bluetooth.isConnecting()) {
            await this.bluetooth.connect(0);
        }
    }

    public async connectUsb(
        port = "detect",
        retryCount = 3
    ): Promise<never | unknown> {
        if (this.auroraUsb.isConnected()) {
            return Promise.reject("Already connected over usb.");
        } else if (this.auroraUsb.isConnecting()) {
            return Promise.reject("Already connecting over usb.");
        }

        return new Promise((resolve, reject) => {
            this.once("usbConnectionChange", (fwInfo) => {
                if (!fwInfo) return reject();

                resolve(fwInfo);
            });

            this.detachMsd()
                .then(() => this.auroraUsb.connect(port, retryCount))
                .catch(reject);
        });
    }

    public async disconnectUsb(): Promise<unknown | never> {
        this.isAutoConnectUsb = false;

        if (!this.auroraUsb.isConnected() && !this.auroraUsb.isConnecting()) {
            return;
        }

        return this.auroraUsb.disconnect();
    }

    public async connectBluetooth(
        timeoutMs = 20000
    ): Promise<AuroraOSInfo | never> {
        if (this.bluetooth.isConnected()) {
            return Promise.reject("Already connected over bluetooth.");
        }

        //is USB is already connected, lets signal to
        //the Aurora to start advertising aggressively
        if (this.isUsbConnected()) {
            await this.queueCmd(
                "ble-reset",
                AuroraConstants.ConnectorTypes.USB
            );
        }

        if (this.bluetooth.isConnecting()) {
            return Promise.reject("Already connecting over bluetooth.");
        }

        return new Promise((resolve, reject) => {
            this.once("bluetoothConnectionChange", (fwInfo) => {
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

    public async attachMsd(): Promise<unknown | never> {
        if (!this.isConnected()) {
            return Promise.reject("Must have a connection first.");
        }

        if (this.isMsdAttached()) {
            return Promise.reject("MSD mode already attached.");
        } else if (this.msdAttaching) {
            return Promise.reject("Already attaching MSD.");
        }

        this.msdAttaching = true;

        try {
            await this.queueCmd("usb-mode 2");
        } catch (error) {
            this.msdAttaching = false;

            return Promise.reject("Failed enabling MSD mode: " + error);
        }

        //sleep one second at a time, checking
        //for a connection
        for (let i = 0; i < MSD_CONNECT_DELAY_SEC; i++) {
            await sleep(1000);

            //if we are connected we can return!!
            if (this.msdDrive) return this.msdDrive;
        }

        this.msdAttaching = false;

        return Promise.reject("Timeout waiting for Aurora MSD drive to mount.");
    }

    public async detachMsd(retryCount = 5): Promise<unknown> {
        if (!this.msdDrive) {
            return;
        }

        //we do this just in case things are moving too fast...
        await sleep(1500);

        if (!this.msdDrive) {
            return;
        }

        return promisify(
            ejectMedia.eject,
            ejectMedia
        )(this.msdDrive)
            .then(() => {
                //we go ahead and mark the drive as removed in case
                //the event hasn't fired yet.
                this.msdSetDetached();
            })
            .catch(async () => {
                if (retryCount) {
                    await sleep(MSD_DISCONNECT_RETRY_DELAY_MS);

                    if (!this.msdDrive) {
                        this.msdSetDetached();

                        return Promise.resolve();
                    }

                    return this.detachMsd(retryCount - 1);
                }

                //check if drive is not actually present
                //in case we missed the disconnect event somehow
                return this.findMsdDrive().then(
                    (msdDrive: unknown): Promise<void> => {
                        if (msdDrive)
                            return Promise.reject(
                                "Failed disconnecting from MSD"
                            );

                        this.msdSetDetached();

                        return Promise.resolve();
                    }
                );
            });
    }

    public async flash(
        fwFile: string,
        fwVersion: number | false = false,
        fwType = "app"
    ): Promise<unknown> {
        if (this.isFlashing) return Promise.reject("Already flashing.");

        if (!this.isConnected())
            return Promise.reject("Must be connected to perform flash.");

        //remember whether auto connect was on before flash
        //since we are going to secretly turn auto connect on now
        const wasUsbAutoConnectOff = !this.isAutoConnectUsb;
        const wasBluetoothAutoConnectOff = !this.isAutoConnectBluetooth;
        const wasUsbConnected = this.isUsbConnected();
        const wasBluetoothConnected = this.isBluetoothConnected();

        if (this.isUsbConnected()) {
            this.isAutoConnectUsb = true;
        }

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
                let onFlashConnectionChange: (
                    fwInfo: AuroraOSInfo
                ) => void | undefined;
                // eslint-disable-next-line prefer-const
                let flashTimeout: NodeJS.Timeout | undefined;

                const finish = (): void => {
                    if (wasUsbAutoConnectOff && this.isAutoConnectUsb) {
                        this.isAutoConnectUsb = false;
                    }

                    if (
                        wasBluetoothAutoConnectOff &&
                        this.isAutoConnectBluetooth
                    ) {
                        this.isAutoConnectBluetooth = false;
                    }

                    this.isFlashing = false;

                    clearTimeout(flashTimeout!);

                    this.removeListener(
                        AuroraEventList.flashConnectionChange,
                        onFlashConnectionChange
                    );

                    if (wasUsbConnected && !this.isUsbConnected()) {
                        this.emit(AuroraEventList.usbConnectionChange, false);
                    }

                    if (wasBluetoothConnected && !this.isBluetoothConnected()) {
                        setTimeout(() => {
                            if (!this.isBluetoothConnected()) {
                                this.emit(
                                    AuroraEventList.bluetoothConnectionChange,
                                    false
                                );
                            }
                        }, 3000);
                    }
                };

                onFlashConnectionChange = (fwInfo: AuroraOSInfo): void => {
                    if (fwInfo) {
                        finish();

                        const version =
                            fwType == "bootloader" ||
                            fwType == "bootloader-and-bootstrap"
                                ? fwInfo.bootloaderVersion
                                : fwType == "ble"
                                ? fwInfo.bleVersion
                                : fwInfo.version;

                        if (!fwVersion || version === fwVersion) {
                            resolve(fwInfo);
                        } else {
                            reject(
                                `Flash failed. Expected ${fwType} version ${versionToString(
                                    fwVersion
                                )} but have ${versionToString(version!)}.`
                            );
                        }
                    }
                };

                this.on("flashConnectionChange", onFlashConnectionChange);

                flashTimeout = setTimeout(() => {
                    finish();
                    reject(
                        "Unable to verify flash. Timeout waiting for reconnection."
                    );
                }, 50000);
            });
        });
    }

    public async queueCmd<T>(
        commandStr: string,
        connectorType = AuroraConstants.ConnectorTypes.ANY,
        onCmdBegin = undefined,
        onCmdEnd = undefined
    ): Promise<T> {
        if (!this.getConnector(connectorType).isConnected()) {
            return Promise.reject(
                `Not connected to Aurora over ${
                    connectorType == "any" ? "usb or bluetooth" : connectorType
                }.`
            );
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
        enableEvent: AuroraConstants.EventIds[]
    ): Promise<CommandResult<EventResponse>> {
        this.enabledEventList.concat(enableEvent);

        this.enabledEventList = _.concat(this.enabledEventList, enableEvent);
        const mask = Event.toMask(enableEvent);

        return await this.queueCmd(
            `${AuroraConstants.CommandNames.EVENT_OUTPUT_ENABLE}${mask} ${16}`
        );
    }

    public async disableEvents(
        disableEvent: AuroraConstants.EventIds[]
    ): Promise<void> {
        this.enabledEventList = _.pullAll(this.enabledEventList, disableEvent);

        const mask = Event.toMask(disableEvent);

        return await this.queueCmd(
            `${AuroraConstants.CommandNames.EVENT_OUTPUT_DISABLE}${mask} ${16}`
        );
    }

    //this command is really only useful to reconcile differences between
    //the old version of os-info and new ones
    //TODO: remove once all in-field units are upgraded to firmware >= 2.1.0
    private async getOsInfo(
        connectorType: AuroraConstants.ConnectorTypes
    ): Promise<unknown> {
        return await this.queueCmd("os-info 1", connectorType)
            .catch((cmdWithResponse) => {
                //if the "too many arguments" error, then we'll reissue the command without params
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
                        cmdWithResponse.response.version
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

        this.cmdCurrent.connector = this.getConnector(
            this.cmdCurrent.connectorType!
        );

        if (!this.cmdCurrent.connector.isConnected()) {
            this.cmdCurrent.reject!(
                `No longer connected to Aurora over ${
                    this.cmdCurrent.connectorType == "any"
                        ? "usb or bluetooth"
                        : this.cmdCurrent.connectorType
                }.`
            );
            return;
        }

        const [command, ...args] = this.cmdCurrent.commandStr!.split(" ");

        this.cmdCurrent.inputStream = new Stream.Writable();
        this.cmdCurrent.inputStream._write = (data, _encoding, done): void => {
            // @ts-ignore
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
            // @ts-ignore
            .then(
                // @ts-ignore
                (cmdWithResponse: AuroraResponse): CommandResult => {
                    cmd.endTime = Date.now();
                    cmd.origin = cmdWithResponse.origin;
                    cmd.error = cmdWithResponse.error;
                    cmd.response = cmdWithResponse.response;

                    return cmd;
                }
            )
            .catch(
                (error: string): CommandResult<unknown> => {
                    cmd.origin =
                        this.cmdCurrent!.connectorType ==
                        AuroraConstants.ConnectorTypes.ANY
                            ? "unknown"
                            : this.cmdCurrent!.connectorType;
                    cmd.error = true;
                    cmd.response = {
                        error: -99,
                        message: `Fatal error: ${error}`,
                    };
                    this.cmdQueue = [];

                    return cmd;
                }
            )
            .then(
                async (cmd: CommandResult<unknown>): Promise<void> => {
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

                    //todo this shouldn't be necessary!!
                    //figure out WTF is going on
                    setTimeout(() => {
                        this.cmdCurrent = undefined;
                        this.processCmdQueue();
                    }, 200);
                }
            );
    }

    private getConnector(
        connectorType: AuroraConstants.ConnectorTypes
    ): AuroraBluetooth | AuroraUsb {
        switch (connectorType) {
            case AuroraConstants.ConnectorTypes.USB:
                return this.auroraUsb;

            case AuroraConstants.ConnectorTypes.BLUETOOTH:
                return this.bluetooth;

            case AuroraConstants.ConnectorTypes.ANY:
            default:
                return this.auroraUsb.isConnected()
                    ? this.auroraUsb
                    : this.bluetooth;
        }
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

    public get getUsyncedSessions(): GetUnsyncedSessions {
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

    public async findMsdDrive(
        retryCount = 0,
        successOnFound = true
    ): Promise<any> {
        return promisify(DriveList.list, DriveList)().then(
            async (drives: any): Promise<unknown> => {
                const drive = drives.find(
                    (drive: { description: string }) =>
                        drive.description == AuroraConstants.MSD_DRIVE_NAME
                );

                if (
                    !drive ||
                    !drive.mountpoints.length ||
                    !drive.mountpoints[0].path
                ) {
                    if (!retryCount || !successOnFound) {
                        return false;
                    }
                } else if (successOnFound) {
                    return drive.mountpoints[0].path;
                }

                await sleep(MSD_SCAN_RETRY_DELAY_MS);

                return this.findMsdDrive(retryCount - 1, successOnFound);
            }
        );
    }

    private watchUsb = (): void => {
        if (isDesktop) {
            this.unwatchUsb();

            usbDetect.on(
                `add:${parseInt(AuroraConstants.AURORA_USB_VID)}`,
                this.onAuroraUsbAttached
            );
            usbDetect.on(
                `remove:${parseInt(AuroraConstants.AURORA_USB_VID)}`,
                this.onAuroraUsbDetached
            );
        }
    };

    private unwatchUsb = (): void => {
        if (isDesktop) {
            // @ts-ignore
            usbDetect.removeListener(
                `add:${parseInt(AuroraConstants.AURORA_USB_VID)}`,
                this.onAuroraUsbAttached
            );
            // @ts-ignore
            usbDetect.removeListener(
                `remove:${parseInt(AuroraConstants.AURORA_USB_VID)}`,
                this.onAuroraUsbDetached
            );
        }
    };

    private onAuroraUsbAttached = async (device: {
        productId: number;
    }): Promise<void> => {
        if (isDesktop) {
            /*if (
                device.productId ===
                parseInt(AuroraConstants.AURORA_USB_MSD_PID)
            ) {
                // @ts-ignore
                this.findMsdDrive(5).then(this.msdSetAttached, true);
            } else if (
                device.productId ===
                    parseInt(AuroraConstants.AURORA_USB_SERIAL_PID) &&
                this.isAutoConnectUsb
            ) {
                this.executeUsbAutoConnection();
            }*/
        }
    };

    private onAuroraUsbDetached = (device: { productId: number }): void => {
        if (device.productId === parseInt(AuroraConstants.AURORA_USB_MSD_PID)) {
            // @ts-ignore
            this.findMsdDrive(5).then(this.msdSetDetached, false);
        }
    };

    private msdSetAttached = (msdDrive: boolean): void => {
        if (!this.msdDrive && msdDrive) {
            this.msdAttaching = false;
            this.msdDrive = msdDrive;

            this.emit(AuroraEventList.msdAttachmentChange, msdDrive);
        }
    };

    private msdSetDetached = (msdDrive?: unknown): void => {
        if (this.msdDrive && !msdDrive) {
            this.msdDrive = false;

            this.emit(AuroraEventList.msdAttachmentChange, false);
        }
    };

    private onUsbConnectionStateChange = (
        connectionState: AuroraConstants.ConnectionStates,
        previousConnectionState: AuroraConstants.ConnectionStates
    ): void => {
        if (
            connectionState === AuroraConstants.ConnectionStates.IDLE &&
            previousConnectionState ===
                AuroraConstants.ConnectionStates.CONNECTING
        ) {
            this.getOsInfo(AuroraConstants.ConnectorTypes.USB)
                //@ts-ignore
                .then((cmd: CommandResult): void => {
                    this.emit(
                        this.isFlashing
                            ? AuroraEventList.flashConnectionChange
                            : AuroraEventList.usbConnectionChange,
                        cmd.response
                    );
                })
                .catch((error: string): void => {
                    console.debug("Usb Connection Error:", error);
                    this.disconnectUsb();
                });
        } else if (
            connectionState === AuroraConstants.ConnectionStates.DISCONNECTED &&
            previousConnectionState !==
                AuroraConstants.ConnectionStates.CONNECTING
        ) {
            this.emit(
                this.isFlashing
                    ? AuroraEventList.flashConnectionChange
                    : AuroraEventList.usbConnectionChange,
                false
            );
        }
    };

    private onBluetoothConnectionStateChange = async (
        connectionState: AuroraConstants.ConnectionStates,
        previousConnectionState: AuroraConstants.ConnectionStates
    ): Promise<void> => {
        console.debug(
            `BluetoothConnectionStateChange ${
                AuroraConstants.ConnectionStatesToNames[previousConnectionState]
            } to ${
                AuroraConstants.ConnectionStatesToNames[connectionState]
            } when ${new Date(Date.now()).toLocaleString()}`
        );
        if (
            connectionState === AuroraConstants.ConnectionStates.IDLE &&
            previousConnectionState ===
                AuroraConstants.ConnectionStates.CONNECTING
        ) {
            await this.getOsInfo(AuroraConstants.ConnectorTypes.BLUETOOTH)
                .then((cmd: any): void => {
                    console.debug("Start bluetoothConnectionChange:", cmd);
                    this.emit(
                        this.isFlashing
                            ? AuroraEventList.flashConnectionChange
                            : AuroraEventList.bluetoothConnectionChange,
                        cmd.response
                    );
                })
                .catch((error: string): void => {
                    console.debug("Bluetooth Connection Error", error);
                    this.disconnectBluetooth();
                });
        } else if (
            connectionState === AuroraConstants.ConnectionStates.DISCONNECTED &&
            previousConnectionState !==
                AuroraConstants.ConnectionStates.CONNECTING
        ) {
            this.emit(
                this.isFlashing
                    ? AuroraEventList.flashConnectionChange
                    : AuroraEventList.bluetoothConnectionChange,
                false
            );

            if (this.isAutoConnectBluetooth) {
                this.bluetooth.connect(0).catch(() => {
                    return;
                });
            }
        }
    };

    private onCmdInputRequested = (): void => {
        if (!this.cmdCurrent) return;

        this.emit(
            AuroraEventList.cmdInputRequested,
            this.cmdCurrent.inputStream
        );
    };

    private onCmdOutputReady = (output: {
        chunk: unknown;
        encoding?: string;
    }): void => {
        if (!this.cmdCurrent) return;

        this.cmdCurrent.outputStream!.push(output);
    };

    private onAuroraLog = (log: unknown): void => {
        this.emit(AuroraEventList.log, log);
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
    AuroraEventOutputIds,
    AuroraLogTypeIds,
    AuroraStreamIds,
    AuroraStreamOutputIds,
    AuroraEventList,
};

export default new Aurora();
