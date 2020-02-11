import React, { FunctionComponent } from "react";
import { Text, View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Colors, Dimens, Fonts } from "../constants";
import { Button, FlatButton, StandardView } from "../components";
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
                    <View style={style.alarmView}>
                        <Text style={style.alarmTime}>8:00</Text>
                        <Text style={style.alarmMeridian}>am</Text>
                    </View>
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

const style = StyleSheet.create({
    alarmView: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    alarmTime: {
        color: Colors.cyan,
        fontFamily: Fonts.primarySemiBold,
        fontSize: Dimens.home_alarm_time_text_size
    },
    alarmMeridian: {
        color: Colors.cyan,
        fontFamily: Fonts.primaryRegular,
        fontSize: Dimens.home_alarm_meridian_text_size
    }
});
