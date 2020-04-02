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
                    console.debug("Start configuring aurora.");

                    try {
                        LoadingDialog.show({
                            dialogTitle: {
                                key:
                                    MessageKeys.home_go_to_sleep_loading_message
                            }
                        });
                        await executeConfiguring(
                            setConnect,
                            connect === ConnectionStates.CONNECTED
                                ? ConnectionStates.DISCONNECTING
                                : ConnectionStates.CONNECTING
                        );
                    } catch (e) {
                        setError(e);
                        console.error(e);
                    } finally {
                        LoadingDialog.close();
                    }
                }}
            >
                {error !== ""
                    ? { key: error }
                    : connect === ConnectionStates.CONNECTED
                    ? { key: MessageKeys.aurora_connected }
                    : { key: MessageKeys.aurora_disconnected }}
            </FlatButton>
        </View>
    );
};

async function executeConfiguring(
    setConnect: React.Dispatch<React.SetStateAction<ConnectionStates>>,
    connectStatus: ConnectionStates
): Promise<void> {
    setConnect(connectStatus);
    let result = undefined;

    try {
        if (connectStatus === ConnectionStates.CONNECTING) {
            result = (await AuroraManagerInstance.connect()) as AuroraOSInfo;

            console.debug("Aurora connected result:", result);

            setConnect(ConnectionStates.CONNECTED);
            if (result.batteryLevel < 25) {
                ConfirmDialog.show({
                    title: {
                        key: MessageKeys.aurora_low_battery_dialog_title
                    },
                    message: {
                        key: MessageKeys.aurora_low_battery_dialog_message,
                        restParam: [result.batteryLevel]
                    },
                    isCancelable: false
                });
            } else {
                console.debug("Start getUnsycedSessions.");
                const unsyncedSessions = await AuroraManagerInstance.getUnsyncedSessions();
                console.debug(
                    "Completed getUnsyncedSessions:",
                    unsyncedSessions
                );

                if (unsyncedSessions && AuroraManagerInstance.isConfiguring()) {
                    ConfirmDialog.show({
                        title: {
                            key:
                                MessageKeys.aurora_unsynced_sessions_dialog_title
                        },
                        message: {
                            key:
                                MessageKeys.aurora_unsynced_sessions_dialog_message,
                            // @ts-ignore
                            restParam: [unsyncedSessions.length]
                        },
                        onConfirm: async (): Promise<void> => {
                            const result = await AuroraManagerInstance.readSessionContent(
                                unsyncedSessions
                            );
                            console.debug("session content:", result);
                        },
                        isCancelable: true
                    });
                }
            }
        } else {
            result = await AuroraManagerInstance.disconnect();
            setConnect(ConnectionStates.DISCONNECTED);
        }
        console.debug("Succeed configuring aurora.", result);
    } catch (e) {
        console.error(e);
        throw e;
    }
}
