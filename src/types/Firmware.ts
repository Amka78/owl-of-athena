//#region Types
/** Supabase の firmware_releases テーブル 1 行分。 */
export type FirmwareRelease = {
    version: number;
    hexPath: string;
    notes?: string;
};

/** 端末に適用できる新しいファームウェア。 */
export type FirmwareUpdate = FirmwareRelease & {
    url: string;
};
//#endregion
