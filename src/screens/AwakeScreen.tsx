import React, { FunctionComponent } from "react";
import {
    Button,
    StandardView,
    ContentTitle,
    ContentText,
    ConfirmDialog
} from "../components";

import { useNavigation } from "react-navigation-hooks";
import { useCheckLogging } from "../hooks";
import { MessageKeys } from "../constants";
export const AwakeScreen: FunctionComponent = () => {
    useCheckLogging();
    const { navigate } = useNavigation();
    return (
        <StandardView>
            <ContentTitle>{{ key: MessageKeys.awake_title }}</ContentTitle>
            <ContentText>{{ key: MessageKeys.awake_text }}</ContentText>
            <Button
                onPress={(): void => {
                    ConfirmDialog.show({
                        title: { key: MessageKeys.wip_dialog_title },
                        message: { key: MessageKeys.wip_dialog_message },
                        isCancelable: false
                    });
                }}
            >
                {{ key: MessageKeys.awake_questionnaire_continue_button }}
            </Button>
            <Button
                onPress={(): void => {
                    navigate("Home");
                }}
            >
                {{ key: MessageKeys.awake_questionnaire_skip_button }}
            </Button>
        </StandardView>
    );
};
