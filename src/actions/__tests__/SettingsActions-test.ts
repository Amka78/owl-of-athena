jest.mock("expo-av", () => ({
    Audio: { Sound: { createAsync: jest.fn() }, setAudioModeAsync: jest.fn() },
    Video: {},
}));

import { cacheSettings, initialize } from "../SettingsActions";
import { Settings } from "../../sdk/models";

describe("SettingsActions", () => {
    it("cacheSettings creates correct action", () => {
        const settings = new Settings({});
        const result = cacheSettings(settings);
        expect(result.type).toBe("CACHE_SETTINGS");
        expect(result.payload.data).toEqual(settings);
    });

    it("initialize creates correct action", () => {
        const result = initialize();
        expect(result.type).toBe("INITIALIZE_AURORA");
    });
});
