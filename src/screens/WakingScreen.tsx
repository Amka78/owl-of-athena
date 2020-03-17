import React, { FunctionComponent } from "react";
import { View } from "react-native";
import {
    AlarmView,
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
            <AlarmView
                hours={settings.alarmHour}
                minutes={settings.alarmMinute}
            ></AlarmView>
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
