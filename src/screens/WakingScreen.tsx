import React, { FunctionComponent } from "react";
import { View } from "react-native";
import {
    AlarmView,
    Button,
    StandardView,
    ContentTitle,
    ContentText
} from "../components";
import { useNavigation } from "react-navigation-hooks";
import { useCheckLogging } from "../hooks";
export const WakingScreen: FunctionComponent = () => {
    useCheckLogging();
    const { navigate } = useNavigation();
    return (
        <StandardView>
            <ContentTitle>{"waking_title"}</ContentTitle>
            <AlarmView></AlarmView>
            <View style={{ alignItems: "center" }}>
                <Button
                    onPress={(): void => {
                        navigate("Awake");
                    }}
                >
                    {"waking_wakeup_button"}
                </Button>
                <ContentText>{"waking_tip_text"}</ContentText>
            </View>
        </StandardView>
    );
};
