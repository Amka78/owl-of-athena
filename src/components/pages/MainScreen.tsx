//#region Import modules
import React, { FunctionComponent } from "react";

import { Colors, Message, MessageKeys } from "../../constants";
import { useMain } from "../../hooks/useMain";
import { ConnectionStates } from "../../sdk";
import { MainScreenTemplate } from "./../templates/MainScreenTemplate";
//#endregion

//#region Component
export const MainScreen: FunctionComponent = () => {
    const mainHook = useMain();
    return (
        <MainScreenTemplate
            bluetoothConnect={mainHook.connect}
            batteryLevel={mainHook.batteryLevel}
            currentFirmwareVersion={mainHook.currentFirmwareVersion}
            error={mainHook.error}
            onBluetoothConnectPress={mainHook.onConnectionStatesPress}
            onHomePress={mainHook.onHomePress}
            onSessionsPress={mainHook.onSessionsPress}
            onSettingsPress={mainHook.onSettingsPress}
        ></MainScreenTemplate>
    );
};
//#endregion
