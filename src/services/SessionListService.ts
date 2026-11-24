//#region Import Modules

import type { AuroraSession } from "../sdk/models";
import dayjs, { type Dayjs } from "../utils/dayjs";
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
    formatMonth: (sessionAt: Dayjs) => string,
): SessionListRow[] => {
    const rows: SessionListRow[] = [];
    let currentMonth = "";

    for (const session of sessions) {
        const sessionAt = dayjs(session.sessionAt);
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
