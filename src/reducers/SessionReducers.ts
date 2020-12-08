//#region  "Import modules"
import {
    SessionState,
    FilterByDateValues,
    FilterCondition,
} from "../state/SessionState";
import { AuroraSession, AuroraSessionDetail } from "../sdk/models";
import { ActionTypes } from "../constants";
import { SessionActions } from "../actions/SessionsActions";
import moment from "moment";
import _ from "lodash";
//#endregion

//#region "Public functions"
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
            return cacheSessions(state, action);
        }
        case ActionTypes.CACHE_SESSION_DETAILS: {
            return cacheSessionDetails(state, action);
        }
        case ActionTypes.UPDATE_FILTER: {
            return updateFilter(action, state);
        }
        case ActionTypes.SELECT_SESSION: {
            return selectSession(state, action);
        }
        case ActionTypes.UPDATE_SESSION: {
            return updateSession(state, action);
        }
        case ActionTypes.DELETE_SESSION: {
            return deleteSession(state, action);
        }
        case ActionTypes.SELECT_SESSION_DETAIL: {
            return selectSessionDetail(state, action);
        }
        case ActionTypes.INITIALIZE_SESSION: {
            return initializeSession(state);
        }
        default:
            return state;
    }
}
//#endregion

//#region "Private functions"
/**
 * Deletes the session with the specified ID.
 *
 * @param {SessionState} state
 * @param {{ payload: { sessionId: string }; type: "DELETE_SESSION" }} action
 * @returns {SessionState}
 */
function deleteSession(
    state: SessionState,
    action: { payload: { sessionId: string }; type: "DELETE_SESSION" }
): SessionState {
    const removedSessionList = _.remove(
        state.sessionList,
        (value: AuroraSession) => {
            return value.id !== action.payload.sessionId;
        }
    );
    return Object.assign({}, state, {
        sessionList: removedSessionList,
        filteredSessionList: createFilteredSessionList(
            removedSessionList,
            state.filterCondition
        ),
    });
}

/**
 * Narrow down the list of sessions based on the filter condition.
 *
 * @param {Array<AuroraSession>} sessionList
 * @param {Partial<FilterCondition>} filterCondition
 * @returns {Array<AuroraSession>}
 */
function createFilteredSessionList(
    sessionList: Array<AuroraSession>,
    filterCondition: Partial<FilterCondition>
): Array<AuroraSession> {
    const filteredSessionList = new Array<AuroraSession>();

    let dateFrom = undefined;
    const dateTo = moment().utc();

    if (filterCondition.byDate !== FilterByDateValues.ANY_TIME) {
        switch (filterCondition.byDate) {
            case FilterByDateValues.PAST_WEEK:
                dateFrom = moment().utc().subtract(7, "days");
                break;

            case FilterByDateValues.PAST_MONTH:
                dateFrom = moment().utc().subtract(1, "month");
                break;

            /*case SessionConstants.DateFilterTypes.CUSTOM_RANGE :
                dateTo = this.filter.dateTo;
                dateFrom = this.filter.dateFrom;
                break;*/
        }
    }

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
            if (!sessionDate.isBetween(dateFrom, dateTo)) {
                continue;
            }
        }

        filteredSessionList.push(session);
    }
    return filteredSessionList;
}

/**
 * Return the session to its initial state.
 *
 * @param {SessionState} state
 * @returns {SessionState}
 */
function initializeSession(state: SessionState): SessionState {
    return Object.assign({}, state, initialState);
}

/**
 * Set SessionDetail to the selected state.
 *
 * @param {SessionState} state
 * @param {{
 *         payload: { sessionDetail: AuroraSessionDetail };
 *         type: "SELECT_SESSION_DETAIL";
 *     }} action
 * @returns {SessionState}
 */
function selectSessionDetail(
    state: SessionState,
    action: {
        payload: { sessionDetail: AuroraSessionDetail };
        type: "SELECT_SESSION_DETAIL";
    }
): SessionState {
    const sessionDetail = state.sessionDetailList.find(
        (value: AuroraSessionDetail) => {
            return value.sessionId === action.payload.sessionDetail.sessionId;
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

/**
 * Update the State in the specified session.
 *
 * @param {SessionState} state
 * @param {{ payload: { session: AuroraSession }; type: "UPDATE_SESSION" }} action
 * @returns {SessionState}
 */
function updateSession(
    state: SessionState,
    action: { payload: { session: AuroraSession }; type: "UPDATE_SESSION" }
): SessionState {
    const targetIndex = state.sessionList.findIndex((value: AuroraSession) => {
        return value.id === action.payload.session.id;
    });
    state.sessionList[targetIndex] = action.payload.session;
    return Object.assign({}, state, {
        sessionList: state.sessionList,
        filteredSessionList: createFilteredSessionList(
            state.sessionList,
            state.filterCondition
        ),
    });
}

/**
 * Sets the specified session to the selected state.
 *
 * @param {SessionState} state
 * @param {{ payload: { session: AuroraSession }; type: "SELECT_SESSION" }} action
 * @returns {SessionState}
 */
function selectSession(
    state: SessionState,
    action: { payload: { session: AuroraSession }; type: "SELECT_SESSION" }
): SessionState {
    return Object.assign({}, state, {
        selectedSession: action.payload.session,
    });
}

/**
 * Update FilterCondition.
 *
 * @param {{
 *         payload: { filter: Partial<FilterCondition> };
 *         type: "UPDATE_FILTER";
 *     }} action
 * @param {SessionState} state
 * @returns {SessionState}
 */
function updateFilter(
    action: {
        payload: { filter: Partial<FilterCondition> };
        type: "UPDATE_FILTER";
    },
    state: SessionState
): SessionState {
    if (action.payload.filter.byDate !== undefined) {
        state.filterCondition.byDate = action.payload.filter.byDate;
    }
    if (action.payload.filter.showNotes !== undefined) {
        state.filterCondition.showNotes = action.payload.filter.showNotes;
    }
    if (action.payload.filter.showStarred !== undefined) {
        state.filterCondition.showStarred = action.payload.filter.showStarred;
    }
    return Object.assign({}, state, {
        filteredSessionList: createFilteredSessionList(
            state.sessionList,
            state.filterCondition
        ),
        filterCondition: state.filterCondition,
    });
}

/**
 * Save the session list.
 *
 * @param {SessionState} state
 * @param {{
 *         payload: { sessionList: AuroraSession[] };
 *         type: "CACHE_SESSIONS";
 *     }} action
 * @returns {SessionState}
 */
function cacheSessions(
    state: SessionState,
    action: {
        payload: { sessionList: AuroraSession[] };
        type: "CACHE_SESSIONS";
    }
): SessionState {
    return Object.assign({}, state, {
        filteredSessionList: createFilteredSessionList(
            action.payload.sessionList,
            state.filterCondition
        ),
        sessionList: action.payload.sessionList,
    });
}
//#endregion

/**
 * Save the session detail list.
 *
 * @param {SessionState} state
 * @param {{
 *         payload: { sessionDetailList: AuroraSessionDetail[] };
 *         type: "CACHE_SESSION_DETAILS";
 *     }} action
 * @returns {SessionState}
 */
function cacheSessionDetails(
    state: SessionState,
    action: {
        payload: { sessionDetailList: AuroraSessionDetail[] };
        type: "CACHE_SESSION_DETAILS";
    }
): SessionState {
    return Object.assign({}, state, {
        sessionDetailList: action.payload.sessionDetailList,
    });
}
//#endregion
