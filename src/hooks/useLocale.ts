//#region Import Modules
import { useLayoutEffect, useState } from "react";

import { Message } from "../constants";
//#endregion

//#region Hooks
export const useLocale = (locale?: string): void => {
    const [, setLocaleState] = useState<string>();
    useLayoutEffect(() => {
        console.debug(`currentLocale:${locale}`);
        if (locale) {
            Message.setLocale(locale);
            setLocaleState(locale);
        }
        return;
    }, [locale]);
};
//#endregion
