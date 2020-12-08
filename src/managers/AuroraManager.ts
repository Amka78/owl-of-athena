import { EventEmitter } from "events";
import { Audio } from "expo-av";

import { AuroraManagerInstance } from ".";
import { SessionRestClientInstance } from "../clients";
import { AuroraInstance, SleepStates } from "../sdk";
import { AuroraEventList } from "../sdk/Aurora";
import {
    CommandNames,
    ConnectionStates,
    EventIds,
    EventIdsToNames,
    SleepStatesToNames,
} from "../sdk/AuroraConstants";
import AuroraSessionReader from "../sdk/AuroraSessionReader";
import {
    AuroraProfile,
    AuroraSessionJson,
    CommandResult,
    DirectoryInfo,
    FileInfo,
    AuroraSessionCSV,
} from "../sdk/AuroraTypes";
import {
    AuroraEvent,
    AuroraOSInfo,
    AuroraSession,
    Profile,
    Settings,
    AuroraSessionDetail,
} from "../sdk/models";

export enum AuroraManagerEventList {
    onConnectionChange = "onConnectionChange",
    onSleepStateChange = "onSleepStateChnage",
    onFoundUnsyncedSession = "onFoundUnsyncedSession",
    onSleeping = "onSleeping",
    onWaking = "onWaking",
    onAwake = "onAwake",
    onPushedSession = "onPushedSession",
    onBatteryChange = "onBatteryChange",
}
export class AuroraManager extends EventEmitter {
    private connected: boolean;
    private currentSleepState: SleepStates;
    private osInfo?: AuroraOSInfo;
    private batteryLevel: number;
    private alarmSound: Audio.Sound;
    private remStimSound: Audio.Sound;
    private currentProfile?: string;
    constructor() {
        super();
        this.connected = false;
        this.currentSleepState = SleepStates.INIT;
        this.batteryLevel = 0;
        this.alarmSound = new Audio.Sound();
        this.remStimSound = new Audio.Sound();

        AuroraInstance.on(AuroraEventList.auroraEvent, this.onEvent);
        AuroraInstance.on(
            AuroraEventList.bluetoothConnectionChange,
            this.onBluetoothConnectionChange
        );
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
            let writingProfile;

            if (profile?.content) {
                writingProfile = new Profile(profile.content);
            } else {
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const defaultProfileTxt = require("../../assets/DefaultProfileContent.txt");
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

            if (settings.alarmAudioPath) {
                if (this.alarmSound._loaded) {
                    await this.alarmSound.unloadAsync();
                }
                await this.alarmSound.loadAsync(
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    require(`../../assets/audio/${settings.alarmAudioPath}`)
                );
            }

            if (settings.remStimAudioPath) {
                if (this.remStimSound._loaded) {
                    await this.remStimSound.unloadAsync();
                }
                await this.remStimSound.loadAsync(
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    require(`../../assets/audio/${settings.remStimAudioPath}`)
                );
            }

            await AuroraInstance.queueCmd(
                `sd-rename profiles/default.prof profiles/default-bk-${Date.now()}.prof`
            );
            const writeFileResult = await AuroraInstance.writeFile(
                "profiles/default.prof",
                writingProfile.raw,
                false,
                this.osInfo!.version
            );

            await AuroraInstance.queueCmd("prof-unload");

            /*:TODO I don't know why, but the session will not be recorded 
                    unless the default.prof is read, so it is fixed at default.prof.
            */
            /*this.currentProfile = writeFileResult.response?.file.replace(
                "profiles/",
                ""
            );*/
            this.currentProfile = "default.prof";
            await AuroraInstance.queueCmd(`prof-load ${this.currentProfile}`);
            this.setSleepState(SleepStates.SLEEPING);
        } catch (e) {
            console.log(e);
            this.setSleepState(SleepStates.INIT);
            this.emit("onError", e);
        }
    }

    public getMsAfterMidnight(alarmHour: number, alarmMinute: number): number {
        const msAfterMidNight =
            alarmHour! * 60 * 60 * 1000 + alarmMinute! * 60 * 1000;
        console.debug(msAfterMidNight);
        return msAfterMidNight;
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
                    if (this.alarmSound._loaded) {
                        this.alarmSound.stopAsync();
                    }
                    if (this.remStimSound._loaded) {
                        this.remStimSound.stopAsync();
                    }
                    break;
                }
                case SleepStates.WAKING: {
                    console.debug("start onWaking.");
                    if (this.alarmSound._loaded) {
                        this.alarmSound.setIsLoopingAsync(true).then(() => {
                            this.alarmSound.playAsync();
                        });
                    }
                    this.emit(AuroraManagerEventList.onWaking);
                    break;
                }
                case SleepStates.AWAKE: {
                    if (this.alarmSound._loaded) {
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
        return await AuroraInstance.getUsyncedSessions("*@*");
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
                    newSession!.id = sessionInfo.name.replace("@", "-");
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
                        // @ts-ignore
                        uploadSession.streams as any,
                        new Array<AuroraEvent>(),
                        new Array<AuroraEvent>(),
                        new Array<AuroraEvent>(),
                        new Array<AuroraEvent>(),
                        new Array<AuroraEvent>()
                    )
                );
            } catch (e) {
                await AuroraInstance.queueCmd(`sd-dir-del ${sessionInfo[0]}`);
            }
        }
        return [pushedSessionList, pushedSessionDetailList];
    }

    private async setupAurora(): Promise<void> {
        this.batteryLevel = this.osInfo!.batteryLevel!;

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
                    if (AuroraManagerInstance.remStimSound._loaded) {
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
