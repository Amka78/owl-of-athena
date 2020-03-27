import React, { FunctionComponent } from "react";
import { Text, StyleSheet, TextStyle, View } from "react-native";
import { Colors, Dimens, Fonts } from "../constants";
export type TimeViewMode = "meridian" | "time";

type TimeViewProps = {
    alarmTimeStyle?: TextStyle;
    alarmMeridianStyle?: TextStyle;
    hours: number;
    minutes: number;
    mode: TimeViewMode;
};
export const TimeView: FunctionComponent<TimeViewProps> = (
    props: TimeViewProps
) => {
    return (
        <View style={style.alarmView}>
            <Text style={style.alarmTime}>{getTimeText(props)}</Text>
            {props.mode === "meridian" ? (
                <Text style={style.alarmMeridian}>
                    {props.hours > 12 ? "pm" : "am"}
                </Text>
            ) : (
                undefined
            )}
        </View>
    );
};

const style = StyleSheet.create({
    alarmView: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flex: 1
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

function getTimeText(props: TimeViewProps): string {
    let timeText: string;

    if (props.mode === "meridian") {
        timeText = `${props.hours > 12 ? props.hours - 12 : props.hours}:${(
            "00" + props.minutes
        ).slice(-2)}`;
    } else {
        timeText = `${props.hours}h ${("00" + props.minutes).slice(-2)}m`;
    }
    return timeText;
}
