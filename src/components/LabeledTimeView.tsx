import React, { FunctionComponent } from "react";
import { Text, View, StyleSheet, TextStyle } from "react-native";
import { TimeView } from ".";
import { Colors, Message } from "../constants";
import { MessageLocalizationParam } from "../constants/Message";
import { TimeViewMode } from "../components/TimeView";
export type LabeledTimeViewProps = {
    label: MessageLocalizationParam;
    hours: number;
    minutes: number;
    mode: TimeViewMode;
    labelStyle?: TextStyle;
    timeStyle?: TextStyle;
    timeMeridianStyle?: TextStyle;
};
export const LabeledTimeView: FunctionComponent<LabeledTimeViewProps> = (
    props: LabeledTimeViewProps
) => {
    return (
        <View style={{ alignItems: "center" }}>
            <Text style={[style.label, props.labelStyle]}>
                {Message.get(props.label.key, props.label.restParam)}
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

const style = StyleSheet.create({
    label: { color: Colors.cyan, fontSize: 20 }
});
