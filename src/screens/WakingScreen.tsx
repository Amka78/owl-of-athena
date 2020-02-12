import React, { FunctionComponent } from "react";
import { View } from "react-native";
import {
    AlarmView,
    Button,
    StandardView,
    ContentTitle,
    ContentText
} from "../components";

export const WakingScreen: FunctionComponent = () => {
    return (
        <StandardView>
            <ContentTitle>{"waking_title"}</ContentTitle>
            <AlarmView></AlarmView>
            <View style={{ alignItems: "center" }}>
                <Button>{"waking_wakeup_button"}</Button>
                <ContentText>{"waking_tip_text"}</ContentText>
            </View>
        </StandardView>
    );
};
