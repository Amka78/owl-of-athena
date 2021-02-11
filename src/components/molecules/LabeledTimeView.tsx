//#region Import Modules
import React, { FunctionComponent } from "react";
import { Text, View, StyleSheet, TextStyle } from "react-native";
import { useTheme } from "react-native-paper";
import { TimeView } from "../atoms";
import { TimeViewMode } from "../atoms/TimeView";
//#endregion

//#region Types
export type LabeledTimeViewProps = {
    label: string;
    hours: number;
    minutes: number;
    mode: TimeViewMode;
    labelStyle?: TextStyle;
    timeStyle?: TextStyle;
    timeMeridianStyle?: TextStyle;
};
//#endregion

//#region Component
export const LabeledTimeView: FunctionComponent<LabeledTimeViewProps> = (
    props: LabeledTimeViewProps
) => {
    const theme = useTheme();
    return (
        <View style={{ alignItems: "center" }}>
            <Text
                style={[
                    style.label,
                    { color: theme.colors?.accent },
                    props.labelStyle,
                ]}
            >
                {props.label}
            </Text>
            <TimeView
                hours={props.hours}
                minutes={props.minutes}
                mode={props.mode}
                timeMeridianStyle={props.timeMeridianStyle}
                timeStyle={props.timeStyle}
            ></TimeView>
        </View>
    );
};
//#endregion

//#region Styles
const style = StyleSheet.create({
    label: { fontSize: 20 },
});
//#endregion
