//#region Import Modules
import type { FirmwareRelease } from "../types";
import { supabase } from "./supabase";

//#endregion

//#region Constants
const TABLE_NAME = "firmware_releases";
const BUCKET_NAME = "firmware";
//#endregion

const optionalNumber = (value: unknown): number | undefined => {
    if (value === null || value === undefined) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
};

//#region Class
/**
 * ファームウェア配布情報の取得。
 * hex 本体は Supabase Storage に置き、テーブルには版とパスだけを持つ。
 */
export class FirmwareRestClient {
    public async getLatest(): Promise<FirmwareRelease | undefined> {
        // コンポーネント列が未適用の DB でもアプリ更新だけは動くよう * で読む。
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select("*")
            .order("version", { ascending: false })
            .limit(1);

        if (error) throw error;

        const row = data?.[0];
        if (row === undefined) return undefined;

        return {
            version: Number(row.version),
            hexPath: row.hex_path,
            notes: row.notes ?? undefined,
            bootloaderVersion: optionalNumber(row.bootloader_version),
            bootloaderHexPath: row.bootloader_hex_path ?? undefined,
            bootloaderHasBootstrap: row.bootloader_has_bootstrap === true,
            bootloaderNotes: row.bootloader_notes ?? undefined,
            bleVersion: optionalNumber(row.ble_version),
            bleHexPath: row.ble_hex_path ?? undefined,
            bleNotes: row.ble_notes ?? undefined,
        };
    }

    public getHexUrl(hexPath: string): string {
        return supabase.storage.from(BUCKET_NAME).getPublicUrl(hexPath).data.publicUrl;
    }
}
//#endregion

//#region Export
export default new FirmwareRestClient();
//#endregion
