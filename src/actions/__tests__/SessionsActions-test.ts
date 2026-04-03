import {
    cacheSessions,
    cacheSessionDetails,
    updateFilter,
    selectSession,
    updateSession,
    deleteSession,
    selectSessionDetail,
    initializeSession,
} from "../SessionsActions";
import { AuroraSession, AuroraSessionDetail } from "../../sdk/models";
import { FilterByDateValues } from "../../state/SessionState";

const mockSession = { id: "session-1", starred: false } as AuroraSession;
const mockSessionDetail = { sessionId: "session-1" } as AuroraSessionDetail;

describe("SessionsActions", () => {
    it("cacheSessions creates correct action", () => {
        const result = cacheSessions([mockSession]);
        expect(result.type).toBe("CACHE_SESSIONS");
        expect(result.payload.sessionList).toEqual([mockSession]);
    });

    it("cacheSessionDetails creates correct action", () => {
        const result = cacheSessionDetails([mockSessionDetail]);
        expect(result.type).toBe("CACHE_SESSION_DETAILS");
        expect(result.payload.sessionDetailList).toEqual([mockSessionDetail]);
    });

    it("updateFilter creates correct action", () => {
        const result = updateFilter({ byDate: FilterByDateValues.PAST_WEEK });
        expect(result.type).toBe("UPDATE_SESSION_FILTER");
        expect(result.payload.filter.byDate).toBe(FilterByDateValues.PAST_WEEK);
    });

    it("selectSession creates correct action", () => {
        const result = selectSession(mockSession);
        expect(result.type).toBe("SELECT_SESSION");
        expect(result.payload.session).toEqual(mockSession);
    });

    it("updateSession creates correct action", () => {
        const result = updateSession(mockSession);
        expect(result.type).toBe("UPDATE_SESSION");
        expect(result.payload.session).toEqual(mockSession);
    });

    it("deleteSession creates correct action", () => {
        const result = deleteSession("session-1");
        expect(result.type).toBe("DELETE_SESSION");
        expect(result.payload.sessionId).toBe("session-1");
    });

    it("selectSessionDetail creates correct action", () => {
        const result = selectSessionDetail(mockSessionDetail);
        expect(result.type).toBe("SELECT_SESSION_DETAIL");
        expect(result.payload.sessionDetail).toEqual(mockSessionDetail);
    });

    it("initializeSession creates correct action", () => {
        const result = initializeSession();
        expect(result.type).toBe("INITIALIZE_SESSION");
    });
});
