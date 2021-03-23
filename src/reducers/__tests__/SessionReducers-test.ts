//#region "Import modules"
import SessionReducers, { initialState } from "../SessionReducers";
import { CacheAction, DeleteSession } from "../../actions/SessionsActions";
import { SessionState } from "../../state";
import { AuroraSession } from "../../sdk/models";
import { AuroraSessionJson } from "../../sdk/AuroraTypes";
//#endregion

describe("SessionReducers-test", () => {
    const initialSessionList = new Array<AuroraSession>();
    let firstResult: SessionState;
    beforeAll(() => {
        initialSessionList.push(createAuroraSessionForTest({ id: "test-1" }));
        initialSessionList.push(createAuroraSessionForTest({ id: "test-2" }));
        initialSessionList.push(
            createAuroraSessionForTest({ id: "test-3", starred: true })
        );
        initialSessionList.push(
            createAuroraSessionForTest({ id: "test-4", notes: "testNode" })
        );
        const action: CacheAction = {
            payload: {
                sessionList: initialSessionList,
            },
            type: "CACHE_SESSIONS",
        };
        firstResult = SessionReducers(initialState, action);
    });
    it("Must be able to save your session to a cache.", () => {
        expect(firstResult.sessionList).toEqual(initialSessionList);
        expect(firstResult.sessionList.length).toBe(4);
        expect(firstResult.filteredSessionList.length).toBe(4);
    });

    it("Specifying that the ID session will be deleted", () => {
        const deleteAction: DeleteSession = {
            payload: {
                sessionId: "test-1",
            },
            type: "DELETE_SESSION",
        };
        const deleteResult = SessionReducers(firstResult, deleteAction);

        expect(deleteResult.sessionList.length).toBe(3);
        expect(deleteResult.filteredSessionList.length).toBe(3);
    });
});

const createAuroraSessionForTest = (
    session: Partial<AuroraSessionJson>
): AuroraSession => {
    session.id ? session.id : (session.id = "test-1");
    session.app_platform
        ? session.app_platform
        : (session.app_platform = "win");
    session.app_version ? session.app_version : (session.app_version = 2000);
    session.asleep_at ? session.asleep_at : (session.asleep_at = 4000);
    session.aurora_profile_id
        ? session.aurora_profile_id
        : (session.aurora_profile_id = "testProfileId");
    session.aurora_profile_name
        ? session.aurora_profile_name
        : (session.aurora_profile_name = "testProfileName");
    session.awake_at ? session.awake_at : (session.awake_at = 4000);
    session.awake_duration
        ? session.awake_duration
        : (session.awake_duration = 4000);
    session.create_at ? session.create_at : (session.create_at = 4000);
    session.deep_duration
        ? session.deep_duration
        : (session.deep_duration = 4000);
    session.firmware_version
        ? session.firmware_version
        : (session.firmware_version = 3000);
    session.incomplete ? session.incomplete : (session.incomplete = true);
    session.light_duration
        ? session.light_duration
        : (session.light_duration = 4000);
    session.no_signal_duration
        ? session.no_signal_duration
        : (session.no_signal_duration = 4000);
    session.notes = session.notes ? session.notes : (session.notes = "test");
    session.rem_duration = session.rem_duration
        ? session.rem_duration
        : (session.rem_duration = 4000);
    session.session_at = session.session_at
        ? session.session_at
        : (session.session_at = 4000);
    session.session_duration = session.session_duration
        ? session.session_duration
        : (session.session_duration = 4000);
    session.session_txt = session.session_txt
        ? session.session_txt
        : (session.session_txt = "session_txt");
    session.session_url = session.session_url
        ? session.session_url
        : (session.session_url = "session_url");
    session.sleep_onset = session.sleep_onset
        ? session.sleep_onset
        : (session.sleep_onset = 200);
    session.sleep_duration = session.sleep_duration
        ? session.sleep_duration
        : (session.sleep_duration = 4000);
    session.sleep_score = session.sleep_score
        ? session.sleep_score
        : (session.sleep_score = 90);
    session.starred = session.starred
        ? session.starred
        : (session.starred = false);
    session.user_id = session.user_id
        ? session.user_id
        : (session.user_id = "testId");
    session.type = "json";

    return new AuroraSession(session as AuroraSessionJson);
};
