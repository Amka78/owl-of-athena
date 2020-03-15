import React, { FunctionComponent } from "react";
import { Button, StandardView, ContentTitle, AlarmView } from "../components";
import { useNavigation } from "react-navigation-hooks";
import { useCheckLogging } from "../hooks";
import { MessageKeys } from "../constants";
export const SleepingScreen: FunctionComponent = () => {
    useCheckLogging();
    const { navigate } = useNavigation();

    return (
        <StandardView>
            <ContentTitle>{{ key: MessageKeys.sleeping_title }}</ContentTitle>
            <AlarmView></AlarmView>
            <Button
                onPress={(): void => {
                    navigate("Waking");
                }}
            >
                {{ key: MessageKeys.sleeping_wakeup_button }}
            </Button>
        </StandardView>
    );
};
