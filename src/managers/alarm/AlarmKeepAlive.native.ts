//#region Import Modules
import { Audio } from "expo-av";

import type { AlarmKeepAlive, AlarmKeepAliveReason } from "./AlarmKeepAliveTypes";

//#endregion

//#region Constants
/**
 * 音量 0 だと iOS がオーディオセッションを畳んでしまうことがあるため、
 * 可聴域外のごく小さい音量で無音ループを鳴らし続ける。
 */
const SILENCE_VOLUME = 0.001;
//#endregion

//#region Class
/**
 * iOS/Android 用。アプリ起動中に無音ループを再生してプロセスを生かし、
 * AlarmRuntime のタイマーがバックグラウンドでも発火できる状態を保つ。
 *
 * アラーム音（AlarmAudio）とは別の Sound インスタンスを使い、
 * 鳴動中の stop で無音ループまで止まらないようにしている。
 */
class NativeAlarmKeepAlive implements AlarmKeepAlive {
    private sound?: Audio.Sound;
    private acquired = false;

    public async acquire(reason: AlarmKeepAliveReason): Promise<void> {
        if (this.acquired) return;

        try {
            if (this.sound === undefined) {
                const created = await Audio.Sound.createAsync(
                    require("../../../assets/audio/silence.wav"),
                    { isLooping: true, volume: SILENCE_VOLUME, shouldPlay: true },
                );
                this.sound = created.sound;
            } else {
                await this.sound.setIsLoopingAsync(true);
                await this.sound.setVolumeAsync(SILENCE_VOLUME);
                await this.sound.playAsync();
            }
            this.acquired = true;
            console.debug(`[AlarmKeepAlive] acquired (${reason}).`);
        } catch (e) {
            console.error("[AlarmKeepAlive] failed to keep the app alive:", e);
        }
    }

    public async release(): Promise<void> {
        if (!this.acquired || this.sound === undefined) {
            this.acquired = false;
            return;
        }

        this.acquired = false;
        try {
            await this.sound.stopAsync();
            console.debug("[AlarmKeepAlive] released.");
        } catch (e) {
            console.error("[AlarmKeepAlive] failed to stop the keep-alive sound:", e);
        }
    }

    public isActive(): boolean {
        return this.acquired;
    }
}
//#endregion

//#region Export
export default new NativeAlarmKeepAlive();
//#endregion
