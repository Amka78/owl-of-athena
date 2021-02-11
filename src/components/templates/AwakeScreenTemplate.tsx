//#region Import Modules
import React, { FunctionComponent } from "react";

import {
    Button,
    ContentText,
    ContentTextProps,
    ContentTitle,
    ContentTitleProps,
    StandardView,
} from "../atoms";
import { Message, MessageKeys } from "../../constants";
import { useLocale } from "../../hooks";
import { TemplateButtonProps } from "./TempatedProps";
//#endregion

//#region Types
export type AwakeScreenTemplateProps = {
    contentTitle?: ContentTitleProps;
    contentText?: ContentTextProps;
    questionnaireButton: TemplateButtonProps;
    skipButton: TemplateButtonProps;
    locale?: string;
};
//#endregion

//#region Component
export const AwakeScreenTemplate: FunctionComponent<AwakeScreenTemplateProps> = (
    props: AwakeScreenTemplateProps
) => {
    useLocale(props.locale);
    return (
        <StandardView>
            <ContentTitle {...props.contentTitle}>
                {Message.get(MessageKeys.awake_title)}
            </ContentTitle>
            <ContentText {...props.contentText}>
                {Message.get(MessageKeys.awake_text)}
            </ContentText>
            <Button {...props.questionnaireButton}>
                {Message.get(MessageKeys.awake_questionnaire_continue_button)}
            </Button>
            <Button {...props.skipButton}>
                {Message.get(MessageKeys.awake_questionnaire_skip_button)}
            </Button>
        </StandardView>
    );
};
//#endregion
