//#region Import Modules
import { useCallback, useState } from "react";
import { useCheckLogging, useLogout, useWindowDimensions } from "./";
import { useNavigation, DrawerActions } from "@react-navigation/native";
//#endregion

//#region Type
type DrawerType = "slide" | "front" | "back" | "permanent" | undefined;
//#endregion

//#region Component
export const useMainDrawerNavigator = (): {
    isDesktop: boolean;
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
        drawerType,
        isDrawerOpen,
        onDrawerMenuPress,
        onLogoutPress,
    };
};
//#endregion
