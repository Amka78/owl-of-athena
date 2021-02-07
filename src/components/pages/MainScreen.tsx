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
            AuroraConnectionStatesBar={{
                children:
                    mainHook.error !== ""
                        ? mainHook.error
                        : mainHook.connect === ConnectionStates.CONNECTED
                        ? Message.get(MessageKeys.aurora_connected, [
                              mainHook.currentFirmwareVersion,
                              mainHook.batteryLevel.toString(),
                          ])
                        : Message.get(MessageKeys.aurora_disconnected),
                contentStyle: {
                    backgroundColor:
                        mainHook.connect === ConnectionStates.CONNECTED
                            ? Colors.aurora_connected
                            : Colors.aurora_disconnected,
                },
                labelStyle: {
                    color:
                        mainHook.connect === ConnectionStates.CONNECTED
                            ? Colors.aurora_connected_text
                            : Colors.aurora_disconnected_text,
                },
                onPress: mainHook.onConnectionStatesPress,
            }}
        ></MainScreenTemplate>
    );
};
//#endregion
