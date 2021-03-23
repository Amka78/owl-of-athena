import AuroraReducer from "../AuroraReducers";
import { SettingsActions } from "../../actions/SettingsActions";
import { AuroraState } from "../../state";
import { Settings } from "../../sdk/models";
describe("AuroraReducers-test", () => {
    let firstResult: AuroraState;
    const initialSetting = new Settings({});
    const testUserId = "testid";
    beforeAll(() => {
        const state: AuroraState = {
            userSettings: new Settings({}),
        };

        initialSetting.userId = testUserId;
        const action: SettingsActions = {
            payload: {
                data: initialSetting,
            },
            type: "CACHE_SETTINGS",
        };
        firstResult = AuroraReducer(state, action);
    });
    it("initialize userSettings succeed.", () => {
        expect(firstResult.userSettings).toEqual(initialSetting);
    });

    it("update UserSetting.", () => {
        const updateSetting = new Settings({ profileTitle: "update" });
        const updateAction: SettingsActions = {
            payload: {
                data: updateSetting,
            },
            type: "CACHE_SETTINGS",
        };

        const updateResult = AuroraReducer(firstResult, updateAction);

        expect(updateResult.userSettings.profileTitle).toBe("update");
    });
});
