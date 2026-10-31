//#region Import Modules
import type { Audio } from "expo-av";

import { AlarmAudio } from "../AlarmAudio";

//#endregion

//#region Function
const createSound = () => ({
    playAsync: jest.fn(() => Promise.resolve()),
    stopAsync: jest.fn(() => Promise.resolve()),
    setIsLoopingAsync: jest.fn(() => Promise.resolve()),
    setVolumeAsync: jest.fn(() => Promise.resolve()),
});

const asSound = (sound: ReturnType<typeof createSound>): Audio.Sound =>
    sound as unknown as Audio.Sound;
//#endregion

//#region Tests
describe("AlarmAudio UnitTest", () => {
    it("plays the sound on loop with the given volume", async () => {
        const audio = new AlarmAudio();
        const sound = createSound();

        await audio.playLoop(asSound(sound), 0.5);

        expect(sound.setIsLoopingAsync).toHaveBeenCalledWith(true);
        expect(sound.setVolumeAsync).toHaveBeenCalledWith(0.5);
        expect(sound.playAsync).toHaveBeenCalledTimes(1);
        expect(audio.isPlaying()).toBe(true);
    });

    it("uses the default volume when no volume is given", async () => {
        const audio = new AlarmAudio();
        const sound = createSound();

        await audio.playLoop(asSound(sound), undefined);

        expect(sound.setVolumeAsync).toHaveBeenCalledWith(0.8);
    });

    it("clamps the volume into the 0..1 range", async () => {
        const audio = new AlarmAudio();
        const loud = createSound();
        const quiet = createSound();

        await audio.playLoop(asSound(loud), 1.5);
        await audio.playLoop(asSound(quiet), -1);

        expect(loud.setVolumeAsync).toHaveBeenCalledWith(1);
        expect(quiet.setVolumeAsync).toHaveBeenCalledWith(0);
    });

    it("stops the previous sound when another sound starts", async () => {
        const audio = new AlarmAudio();
        const first = createSound();
        const second = createSound();

        await audio.playLoop(asSound(first), 0.5);
        await audio.playLoop(asSound(second), 0.5);

        expect(first.stopAsync).toHaveBeenCalledTimes(1);
        expect(second.playAsync).toHaveBeenCalledTimes(1);
    });

    it("stops and clears the active sound", async () => {
        const audio = new AlarmAudio();
        const sound = createSound();

        await audio.playLoop(asSound(sound), 0.5);
        await audio.stop();

        expect(sound.stopAsync).toHaveBeenCalledTimes(1);
        expect(sound.setIsLoopingAsync).toHaveBeenLastCalledWith(false);
        expect(audio.isPlaying()).toBe(false);
    });

    it("does nothing when stopped without an active sound", async () => {
        const audio = new AlarmAudio();

        await audio.stop();

        expect(audio.isPlaying()).toBe(false);
    });

    it("clears the active sound when playback fails", async () => {
        const audio = new AlarmAudio();
        const sound = createSound();
        sound.playAsync.mockRejectedValueOnce(new Error("playback failed"));

        await expect(audio.playLoop(asSound(sound), 0.5)).rejects.toThrow("playback failed");

        expect(audio.isPlaying()).toBe(false);
    });

    it("configures the audio session without throwing", async () => {
        const audio = new AlarmAudio();

        await expect(audio.configureSession()).resolves.toBeUndefined();
    });
});
//#endregion
