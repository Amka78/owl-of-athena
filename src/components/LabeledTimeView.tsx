//#region Import Modules
import React, { FunctionComponent } from "react";
import { Text, View, StyleSheet, TextStyle } from "react-native";
import { TimeView } from ".";
import { Colors } from "../constants";
import { TimeViewMode } from "../components/TimeView";
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
    return (
        <View style={{ alignItems: "center" }}>
            <Text style={[style.label, props.labelStyle]}>{props.label}</Text>
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
    label: { color: Colors.cyan, fontSize: 20 },
});
//#endregion
