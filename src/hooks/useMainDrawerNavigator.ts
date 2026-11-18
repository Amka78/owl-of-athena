//#region Import Modules

import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { DrawerActions, type ParamListBase } from "@react-navigation/native";
import { type RefObject, useCallback, useLayoutEffect, useState } from "react";

import { useCheckLogging, useLogout, useWindowDimensions } from "./";

//#endregion

//#region Type
type DrawerType = "slide" | "front" | "back" | "permanent" | undefined;
//#endregion

//#region Component
export const useMainDrawerNavigator = (
    drawerNavigationRef: RefObject<DrawerNavigationProp<ParamListBase> | null>,
): {
    isDesktop: boolean;
    isHorizontal: boolean;
    drawerType: DrawerType;
    isDrawerOpen: boolean;
    onDrawerMenuPress: () => void;
    onLogoutPress: () => Promise<void>;
} => {
    useCheckLogging();
    const dimens = useWindowDimensions();
    const logout = useLogout();
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(dimens.isDesktop);
    const [drawerType, setDrawerType] = useState<DrawerType>(
        dimens.isDesktop ? "permanent" : "slide",
    );

    const isDesktop = dimens.isDesktop;
    const isHorizontal = dimens.isHorizontal;

    // useNavigation() はこのフックの呼び出し元（Drawer をレンダーする親の Stack）の
    // navigation を返すため、Drawer 自身を操作するアクションをその経路で dispatch すると
    // "The action 'CLOSE_DRAWER' was not handled by any navigator" になる。
    // Drawer の navigation（screenOptions の関数引数で捕捉したもの）へ投げ直す。
    useLayoutEffect(() => {
        if (!dimens.isDesktop) {
            setDrawerType("slide");

            if (dimens.isVertical) {
                drawerNavigationRef.current?.dispatch(DrawerActions.closeDrawer());
            }
        } else {
            setDrawerType("permanent");
        }
        return () => {
            return;
        };
    }, [dimens.isDesktop, dimens.isVertical, drawerNavigationRef]);

    const onDrawerMenuPress = useCallback(() => {
        if (isDrawerOpen) {
            if (drawerType === "permanent") {
                setDrawerType("slide");
                setIsDrawerOpen(false);
            }
        } else {
            if (dimens.isDesktop) {
                setDrawerType("permanent");
            }
            setIsDrawerOpen(true);
        }

        drawerNavigationRef.current?.dispatch(DrawerActions.toggleDrawer());
    }, [dimens.isDesktop, drawerNavigationRef, drawerType, isDrawerOpen]);

    const onLogoutPress = logout.onPress;

    return {
        isDesktop,
        isHorizontal,
        drawerType,
        isDrawerOpen,
        onDrawerMenuPress,
        onLogoutPress,
    };
};
//#endregion
