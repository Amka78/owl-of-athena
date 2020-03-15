import * as Localization from "expo-localization";
import i18n from "i18n-js";
import { MessageKeys } from "./";
import en from "./i18-n/en";
import ja from "./i18-n/ja";

i18n.fallbacks = true;
i18n.translations = { ja, en };
i18n.locale = Localization.locale;
i18n.defaultLocale = "ja-JP";
export type MessageKeys = typeof MessageKeys | string;
export type MessageLocalizationParam = {
    key: MessageKeys;
    restParam?: any[];
};
export default class Message {
    /**
     * 文言取得
     * @description 指定したキーに紐づく現在のロケールに対応する文言情報を取得します。{数字}のフィールドに文言の埋め込みが可能です。
     * @static
     * @memberof Message
     */
    public static get(value: MessageKeys, restParam?: MessageKeys[]): string {
        return Message.getTranslatedValue(value, restParam);
    }

    public static setLocale(localeStr: string): void {
        i18n.locale = localeStr;
    }

    private static getTranslatedValue(
        key: MessageKeys,
        restParam?: MessageKeys[]
    ): string {
        let currentLocaleValue = i18n.t(key.toString());

        if (currentLocaleValue.match("missing")) {
            currentLocaleValue = key as string;
        }
        if (restParam) {
            for (let i = 0; restParam.length > i; i++) {
                const settingValue = Message.get(restParam[i]);
                currentLocaleValue = currentLocaleValue.replace(
                    "{" + i + "}",
                    settingValue
                );
            }
        }
        return currentLocaleValue;
    }
}
