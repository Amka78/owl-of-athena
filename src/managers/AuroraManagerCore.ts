//#region Import Modules
import { EventEmitter } from "events";
import type { AudioPlayer } from "expo-audio";
import {
    cloneDeep,
    isEmpty,
    maxBy,
    meanBy,
    minBy,
    remove,
    sortBy,
    sortedIndexBy,
    sumBy,
} from "lodash";
import { Platform } from "react-native";

import { FirmwareRestClientInstance, SessionRestClientInstance } from "../clients";
import { AuroraInstance, SleepStates } from "../sdk";
import {
    CommandNames,
    ConnectionStates,
    EventIds,
    EventIdsToNames,
    LOW_BATTERY_THRESHOLD,
    SleepStatesToNames,
} from "../sdk/AuroraConstants";
import { AuroraEventList } from "../sdk/AuroraEventList";
import AuroraSessionReader from "../sdk/AuroraSessionReader";
import type {
    AuroraEventJson,
    AuroraProfile,
    AuroraEvent as AuroraSDKEvent,
    AuroraSessionCSV,
    CommandResult,
    DirectoryInfo,
    FileInfo,
    SongValue,
    StimLedValue,
} from "../sdk/AuroraTypes";
import {
    AuroraEvent,
    type AuroraOSInfo,
    AuroraSession,
    AuroraSessionDetail,
    Profile,
    type Settings,
} from "../sdk/models";
import { firmwareFlashType, selectFirmwareUpdate } from "../services/FirmwareService";
import type {
    AuroraSound,
    FirmwareDownloadProgress,
    FirmwareUpdate,
    FirmwareUpdatePhase,
} from "../types";
import { AuroraManagerEventList } from "./AuroraManagerEventList";
import AlarmAudioInstance from "./alarm/AlarmAudio";
import AlarmKeepAliveInstance from "./alarm/AlarmKeepAlive";
import AlarmRuntimeInstance, { AlarmRuntimeEventList } from "./alarm/AlarmRuntime";
import { nextAlarmEpochMs } from "./alarm/AlarmScheduler";
import type { SessionSyncProgress, SessionSyncResult } from "./SessionSyncResult";

//#endregion

/** 中身が空のセッションはサーバへ送らず端末から削除する。 */
const isSessionContentEmpty = (content?: string): boolean => (content ?? "").trim().length === 0;

export class AuroraManager extends EventEmitter {
    private connected: boolean;
    private currentSleepState: SleepStates;
    private osInfo?: AuroraOSInfo;
    private batteryLevel: number;
    private alarmSound?: AudioPlayer;
    private remStimSound?: AudioPlayer;
    private currentProfile?: string;

    private soundList?: Array<AuroraSound>;
    constructor() {
        super();
        this.connected = false;
        this.currentSleepState = SleepStates.INIT;
        this.batteryLevel = 0;

        AuroraInstance.on(AuroraEventList.auroraEvent, this.onEvent);
        AuroraInstance.on(
            AuroraEventList.bluetoothConnectionChange,
            this.onBluetoothConnectionChange,
        );

        AlarmRuntimeInstance.setPlayer({
            play: (soundFileName, volume) => this.playAlarmSound(soundFileName, volume),
            stop: () => AlarmAudioInstance.stop(),
        });
        AlarmRuntimeInstance.on(AlarmRuntimeEventList.onDismissed, this.onAlarmDismissed);
    }

    public setAuroraSound(soundList: Array<AuroraSound>): void {
        this.soundList = soundList;
    }

    public isConnected(): boolean {
        return this.connected;
    }

    public isConfiguring(): boolean {
        return this.currentSleepState === SleepStates.CONFIGURING;
    }

    public getBatteryLevel(): number {
        return this.batteryLevel;
    }

    /** 電池残量が不明（0）のときは false。 */
    public isBatteryLow(): boolean {
        return this.batteryLevel > 0 && this.batteryLevel < LOW_BATTERY_THRESHOLD;
    }

