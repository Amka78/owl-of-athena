import React, { FunctionComponent } from "react";
import { Button, StandardView, ContentTitle, AlarmView } from "../components";
import { useCheckLogging, useSettingsSelector } from "../hooks";
import { MessageKeys } from "../constants";
import { AuroraManagerInstance } from "../managers";
import { SleepStates } from "../sdk";
export const SleepingScreen: FunctionComponent = () => {
    useCheckLogging();

    const setting = useSettingsSelector();

    return (
        <StandardView>
            <ContentTitle>{{ key: MessageKeys.sleeping_title }}</ContentTitle>
            <AlarmView
                hours={setting.alarmHour}
                minutes={setting.alarmMinute}
            ></AlarmView>
            <Button
                onPress={(): void => {
                    AuroraManagerInstance.setSleepState(SleepStates.AWAKE);
                }}
            >
                {{ key: MessageKeys.sleeping_wakeup_button }}
            </Button>
        </StandardView>
    );
};
