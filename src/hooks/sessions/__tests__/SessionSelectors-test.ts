import { renderHook } from "@testing-library/react-native";
import { FilterByDateValues } from "../../../state/SessionState";

const mockSession = { id: "s1", starred: true };
const mockSessionDetail = { sessionId: "s1" };
const mockFilterCondition = {
    byDate: FilterByDateValues.ANY_TIME,
    showNotes: false,
    showStarred: false,
};

jest.mock("react-redux", () => ({
    useSelector: jest.fn((selector: any) =>
        selector({
            session: {
                sessionList: [mockSession],
                filteredSessionList: [mockSession],
                selectedSession: mockSession,
                sessionDetailList: [mockSessionDetail],
                selectedSessionDetail: mockSessionDetail,
                filterCondition: mockFilterCondition,
            },
            auth: {},
            aurora: {},
            app: {},
            profile: {},
        })
    ),
    useDispatch: () => jest.fn(),
}));

import { useSessionListSelector } from "../useSessionListSelector";
import { useFilteredSessionListSelector } from "../useFilteredSessionListSelector";
import { useSelectedSessionSelector } from "../useSelectedSessionSelector";
import { useSessionDetailListSelector } from "../useSessionDetailListSelector";
import { useSelectedSessionDetailSelector } from "../useSelectedSessionDetailSelector";
import { useFilterConditionSelector } from "../useFilteredConditionSelector";

describe("Session selector hooks", () => {
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
