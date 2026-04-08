import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";
import moment from "moment";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AuroraSession, AuroraSessionDetail } from "../sdk/models";

export enum FilterByDateValues {
    ANY_TIME = "any_time",
    PAST_WEEK = "past_week",
    PAST_MONTH = "past_month",
}

export type SessionFilterCondition = {
    byDate: FilterByDateValues;
    showNotes: boolean;
    showStarred: boolean;
};

type SessionStore = {
    sessionList: AuroraSession[];
    filteredSessionList: AuroraSession[];
    selectedSession?: AuroraSession;
    sessionDetailList: AuroraSessionDetail[];
    selectedSessionDetail?: AuroraSessionDetail;
    filterCondition: SessionFilterCondition;
    cacheSessions: (sessionList: AuroraSession[]) => void;
    cacheSessionDetails: (sessionDetailList: AuroraSessionDetail[]) => void;
    selectSession: (session: AuroraSession) => void;
    selectSessionDetail: (sessionDetail: AuroraSessionDetail) => void;
    updateSession: (session: AuroraSession) => void;
    deleteSession: (sessionId: string) => void;
    updateFilter: (filter: Partial<SessionFilterCondition>) => void;
    initializeSession: () => void;
};

const initialFilterCondition: SessionFilterCondition = {
    byDate: FilterByDateValues.ANY_TIME,
    showNotes: false,
    showStarred: false,
};

function createFilteredSessionList(
    sessionList: AuroraSession[],
    filterCondition: Partial<SessionFilterCondition>,
): AuroraSession[] {
    const filtered: AuroraSession[] = [];
    let dateFrom: moment.Moment | undefined;
    const dateTo = moment().utc();

    if (filterCondition.byDate !== FilterByDateValues.ANY_TIME) {
        switch (filterCondition.byDate) {
            case FilterByDateValues.PAST_WEEK:
                dateFrom = moment().utc().subtract(7, "days");
                break;
            case FilterByDateValues.PAST_MONTH:
                dateFrom = moment().utc().subtract(1, "month");
                break;
        }
    }

    for (const session of sessionList) {
        if (filterCondition.showNotes && (!session.notes || session.notes.length <= 0)) {
            continue;
        }
        if (filterCondition.showStarred && !session.starred) {
            continue;
        }
        if (filterCondition.byDate !== FilterByDateValues.ANY_TIME) {
            if (!moment(session.sessionAt).utc().isBetween(dateFrom, dateTo)) {
                continue;
            }
        }
        filtered.push(session);
    }
    return filtered;
}

export const useSessionStore = create<SessionStore>()(
    persist(
        (set) => ({
            sessionList: [],
            filteredSessionList: [],
            selectedSession: undefined,
            sessionDetailList: [],
            selectedSessionDetail: undefined,
            filterCondition: initialFilterCondition,

            cacheSessions: (sessionList) =>
                set((state) => ({
                    sessionList,
                    filteredSessionList: createFilteredSessionList(
                        sessionList,
                        state.filterCondition,
                    ),
                })),

            cacheSessionDetails: (sessionDetailList) => set({ sessionDetailList }),

            selectSession: (session) => set({ selectedSession: session }),

            selectSessionDetail: (sessionDetail) =>
                set((state) => {
                    const detailList = [...state.sessionDetailList];
                    const exists = detailList.find((d) => d.sessionId === sessionDetail.sessionId);
                    if (!exists) detailList.push(sessionDetail);
                    return {
                        selectedSessionDetail: sessionDetail,
                        sessionDetailList: detailList,
                    };
                }),

            updateSession: (session) =>
                set((state) => {
                    const sessionList = [...state.sessionList];
                    const idx = sessionList.findIndex((s) => s.id === session.id);
                    if (idx >= 0) sessionList[idx] = session;
                    return {
                        sessionList,
                        filteredSessionList: createFilteredSessionList(
                            sessionList,
                            state.filterCondition,
                        ),
                    };
                }),

            deleteSession: (sessionId) =>
                set((state) => {
                    const sessionList = _.remove([...state.sessionList], (s) => s.id !== sessionId);
                    return {
                        sessionList,
                        filteredSessionList: createFilteredSessionList(
                            sessionList,
                            state.filterCondition,
                        ),
                    };
                }),

            updateFilter: (filter) =>
                set((state) => {
                    const filterCondition = {
                        ...state.filterCondition,
                        ...filter,
                    };
                    return {
                        filterCondition,
                        filteredSessionList: createFilteredSessionList(
                            state.sessionList,
                            filterCondition,
                        ),
                    };
                }),

            initializeSession: () =>
                set({
                    sessionList: [],
                    filteredSessionList: [],
                    selectedSession: undefined,
                    sessionDetailList: [],
                    selectedSessionDetail: undefined,
                    filterCondition: initialFilterCondition,
                }),
        }),
        {
            name: "session-storage",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
