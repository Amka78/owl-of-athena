//#region Import Modules
import { EventEmitter } from "events";
import { Audio } from "expo-av";
import { Platform } from "react-native";

import { AuroraManagerInstance } from ".";
import { SessionRestClientInstance } from "../clients";
import { AuroraInstance, SleepStates } from "../sdk";
import {
    CommandNames,
    ConnectionStates,
    EventIds,
    EventIdsToNames,
    SleepStatesToNames,
} from "../sdk/AuroraConstants";
import { AuroraEventList } from "../sdk/AuroraEventList";
import AuroraSessionReader from "../sdk/AuroraSessionReader";
import {
    AuroraEventJson,
    AuroraProfile,
    AuroraSessionCSV,
    CommandResult,
    DirectoryInfo,
    FileInfo,
} from "../sdk/AuroraTypes";
import {
    AuroraEvent,
    AuroraOSInfo,
    AuroraSession,
    AuroraSessionDetail,
    Profile,
    Settings,
} from "../sdk/models";
import { AuroraSound } from "../types";
import { AuroraManagerEventList } from "./AuroraManagerEventList";
import {
    cloneDeep,
    meanBy,
    minBy,
    maxBy,
    remove,
    isEmpty,
    sortedIndexBy,
    sumBy,
    sortBy,
} from "lodash";
//#endregion

