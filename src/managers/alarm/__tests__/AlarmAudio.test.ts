//#region Import Modules
import type { AudioPlayer } from "expo-audio";

import { AlarmAudio } from "../AlarmAudio";

//#endregion

//#region Function
const createPlayer = () => ({
    loop: false,
    volume: 1,
    playing: false,
    play: jest.fn(),
    pause: jest.fn(),
    seekTo: jest.fn(() => Promise.resolve()),
});

const asPlayer = (player: ReturnType<typeof createPlayer>): AudioPlayer =>
    player as unknown as AudioPlayer;
//#endregion

//#region Tests
describe("AlarmAudio UnitTest", () => {
    it("plays the sound on loop with the given volume", async () => {
        const audio = new AlarmAudio();
        const player = createPlayer();

        await audio.playLoop(asPlayer(player), 0.5);

        expect(player.loop).toBe(true);
        expect(player.volume).toBe(0.5);
        expect(player.seekTo).toHaveBeenCalledWith(0);
        expect(player.play).toHaveBeenCalledTimes(1);
        expect(audio.isPlaying()).toBe(true);
    });

    it("uses the default volume when no volume is given", async () => {
        const audio = new AlarmAudio();
        const player = createPlayer();

        await audio.playLoop(asPlayer(player), undefined);

        expect(player.volume).toBe(0.8);
    });

    it("clamps the volume into the 0..1 range", async () => {
        const audio = new AlarmAudio();
        const loud = createPlayer();
        const quiet = createPlayer();

        await audio.playLoop(asPlayer(loud), 1.5);
        await audio.playLoop(asPlayer(quiet), -1);

        expect(loud.volume).toBe(1);
        expect(quiet.volume).toBe(0);
    });

    it("stops the previous sound when another sound starts", async () => {
        const audio = new AlarmAudio();
        const first = createPlayer();
        const second = createPlayer();

        await audio.playLoop(asPlayer(first), 0.5);
        await audio.playLoop(asPlayer(second), 0.5);

        expect(first.pause).toHaveBeenCalledTimes(1);
        expect(second.play).toHaveBeenCalledTimes(1);
    });

    it("stops and clears the active sound", async () => {
        const audio = new AlarmAudio();
        const player = createPlayer();

        await audio.playLoop(asPlayer(player), 0.5);
        await audio.stop();

        expect(player.pause).toHaveBeenCalledTimes(1);
        expect(player.loop).toBe(false);
        expect(player.seekTo).toHaveBeenLastCalledWith(0);
        expect(audio.isPlaying()).toBe(false);
    });

    it("does nothing when stopped without an active sound", async () => {
        const audio = new AlarmAudio();

        await audio.stop();

        expect(audio.isPlaying()).toBe(false);
    });

    it("clears the active sound when playback fails", async () => {
        const audio = new AlarmAudio();
        const player = createPlayer();
        player.seekTo.mockRejectedValueOnce(new Error("playback failed"));

        await expect(audio.playLoop(asPlayer(player), 0.5)).rejects.toThrow("playback failed");

        expect(audio.isPlaying()).toBe(false);
    });

    it("configures the audio session without throwing", async () => {
        const audio = new AlarmAudio();

        await expect(audio.configureSession()).resolves.toBeUndefined();
    });
});
//#endregion