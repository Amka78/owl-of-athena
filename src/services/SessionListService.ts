//#region Import Modules
import moment, { type Moment } from "moment";
import type { AuroraSession } from "../sdk/models";
//#endregion

//#region Types
export type SessionListRow =
    | { type: "month"; key: string; label: string }
    | { type: "session"; key: string; session: AuroraSession };
//#endregion

//#region Functions
/**
 * セッションを月ごとの見出し付きの行に変換する。
 * セッションは日時の降順で並んでいる前提。
 */
export const buildSessionListRows = (
    sessions: AuroraSession[],
    formatMonth: (sessionAt: Moment) => string,
): SessionListRow[] => {
    const rows: SessionListRow[] = [];
    let currentMonth = "";

    for (const session of sessions) {
        const sessionAt = moment(session.sessionAt);
        const monthKey = sessionAt.format("YYYY-MM");

        if (monthKey !== currentMonth) {
            currentMonth = monthKey;
            rows.push({
                type: "month",
                key: `month-${monthKey}`,
                label: formatMonth(sessionAt),
            });
        }

        rows.push({ type: "session", key: session.id, session });
    }

    return rows;
};
//#endregion
