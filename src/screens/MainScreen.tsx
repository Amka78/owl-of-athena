import React, { FunctionComponent, useState, useEffect } from "react";
import { View } from "react-native";
import { MainContainer } from "../navigation";
import { FlatButton, LoadingDialog } from "../components";
import { useAuroraSelector } from "../hooks";
import { Colors } from "../constants";
type connetStatus = "connected" | "connecting" | "disconnect" | "disconnecting";
export const MainScreen: FunctionComponent = () => {
    const [connect, setConnect] = useState<connetStatus>("disconnect");
    const auroraDevice = useAuroraSelector();
    useEffect(() => {
        auroraDevice.on("bluetoothConnectionChange", (connect: boolean) => {
            connect ? setConnect("connected") : setConnect("disconnect");
        });
        return (): void => {
            return;
        };
    }, [auroraDevice]);
    return (
        <View style={{ flex: 1 }}>
            <MainContainer></MainContainer>
            <FlatButton
                contentStyle={{
                    backgroundColor:
                        connect === "connected"
                            ? Colors.aurora_connected
                            : Colors.aurora_disconnected
                }}
                labelStyle={{
                    color:
                        connect === "connected"
                            ? Colors.aurora_connected_text
                            : Colors.aurora_disconnected_text
                }}
                onPress={async (): Promise<void> => {
                    console.log("configuring aurora start.");

                    try {
                        await executeConfiguring(
                            setConnect,
                            auroraDevice,
                            connect === "connected"
                                ? "disconnecting"
                                : "connecting"
                        );
                    } catch (e) {
                        console.log(e);
                    }
                }}
            >
                {connect === "connected"
                    ? "aurora_connected"
                    : "aurora_disconnected"}
            </FlatButton>
            <LoadingDialog
                visible={
                    connect === "connecting" || connect === "disconnecting"
                }
                dialogTitle={"home_go_to_sleep_loading_message"}
            ></LoadingDialog>
        </View>
    );
};

async function executeConfiguring(
    setConnect: React.Dispatch<React.SetStateAction<connetStatus>>,
    auroraDevice: import("../sdk/Aurora").Aurora,
    connectStatus: connetStatus
): Promise<void> {
    setConnect(connectStatus);
    let result = undefined;

    if (connectStatus === "connecting") {
        result = await auroraDevice.connectBluetooth();
        await auroraDevice.queueCmd("led-demo");
    } else {
        result = await auroraDevice.disconnectBluetooth();
    }
    console.log("configuring aurora succeed.", result);
}
