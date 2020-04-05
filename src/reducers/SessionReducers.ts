import { SessionState } from "../state";
import { AuroraSession } from "../sdk/models";
import { ActionTypes } from "../constants";
import { SessionActions } from "../actions/SessionsActions";
import { AuroraSessionDetail } from "../sdk/models/AuroraSessionDetail";
const initialState: SessionState = {
    sessionList: new Array<AuroraSession>(),
    selectedSession: undefined,
    sessionDetailList: new Array<AuroraSessionDetail>(),
    selectedSessionDetail: undefined
};

export default function SessionReducers(
    state: SessionState = initialState,
    action: SessionActions
): SessionState {
    switch (action.type) {
        case ActionTypes.CACHE_SESSIONS: {
            return Object.assign({}, state, {
                sessionList: action.payload.sessionList
            });
        }
        case ActionTypes.SELECT_SESSION: {
            return Object.assign({}, state, {
                selectedSession: action.payload.session
            });
        }
        case ActionTypes.SELECT_SESSION_DETAIL: {
            const sessionDetail = state.sessionDetailList.find(
                (value: AuroraSessionDetail) => {
                    return (
                        value.sessionId ===
                        action.payload.sessionDetail.sessionId
                    );
                }
            );

            if (!sessionDetail) {
                state.sessionDetailList.push(action.payload.sessionDetail);
            }
            return Object.assign({}, state, {
                selectedSessionDetail: action.payload.sessionDetail,
                sessionDetailList: state.sessionDetailList
            });
        }
        case ActionTypes.INITIALIZE_SESSION: {
            return Object.assign({}, state, {
                selectedSession: undefined,
                selectedSessionDetail: undefined,
                sessionList: new Array<AuroraSession>(),
                sessionDetailList: new Array<AuroraSessionDetail>()
            });
        }
        default:
            return state;
    }
}
