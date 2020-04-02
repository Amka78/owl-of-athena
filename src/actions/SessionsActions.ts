/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { AuroraSession } from "../sdk/models";
import { ActionTypes } from "../constants";

export type CacheAction = ReturnType<typeof cacheSessions>;
export type SelectAction = ReturnType<typeof selectSession>;
export type SelectDetailAction = ReturnType<typeof selectSessionDetail>;
export type SessionActions = CacheAction | SelectAction | SelectDetailAction;

export const cacheSessions = (sessionList: Array<AuroraSession>) => ({
    payload: {
        sessionList
    },
    type: ActionTypes.CACHE_SESSION
});

export const selectSession = (session: AuroraSession) => ({
    payload: {
        session
    },
    type: ActionTypes.SELECT_SESSION
});

export const selectSessionDetail = (sessionDetail: any) => ({
    payload: {
        sessionDetail
    },
    type: ActionTypes.SELECT_SESSION_DETAIL
});
