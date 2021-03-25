//#region Import modules
import React, { FunctionComponent } from "react";
import { useWindowDimensions } from "../../hooks";

import { useMain } from "../../hooks/useMain";
import { MainScreenTemplate } from "./../templates/MainScreenTemplate";
//#endregion

//#region Component
export const MainScreen: FunctionComponent = () => {
    const mainHook = useMain();
    const dimens = useWindowDimensions();
    return (
        <MainScreenTemplate
            bluetoothConnect={mainHook.connect}
            batteryLevel={mainHook.batteryLevel}
            currentFirmwareVersion={mainHook.currentFirmwareVersion}
            error={mainHook.error}
            onBluetoothConnectPress={mainHook.onConnectionStatesPress}
            onHomePress={mainHook.onHomePress}
            onProfilesPress={mainHook.onProfilesPress}
            onSessionsPress={mainHook.onSessionsPress}
            onSettingsPress={mainHook.onSettingsPress}
            dimens={dimens}
        ></MainScreenTemplate>
    );
};
//#endregion