export class AuroraManager extends EventEmitter {
    private connected: boolean;
    private currentSleepState: SleepStates;
    private osInfo?: AuroraOSInfo;
    private batteryLevel: number;
    private alarmSound?: Audio.Sound;
    private remStimSound?: Audio.Sound;
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
            this.onBluetoothConnectionChange
        );
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

    public async goToSleep(
        profile: AuroraProfile,
        settings: Settings
    ): Promise<void> {
        try {
            if (Platform.OS === "web") {
                let writingProfile;

                if (profile?.content) {
                    writingProfile = new Profile(profile.content);
                } else {
                    const defaultProfileTxt = require("../../assets/profiles/default_profile_content.ttf");
                    console.debug(defaultProfileTxt);
                    const response = await fetch(defaultProfileTxt);
                    console.debug(`response:${response}`);
                    const profileContent = await response.text();

                    console.debug(`profileContent: ${profileContent}`);

                    writingProfile = new Profile(profileContent);
                }

                writingProfile.wakeupTime = this.getMsAfterMidnight(
                    settings.alarmHour,
                    settings.alarmMinute
                );
                writingProfile.saEnabled = settings.smartAlarmEnabled;
                writingProfile.stimEnabled = settings.remStimEnabled;
                writingProfile.dslEnabled = settings.dslEnabled;

                if (this.soundList) {
                    if (settings.alarmAudioPath) {
                        this.alarmSound = this.soundList.find(
                            (value: AuroraSound) => {
                                return (
                                    value.fileName === settings.alarmAudioPath
                                );
                            }
                        )?.sound;
                    }

                    if (settings.remStimAudioPath) {
                        this.remStimSound = this.soundList.find(
                            (value: AuroraSound) => {
                                return (
                                    value.fileName === settings.remStimAudioPath
                                );
                            }
                        )?.sound;
                    }
                }

                await AuroraInstance.queueCmd("prof-unload");
                try {
                    const readProfileResult = await AuroraInstance.readFile(
                        "profiles/default.prof",
                        false,
                        false
                    );
                    if (!readProfileResult.error) {
                        await AuroraInstance.queueCmd(
                            `sd-rename profiles/default.prof profiles/default-bk-${Date.now()}.prof`
                        );
                    }
                } catch (e) {
                    console.debug(e);
                } finally {
                    await AuroraInstance.writeFile(
                        "profiles/default.prof",
                        writingProfile.raw,
                        false,
                        this.osInfo!.version
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
                await AuroraInstance.queueCmd(
                    `prof-load ${this.currentProfile}`
                );
            }
            this.setSleepState(SleepStates.SLEEPING);
        } catch (e) {
            console.log(e);
            this.setSleepState(SleepStates.INIT);
            this.emit("onError", e);
        }
    }

    public setSleepState(followingSleepState: SleepStates): void {
        console.debug(
            `SleepState Change ${
                SleepStatesToNames[this.currentSleepState]
            } to ${SleepStatesToNames[followingSleepState]} when ${new Date(
                Date.now()
            ).toLocaleString()}`
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
                    if (this.alarmSound !== undefined) {
                        this.alarmSound.stopAsync();
                    }
                    if (this.remStimSound !== undefined) {
                        this.remStimSound.stopAsync();
                    }
                    break;
                }
                case SleepStates.WAKING: {
                    console.debug("start onWaking.");
                    if (this.alarmSound !== undefined) {
                        this.alarmSound.setIsLoopingAsync(true).then(() => {
                            this.alarmSound!.playAsync();
                        });
                    }
                    this.emit(AuroraManagerEventList.onWaking);
                    break;
                }
                case SleepStates.AWAKE: {
                    if (this.alarmSound !== undefined) {
                        this.alarmSound.stopAsync();
                    }
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
        sessions: Array<FileInfo>
    ): Promise<Map<string, any>> {
        const readSessionContent = new Map<string, any>();

        for (const sessionFileInfo of sessions) {
            const result = await AuroraInstance.readFile(
                sessionFileInfo.file,
                false,
                true
            );

            const dirName = sessionFileInfo.file.replace("/session.txt", "");
            console.debug("Start reading session.");
            const sessionDirReadCmd = await AuroraInstance.queueCmd<
                CommandResult<Array<DirectoryInfo>>
            >(`sd-dir-read ${dirName} 1`);
            const session = await AuroraSessionReader.read(
                dirName,
                result.output,
                sessionDirReadCmd.response
            );
            readSessionContent.set(sessionFileInfo.file, session);
        }

        return readSessionContent;
    }

    public async pushSessions(
        sessions: Array<FileInfo>,
        guestLogin: boolean
    ): Promise<[Array<AuroraSession>, Array<AuroraSessionDetail>]> {
        const sessionList = await this.readSessionContent(sessions);

        const pushedSessionList = new Array<AuroraSession>();
        const pushedSessionDetailList = new Array<AuroraSessionDetail>();
        for (const value of sessionList) {
            const sessionInfo = value[1];
            const uploadSession: AuroraSessionCSV = {
                ...sessionInfo,
            };
            uploadSession.app_version = this.osInfo!.version;
            uploadSession.app_platform = "win"; //Platform.OS;
            uploadSession.session_txt = sessionInfo.content;

            let newSession: AuroraSession | undefined;

            try {
                if (!guestLogin) {
                    console.debug("guest process called.");
                    if (sessionInfo.name.indexOf("@") == -1) {
                        await SessionRestClientInstance.getById(
                            sessionInfo.name
                        ).catch(async () => {
                            newSession = await SessionRestClientInstance.create(
                                uploadSession
                            );
                        });
                    } else {
                        newSession = await SessionRestClientInstance.create(
                            uploadSession
                        );
                    }
                } else {
                    newSession = new AuroraSession(uploadSession);
                    newSession.id = sessionInfo.name.replace("@", "-");
                }

                console.debug(`uploadSession:${uploadSession}`);
                if (newSession!.id != sessionInfo.name) {
                    await AuroraInstance.queueCmd(
                        `sd-rename sessions/${sessionInfo.name} sessions/${
                            newSession!.id
                        }`
                    );
                }
                pushedSessionList.push(newSession!);

                pushedSessionDetailList.push(
                    new AuroraSessionDetail(
                        newSession!.id,
                        uploadSession.streams as any,
                        this.aggregateSessionDetail(
                            cloneDeep(uploadSession.events),
                            [0, 15, 30, 45, 60],
                            "sum"
                        ),
                        this.aggregateSessionDetail(
                            cloneDeep(uploadSession.events),
                            [0, 15, 30, 45, 60],
                            "sum"
                        ),
                        this.aggregateSessionDetail(
                            cloneDeep(uploadSession.events),
                            [0, 5, 10, 15, 20],
                            "average"
                        ),
                        this.aggregateSessionDetail(
                            cloneDeep(uploadSession.events),
                            [0, 5, 10, 15, 20, 25],
                            "duration"
                        ),
                        this.aggregateSessionDetail(
                            cloneDeep(uploadSession.events),
                            [0, 15, 30, 45, 60],
                            "count"
                        )
                    )
                );
            } catch (e) {
                console.debug(`session parse error:${e}`);
                await AuroraInstance.queueCmd(`sd-dir-del ${sessionInfo[0]}`);
            }
        }
        return [pushedSessionList, pushedSessionDetailList];
    }

    private aggregateSessionDetail(
        events: Array<AuroraEventJson>,
        bins: Array<number>,
        groupByType: string
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

        let groupBy: any = undefined;
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

        eventsInBins.forEach((eventsInBin, binIndex) => {
            for (const binOfEvents of Object.values(eventsInBin)) {
                const sortedEvents = sortBy(
                    binOfEvents,
                    ({ event }) => event.time
                );

                //special case
                if (groupByType == "duration") {
                    events[sortedEvents[0].eventIndex].bins[
                        bins[binIndex]
                    ] = this.calculateDuration(sortedEvents, bins[binIndex]);
                } else {
                    const meanTime = meanBy(
                        binOfEvents,
                        ({ event }) => event.time
                    );
                    const sortedEventIndex = sortedIndexBy(
                        sortedEvents,
                        // @ts-ignore
                        { event: { time: meanTime } },
                        ({ event }) => event.time
                    );
                    const eventIndex =
                        sortedEvents[sortedEventIndex].eventIndex;
                    events[eventIndex].bins[bins[binIndex]] = groupBy(
                        sortedEvents,
                        ({ event }: { event: any }) => event.flags
                    );
                }
            }
        });

        //if we don't need the whole result
        if (!bins.includes(0)) {
            //remove any events that aren't in at least one bin
            remove(events, (event) => isEmpty(event.bins));
        }

        const auroraEvent = new Array<AuroraEvent>();

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
        binDuration: number
    ) {
        let totalDuration = 0;
        let maxDuration = 0;
        let maxFlags = events[0].event.flags;
        const totalDurations = new Array<number>();

        if (events.length == 1) {
            return maxFlags;
        }

        if (events.length == 2) {
            return events[1].event.flags;
        }

        for (let i = 1; i < events.length; i++) {
            const lastEventDuration =
                events[i].event.time - events[i - 1].event.time;
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

        return totalDurations[lastEventFlags] > maxDuration
            ? lastEventFlags
            : maxFlags;
    }

    private getMsAfterMidnight(alarmHour: number, alarmMinute: number): number {
        const msAfterMidNight =
            alarmHour * 60 * 60 * 1000 + alarmMinute * 60 * 1000;
        console.debug(msAfterMidNight);
        return msAfterMidNight;
    }

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
                await AuroraInstance.queueCmd(
                    `prof-load ${this.currentProfile!}`
                );
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
        const enableEventList = new Array<EventIds>();
        enableEventList.push(EventIds.BUTTON_MONITOR);
        enableEventList.push(EventIds.BATTERY_MONITOR);
        enableEventList.push(EventIds.SMART_ALARM);
        enableEventList.push(EventIds.CLOCK_ALARM_FIRE);
        enableEventList.push(EventIds.STIM_PRESENTED);
        return enableEventList;
    }

    private onEvent(event: AuroraEvent): void {
        console.debug("Aurora Event: %s", event.eventId);
        console.debug("Aurora Event Name:", EventIdsToNames[event.eventId]);

        switch (event.eventId) {
            case EventIds.BATTERY_MONITOR: {
                AuroraManagerInstance.batteryLevel = event.flags;
                AuroraManagerInstance.emit(
                    AuroraManagerEventList.onBatteryChange,
                    AuroraManagerInstance.batteryLevel
                );
                break;
            }
            case EventIds.BUTTON_MONITOR: {
                if (
                    event.flags == 1 &&
                    AuroraManagerInstance.currentSleepState ===
                        SleepStates.WAKING
                ) {
                    AuroraManagerInstance.setSleepState(SleepStates.AWAKE);
                }
                break;
            }
            case EventIds.CLOCK_ALARM_FIRE:
            case EventIds.SMART_ALARM: {
                console.debug(
                    "Current SleepState:",
                    AuroraManagerInstance.currentSleepState
                );
                if (
                    AuroraManagerInstance.currentSleepState ===
                    SleepStates.SLEEPING
                ) {
                    console.debug("Execute Smart Alarm Event.");
                    AuroraManagerInstance.setSleepState(SleepStates.WAKING);
                }
                break;
            }
            case EventIds.STIM_PRESENTED: {
                if (
                    AuroraManagerInstance.currentSleepState ===
                    SleepStates.SLEEPING
                ) {
                    if (AuroraManagerInstance.remStimSound !== undefined) {
                        AuroraManagerInstance.remStimSound.playAsync();
                    }
                }
            }
        }
    }

    private onBluetoothConnectionChange(
        connectionState: ConnectionStates
    ): void {
        AuroraManagerInstance.emit(
            AuroraManagerEventList.onConnectionChange,
            connectionState
        );
    }
}

export default new AuroraManager();
