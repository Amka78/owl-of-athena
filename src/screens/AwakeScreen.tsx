import React, { FunctionComponent } from "react";
import { Button, StandardView, ContentTitle, ContentText } from "../components";

import { useNavigation } from "react-navigation-hooks";
import { useCheckLogging } from "../hooks";
export const AwakeScreen: FunctionComponent = () => {
    useCheckLogging();
    const { navigate } = useNavigation();
    return (
        <StandardView>
            <ContentTitle>{"awake_title"}</ContentTitle>
            <ContentText>{"awake_text"}</ContentText>
            <Button>{"awake_questionnaire_continue_button"}</Button>
            <Button
                onPress={(): void => {
                    navigate("Home");
                }}
            >
                {"awake_questionnaire_skip_button"}
            </Button>
        </StandardView>
    );
};
