import { renderHook } from "@testing-library/react-native";
import { useAuroraStore } from "../../store/auroraStore";
import { useSettingsSelector } from "../useSettingsSelector";

const mockSettings = { profileTitle: "Test Profile", alarmHour: 7, alarmMinute: 0 };

describe("useSettingsSelector", () => {
    beforeEach(() => {
        useAuroraStore.setState({ userSettings: mockSettings } as any);
    });

    afterEach(() => {
        useAuroraStore.setState({ userSettings: undefined } as any);
    });

    it("returns userSettings from state", () => {
        const { result } = renderHook(() => useSettingsSelector());
        expect(result.current).toEqual(mockSettings);
    });
});
