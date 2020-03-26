import { AuroraSession, Settings } from "../sdk/models";
import { AuroraProfile } from "../sdk/AuroraTypes";

export type AuroraState = {
    userSettings: Settings;
    settingList: Array<Settings>;
    profileList: Array<AuroraProfile>;
    sessionList: Array<AuroraSession>;
};
