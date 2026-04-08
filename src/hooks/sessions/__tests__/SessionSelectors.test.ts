import { renderHook } from "@testing-library/react-native";
import type { AuroraSession, AuroraSessionDetail } from "../../../sdk/models";
import { FilterByDateValues, useSessionStore } from "../../../store/sessionStore";

const mockSession = { id: "s1", starred: true } as unknown as AuroraSession;
const mockSessionDetail = { sessionId: "s1" } as unknown as AuroraSessionDetail;
const mockFilterCondition = {
    byDate: FilterByDateValues.ANY_TIME,
    showNotes: false,
    showStarred: false,
};

import { useFilterConditionSelector } from "../useFilteredConditionSelector";
import { useFilteredSessionListSelector } from "../useFilteredSessionListSelector";
import { useSelectedSessionDetailSelector } from "../useSelectedSessionDetailSelector";
import { useSelectedSessionSelector } from "../useSelectedSessionSelector";
import { useSessionDetailListSelector } from "../useSessionDetailListSelector";
import { useSessionListSelector } from "../useSessionListSelector";

describe("Session selector hooks", () => {
    beforeEach(() => {
        useSessionStore.setState({
            sessionList: [mockSession],
            filteredSessionList: [mockSession],
            selectedSession: mockSession,
            sessionDetailList: [mockSessionDetail],
            selectedSessionDetail: mockSessionDetail,
            filterCondition: mockFilterCondition,
        } as any);
    });

    afterEach(() => {
        useSessionStore.setState({
            sessionList: [],
            filteredSessionList: [],
            selectedSession: undefined,
            sessionDetailList: [],
            selectedSessionDetail: undefined,
            filterCondition: mockFilterCondition,
        } as any);
    });

    it("useSessionListSelector returns sessionList", () => {
        const { result } = renderHook(() => useSessionListSelector());
        expect(result.current).toEqual([mockSession]);
    });

    it("useFilteredSessionListSelector returns filteredSessionList", () => {
        const { result } = renderHook(() => useFilteredSessionListSelector());
        expect(result.current).toEqual([mockSession]);
    });

    it("useSelectedSessionSelector returns selectedSession", () => {
        const { result } = renderHook(() => useSelectedSessionSelector());
        expect(result.current).toEqual(mockSession);
    });

    it("useSessionDetailListSelector returns sessionDetailList", () => {
        const { result } = renderHook(() => useSessionDetailListSelector());
        expect(result.current).toEqual([mockSessionDetail]);
    });

    it("useSelectedSessionDetailSelector returns selectedSessionDetail", () => {
        const { result } = renderHook(() => useSelectedSessionDetailSelector());
        expect(result.current).toEqual(mockSessionDetail);
    });

    it("useFilterConditionSelector returns filterCondition", () => {
        const { result } = renderHook(() => useFilterConditionSelector());
        expect(result.current).toEqual(mockFilterCondition);
    });
});
