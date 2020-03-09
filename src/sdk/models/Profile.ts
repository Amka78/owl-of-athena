enum ProfileKeys {
    STIM_DELAY = "stim-delay",
    STIM_INTERVAL = "stim-interval",
    STIM_ENABLED = "stim-enabled",
    WAKEUP_WINDOW = "wakeup-window",
    SMART_ALARM_ENABLED = "sa-enabled",
    DAWN_STIMULATING_LIGHT = "dsl-enabled",
    STREAM_DEBUG = "stream-debug",
    WAKEUP_TIME = "wakeup-time"
}
export class Profile {
    private profileList: Map<ProfileKeys, any>;
    private content: string;
    constructor(content: string) {
        this.content = "";
        this.profileList = new Map<ProfileKeys, unknown>();

        this.profileList.set(ProfileKeys.STIM_DELAY, undefined);
        this.profileList.set(ProfileKeys.STIM_INTERVAL, undefined);
        this.profileList.set(ProfileKeys.STIM_ENABLED, undefined);
        this.profileList.set(ProfileKeys.WAKEUP_WINDOW, undefined);
        this.profileList.set(ProfileKeys.SMART_ALARM_ENABLED, undefined);
        this.profileList.set(ProfileKeys.DAWN_STIMULATING_LIGHT, undefined);
        this.profileList.set(ProfileKeys.STREAM_DEBUG, undefined);
        this.profileList.set(ProfileKeys.WAKEUP_TIME, undefined);

        this.setContent(content);
    }

    public setContent(content: string): void {
        this.content = content;

        const result = this.content.match(/\{\s*(\S+)\s*:\s*(.*)\}/g);

        result!.forEach((value: string) => {
            const splitted = value.split(":");
            this.profileList.set(
                splitted[0].replace("{", "") as ProfileKeys,
                splitted[1].replace("}", "")
            );
        });
    }

    public get stimDelay(): number {
        return this.getNumberValue(ProfileKeys.STIM_DELAY);
    }

    public set stimDelay(stimDelay: number) {
        this.setNumberValue(ProfileKeys.STIM_DELAY, stimDelay);
    }

    public get stimInterval(): number {
        return this.getNumberValue(ProfileKeys.STIM_INTERVAL);
    }

    public set stimInterval(stimInterval: number) {
        this.setNumberValue(ProfileKeys.STIM_INTERVAL, stimInterval);
    }

    public get stimEnabled(): boolean {
        return this.getBooleanValue(ProfileKeys.STIM_ENABLED);
    }

    public set stimEnabled(stimEnabled: boolean) {
        this.setBooleanValue(ProfileKeys.STIM_ENABLED, stimEnabled);
    }

    public get wakeupWindow(): number {
        return this.getNumberValue(ProfileKeys.WAKEUP_WINDOW);
    }

    public set wakeupWindow(wakeupWindow: number) {
        this.setNumberValue(ProfileKeys.WAKEUP_WINDOW, wakeupWindow);
    }

    public get saEnabled(): boolean {
        return this.getBooleanValue(ProfileKeys.SMART_ALARM_ENABLED);
    }

    public set saEnabled(saEnabled: boolean) {
        this.setBooleanValue(ProfileKeys.SMART_ALARM_ENABLED, saEnabled);
    }

    public get dslEnabled(): boolean {
        return this.getBooleanValue(ProfileKeys.DAWN_STIMULATING_LIGHT);
    }

    public set dslEnabled(dslEnabled: boolean) {
        this.setBooleanValue(ProfileKeys.DAWN_STIMULATING_LIGHT, dslEnabled);
    }

    public get streamDebug(): boolean {
        return this.getBooleanValue(ProfileKeys.STREAM_DEBUG);
    }

    public set streamDebug(streamDebug: boolean) {
        this.setBooleanValue(ProfileKeys.STREAM_DEBUG, streamDebug);
    }

    public get wakeupTime(): number {
        return this.getNumberValue(ProfileKeys.WAKEUP_TIME);
    }

    public set wakeupTime(wakeupTime: number) {
        this.setNumberValue(ProfileKeys.WAKEUP_TIME, wakeupTime);
    }
    public get raw(): string {
        return this.content;
    }

    private getBooleanValue(key: ProfileKeys): boolean {
        const value = this.profileList.get(key);

        return value == 1;
    }

    private setBooleanValue(key: ProfileKeys, value: boolean): void {
        const setValue = value ? 1 : 0;
        this.profileList.set(key, setValue);

        this.content = this.content.replace(
            new RegExp("\\{\\s*" + key + "\\s*:\\s*(.*)\\}"),
            "{" + key + ":" + setValue + "}"
        );
    }

    private getNumberValue(key: ProfileKeys): number {
        const value = this.profileList.get(key);
        if (value) {
            return Number(value);
        } else {
            return 0;
        }
    }

    private setNumberValue(key: ProfileKeys, value: number): void {
        this.profileList.set(key, value);

        this.content = this.content.replace(
            new RegExp("\\{\\s*" + key + "\\s*:\\s*(.*)\\}"),
            "{" + key + ":" + value.toString() + "}"
        );
    }
}
