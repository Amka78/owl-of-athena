import AuroraReducer from "../AuroraReducers";
import { SettingsActions } from "../../actions";
import { AuroraState } from "../../state";
import { Settings } from "../../sdk/models";
import { AuroraProfile } from "../../sdk/AuroraTypes";
describe("AuroraReducers-test", () => {
    let firstResult: AuroraState;
    const initialSetting = new Settings({});
    const testUserId = "testid";
    beforeAll(() => {
        const state: AuroraState = {
            profileList: new Array<AuroraProfile>(),
            settingList: new Array<Settings>(),
            userSettings: new Settings({})
        };

        initialSetting.userId = testUserId;
        const action: SettingsActions = {
            payload: {
                data: initialSetting,
                userId: testUserId
            },
            type: "UPDATE_SETTINGS"
        };
        firstResult = AuroraReducer(state, action);
    });
    it("initialize userSettings succeed.", () => {
        expect(firstResult.userSettings).toEqual(initialSetting);
        expect(firstResult.settingList.length).toBe(1);
    });

    it("update UserSetting by same user.", () => {
        const updateSetting = new Settings({ profileTitle: "update" });
        const updateAction: SettingsActions = {
            payload: {
                data: updateSetting,
                userId: testUserId
            },
            type: "UPDATE_SETTINGS"
        };

        const updateResult = AuroraReducer(firstResult, updateAction);

        expect(updateResult.userSettings!.profileTitle).toBe("update");
        expect(updateResult.settingList.length).toBe(1);
    });

    it("update UserSetting by different user.", () => {
        const testDifferentUserId = "differentUser";
        const updateSetting = new Settings({});
        const updateAction: SettingsActions = {
            payload: {
                data: updateSetting,
                userId: testDifferentUserId
            },
            type: "UPDATE_SETTINGS"
        };

        const updateResult = AuroraReducer(firstResult, updateAction);

        expect(updateResult.userSettings).toEqual(updateSetting);
        expect(updateResult.settingList.length).toBe(2);
    });
});
