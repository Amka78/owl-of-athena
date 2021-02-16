//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";

import { Message } from "../constants";
//#endregion

//#region Hooks
export const useConvertibleHeader = (
    headerTitleKey: string,
    isDesktop: boolean,
    isSmallHeight: boolean
): void => {
    const { setOptions } = useNavigation();
    useLayoutEffect(() => {
        setOptions({
            headerTitle: Message.get(headerTitleKey),
            headerShown: !isDesktop && !isSmallHeight,
        });
    }, [isDesktop, isSmallHeight, headerTitleKey, setOptions]);
};
//#endregion
