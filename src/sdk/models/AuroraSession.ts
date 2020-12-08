import { AuroraSessionJson, AuroraSessionCSV } from "../AuroraTypes";
export class AuroraSession {
    public id: string;
    public userId: string;
    public auroraProfileId: string;
    public auroraProfileName: string;
    public firmwareVersion?: number;
    public appPlatform: string;
    public appVersion: number;
    public sleepOnset: number;
    public sessionDuration?: number;
    public sleepDuration: number;
    public noSignalDuration: number;
    public awakeDuration: number;
    public lightDuration: number;
    public deepDuration: number;
    public remDuration: number;
    public sleepScore: number;
    public incomplete: boolean;
    public starred: boolean;
    public notes?: string;
    public asleepAt: number;
    public awakeAt: number;
    public createAt?: number;
    public sessionAt?: number;
    public sessionUrl?: string;
    [propName: string]: any;
    constructor(src: AuroraSessionJson | AuroraSessionCSV) {
        this.appPlatform = src.app_platform;
        this.appVersion = src.app_version;
        this.incomplete = src.incomplete;
        if (src.type === "json") {
            this.id = src.id;
            this.userId = src.user_id;
            this.auroraProfileId = src.aurora_profile_id;
            this.auroraProfileName = src.aurora_profile_name;
            this.firmwareVersion = src.firmware_version;
            this.sleepOnset = src.sleep_onset;
            this.sleepDuration = src.sleep_duration;
            this.sessionDuration = src.session_duration;
            this.noSignalDuration = src.no_signal_duration;
            this.awakeDuration = src.awake_duration;
            this.lightDuration = src.light_duration;
            this.deepDuration = src.deep_duration;
            this.remDuration = src.rem_duration;
            this.sleepScore = src.sleep_score;
            this.starred = src.starred;
            this.notes = src.notes;
            this.asleepAt = src.asleep_at;
            this.awakeAt = src.awake_at;
            this.createAt = src.create_at;
            this.sessionAt = src.session_at;
            this.sessionUrl = src.session_url;
        } else {
            this.id = src.name;
            this.userId = "";
            this.auroraProfileId = src.profile.id!;
            this.auroraProfileName = src.profile.name!;
            this.sleepOnset = src.sleepOnset;
            this.sleepDuration = src.sleepDuration.total;
            this.noSignalDuration = src.sleepDuration.unknown;
            this.awakeDuration = src.sleepDuration.awake;
            this.lightDuration = src.sleepDuration.light;
            this.deepDuration = src.sleepDuration.deep;
            this.remDuration = src.sleepDuration.rem;
            this.sleepScore = src.sleepScore;
            this.starred = false;
            this.asleepAt = src.asleespAt;
            this.awakeAt = src.awakeAt;
        }
    }
}
