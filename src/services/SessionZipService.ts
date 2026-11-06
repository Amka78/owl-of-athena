//#region Import Modules
import { strToU8, zipSync } from "fflate";
import moment from "moment";
import type { AuroraSession, AuroraSessionDetail } from "../sdk/models";
import { buildSessionEventsCsv, buildSessionExportJson } from "./ExportService";
//#endregion

//#region Types
export type SessionZipItem = {
    session: AuroraSession;
    detail?: AuroraSessionDetail;
};
//#endregion

//#region Functions
const sessionIdPart = (session: AuroraSession): string => {
    return session.id.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 8) || "session";
};

const sessionTimestamp = (session: AuroraSession): string => {
    return moment.utc(session.sessionAt ?? 0).format("YYYYMMDD-HHmmss");
};

/** 1 セッション分の ZIP ファイル名。 */
export const buildSessionZipFileName = (session: AuroraSession): string => {
    return `session-${sessionTimestamp(session)}-${sessionIdPart(session)}.zip`;
};

/** 複数セッションをまとめた ZIP ファイル名。 */
export const buildSessionCollectionZipFileName = (): string => {
    return `sessions-${moment().format("YYYYMMDD-HHmmss")}.zip`;
};

const buildEntries = (item: SessionZipItem, prefix: string): Record<string, Uint8Array> => {
    return {
        [`${prefix}session.json`]: strToU8(buildSessionExportJson(item.session, item.detail)),
        [`${prefix}events.csv`]: strToU8(buildSessionEventsCsv(item.session, item.detail)),
    };
};

/**
 * セッションの ZIP を作る。collection が true の場合は
 * `Sessions/<日時>_<ID>/` の下にセッションごとのファイルを置く。
 */
export const buildSessionZip = (
    items: SessionZipItem[],
    options: { collection?: boolean } = {},
): Uint8Array => {
    const entries: Record<string, Uint8Array> = {};

    for (const item of items) {
        const prefix = options.collection
            ? `Sessions/${sessionTimestamp(item.session)}_${sessionIdPart(item.session)}/`
            : "";
        Object.assign(entries, buildEntries(item, prefix));
    }

    return zipSync(entries, { level: 6 });
};
//#endregion
