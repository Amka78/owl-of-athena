import React, { FunctionComponent } from "react";
import { Button, StandardView, ContentTitle, AlarmView } from "../components";
import { useNavigation } from "react-navigation-hooks";
export const SleepingScreen: FunctionComponent = () => {
    const { navigate } = useNavigation();

    return (
        <StandardView>
            <ContentTitle>{"sleeping_title"}</ContentTitle>
            <AlarmView></AlarmView>
            <Button
                onPress={(): void => {
                    navigate("Wakeup");
                }}
            >
                {"sleeping_wakeup_button"}
            </Button>
        </StandardView>
    );
};
