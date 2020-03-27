import React, { FunctionComponent } from "react";
import { View } from "react-native";
import {
    TimeView,
    Button,
    StandardView,
    ContentTitle,
    ContentText
} from "../components";
import { useCheckLogging, useSettingsSelector } from "../hooks";
import { MessageKeys } from "../constants";
import { AuroraManagerInstance } from "../managers";
import { SleepStates } from "../sdk";
export const WakingScreen: FunctionComponent = () => {
    useCheckLogging();
    const settings = useSettingsSelector();
    return (
        <StandardView>
            <ContentTitle>{{ key: MessageKeys.waking_title }}</ContentTitle>
            <TimeView
                hours={settings.alarmHour}
                minutes={settings.alarmMinute}
                mode={"meridian"}
            ></TimeView>
            <View style={{ alignItems: "center" }}>
                <Button
                    onPress={(): void => {
                        AuroraManagerInstance.setSleepState(SleepStates.AWAKE);
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
