import React, { FunctionComponent } from "react";
import { Text, StyleSheet, TextStyle, View } from "react-native";
import { Colors, Dimens, Fonts } from "../constants";

type AlarmViewProps = {
    alarmTimeStyle?: TextStyle;
    alarmMeridianStyle?: TextStyle;
    hours: number;
    minutes: number;
};
export const AlarmView: FunctionComponent<AlarmViewProps> = (
    props: AlarmViewProps
) => {
    return (
        <View style={style.alarmView}>
            <Text style={style.alarmTime}>{`${
                props.hours > 12 ? props.hours - 12 : props.hours
            }:${("00" + props.minutes).slice(-2)}`}</Text>
            <Text style={style.alarmMeridian}>
                {props.hours > 12 ? "pm" : "am"}
            </Text>
        </View>
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
