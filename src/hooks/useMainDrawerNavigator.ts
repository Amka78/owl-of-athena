//#region Import Modules
import { useCallback, useState } from "react";
import { useCheckLogging, useLogout, useWindowDimensions } from "./";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { useMain } from "./useMain";
import { ConnectionStates } from "../sdk";
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
    onBluetoothConnectPress: () => void;
    batteryLevel: number;
    bluetoothConnect: ConnectionStates;
} => {
    useCheckLogging();
    const dimens = useWindowDimensions();
    const logout = useLogout();
    const main = useMain();
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

    const onBluetoothConnectPress = main.onConnectionStatesPress;

    const batteryLevel = main.batteryLevel;

    const bluetoothConnect = main.connect;
    return {
        isDesktop,
        drawerType,
        isDrawerOpen,
        onDrawerMenuPress,
        onLogoutPress,
        onBluetoothConnectPress,
        batteryLevel,
        bluetoothConnect,
    };
};
//#endregion
