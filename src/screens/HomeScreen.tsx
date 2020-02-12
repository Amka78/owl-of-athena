import React, { FunctionComponent } from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import { Button, FlatButton, StandardView, AlarmView } from "../components";
import { useNavigation } from "react-navigation-hooks";

export const HomeScreen: FunctionComponent = () => {
    const { navigate } = useNavigation();
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
