/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { AuroraSession, AuroraSessionDetail } from "../sdk/models";
import { ActionTypes } from "../constants";
import { FilterCondition } from "../state/SessionState";

export type CacheAction = ReturnType<typeof cacheSessions>;
export type SelectAction = ReturnType<typeof selectSession>;
export type SelectDetailAction = ReturnType<typeof selectSessionDetail>;
export type InitializeSession = ReturnType<typeof initializeSession>;
export type UPDATE_FILTER = ReturnType<typeof updateFilter>;
export type SessionActions =
    | CacheAction
    | SelectAction
    | SelectDetailAction
    | InitializeSession
    | UPDATE_FILTER;

export const cacheSessions = (sessionList: Array<AuroraSession>) => ({
    payload: {
        sessionList,
    },
    type: ActionTypes.CACHE_SESSIONS,
});

export const updateFilter = (filter: Partial<FilterCondition>) => ({
    payload: {
        filter,
    },
    type: ActionTypes.UPDATE_FILTER,
});

export const selectSession = (session: AuroraSession) => ({
    payload: {
        session,
    },
    type: ActionTypes.SELECT_SESSION,
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
