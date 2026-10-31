//#region Import Modules
import type { AlarmKeepAlive, AlarmKeepAliveReason } from "./AlarmKeepAliveTypes";

//#endregion

//#region Class
/**
 * Web にはバックグラウンド実行の仕組みがないため何もしない。
 * タブを開いている間は AlarmRuntime のタイマーと音声再生がそのまま動く。
 */
class WebAlarmKeepAlive implements AlarmKeepAlive {
    public async acquire(reason: AlarmKeepAliveReason): Promise<void> {
        console.debug(
            `[AlarmKeepAlive] requested (${reason}) but web has no background keep-alive.`,
        );
    }

    public async release(): Promise<void> {
        return;
    }
}
//#endregion

//#region Export
export default new WebAlarmKeepAlive();
//#endregion
