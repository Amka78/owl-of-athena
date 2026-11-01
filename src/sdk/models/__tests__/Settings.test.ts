import { Settings } from "../Settings";

describe("Settings UnitTest", () => {
    it("keeps midnight as 0 hour and 0 minute", () => {
        const settings = new Settings({ alarmHour: 0, alarmMinute: 0 });

        expect(settings.alarmHour).toBe(0);
        expect(settings.alarmMinute).toBe(0);
    });

    it("uses 8:00 when the alarm time is missing", () => {
        const settings = new Settings({});

        expect(settings.alarmHour).toBe(8);
        expect(settings.alarmMinute).toBe(0);
    });

    it("keeps the given alarm time", () => {
        const settings = new Settings({ alarmHour: 7, alarmMinute: 45 });

        expect(settings.alarmHour).toBe(7);
        expect(settings.alarmMinute).toBe(45);
    });

    it("keeps the given zero volume", () => {
        const settings = new Settings({ alarmVolume: 0 });

        expect(settings.alarmVolume).toBe(0);
    });
});
