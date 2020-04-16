import {
    SessionState,
    FilterByDateValues,
    FilterCondition,
} from "../state/SessionState";
import { AuroraSession, AuroraSessionDetail } from "../sdk/models";
import { ActionTypes } from "../constants";
import { SessionActions } from "../actions/SessionsActions";
import moment from "moment";

export const initialState: SessionState = {
    sessionList: new Array<AuroraSession>(),
    filteredSessionList: new Array<AuroraSession>(),
    filterCondition: {
        byDate: FilterByDateValues.ANY_TIME,
        showNotes: false,
        showStarred: false,
    },
    selectedSession: undefined,
    sessionDetailList: new Array<AuroraSessionDetail>(),
    selectedSessionDetail: undefined,
};

export default function SessionReducers(
    state: SessionState = initialState,
    action: SessionActions
): SessionState {
    switch (action.type) {
        case ActionTypes.CACHE_SESSIONS: {
            return Object.assign({}, state, {
                filteredSessionList: createFilteredSessionList(
                    action.payload.sessionList,
                    state.filterCondition
                ),
                sessionList: action.payload.sessionList,
            });
        }
        case ActionTypes.UPDATE_FILTER: {
            if (action.payload.filter.byDate !== undefined) {
                state.filterCondition.byDate = action.payload.filter.byDate;
            }
            if (action.payload.filter.showNotes !== undefined) {
                state.filterCondition.showNotes =
                    action.payload.filter.showNotes;
            }
            if (action.payload.filter.showStarred !== undefined) {
                state.filterCondition.showStarred =
                    action.payload.filter.showStarred;
            }
            return Object.assign({}, state, {
                filteredSessionList: createFilteredSessionList(
                    state.sessionList,
                    action.payload.filter
                ),
                filterCondition: state.filterCondition,
            });
        }
        case ActionTypes.SELECT_SESSION: {
            return Object.assign({}, state, {
                selectedSession: action.payload.session,
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
                sessionDetailList: state.sessionDetailList,
            });
        }
        case ActionTypes.INITIALIZE_SESSION: {
            return Object.assign({}, state, initialState);
        }
        default:
            return state;
    }
}

function createFilteredSessionList(
    sessionList: Array<AuroraSession>,
    filterCondition: Partial<FilterCondition>
): Array<AuroraSession> {
    const filteredSessionList = new Array<AuroraSession>();

    for (const session of sessionList) {
        const sessionDate = moment(session.sessionAt).utc();
        if (filterCondition.showNotes) {
            if (!session.notes || session.notes.length <= 0) {
                continue;
            }
        }

        if (filterCondition.showStarred) {
            if (!session.starred) {
                continue;
            }
        }

        if (filterCondition.byDate !== FilterByDateValues.ANY_TIME) {
            if (filterCondition.byDate === FilterByDateValues.PAST_WEEK) {
                const dateFrom = moment().utc().subtract(7, "days");

                if (sessionDate < dateFrom) {
                    continue;
                }
            }

            if (filterCondition.byDate === FilterByDateValues.PAST_MONTH) {
                const dateFrom = moment().utc().subtract(1, "month");

                if (sessionDate < dateFrom) {
                    continue;
                }
            }
        }

        filteredSessionList.push(session);
    }
    return filteredSessionList;
}
