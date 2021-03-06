import { AudioList } from "../../components/molecules/AudioDialog";

export class Settings {
    public userId?: string;

    public profileId?: string;

    public profileTitle: string;

    public alarmHour: number;

    public alarmMinute: number;

    public smartAlarmEnabled: boolean;

    public remStimEnabled: boolean;

    public dslEnabled: boolean;

    public alarmAudio: AudioList;

    public alarmAudioPath?: string;

    public remStimAudio: AudioList;

    public remStimAudioPath?: string;

    public savedAt?: Date;
    constructor(settings: Partial<Settings>) {
        this.profileId = settings.profileId;

        settings.profileTitle
            ? (this.profileTitle = settings.profileTitle)
            : (this.profileTitle = "Default Profile");

        settings.alarmHour
            ? (this.alarmHour = settings.alarmHour)
            : (this.alarmHour = 8);

        settings.alarmMinute
            ? (this.alarmMinute = settings.alarmMinute)
            : (this.alarmMinute = 0);

        settings.smartAlarmEnabled
            ? (this.smartAlarmEnabled = settings.smartAlarmEnabled)
            : (this.smartAlarmEnabled = false);

        settings.remStimEnabled
            ? (this.remStimEnabled = settings.remStimEnabled)
            : (this.remStimEnabled = false);

        settings.dslEnabled
            ? (this.dslEnabled = settings.dslEnabled)
            : (this.dslEnabled = false);

        settings.alarmAudio
            ? (this.alarmAudio = settings.alarmAudio)
            : (this.alarmAudio = AudioList.NONE);
        this.alarmAudioPath = settings.alarmAudioPath;
        settings.remStimAudio
            ? (this.remStimAudio = settings.remStimAudio)
            : (this.remStimAudio = AudioList.NONE);
        this.remStimAudioPath = settings.remStimAudioPath;
        this.savedAt = settings.savedAt;
    }
}
