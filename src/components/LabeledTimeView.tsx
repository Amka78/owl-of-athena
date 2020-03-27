import React, { FunctionComponent } from "react";
import { Text, View } from "react-native";
import { TimeView } from ".";
import { Colors, Message } from "../constants";
import { MessageLocalizationParam } from "../constants/Message";
import { TimeViewMode } from "../components/TimeView";
export type LabledTimeViewProps = {
    label: MessageLocalizationParam;
    hours: number;
    minutes: number;
    mode: TimeViewMode;
};
export const LabeledTimeView: FunctionComponent<LabledTimeViewProps> = (
    props: LabledTimeViewProps
) => {
    return (
        <View style={{ alignItems: "center" }}>
            <Text style={{ color: Colors.cyan, fontSize: 20 }}>
                {Message.get(props.label.key, props.label.restParam)}
            </Text>
            <TimeView
                hours={props.hours}
                minutes={props.minutes}
                mode={props.mode}
            ></TimeView>
        </View>
    );
};
