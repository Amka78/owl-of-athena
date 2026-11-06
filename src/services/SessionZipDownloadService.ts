//#region Import Modules
import type { AuroraSession, AuroraSessionDetail } from "../sdk/models";
import {
    buildSessionCollectionZipFileName,
    buildSessionZip,
    buildSessionZipFileName,
    type SessionZipItem,
} from "./SessionZipService";
import { downloadZipFile } from "./ZipDownloadService";
//#endregion

//#region Functions
/** 1 セッションを ZIP にしてダウンロード／共有する。 */
export const downloadSessionZip = async (
    session: AuroraSession,
    detail?: AuroraSessionDetail,
): Promise<void> => {
    await downloadZipFile(buildSessionZipFileName(session), buildSessionZip([{ session, detail }]));
};

/** 複数セッションを 1 つの ZIP にまとめてダウンロード／共有する。 */
export const downloadSessionCollectionZip = async (items: SessionZipItem[]): Promise<void> => {
    await downloadZipFile(
        buildSessionCollectionZipFileName(),
        buildSessionZip(items, { collection: true }),
    );
};
//#endregion
