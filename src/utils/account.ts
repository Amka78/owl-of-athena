//#region Import Modules

import type { User } from "../types";
import dayjs from "./dayjs";
//#endregion

//#region Types
export type AccountEdits = {
    firstName: string;
    lastName: string;
    gender: string;
    birthDay: Date;
    countryCode: string;
    postalCode: string;
};
//#endregion

//#region Functions
/** 誕生日は iOS 版と同じ "yyyy-MM-dd"（端末ローカル）で保存する。 */
export const formatBirthday = (date: Date): string => dayjs(date).format("YYYY-MM-DD");

/** "yyyy-MM-dd" を UTC として解釈すると日付がずれるため、ローカルの日付として読む。 */
export const parseBirthday = (value?: string): Date => {
    const parsed = dayjs(value, "YYYY-MM-DD", true);
    if (parsed.isValid()) return parsed.toDate();

    const fallback = new Date(value ?? Date.now());
    return Number.isNaN(fallback.getTime()) ? new Date() : fallback;
};

/** 画面で編集した値を、保存用の User に反映する。 */
export const buildAccountUpdate = (user: User, edits: AccountEdits): User => ({
    ...user,
    first_name: edits.firstName,
    last_name: edits.lastName,
    gender: edits.gender,
    birthday: formatBirthday(edits.birthDay),
    country_code: edits.countryCode.trim().toUpperCase(),
    postal_code: edits.postalCode.trim(),
});
//#endregion
