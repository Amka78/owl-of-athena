//#region Import Modules
import type { AuroraSession } from "../sdk/models/AuroraSession";
import type { AuroraSessionDetail } from "../sdk/models/AuroraSessionDetail";
//#endregion

//#region Types
/** pushSessions の結果。同期件数と失敗件数を画面側で通知するために返す。 */
export type SessionSyncResult = {
    sessions: Array<AuroraSession>;
    sessionDetails: Array<AuroraSessionDetail>;
    syncedCount: number;
    failedCount: number;
    removedEmptyCount: number;
};
//#endregion
