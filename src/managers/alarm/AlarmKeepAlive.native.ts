//#region Import Modules
import { type AudioPlayer, createAudioPlayer } from "expo-audio";

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
 * アラーム音（AlarmAudio）とは別の player を使い、
 * 鳴動中の stop で無音ループまで止まらないようにしている。
 */
class NativeAlarmKeepAlive implements AlarmKeepAlive {
    private player?: AudioPlayer;
    private acquired = false;

    public async acquire(reason: AlarmKeepAliveReason): Promise<void> {
        if (this.acquired) return;

        try {
            if (this.player === undefined) {
                this.player = createAudioPlayer(require("../../../assets/audio/silence.wav"), {
                    keepAudioSessionActive: true,
                });
            }
            this.player.loop = true;
            this.player.volume = SILENCE_VOLUME;
            this.player.play();
            this.acquired = true;
            console.debug(`[AlarmKeepAlive] acquired (${reason}).`);
        } catch (e) {
            console.error("[AlarmKeepAlive] failed to keep the app alive:", e);
        }
    }

    public async release(): Promise<void> {
        if (!this.acquired || this.player === undefined) {
            this.acquired = false;
            return;
        }

        this.acquired = false;
        try {
            this.player.pause();
            await this.player.seekTo(0);
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
