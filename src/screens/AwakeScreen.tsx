//#region Import Modules
import React, { FunctionComponent } from "react";

import { Message, MessageKeys } from "../constants";
import { useAwake } from "../hooks/useAwake";
import { AwakeScreenTemplate } from "./templates/AwakeScreenTemplate";
//#endregion

//#region Component
export const AwakeScreen: FunctionComponent = () => {
    const awakeHook = useAwake();

    return (
        <AwakeScreenTemplate
            contentTitle={{ children: Message.get(MessageKeys.awake_title) }}
            contentText={{ children: Message.get(MessageKeys.awake_text) }}
            questionnaireButton={{
                onPress: awakeHook.questionnaireButtonPress,
                children: Message.get(
                    MessageKeys.awake_questionnaire_continue_button
                ),
            }}
            skipButton={{
                onPress: awakeHook.skipButtonPress,
                children: Message.get(
                    MessageKeys.awake_questionnaire_skip_button
                ),
            }}
        ></AwakeScreenTemplate>
    );
};
//#endregion
