import { Aurora, SleepStates } from "../sdk";
import EventEmitter from "events";
import { AuroraOSInfo, Profile, Settings } from "../sdk/models";
import { AuroraProfile } from "../sdk/AuroraTypes";
import { AuroraEventList } from "../sdk/Aurora";
import { EventIds, CommandNames } from "../sdk/AuroraConstants";
import { AuroraEvent } from "../sdk/AuroraTypes";
import { Audio } from "expo-av";
export enum AuroraManagetEventList {
    onConnectionChange = "onConnectionStateChange",
    onSleepStateChange = "onSleepStateChnage",
    onFoundUnsyncedSession = "onFoundUnsyncedSession",
    onAuroraReady = "onAuroraReady",
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

        Aurora.on(
            AuroraEventList.bluetoothConnectionChange,
            this.onConnectionChange
        );

        Aurora.on(AuroraEventList.auroraEvent, this.onEvent);
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

    public async connect(): Promise<void> {
        try {
            this.osInfo = await Aurora.connectBluetooth();
        } catch (e) {
            console.log(e);
        }
    }

    public async disconnect(): Promise<void> {
        await Aurora.disconnectBluetooth();

        this.setSleepState(SleepStates.CONFIGURING);
    }

    public async executeCommand(command: string): Promise<unknown> {
        return await Aurora.queueCmd(command);
    }

    public async goToSleep(
        profile: AuroraProfile,
        settings: Settings
    ): Promise<void> {
        const writingProfile = new Profile(profile.content!);

        writingProfile.wakeupTime = settings.getMsAfterMidnight();
        writingProfile.saEnabled = settings.smartAlarmEnabled;
        writingProfile.stimEnabled = settings.remStimEnabled;
        writingProfile.dslEnabled = settings.dslEnabled;

        await this.alarmSound.loadAsync(
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require(`../../assets/audio/${settings.alarmAudioPath}`)
        );
        await this.remStimSound.loadAsync(
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require(`../../assets/audio/${settings.remStimAudioPath}`)
        );
        try {
            Aurora.writeFile("profiles/default.prof", writingProfile.raw, true);

            await Aurora.queueCmd("prof-load default.prof");
            this.setSleepState(SleepStates.SLEEPING);
        } catch (e) {
            console.log(e);
            this.setSleepState(SleepStates.CONFIGURING);
            this.emit("onError", e);
        }
    }

    public setSleepState(followingSleepState: SleepStates): void {
        if (followingSleepState !== this.currentSleepState) {
            this.currentSleepState = followingSleepState;

            switch (this.currentSleepState) {
                case SleepStates.SLEEPING: {
                    this.emit(AuroraManagetEventList.onSleeping);
                    break;
                }
                case SleepStates.CONFIGURING: {
                    this.alarmSound.stopAsync();
                    this.remStimSound.stopAsync();
                    break;
                }
                case SleepStates.WAKING: {
                    this.emit(AuroraManagetEventList.onWaking);
                    this.alarmSound.playAsync();
                    break;
                }
                case SleepStates.AWAKE: {
                    this.alarmSound.stopAsync();
                    this.emit(AuroraManagetEventList.onAwake);
                    this.setSleepState(SleepStates.SYNCING);
                    break;
                }
                case SleepStates.SYNCING: {
                    Aurora.queueCmd(CommandNames.PROF_UNLOAD)
                        .catch((reason: any) => {
                            console.error(reason);
                            this.setSleepState(SleepStates.SYNCING_ERROR);
                        })
                        .then(() => {
                            this.getUnsyncedSessions();
                            this.setSleepState(SleepStates.CONFIGURING);
                        });
                }
            }

            this.emit("onSleepStateChange", this.currentSleepState);
        }
    }

    private async onConnectionChange(connected: boolean): Promise<void> {
        this.connected = connected;

        if (connected) {
            await this.setupAurora();
        }
        this.emit(AuroraManagetEventList.onConnectionChange, connected);
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
                await Aurora.queueCmd("prof-load default.prof");
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

        Aurora.enableEvents(enableEventList);
        //good as time as any to make sure clock is still in sync with device time
        Aurora.syncTime();

        this.emit(AuroraManagetEventList.onAuroraReady, this.batteryLevel);
    }

    public getUnsyncedSessions(): any {
        Aurora.getSessions(false, "*@*")
            .then((value: unknown) => {
                return value;
            })
            .catch((reason: any) => {
                console.log(reason);
            });
    }

    private onEvent(event: AuroraEvent): void {
        console.log("Aurora Event: %s", event.eventId);

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
            case EventIds.SMART_ALARM: {
                if (this.currentSleepState === SleepStates.SLEEPING) {
                    this.alarmSound.playAsync();
                }
                break;
            }
            case EventIds.STIM_PRESENTED: {
                if (this.currentSleepState === SleepStates.SLEEPING) {
                    this.remStimSound.playAsync();
                }
            }
        }
    }
}
export default new AuroraManager();
