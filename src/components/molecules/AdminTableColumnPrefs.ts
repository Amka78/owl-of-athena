//#region Import Modules
import AsyncStorage from "@react-native-async-storage/async-storage";

//#endregion

//#region Constants
const STORAGE_KEY_PREFIX = "adminTable.hiddenColumns.";
//#endregion

//#region Functions
/** 保存済みの非表示列を返す。未保存なら undefined（列定義の hidden を使う）。 */
export const loadHiddenColumns = async (storageKey: string): Promise<string[] | undefined> => {
    try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY_PREFIX + storageKey);
        if (raw === null) {
            return undefined;
        }
        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return undefined;
        }
        return parsed.filter((value): value is string => typeof value === "string");
    } catch {
        return undefined;
    }
};

/** 非表示列を保存する。保存に失敗してもテーブル操作は止めない。 */
export const saveHiddenColumns = async (storageKey: string, titles: string[]): Promise<void> => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY_PREFIX + storageKey, JSON.stringify(titles));
    } catch {
        // 設定が保存できなくても表示切替自体は継続する。
    }
};
//#endregion
