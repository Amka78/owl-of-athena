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
import { MessageKeys } from "../constants";
export const WakingScreen: FunctionComponent = () => {
    useCheckLogging();
    const { navigate } = useNavigation();
    return (
        <StandardView>
            <ContentTitle>{{ key: MessageKeys.waking_title }}</ContentTitle>
            <AlarmView></AlarmView>
            <View style={{ alignItems: "center" }}>
                <Button
                    onPress={(): void => {
                        navigate("Awake");
                    }}
                >
                    {{ key: MessageKeys.waking_wakeup_button }}
                </Button>
                <ContentText>
                    {{ key: MessageKeys.waking_tip_text }}
                </ContentText>
            </View>
        </StandardView>
    );
};
