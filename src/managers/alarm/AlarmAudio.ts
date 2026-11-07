//#region Import Modules
import { type AudioPlayer, setAudioModeAsync } from "expo-audio";
import { Platform } from "react-native";
import { boostSystemVolume, restoreSystemVolume } from "./SystemVolumeBooster";

//#endregion

//#region Constants
const DEFAULT_ALARM_VOLUME = 0.8;

/** Web の自動再生ポリシーを解除するために再生を試みる時間。 */
const WEB_UNLOCK_DURATION_MS = 120;

/**
 * iOS 版が Playback + mixWithOthers で鳴らしていたため、同じ挙動に合わせている。
 * Android はアラームが他の音に負けないよう doNotMix を維持する。
 */
const AUDIO_MODE = {
    allowsRecording: false,
    playsInSilentMode: true,
    shouldPlayInBackground: true,
    interruptionMode: "mixWithOthers",
    interruptionModeAndroid: "doNotMix",
    shouldRouteThroughEarpiece: false,
} as const;
//#endregion

//#region Class
export class AlarmAudio {
    private activeSound?: AudioPlayer;

    /**
     * アプリ起動時に一度だけ呼ぶ。Web には音声セッションの概念がないため何もしない。
     */
    public async configureSession(): Promise<void> {
        if (Platform.OS === "web") return;
        try {
            await setAudioModeAsync(AUDIO_MODE);
        } catch (e) {
            console.error("[AlarmAudio] failed to configure audio session", e);
        }
    }

    /**
     * Web はユーザー操作を伴わない再生を拒否するため、
     * GO TO BED 押下などの操作中に一度無音で再生して解除しておく。
     */
    public async unlock(sound: AudioPlayer): Promise<void> {
        if (Platform.OS !== "web") return;
        try {
            await this.stop();
            sound.volume = 0;
            sound.play();
            await new Promise((resolve) => setTimeout(resolve, WEB_UNLOCK_DURATION_MS));
            sound.pause();
            await sound.seekTo(0);
        } catch (e) {
            console.error("[AlarmAudio] failed to unlock audio playback", e);
        }
    }

    public async playLoop(sound: AudioPlayer, volume?: number): Promise<void> {
        if (this.activeSound !== undefined && this.activeSound !== sound) {
            await this.stop();
        }
        try {
            sound.loop = true;
            sound.volume = clampVolume(volume);
            await sound.seekTo(0);
            sound.play();
            this.activeSound = sound;
            await boostSystemVolume();
        } catch (e) {
            this.activeSound = undefined;
            throw e;
        }
    }

    public async stop(): Promise<void> {
        const sound = this.activeSound;
        if (sound === undefined) return;
        this.activeSound = undefined;
        try {
            sound.pause();
            sound.loop = false;
            await sound.seekTo(0);
        } catch (e) {
            console.error("[AlarmAudio] failed to stop alarm sound", e);
        } finally {
            await restoreSystemVolume();
        }
    }

    public isPlaying(): boolean {
        return this.activeSound !== undefined;
    }
}
//#endregion

//#region Function
function clampVolume(volume?: number): number {
    if (typeof volume !== "number" || Number.isNaN(volume)) {
        return DEFAULT_ALARM_VOLUME;
    }
    return Math.min(Math.max(volume, 0), 1);
}
//#endregion

//#region Export
export default new AlarmAudio();
//#endregion
