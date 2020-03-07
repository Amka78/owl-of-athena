import * as Localization from "expo-localization";
import i18n from "i18n-js";

import en from "./i18-n/en";
import ja from "./i18-n/ja";
import LocaleMessageParameter, {
    IMessageRestParameter
} from "./LocaleMessageParameter";

i18n.fallbacks = true;
i18n.translations = { ja, en };
i18n.locale = Localization.locale;
i18n.defaultLocale = "ja-JP";

export type MessageLocalizationParam =
    | LocaleMessageParameter
    | string
    | undefined;

export default class Message {
    /**
     * 文言取得
     * @description 指定したキーに紐づく現在のロケールに対応する文言情報を取得します。{数字}のフィールドに文言の埋め込みが可能です。
     * @static
     * @memberof Message
     */
    public static get = (
        value: MessageLocalizationParam,
        translation = true
    ): string => {
        if (typeof value === "string") {
            if (value == "") {
                return "";
            }
            return translation ? Message.getTranslatedValue(value) : value;
        } else if (typeof value === "undefined") {
            return "";
        } else if (value.key) {
            return Message.getTranslatedValue(value.key!, value.restParam);
        }

        return "";
    };

    public static setLocale(localeStr: string): void {
        i18n.locale = localeStr;
    }

    private static getTranslatedValue(
        key: string,
        restParam?: IMessageRestParameter[]
    ) {
        let currentLocaleValue = i18n.t(key);

        if (restParam) {
            for (let i = 0; restParam.length > i; i++) {
                currentLocaleValue = currentLocaleValue.replace(
                    "{" + i + "}",
                    restParam[i].isKey !== undefined
                        ? restParam[i].isKey!
                            ? Message.get(restParam[i].value)
                            : restParam[i].value
                        : Message.get(restParam[i].value)
                );
            }
        }
        return currentLocaleValue;
    }
}
