//#region Import Modules
import { Audio, type AudioMode, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { Platform } from "react-native";

//#endregion

//#region Constants
const DEFAULT_ALARM_VOLUME = 0.8;

/** Web の自動再生ポリシーを解除するために再生を試みる時間。 */
const WEB_UNLOCK_DURATION_MS = 120;

/** iOS 版が Playback + mixWithOthers で鳴らしていたため、同じ挙動に合わせている。 */
const AUDIO_MODE: Partial<AudioMode> = {
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
    staysActiveInBackground: true,
    interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
    shouldDuckAndroid: false,
    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    playThroughEarpieceAndroid: false,
};
//#endregion

//#region Class
export class AlarmAudio {
    private activeSound?: Audio.Sound;

    /**
     * アプリ起動時に一度だけ呼ぶ。Web には音声セッションの概念がないため何もしない。
     */
    public async configureSession(): Promise<void> {
        if (Platform.OS === "web") return;
        try {
            await Audio.setAudioModeAsync(AUDIO_MODE);
        } catch (e) {
            console.error("[AlarmAudio] failed to configure audio session", e);
        }
    }

    /**
     * Web はユーザー操作を伴わない再生を拒否するため、
     * GO TO BED 押下などの操作中に一度無音で再生して解除しておく。
     */
    public async unlock(sound: Audio.Sound): Promise<void> {
        if (Platform.OS !== "web") return;
        try {
            await this.stop();
            await sound.setVolumeAsync(0);
            await sound.playAsync();
            await new Promise((resolve) => setTimeout(resolve, WEB_UNLOCK_DURATION_MS));
            await sound.stopAsync();
        } catch (e) {
            console.error("[AlarmAudio] failed to unlock audio playback", e);
        }
    }

    public async playLoop(sound: Audio.Sound, volume?: number): Promise<void> {
        if (this.activeSound !== undefined && this.activeSound !== sound) {
            await this.stop();
        }
        try {
            await sound.setIsLoopingAsync(true);
            await sound.setVolumeAsync(clampVolume(volume));
            await sound.playAsync();
            this.activeSound = sound;
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
            await sound.stopAsync();
            await sound.setIsLoopingAsync(false);
        } catch (e) {
            console.error("[AlarmAudio] failed to stop alarm sound", e);
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