    /** 端末の電源を落とす。起床時に電池が少ない場合に呼ぶ。 */
    public async shutdown(): Promise<void> {
        await AuroraInstance.queueCmd("os-shutdown");
    }

    /** 接続中の端末に適用できる新しいファームウェアがあるか調べる。 */
    public async getFirmwareUpdate(): Promise<FirmwareUpdate | undefined> {
        if (this.osInfo === undefined) return undefined;

        const release = await FirmwareRestClientInstance.getLatest();
        if (release === undefined) return undefined;

        return selectFirmwareUpdate(
            {
                app: this.osInfo.version,
                bootloader: this.osInfo.bootloaderVersion,
                ble: this.osInfo.bleVersion,
            },
            release,
            (hexPath) => FirmwareRestClientInstance.getHexUrl(hexPath),
        );
    }

    /**
     * ファームウェアを書き込む。書き込み中は接続が切れるため、
     * 睡眠セッション中は実行しない。
     */
    public async flashFirmware(
        update: FirmwareUpdate,
        onPhase?: (phase: FirmwareUpdatePhase) => void,
        onDownloadProgress?: (progress: FirmwareDownloadProgress) => void,
    ): Promise<AuroraOSInfo> {
        if (this.currentSleepState === SleepStates.SLEEPING) {
            throw new Error("Cannot flash firmware while a sleep session is running.");
        }

        const onFlashConnectionChange = (info: AuroraOSInfo | false): void => {
            if (info) onPhase?.("verifying");
        };
        AuroraInstance.on(AuroraEventList.flashConnectionChange, onFlashConnectionChange);

        try {
            const flashed = (await AuroraInstance.flashFile(
                update.url,
                update.version,
                firmwareFlashType(update),
                onPhase,
                onDownloadProgress,
            )) as AuroraOSInfo;
            if (flashed !== undefined) {
                this.osInfo = flashed;
            }
            await this.setupAurora();
            return this.osInfo!;
        } finally {
            AuroraInstance.removeListener(
                AuroraEventList.flashConnectionChange,
                onFlashConnectionChange,
            );
        }
    }

    public async connect(): Promise<AuroraOSInfo | void> {
        try {
            console.debug("Start connection to aurora.");
            this.osInfo = await AuroraInstance.connectBluetooth();
            await this.setupAurora();
            this.connected = true;
            return this.osInfo;
        } catch (e) {
            this.connected = false;
            console.error(e);
            throw e;
        }
    }

    public async disconnect(): Promise<void> {
        await AuroraInstance.disconnectBluetooth();

        this.connected = false;
        this.setSleepState(SleepStates.CONFIGURING);
    }

    public async executeCommand(command: string): Promise<unknown> {
        return await AuroraInstance.queueCmd(command);
    }

    /** プロフィール編集中のプレビュー用。未接続時は何もしない。 */
    public async playLedEffect(effect: StimLedValue): Promise<void> {
        if (!this.isConnected()) return;
        // プレビューが止まらなくならないよう、停止までの時間を 3 秒に固定する。
        await AuroraInstance.playLedEffect({ ...effect, shutoffDelay: 3 });
    }

    /** プロフィール編集中のプレビュー用。未接続時は何もしない。 */
    public async playBuzzSong(song: SongValue): Promise<void> {
        if (!this.isConnected()) return;
        // 試聴なので 1 回だけ再生する。
        await AuroraInstance.playBuzzSong({ ...song, repeat: 1 });
    }

