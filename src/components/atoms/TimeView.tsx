//#region Import Modules
import React, { FunctionComponent } from "react";
import { StyleSheet, Text, TextStyle, View } from "react-native";
import { useTheme } from "react-native-paper";

import { Fonts } from "../../constants";
//#endregion

//#region Types
export type TimeViewMode = "meridian" | "time";
export type TimeViewProps = {
    timeViewStyle?: TextStyle;
    timeStyle?: TextStyle;
    timeMeridianStyle?: TextStyle;
    hours: number;
    minutes: number;
    mode: TimeViewMode;
};
//#endregion

//#region Component
export const TimeView: FunctionComponent<TimeViewProps> = (
    props: TimeViewProps
) => {
    const theme = useTheme();
    return (
        <View style={[style.alarmView, props.timeViewStyle]}>
            <Text
                style={[
                    style.alarmTime,
                    { color: theme.colors?.accent },
                    props.timeStyle,
                ]}
            >
                {getTimeText(props)}
            </Text>
            {props.mode === "meridian" ? (
                <Text
                    style={[
                        style.alarmMeridian,
                        { color: theme.colors?.accent },
                        props.timeMeridianStyle,
                    ]}
                >
                    {props.hours > 12 ? "pm" : "am"}
                </Text>
            ) : undefined}
        </View>
    );
};
//#endregion

//#region Styles
const style = StyleSheet.create({
    alarmView: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    alarmTime: {
        fontFamily: Fonts.primarySemiBold,
        fontSize: 20,
    },
    alarmMeridian: {
        fontFamily: Fonts.primaryRegular,
        fontSize: 20,
    },
});
//#endregion

function getTimeText(props: TimeViewProps): string {
    let timeText: string;

    if (props.mode === "meridian") {
        timeText = `${props.hours > 12 ? props.hours - 12 : props.hours}:${(
            "00" + props.minutes
        ).slice(-2)}`;
    } else {
        timeText = `${props.hours ? props.hours + "h" : ""} ${props.minutes}m`;
    }
    return timeText;
}
