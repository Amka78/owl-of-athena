/* eslint-disable react-hooks/rules-of-hooks */
//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";

import { Message } from "../constants";
//#endregion

//#region Hooks
export const useConvertibleHeader = (
    headerTitleKey: string,
    isDesktop: boolean,
    isSmallHeight: boolean,
): void => {
    let navigation: any;
    try {
        // biome-ignore lint/correctness/useHookAtTopLevel: intentionally used in try-catch for optional navigation context
        navigation = useNavigation();
    } catch (ex) {
        console.debug(ex);
    }
    useLayoutEffect(() => {
        if (navigation !== undefined) {
            navigation.setOptions({
                headerTitle: Message.get(headerTitleKey),
                headerShown: !isDesktop && !isSmallHeight,
            });
        }
    }, [isDesktop, isSmallHeight, headerTitleKey, navigation]);
};
//#endregion
