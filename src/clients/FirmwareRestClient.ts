//#region Import Modules
import type { FirmwareRelease } from "../types";
import { supabase } from "./supabase";

//#endregion

//#region Constants
const TABLE_NAME = "firmware_releases";
const BUCKET_NAME = "firmware";
//#endregion

//#region Class
/**
 * ファームウェア配布情報の取得。
 * hex 本体は Supabase Storage に置き、テーブルには版とパスだけを持つ。
 */
export class FirmwareRestClient {
    public async getLatest(): Promise<FirmwareRelease | undefined> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select("version, hex_path, notes")
            .order("version", { ascending: false })
            .limit(1);

        if (error) throw error;

        const row = data?.[0];
        if (row === undefined) return undefined;

        return {
            version: Number(row.version),
            hexPath: row.hex_path,
            notes: row.notes ?? undefined,
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