    /** Wrap a promise with a timeout so BLE commands cannot hang forever. */
    private withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const timer = setTimeout(
                () => reject(new Error(`Timeout: ${label} did not complete within ${ms}ms`)),
                ms,
            );
            promise.then(
                (v) => {
                    clearTimeout(timer);
                    resolve(v);
                },
                (e) => {
                    clearTimeout(timer);
                    reject(e);
                },
            );
        });
    }

    private static readonly CMD_TIMEOUT_MS = 30_000;

    public async goToSleep(profile: AuroraProfile, settings: Settings): Promise<void> {
        const T = AuroraManager.CMD_TIMEOUT_MS;
        try {
            const writingProfile = new Profile(profile.content);

            writingProfile.wakeupTime = this.getMsAfterMidnight(
                settings.alarmHour,
                settings.alarmMinute,
            );
            writingProfile.saEnabled = settings.smartAlarmEnabled;
            writingProfile.stimEnabled = settings.remStimEnabled;
            writingProfile.dslEnabled = settings.dslEnabled;

            if (this.soundList) {
                if (settings.alarmAudioPath) {
                    this.alarmSound = this.soundList.find((value: AuroraSound) => {
                        return value.fileName === settings.alarmAudioPath;
                    })?.sound;
                }

                if (settings.remStimAudioPath) {
                    this.remStimSound = this.soundList.find((value: AuroraSound) => {
                        return value.fileName === settings.remStimAudioPath;
                    })?.sound;
                }
            }

            console.debug("[goToSleep] prof-unload");
            await this.withTimeout(AuroraInstance.queueCmd("prof-unload"), T, "prof-unload");

            try {
                console.debug("[goToSleep] readFile profiles/default.prof");
                const readProfileResult = await this.withTimeout(
                    AuroraInstance.readFile("profiles/default.prof", false, false),
                    T,
                    "readFile",
                );
                if (!readProfileResult.error) {
                    console.debug("[goToSleep] sd-rename");
                    await this.withTimeout(
                        AuroraInstance.queueCmd(
                            `sd-rename profiles/default.prof profiles/default-bk-${Date.now()}.prof`,
                        ),
                        T,
                        "sd-rename",
                    );
                }
            } catch (e) {
                console.debug("[goToSleep] readFile/rename error (non-fatal):", e);
            } finally {
                console.debug("[goToSleep] writeFile profiles/default.prof");
                await this.withTimeout(
                    AuroraInstance.writeFile(
                        "profiles/default.prof",
                        writingProfile.raw,
                        false,
                        this.osInfo!.version,
                    ),
                    T,
                    "writeFile",
                );
            }

            /*:TODO I don't know why, but the session will not be recorded 
                unless the default.prof is read, so it is fixed at default.prof.
            */
            /*this.currentProfile = writeFileResult.response?.file.replace(
                "profiles/",
                ""
            );*/
            this.currentProfile = "default.prof";
            console.debug("[goToSleep] prof-load");
            await this.withTimeout(
                AuroraInstance.queueCmd(`prof-load ${this.currentProfile}`),
                T,
                "prof-load",
            );

            await AlarmRuntimeInstance.arm(
                nextAlarmEpochMs(settings.alarmHour, settings.alarmMinute, Date.now()),
                {
                    soundFileName: settings.alarmAudioPath,
                    volume: settings.alarmVolume,
                },
            );
            await AlarmKeepAliveInstance.acquire("sleeping");
            this.setSleepState(SleepStates.SLEEPING);
        } catch (e) {
            console.error("[goToSleep] error:", e);
            this.setSleepState(SleepStates.INIT);
            this.emit("onError", e);
        }
    }

    public setSleepState(followingSleepState: SleepStates): void {
        console.debug(
            `SleepState Change ${
                SleepStatesToNames[this.currentSleepState]
            } to ${SleepStatesToNames[followingSleepState]} when ${new Date(
                Date.now(),
            ).toLocaleString()}`,
        );
        if (followingSleepState !== this.currentSleepState) {
            this.currentSleepState = followingSleepState;

            switch (this.currentSleepState) {
                case SleepStates.SLEEPING: {
                    console.debug("Start onSleeping.");
                    this.emit(AuroraManagerEventList.onSleeping);
                    break;
                }
                case SleepStates.CONFIGURING: {
                    AlarmAudioInstance.stop();
                    if (this.remStimSound !== undefined) {
                        this.remStimSound.pause();
                    }
                    break;
                }
                case SleepStates.WAKING: {
                    console.debug("start onWaking.");
                    void AlarmRuntimeInstance.ring();
                    this.emit(AuroraManagerEventList.onWaking);
                    break;
                }
                case SleepStates.AWAKE: {
                    void AlarmKeepAliveInstance.release();
                    void AlarmRuntimeInstance.dismiss();
                    this.emit(AuroraManagerEventList.onAwake);
                    this.setSleepState(SleepStates.SYNCING);
                    break;
                }
                case SleepStates.SYNCING: {
                    AuroraInstance.queueCmd(CommandNames.PROF_UNLOAD)
                        .catch((reason: any) => {
                            console.error(reason);
                            this.setSleepState(SleepStates.SYNCING_ERROR);
                        })
                        .then(() => {
                            this.setSleepState(SleepStates.CONFIGURING);
                        });
                }
            }

            this.emit("onSleepStateChange", this.currentSleepState);
        }
    }

    public async getUnsyncedSessions(): Promise<Array<FileInfo>> {
        return await AuroraInstance.getUnsyncedSessions("*@*");
    }

    public async readSessionContent(
        sessions: Array<FileInfo>,
        onProgress?: (completed: number, total: number) => void,
    ): Promise<Map<string, any>> {
        const readSessionContent = new Map<string, any>();

        for (const [index, sessionFileInfo] of sessions.entries()) {
            const result = await AuroraInstance.readFile(sessionFileInfo.file, false, true);

            const dirName = sessionFileInfo.file.replace("/session.txt", "");
            console.debug("Start reading session.");
            const sessionDirReadCmd = await AuroraInstance.queueCmd<
                CommandResult<Array<DirectoryInfo>>
            >(`sd-dir-read ${dirName} 1`);
            const session = await AuroraSessionReader.read(
                dirName,
                result.output,
                sessionDirReadCmd.response,
            );
            readSessionContent.set(sessionFileInfo.file, session);
            onProgress?.(index + 1, sessions.length);
        }

        return readSessionContent;
    }

    public async pushSessions(
        sessions: Array<FileInfo>,
        guestLogin: boolean,
        onProgress?: (progress: SessionSyncProgress) => void,
    ): Promise<SessionSyncResult> {
        const sessionList = await this.readSessionContent(sessions, (completed, total) => {
            onProgress?.({ phase: "reading", completed, total });
        });

        const result: SessionSyncResult = {
            sessions: [],
            sessionDetails: [],
            syncedCount: 0,
            failedCount: 0,
            removedEmptyCount: 0,
        };

        let processed = 0;
        for (const value of sessionList) {
            const sessionInfo = value[1];
            try {
                if (isSessionContentEmpty(sessionInfo.content)) {
                    await AuroraInstance.queueCmd(`sd-dir-del sessions/${sessionInfo.name}`);
                    result.removedEmptyCount += 1;
                    continue;
                }

                const uploadSession: AuroraSessionCSV = {
                    ...sessionInfo,
                };
                uploadSession.app_version = this.osInfo!.version;
                uploadSession.app_platform = Platform.OS;
                uploadSession.session_txt = sessionInfo.content;

                const newSession = await this.uploadSession(uploadSession, guestLogin);
                if (newSession === undefined) {
                    // サーバに既に存在し、端末側のリネームも不要なセッション
                    result.syncedCount += 1;
                    continue;
                }

                if (newSession.id !== sessionInfo.name) {
                    await AuroraInstance.queueCmd(
                        `sd-rename sessions/${sessionInfo.name} sessions/${newSession.id}`,
                    );
                }

                result.sessions.push(newSession);
                result.sessionDetails.push(this.createSessionDetail(newSession, uploadSession));
                result.syncedCount += 1;
            } catch (e) {
                // 失敗したセッションは端末に残し、次回の同期で再試行する
                console.error(`[pushSessions] failed to sync ${sessionInfo.name}:`, e);
                result.failedCount += 1;
            } finally {
                processed += 1;
                onProgress?.({
                    phase: "uploading",
                    completed: processed,
                    total: sessionList.size,
                    fileName: sessionInfo.name,
                });
            }
        }

        return result;
    }

    /**
     * ゲストはローカル生成、通常ユーザーはサーバへ送信する。
     * 既にサーバへ送信済みのセッションは何もせず undefined を返す。
     */
    private async uploadSession(
        uploadSession: AuroraSessionCSV,
        guestLogin: boolean,
    ): Promise<AuroraSession | undefined> {
        if (guestLogin) {
            const guestSession = new AuroraSession(uploadSession);
            guestSession.id = uploadSession.name.replace("@", "-");
            return guestSession;
        }

        if (uploadSession.name.indexOf("@") !== -1) {
            return await SessionRestClientInstance.create(uploadSession);
        }

        const existingSession = await SessionRestClientInstance.getById(uploadSession.name).catch(
            () => undefined,
        );
        return existingSession ?? (await SessionRestClientInstance.create(uploadSession));
    }

    private createSessionDetail(
        session: AuroraSession,
        uploadSession: AuroraSessionCSV,
    ): AuroraSessionDetail {
        return new AuroraSessionDetail(
            session.id,
            uploadSession.streams as any,
            this.aggregateSessionDetail(
                cloneDeep(uploadSession.events),
                [0, 15, 30, 45, 60],
                "sum",
            ),
            this.aggregateSessionDetail(
                cloneDeep(uploadSession.events),
                [0, 15, 30, 45, 60],
                "sum",
            ),
            this.aggregateSessionDetail(
                cloneDeep(uploadSession.events),
                [0, 5, 10, 15, 20],
                "average",
            ),
            this.aggregateSessionDetail(
                cloneDeep(uploadSession.events),
                [0, 5, 10, 15, 20, 25],
                "duration",
            ),
            this.aggregateSessionDetail(
                cloneDeep(uploadSession.events),
                [0, 15, 30, 45, 60],
                "count",
            ),
        );
    }

    private aggregateSessionDetail(
        events: Array<AuroraEventJson>,
        bins: Array<number>,
        groupByType: string,
    ): Array<AuroraEvent> {
        /*const eventsInBins: Array<{
            event: AuroraEventJson;
            eventIndex: number;
        }>[][] = [];*/
        const eventsInBins: any = bins.map(() => ({}));

        events.forEach((event: AuroraEventJson, eventIndex: number) => {
            events[eventIndex].bins = [];

            bins.forEach((bin: number, binIndex: number) => {
                if (!bin) return;

                const eventBinIndex = Math.floor(event.time / 1000 / 60 / bin);

                if (!Array.isArray(eventsInBins[binIndex][eventBinIndex])) {
                    eventsInBins[binIndex][eventBinIndex] = [];
                }

                eventsInBins[binIndex][eventBinIndex].push({
                    event,
                    eventIndex,
                });
            });

            if (groupByType === "count") {
                event.flags = 1;
            }
        });

        let groupBy: any;
        switch (groupByType) {
            case "mode":
                groupBy = this.modeBy;
                break;
            case "min":
                groupBy = minBy;
                break;
            case "max":
                groupBy = maxBy;
                break;

            case "count":
            case "sum":
                groupBy = sumBy;
                break;

            default:
                groupBy = meanBy;
        }

        eventsInBins.forEach(
            (
                eventsInBin: Record<string, { event: AuroraEventJson; eventIndex: number }[]>,
                binIndex: number,
            ) => {
                for (const binOfEvents of Object.values(eventsInBin)) {
                    const sortedEvents = sortBy(binOfEvents, ({ event }) => event.time);

                    //special case
                    if (groupByType == "duration") {
                        events[sortedEvents[0].eventIndex].bins[bins[binIndex]] =
                            this.calculateDuration(sortedEvents, bins[binIndex]);
                    } else {
                        const meanTime = meanBy(binOfEvents, ({ event }) => event.time);
                        const sortedEventIndex = sortedIndexBy(
                            sortedEvents,
                            // @ts-expect-error
                            { event: { time: meanTime } },
                            ({ event }) => event.time,
                        );
                        const eventIndex = sortedEvents[sortedEventIndex].eventIndex;
                        events[eventIndex].bins[bins[binIndex]] = groupBy(
                            sortedEvents,
                            ({ event }: { event: any }) => event.flags,
                        );
                    }
                }
            },
        );

        //if we don't need the whole result
        if (!bins.includes(0)) {
            //remove any events that aren't in at least one bin
            remove(events, (event) => isEmpty(event.bins));
        }

        const auroraEvent: AuroraEvent[] = [];

        events.forEach((value: AuroraEventJson) => {
            auroraEvent.push(new AuroraEvent(value));
        });
        return auroraEvent;
    }

    private modeBy(values: any, predicate: any): any {
        const freq: any = {};
        let mode = null;

        for (const val of values) {
            const v = predicate(val);

            freq[v] = (freq[v] || 0) + 1;

            if (!freq[mode] || freq[v] > freq[mode]) {
                mode = v;
            }
        }

        return mode;
    }

    private calculateDuration(
        events: Array<{ event: AuroraEventJson; eventIndex: number }>,
        binDuration: number,
    ) {
        let totalDuration = 0;
        let maxDuration = 0;
        let maxFlags = events[0].event.flags;
        const totalDurations: number[] = [];

        if (events.length == 1) {
            return maxFlags;
        }

        if (events.length == 2) {
            return events[1].event.flags;
        }

        for (let i = 1; i < events.length; i++) {
            const lastEventDuration = events[i].event.time - events[i - 1].event.time;
            const lastEventFlags = events[i - 1].event.flags;

            totalDurations[lastEventFlags] =
                (typeof totalDurations[lastEventFlags] == "undefined"
                    ? 0
                    : totalDurations[lastEventFlags]) + lastEventDuration;
            totalDuration += lastEventDuration;

            if (totalDurations[lastEventFlags] > maxDuration) {
                maxDuration = totalDurations[lastEventFlags];
                maxFlags = lastEventFlags;
            }
        }

        const lastEventFlags = events[events.length - 1].event.flags;
        totalDurations[lastEventFlags] =
            (typeof totalDurations[lastEventFlags] == "undefined"
                ? 0
                : totalDurations[lastEventFlags]) +
            binDuration * 60 * 1000 -
            totalDuration;

        return totalDurations[lastEventFlags] > maxDuration ? lastEventFlags : maxFlags;
    }

    private getMsAfterMidnight(alarmHour: number, alarmMinute: number): number {
        const msAfterMidNight = alarmHour * 60 * 60 * 1000 + alarmMinute * 60 * 1000;
        console.debug(msAfterMidNight);
        return msAfterMidNight;
    }

    private async playAlarmSound(soundFileName?: string, volume?: number): Promise<void> {
        const sound = this.findAlarmSound(soundFileName);
        if (sound === undefined) {
            console.warn("[AuroraManager] no alarm sound is available to play.");
            return;
        }
        await AlarmAudioInstance.playLoop(sound, volume);
    }

    private findAlarmSound(soundFileName?: string): AudioPlayer | undefined {
        if (soundFileName !== undefined && this.soundList !== undefined) {
            const matched = this.soundList.find((value) => value.fileName === soundFileName);
            if (matched !== undefined) {
                return matched.sound;
            }
        }
        return this.alarmSound;
    }

    private onAlarmDismissed = (): void => {
        this.setSleepState(SleepStates.AWAKE);
    };

    private async setupAurora(): Promise<void> {
        this.batteryLevel = this.osInfo!.batteryLevel;

        //a crash (in which case no profile would be loaded) or
        //the aurora service restarting after kill (in which case
        //aurora should still be running profile)
        if (this.currentSleepState == SleepStates.SLEEPING) {
            //is this after android restarted the aurora fg service?
            if (this.osInfo!.profileLoaded) {
                //all we really need to is restart profile
                //since the events will get resubscribed to below
                //and backup alarm should still be running
                await AuroraInstance.queueCmd(`prof-load ${this.currentProfile!}`);
            } else {
                //TODO: make sure backup alarm is still running?
                //aurora
            }
        } else {
            //we could be reconnecting from an unexpected state
            //so reset back to known configuring state
            this.setSleepState(SleepStates.CONFIGURING);
        }

        //enable the events we need, even though we might
        //already be subscribed
        const enableEventList = this.createEventList();
        await AuroraInstance.enableEvents(enableEventList);

        //good as time as any to make sure clock is still in sync with device timeurora
        await AuroraInstance.syncTime();

        await AuroraInstance.queueCmd("log-level-display");
        await AuroraInstance.queueCmd("log-output-display");
    }

    private createEventList(): Array<EventIds> {
        const enableEventList: EventIds[] = [];
        enableEventList.push(EventIds.BUTTON_MONITOR);
        enableEventList.push(EventIds.BATTERY_MONITOR);
        enableEventList.push(EventIds.SMART_ALARM);
        enableEventList.push(EventIds.CLOCK_ALARM_FIRE);
        enableEventList.push(EventIds.STIM_PRESENTED);
        return enableEventList;
    }

    private onEvent = (event: AuroraSDKEvent): void => {
        console.debug("Aurora Event: %s", event.eventId);
        console.debug("Aurora Event Name:", EventIdsToNames[event.eventId]);

        switch (event.eventId) {
            case EventIds.BATTERY_MONITOR: {
                this.batteryLevel = event.flags;
                this.emit(AuroraManagerEventList.onBatteryChange, this.batteryLevel);
                break;
            }
            case EventIds.BUTTON_MONITOR: {
                if (event.flags == 1 && this.currentSleepState === SleepStates.WAKING) {
                    this.setSleepState(SleepStates.AWAKE);
                }
                break;
            }
            case EventIds.CLOCK_ALARM_FIRE:
            case EventIds.SMART_ALARM: {
                console.debug("Current SleepState:", this.currentSleepState);
                if (this.currentSleepState === SleepStates.SLEEPING) {
                    console.debug("Execute Smart Alarm Event.");
                    this.setSleepState(SleepStates.WAKING);
                }
                break;
            }
            case EventIds.STIM_PRESENTED: {
                if (this.currentSleepState === SleepStates.SLEEPING) {
                    if (this.remStimSound !== undefined) {
                        void this.remStimSound.seekTo(0).then(() => {
                            this.remStimSound?.play();
                        });
                    }
                }
            }
        }
    };

    private onBluetoothConnectionChange = (connectionState: ConnectionStates): void => {
        this.emit(AuroraManagerEventList.onConnectionChange, connectionState);
        void this.handleAlarmConnectionChange(connectionState);
    };

    /**
     * 睡眠中に Bluetooth が切れてもアラームは鳴らし続ける必要があるため、
     * 無音ループでアプリを生かしたままスマホ側の締切に任せる。
     */
    private async handleAlarmConnectionChange(connectionState: ConnectionStates): Promise<void> {
        if (AlarmRuntimeInstance.getState().phase === "idle") {
            await AlarmKeepAliveInstance.release();
            return;
        }

        if (connectionState === ConnectionStates.DISCONNECTED) {
            console.debug(
                "[AuroraManager] device disconnected while the alarm is armed: the phone alarm takes over.",
            );
            await AlarmKeepAliveInstance.acquire("disconnected-fallback");
            return;
        }

        await AlarmKeepAliveInstance.acquire("sleeping");

        if (
            connectionState === ConnectionStates.CONNECTED &&
            this.currentSleepState === SleepStates.SLEEPING
        ) {
            try {
                await this.setupAurora();
            } catch (e) {
                console.error("[AuroraManager] failed to restore the sleeping session:", e);
            }
        }
    }
}

export default new AuroraManager();
