//#region Import Modules
import { useLayoutEffect } from "react";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";

import { useCheckLogging, useLogout, useWindowDimensions } from "./";
//#endregion

//#region Type
type DrawerType = "slide" | "front" | "back" | "permanent" | undefined;
//#endregion

//#region Component
export const useMainDrawerNavigator = (): {
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
        dimens.isDesktop ? "permanent" : "slide"
    );
    const { dispatch } = useNavigation();

    const isDesktop = dimens.isDesktop;
    const isHorizontal = dimens.isHorizontal;

    useLayoutEffect(() => {
        if (!dimens.isDesktop) {
            setDrawerType("slide");

            if (dimens.isVertical) {
                dispatch(DrawerActions.closeDrawer());
            }
        } else {
            setDrawerType("permanent");
        }
        return () => {
            return;
        };
    }, [dimens.isDesktop, dimens.isVertical, dispatch]);

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

        dispatch(DrawerActions.toggleDrawer());
    }, [dimens.isDesktop, dispatch, drawerType, isDrawerOpen]);

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
