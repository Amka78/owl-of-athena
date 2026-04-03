import { renderHook } from "@testing-library/react-native";

const mockSettings = { profileTitle: "Test Profile", alarmHour: 7, alarmMinute: 0 };

jest.mock("react-redux", () => ({
    useSelector: jest.fn((selector: any) =>
        selector({
            aurora: { userSettings: mockSettings },
            auth: {},
            app: {},
            profile: {},
            session: {},
        })
    ),
    useDispatch: () => jest.fn(),
}));

import { useSettingsSelector } from "../useSettingsSelector";

describe("useSettingsSelector", () => {
    it("returns userSettings from state", () => {
        const { result } = renderHook(() => useSettingsSelector());
        expect(result.current).toEqual(mockSettings);
    });
});
