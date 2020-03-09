export class Settings {
    public userId: string;

    public profileId?: string;

    public profileTitle?: string;

    public alarmHour?: number;

    public alarmMinute?: number;

    public smartAlarmEnabled: boolean;

    public remStimEnabled: boolean;

    public dslEnabled: boolean;

    public alarmAudioPath?: string;

    public remStimAudioPath?: string;

    public saveAt?: Date;
    constructor(settings: Partial<Settings>) {
        if (settings.userId) {
            this.userId = settings.userId!;
        } else {
            throw new Error("userId is required.");
        }

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

        this.alarmAudioPath = settings.alarmAudioPath;
        this.remStimAudioPath = settings.remStimAudioPath;
        this.saveAt = settings.saveAt;
    }
}
