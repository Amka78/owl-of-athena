/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { AuroraSession } from "../sdk/models";
import { ActionTypes } from "../constants";

export type SessionsActions = ReturnType<typeof updateSessions>;

export const updateSessions = (
    session: Array<AuroraSession>,
    userId: string
) => ({
    payload: {
        data: session,
        userId
    },
    type: ActionTypes.UPDATE_SESSIONS
});
