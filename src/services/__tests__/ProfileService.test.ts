import type { Mock } from "bun:test";

import type { AuroraProfile } from "../../sdk/AuroraTypes";
import {
    checkProfileOptionConditions,
    createOfficialProfile,
    createProfileName,
    createProfileOptionValues,
    createProfileTitle,
    defaultOptions,
    groupingProfileOptionList,
    hasProfileUnsavedChanges,
    LED_EFFECT_DEFAULTS,
    normalizeProfileOptionValue,
    parseProfileOptions,
    processProfile,
} from "../ProfileService";

describe("ProfileService-test", () => {
    it("Successful creation of an official profile.", async () => {
        const fetchMock = fetch as unknown as Mock<any>;
        fetchMock.mockReturnValueOnce({
            text: async () => {
                return "test";
            },
        });
        const officialProfile = await createOfficialProfile();

        expect(officialProfile.id).toBe("F367G2");
        expect(officialProfile.options).toEqual(defaultOptions);
        expect(officialProfile.content).toBe("test");
        expect(fetchMock.mock.calls.length).toBe(1);
    });

    it("Successful grouping profile options", () => {
        const grouped = groupingProfileOptionList(defaultOptions);

        expect(grouped.length).toBe(3);
        expect(grouped[0][0]).toBe("REM Stim Options");
        expect(grouped[1][0]).toBe("Alarm Options");
        expect(grouped[2][0]).toBe("Misc Options");
    });

    it("parses options from an array or a JSON string", () => {
        expect(parseProfileOptions(defaultOptions)).toBe(defaultOptions);
        expect(parseProfileOptions(JSON.stringify(defaultOptions))).toEqual(defaultOptions);
        expect(parseProfileOptions("not json")).toEqual([]);
        expect(parseProfileOptions(undefined)).toEqual([]);
    });

    it("evaluates option conditions with = and ! operators", () => {
        const fileStream = defaultOptions.find((option) => option.name === "file-streams")!;

        expect(checkProfileOptionConditions(fileStream, { "file-output": "0x04" })).toBe(true);
        expect(checkProfileOptionConditions(fileStream, { "file-output": "0x02" })).toBe(true);
        expect(checkProfileOptionConditions(fileStream, { "file-output": "0x00" })).toBe(false);

        const wakeupBuzz = defaultOptions.find((option) => option.name === "wakeup-buzz")!;
        expect(checkProfileOptionConditions(wakeupBuzz, { "wakeup-time": undefined })).toBe(false);
        expect(checkProfileOptionConditions(wakeupBuzz, { "wakeup-time": null })).toBe(false);
        expect(checkProfileOptionConditions(wakeupBuzz, { "wakeup-time": 25200000 })).toBe(true);
    });

    it("normalizes time, slider, stream, toggle, LED and song values", () => {
        const timeField = {
            type: "time",
            clearable: true,
            labelCleared: "",
            minutesStep: 5,
            defaultTime: 0,
        } as const;
        const sliderField = {
            type: "slider",
            format: "hours",
            min: 0,
            max: 8,
            step: 0.5,
        } as const;
        const checkBoxField = {
            type: "checkboxes",
            choices: "streams",
            labelNone: "",
        } as const;
        const toggleField = { type: "toggle" } as const;
        const ledField = { type: "led-effect" } as const;
        const songField = { type: "buzz-song" } as const;

        expect(normalizeProfileOptionValue(25200000, timeField)).toBe("25200000");
        expect(normalizeProfileOptionValue(undefined, timeField)).toBe("-1");
        expect(normalizeProfileOptionValue(1.5, sliderField)).toBe("5400000");
        expect(normalizeProfileOptionValue([0, 1, 10], checkBoxField)).toBe("0x00000403");
        expect(normalizeProfileOptionValue(true, toggleField)).toBe("1");
        expect(normalizeProfileOptionValue("0x04", toggleField)).toBe("0x04");
        expect(normalizeProfileOptionValue(LED_EFFECT_DEFAULTS.set, ledField)).toBe(
            "led-set 0x03 0xFF0000 0xFF 5000",
        );
        expect(
            normalizeProfileOptionValue(
                { song: "a_new_day.m4a", repeat: 2, volume: 50, tempoAdjust: 1.5, pitchAdjust: 3 },
                songField,
            ),
        ).toBe("buzz-song a_new_day.m4a 2 50 1.5 3");
        expect(normalizeProfileOptionValue({}, ledField)).toBe("");
    });

    it("processes profile content and keeps option values", () => {
        const profile: AuroraProfile = {
            id: "profile-1",
            name: "my.prof",
            title: "My Profile",
            description: "",
            type: "private",
            min_firmware_version: 0,
            content: "\n{wakeup-time:0}\n{file-streams:0x00000000}\n{stim-led:}\n{stim-buzz:}\n",
            options: defaultOptions,
            created_at: 0,
            updated_at: 0,
        };

        const processed = processProfile(profile, {
            "wakeup-time": 25200000,
            "file-streams": [0, 1, 10],
            "stim-led": LED_EFFECT_DEFAULTS.set,
            "stim-buzz": {
                song: "a_new_day.m4a",
                repeat: 1,
                volume: 80,
                tempoAdjust: 1,
                pitchAdjust: 0,
            },
        });

        expect(processed.content).toContain("{wakeup-time:25200000}");
        expect(processed.content).toContain("{file-streams:0x00000403}");
        expect(processed.content).toContain("{stim-led:led-set 0x03 0xFF0000 0xFF 5000}");
        expect(processed.content).toContain("{stim-buzz:buzz-song a_new_day.m4a 1 80 1 0}");
        expect(processed.content).not.toContain("\n\n");
        expect(processed.content.split("\r\n").length).toBeGreaterThan(1);
        expect(processed.options).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: "wakeup-time", value: 25200000 }),
                expect.objectContaining({ name: "file-streams", value: [0, 1, 10] }),
            ]),
        );
    });

    it("detects unsaved changes", () => {
        const profile: AuroraProfile = {
            id: "profile-1",
            name: "my.prof",
            title: "My Profile",
            description: "",
            type: "private",
            min_firmware_version: 0,
            content: "",
            options: defaultOptions,
            created_at: 0,
            updated_at: 0,
        };

        const values = createProfileOptionValues(defaultOptions);
        expect(hasProfileUnsavedChanges(profile, {})).toBe(true);
        expect(hasProfileUnsavedChanges(profile, values)).toBe(false);
        expect(hasProfileUnsavedChanges(profile, { ...values, "stim-enabled": true })).toBe(true);
        expect(
            hasProfileUnsavedChanges(profile, {
                ...values,
                "stim-led": LED_EFFECT_DEFAULTS.blink,
            }),
        ).toBe(true);
    });

    it("creates unique titles and file names", () => {
        expect(createProfileTitle("Default Profile", [])).toBe("My Default Profile");
        expect(createProfileTitle("Default Profile", ["My Default Profile"])).toBe(
            "My Default Profile 2",
        );
        expect(
            createProfileTitle("Default Profile", ["My Default Profile", "My Default Profile 2"]),
        ).toBe("My Default Profile 3");

        const name = createProfileName([]);
        expect(name).toMatch(/^my-.+\.prof$/);
        expect(createProfileName([name])).not.toBe(name);
    });
});
