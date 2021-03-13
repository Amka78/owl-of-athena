/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
//#region Import Modules
import { ActionTypes } from "../constants";
import { AuroraSession, AuroraSessionDetail } from "../sdk/models";
import { FilterCondition } from "../state/SessionState";
//#endregion

//#region Types
export type CacheAction = ReturnType<typeof cacheSessions>;
export type CacheDetailsAction = ReturnType<typeof cacheSessionDetails>;
export type SelectAction = ReturnType<typeof selectSession>;
export type SelectDetailAction = ReturnType<typeof selectSessionDetail>;
export type InitializeSession = ReturnType<typeof initializeSession>;
export type UpdateFilter = ReturnType<typeof updateFilter>;
export type UpdateSession = ReturnType<typeof updateSession>;
export type DeleteSession = ReturnType<typeof deleteSession>;
export type SessionActions =
    | CacheAction
    | CacheDetailsAction
    | SelectAction
    | SelectDetailAction
    | InitializeSession
    | UpdateFilter
    | DeleteSession
    | UpdateSession;
//#endregion

//#region Functions
export const cacheSessions = (sessionList: Array<AuroraSession>) => ({
    payload: {
        sessionList,
    },
    type: ActionTypes.CACHE_SESSIONS,
});

export const cacheSessionDetails = (
    sessionDetailList: Array<AuroraSessionDetail>
) => ({
    payload: {
        sessionDetailList,
    },
    type: ActionTypes.CACHE_SESSION_DETAILS,
});

export const updateFilter = (filter: Partial<FilterCondition>) => ({
    payload: {
        filter,
    },
    type: ActionTypes.UPDATE_SESSION_FILTER,
});

export const selectSession = (session: AuroraSession) => ({
    payload: {
        session,
    },
    type: ActionTypes.SELECT_SESSION,
});

export const updateSession = (session: AuroraSession) => ({
    payload: {
        session,
    },
    type: ActionTypes.UPDATE_SESSION,
});

export const deleteSession = (sessionId: string) => ({
    payload: {
        sessionId,
    },
    type: ActionTypes.DELETE_SESSION,
});

export const selectSessionDetail = (sessionDetail: AuroraSessionDetail) => ({
    payload: {
        sessionDetail,
    },
    type: ActionTypes.SELECT_SESSION_DETAIL,
});

export const initializeSession = () => ({
    type: ActionTypes.INITIALIZE_SESSION,
});
//#endregion
