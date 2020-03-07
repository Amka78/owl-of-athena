import React, { FunctionComponent, useEffect, useState } from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import {
    Button,
    FlatButton,
    StandardView,
    AlarmView,
    ContentText,
    ErrorText
} from "../components";
import { useNavigation } from "react-navigation-hooks";
import { useCheckLogging } from "../hooks";
import { useAuroraSelector } from "../hooks";
export const HomeScreen: FunctionComponent = () => {
    useCheckLogging();
    const auroraDevice = useAuroraSelector();
    const { navigate } = useNavigation();

    const [connect, setConnect] = useState<boolean>(false);
    const [isBluetoothSupport, setIsBluetoothSupport] = useState<boolean>(
        false
    );
    const [errorText, setErrorText] = useState<string>("");
    useEffect(() => {
        auroraDevice.isConnected ? setConnect(true) : setConnect(false);
        return () => {
            //cleanup
        };
    }, [auroraDevice]);
    return (
        <StandardView>
            <TouchableWithoutFeedback
                onPress={(): void => {
                    navigate("Settings");
                }}
            >
                <View>
                    <AlarmView></AlarmView>
                    <FlatButton>{"home_edit_alarm_button"}</FlatButton>
                </View>
            </TouchableWithoutFeedback>
            <FlatButton
                onPress={(): void => {
                    navigate("Settings");
                }}
            >
                {"home_default_profile"}
            </FlatButton>
            <FlatButton
                onPress={async () => {
                    console.debug("connect bluetooth start.");

                    try {
                        const result = await auroraDevice.connectBluetooth(
                            200000000
                        );

                        auroraDevice.isBluetoothConnected
                            ? setConnect(true)
                            : setConnect(false);
                    } catch (e) {
                        console.debug(e);
                        setErrorText(e);
                        setIsBluetoothSupport(false);
                    }
                }}
                multiLingual={false}
            >
                {`Connected Status: ${
                    isBluetoothSupport
                        ? connect
                            ? "Connected"
                            : "Disconnected"
                        : "Browser that does not support Bluetooth."
                }`}
            </FlatButton>
            <ErrorText>{errorText}</ErrorText>
            <Button
                onPress={(): void => {
                    navigate("Sleeping");
                }}
            >
                {"home_go_to_sleep_button"}
            </Button>
        </StandardView>
    );
};
