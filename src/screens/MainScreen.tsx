import React, { FunctionComponent, useState, useEffect } from "react";
import { View } from "react-native";
import { MainContainer } from "../navigation";
import { FlatButton, LoadingDialog, ConfirmDialog } from "../components";
import { Colors, MessageKeys } from "../constants";
import { AuroraManagerInstance, AuroraManagetEventList } from "../managers";
import { ConnectionStates } from "../sdk";
import { useNavigation } from "react-navigation-hooks";
export const MainScreen: FunctionComponent = () => {
    const [connect, setConnect] = useState<ConnectionStates>(
        ConnectionStates.DISCONNECTED
    );

    const { navigate } = useNavigation();
    const onConnectionStateChange = (connect: boolean): void => {
        connect
            ? setConnect(ConnectionStates.CONNECTED)
            : setConnect(ConnectionStates.DISCONNECTED);
    };

    useEffect(() => {
        AuroraManagerInstance.on(
            AuroraManagetEventList.onConnectionChange,
            onConnectionStateChange
        );
        AuroraManagerInstance.on(AuroraManagetEventList.onSleeping, () => {
            navigate("Sleeping");
        });
        AuroraManagerInstance.on(AuroraManagetEventList.onAwake, () => {
            navigate("Awake");
        });
        AuroraManagerInstance.on(AuroraManagetEventList.onSleeping, () => {
            navigate("Waking");
        });
        AuroraManagerInstance.on(
            AuroraManagetEventList.onAuroraReady,
            (batteryLevel: number) => {
                if (batteryLevel < 25) {
                    ConfirmDialog.show({
                        title: {
                            key: MessageKeys.aurora_low_battery_dialog_title
                        },
                        message: {
                            key: MessageKeys.aurora_low_battery_dialog_message,
                            restParam: [batteryLevel]
                        },
                        isCancelable: false
                    });
                } else {
                    const unsyncedSession = AuroraManagerInstance.getUnsyncedSessions();

                    if (
                        unsyncedSession &&
                        AuroraManagerInstance.isConfiguring
                    ) {
                        ConfirmDialog.show({
                            title: {
                                key:
                                    MessageKeys.aurora_unsynced_sessions_dialog_title
                            },
                            message: {
                                key:
                                    MessageKeys.aurora_unsynced_sessions_dialog_message,
                                restParam: [unsyncedSession.length]
                            }
                        });
                    }
                }
            }
        );
        return (): void => {
            return;
        };
    }, [navigate]);
    return (
        <View style={{ flex: 1 }}>
            <MainContainer></MainContainer>
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
