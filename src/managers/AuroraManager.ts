import { AuroraInstance, SleepStates } from "../sdk";
import EventEmitter from "events";
import { AuroraOSInfo, Profile, Settings } from "../sdk/models";
import { AuroraProfile, CommandResult } from "../sdk/AuroraTypes";
import { AuroraEventList } from "../sdk/Aurora";
import {
    EventIds,
    CommandNames,
    EventIdsToNames
} from "../sdk/AuroraConstants";
import { AuroraEvent } from "../sdk/AuroraTypes";
import { Audio } from "expo-av";
import { AuroraManagerInstance } from ".";
import { FileInfo } from "../sdk/AuroraTypes";
import AuroraSessionReader from "../sdk/AuroraSessionReader";
export enum AuroraManagetEventList {
    onSleepStateChange = "onSleepStateChnage",
    onFoundUnsyncedSession = "onFoundUnsyncedSession",
    onSleeping = "onSleeping",
    onWaking = "onWaking",
    onAwake = "onAwake"
}
export class AuroraManager extends EventEmitter {
    private connected: boolean;
    private currentSleepState: SleepStates;
    private osInfo?: AuroraOSInfo;
    private batteryLevel: number;
    private alarmSound: Audio.Sound;
    private remStimSound: Audio.Sound;
    constructor() {
        super();
        this.connected = false;
        this.currentSleepState = SleepStates.INIT;
        this.batteryLevel = 0;
        this.alarmSound = new Audio.Sound();
        this.remStimSound = new Audio.Sound();

        AuroraInstance.on(AuroraEventList.auroraEvent, this.onEvent);
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
        const writingProfile = new Profile(profile.content!);

        writingProfile.wakeupTime = this.getMsAfterMidnight(
            settings.alarmHour,
            settings.alarmMinute
        );
        writingProfile.saEnabled = settings.smartAlarmEnabled;
        writingProfile.stimEnabled = settings.remStimEnabled;
        writingProfile.dslEnabled = settings.dslEnabled;

        if (settings.alarmAudioPath) {
            await this.alarmSound.loadAsync(
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                require(`../../assets/audio/${settings.alarmAudioPath}`)
            );
        }

        if (settings.remStimAudioPath) {
            await this.remStimSound.loadAsync(
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                require(`../../assets/audio/${settings.remStimAudioPath}`)
            );
        }
        try {
            console.debug("Start write files.");
            await AuroraInstance.writeFile(
                "profiles/default.prof",
                writingProfile.raw,
                true,
                this.osInfo!.version
            );
            console.debug("Completed write files.");

            console.debug("Start prop unload.");
            await AuroraInstance.queueCmd<CommandResult<undefined>>(
                "prof-unload"
            );
            console.debug("Completed prof unload.");

            console.debug("Start prof load.");
            await AuroraInstance.queueCmd<CommandResult<undefined>>(
                "prof-load default.prof"
            );
            console.debug("Completed prop load.");
            this.setSleepState(SleepStates.SLEEPING);
        } catch (e) {
            this.setSleepState(SleepStates.CONFIGURING);
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
            `currentSleepState: ${this.currentSleepState} followingSleepState: ${followingSleepState}`
        );
        if (followingSleepState !== this.currentSleepState) {
            this.currentSleepState = followingSleepState;

            switch (this.currentSleepState) {
                case SleepStates.SLEEPING: {
                    console.debug("start onSleeping.");
                    this.emit(AuroraManagetEventList.onSleeping);
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
                    this.emit(AuroraManagetEventList.onWaking);
                    break;
                }
                case SleepStates.AWAKE: {
                    if (this.alarmSound._loaded) {
                        this.alarmSound.stopAsync();
                    }
                    this.emit(AuroraManagetEventList.onAwake);
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
                            //this.getUnsyncedSessions();
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
        /*sessions.forEach((value: FileInfo) => {
            AuroraInstance.readFile(value.file, false)
                .then((readFileContent: unknown) => {
                    console.debug("readFileSucceed");
                    readSessionContent.set(value.file, readFileContent);
                })
                .catch((reason: any) => {
                    console.debug(reason);
                });
        });*/

        const result = await AuroraInstance.readFile(sessions[0].file, false);

        const session = await AuroraSessionReader.read(
            sessions[0].file.replace("/session.txt", ""),
            result.output
        );
        readSessionContent.set(sessions[0].file, session);

        return readSessionContent;
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
                await AuroraInstance.queueCmd("prof-load default.prof");
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
        const enableEventList = new Array<EventIds>();
        enableEventList.push(EventIds.BUTTON_MONITOR);
        enableEventList.push(EventIds.BATTERY_MONITOR);
        enableEventList.push(EventIds.SMART_ALARM);
        enableEventList.push(EventIds.CLOCK_ALARM_FIRE);
        enableEventList.push(EventIds.STIM_PRESENTED);

        console.debug("Execute enable events command.");
        const enableEventConmmandResult = await AuroraInstance.enableEvents(
            enableEventList
        );
        console.debug(
            "Completed enable events command:",
            enableEventConmmandResult
        );

        console.debug("Execute sync time command.");
        //good as time as any to make sure clock is still in sync with device timeurora
        const syncTimeResult = await AuroraInstance.syncTime();
        console.debug("Completed sync time command:", syncTimeResult);
    }

    private onEvent(event: AuroraEvent): void {
        console.debug("Aurora Event: %s", event.eventId);
        // @ts-ignore
        console.debug("Aurora Event Name:", EventIdsToNames[event.eventId]);

        switch (event.eventId) {
            case EventIds.BATTERY_MONITOR: {
                this.batteryLevel = event.flags;
                break;
            }
            case EventIds.BUTTON_MONITOR: {
                if (
                    event.flags == 1 &&
                    this.currentSleepState === SleepStates.WAKING
                ) {
                    this.setSleepState(SleepStates.AWAKE);
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
                //if (this.currentSleepState === SleepStates.SLEEPING) {
                if (this.remStimSound._loaded) {
                    this.remStimSound.playAsync();
                }
                //}
            }
        }
    }
}
export default new AuroraManager();
