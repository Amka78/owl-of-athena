//#region Import modules
import { AuroraSession, AuroraSessionDetail } from "../sdk/models";
//#endregion

//#region Export types
export type FilterCondition = {
    byDate: FilterByDateValues;
    showNotes: boolean;
    showStarred: boolean;
};
export enum FilterByDateValues {
    ANY_TIME = "any_time",
    PAST_WEEK = "past_week",
    PAST_MONTH = "past_month",
}

export type SessionState = {
    sessionList: Array<AuroraSession>;
    filteredSessionList: Array<AuroraSession>;
    selectedSession?: AuroraSession;
    sessionDetailList: Array<AuroraSessionDetail>;
    selectedSessionDetail?: AuroraSessionDetail;
    filterCondition: FilterCondition;
};
//#endregion
