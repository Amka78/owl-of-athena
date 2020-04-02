import React, { FunctionComponent, useState } from "react";
import { View } from "react-native";
import { MainContainer } from "../navigation";
import { FlatButton, LoadingDialog, ConfirmDialog } from "../components";
import { Colors, MessageKeys } from "../constants";
import { AuroraManagerInstance } from "../managers";
import { ConnectionStates } from "../sdk";
import { AuroraOSInfo } from "../sdk/models";
import { useNavigation } from "react-navigation-hooks";
import { NavigationState } from "react-navigation";
export const MainScreen: FunctionComponent = () => {
    const { navigate } = useNavigation();
    const [connect, setConnect] = useState<ConnectionStates>(
        ConnectionStates.DISCONNECTED
    );
    const [error, setError] = useState<string>("");

    return (
        <View style={{ flex: 1 }}>
            <MainContainer
                onNavigationStateChange={(
                    _prevNavigationState: NavigationState,
                    _nextNavigationState: NavigationState,
                    action: any
                ): void => {
                    if (action.routeName === "Logout") {
                        navigate("Unauthenticated");
                    }
                }}
            ></MainContainer>
            <FlatButton
                contentStyle={{
                    backgroundColor:
                        connect === ConnectionStates.CONNECTED
                            ? Colors.aurora_connected
                            : Colors.aurora_disconnected
                }}
                labelStyle={{
                    color:
                        connect === ConnectionStates.CONNECTED
                            ? Colors.aurora_connected_text
                            : Colors.aurora_disconnected_text
                }}
                onPress={async (): Promise<void> => {
                    console.log("configuring aurora start.");

                    try {
                        await executeConfiguring(
                            setConnect,
                            connect === ConnectionStates.CONNECTED
                                ? ConnectionStates.DISCONNECTING
                                : ConnectionStates.CONNECTING
                        );
                    } catch (e) {
                        console.log(e);
                    }
                }}
            >
                {connect === ConnectionStates.CONNECTED
                    ? { key: MessageKeys.aurora_connected }
                    : { key: MessageKeys.aurora_disconnected }}
            </FlatButton>
            <LoadingDialog
                visible={
                    connect === ConnectionStates.CONNECTING ||
                    connect === ConnectionStates.DISCONNECTING
                }
                dialogTitle={{
                    key: MessageKeys.home_go_to_sleep_loading_message
                }}
            ></LoadingDialog>
            <ConfirmDialog></ConfirmDialog>
        </View>
    );
};

async function executeConfiguring(
    setConnect: React.Dispatch<React.SetStateAction<ConnectionStates>>,
    connectStatus: ConnectionStates
): Promise<void> {
    setConnect(connectStatus);
    let result = undefined;

    if (connectStatus === ConnectionStates.CONNECTING) {
        result = await AuroraManagerInstance.connect();
    } else {
        result = await AuroraManagerInstance.disconnect();
    }
    console.log("configuring aurora succeed.", result);
}
