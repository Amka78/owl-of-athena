import { Profile } from "../Profile";
import path from "path";
import fs from "fs";
let content: string;

let profile: Profile;
describe("Profile Test", () => {
    beforeAll(() => {
        const testProfile = "DefaultProfile.mock";

        const result = fs.readFileSync(path.join(__dirname, testProfile));

        content = result.toString();
        profile = new Profile(content);
    });

    it("Is the profile information read correctly?", (): void => {
        expect(profile.stimDelay).toBe(14400000);
        expect(profile.stimInterval).toBe(300000);
        expect(profile.stimEnabled).toBeFalsy();
        expect(profile.wakeupWindow).toBe(1800000);
        expect(profile.saEnabled).toBeFalsy();
        expect(profile.dslEnabled).toBeFalsy();
        expect(profile.streamDebug).toBeFalsy();
        expect(profile.wakeupTime).toBe(-1);

        expect(profile.raw).toBe(content);
    });

    it("Is the profile information modify correctly", (): void => {
        const testStimDelay = 200;
        const testStimInterval = 300;
        const testWakeupWindow = 400;
        const testWakeupTime = 500;

        profile.stimDelay = testStimDelay;
        profile.stimInterval = testStimInterval;
        profile.stimEnabled = true;
        profile.wakeupWindow = testWakeupWindow;
        profile.saEnabled = true;
        profile.dslEnabled = true;
        profile.streamDebug = true;
        profile.wakeupTime = testWakeupTime;

        expect(profile.stimDelay).toBe(testStimDelay);
        expect(profile.stimInterval).toBe(testStimInterval);
        expect(profile.stimEnabled).toBeTruthy();
        expect(profile.wakeupWindow).toBe(testWakeupWindow);
        expect(profile.saEnabled).toBeTruthy();
        expect(profile.dslEnabled).toBeTruthy();
        expect(profile.streamDebug).toBeTruthy();
        expect(profile.wakeupTime).toBe(testWakeupTime);
        expect(profile.raw).not.toBe(content);

        profile = new Profile(profile.raw);

        expect(profile.stimDelay).toBe(testStimDelay);
        expect(profile.stimInterval).toBe(testStimInterval);
        expect(profile.stimEnabled).toBeTruthy();
        expect(profile.wakeupWindow).toBe(testWakeupWindow);
        expect(profile.saEnabled).toBeTruthy();
        expect(profile.dslEnabled).toBeTruthy();
        expect(profile.streamDebug).toBeTruthy();
        expect(profile.wakeupTime).toBe(testWakeupTime);
        expect(profile.raw).not.toBe(content);
    });
});
