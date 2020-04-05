import { Settings } from "../sdk/models";
import { AuroraProfile } from "../sdk/AuroraTypes";

export type AuroraState = {
    userSettings: Settings;
    profileList: Array<AuroraProfile>;
};
