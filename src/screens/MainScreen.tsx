import React, { FunctionComponent, useEffect, useState } from "react";
import { View } from "react-native";
import { MainContainer } from "../navigation";
import { FlatButton, LoadingDialog, ConfirmDialog } from "../components";
import { Colors, MessageKeys } from "../constants";
import { AuroraManagerInstance } from "../managers";
import { ConnectionStates } from "../sdk";
import { AuroraOSInfo, AuroraSession } from "../sdk/models";
import { useNavigation } from "react-navigation-hooks";
import { NavigationState } from "react-navigation";
import { cacheSessions } from "../actions";
import { useSessionListSelector, useUserSelector } from "../hooks";
import { useDispatch } from "react-redux";
import { AuroraRestClientInstance } from "../clients";
import { AuroraManagerEventList } from "../managers/AuroraManager";
export const MainScreen: FunctionComponent = () => {
    const { navigate } = useNavigation();
    const dispatch = useDispatch();
    const sessionList = useSessionListSelector();
    const userInfo = useUserSelector();
    const [connect, setConnect] = useState<ConnectionStates>(
        ConnectionStates.DISCONNECTED
    );
    const [error, setError] = useState<string>("");

    useEffect(() => {
        let unmounted = false;
        const f = async (): Promise<void> => {
            if (!unmounted && userInfo !== undefined) {
                if (sessionList.length <= 0) {
                    const remoteSessionList = await AuroraRestClientInstance.getAuroraSessions(
                        userInfo!.id
                    );
                    dispatch(cacheSessions(remoteSessionList));
                }
            }
        };
        f();
        const cleanup = (): void => {
            unmounted = true;
        };
        return cleanup();
    }, [dispatch, sessionList, userInfo]);
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
                                : ConnectionStates.CONNECTING,
                            (pushedSessionList: Array<AuroraSession>) => {
                                sessionList.unshift(...pushedSessionList);

                                dispatch(cacheSessions(sessionList));
                            }
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
    connectStatus: ConnectionStates,
    pushedSessionCallback: (sessionList: Array<AuroraSession>) => void
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
                console.debug("Sart getUnsycedSessions.");
                const unsyncedSessions = await AuroraManagerInstance.getUnsyncedSessions();
                console.debug(
                    "Completed getUnsyncedSessions:",
                    unsyncedSessions
                );

                if (
                    unsyncedSessions.length > 0 &&
                    AuroraManagerInstance.isConfiguring()
                ) {
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
                            LoadingDialog.show({
                                dialogTitle: {
                                    key:
                                        MessageKeys.home_go_to_sleep_loading_message
                                }
                            });
                            try {
                                const result = await AuroraManagerInstance.pushSessions(
                                    unsyncedSessions
                                );

                                pushedSessionCallback(result);
                            } finally {
                                LoadingDialog.close();
                            }
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
