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
                    <FlatButton>
                        {{ key: MessageKeys.home_edit_alarm_button }}
                    </FlatButton>
                </View>
            </TouchableWithoutFeedback>
            <FlatButton
                onPress={(): void => {
                    navigate("Settings");
                }}
            >
                {{ key: MessageKeys.home_default_profile }}
            </FlatButton>
            <View style={{ alignItems: "center" }}>
                <ErrorText>{{ key: errorText }}</ErrorText>
                <Button
                    disabled={!AuroraManagerInstance.isConnected}
                    onPress={(): void => {
                        navigate("Sleeping");
                    }}
                >
                    {{ key: MessageKeys.home_go_to_sleep_button }}
                </Button>
            </View>
        </StandardView>
    );
};
