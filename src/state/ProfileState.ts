//#region Import modules
import { AuroraProfile } from "../sdk/AuroraTypes";
//#endregion

//#region Export types
export type FilterCondition = {
    showOfficial: boolean;
    showCommunity: boolean;
    showPrivate: boolean;
};

export type ProfileState = {
    list: Array<AuroraProfile>;
    filteredList: Array<AuroraProfile>;
    selected?: AuroraProfile;
    filterCondition: FilterCondition;
};
//#endregion
