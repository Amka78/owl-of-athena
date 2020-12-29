//#region Import Modules
import React, { FunctionComponent } from "react";

import {
    Button,
    ButtonProps,
    ContentText,
    ContentTextProps,
    ContentTitle,
    ContentTitleProps,
    StandardView,
} from "../../components";
//#endregion

//#region Types
export type AwakeScreenTemplateProps = {
    contentTitle: ContentTitleProps;
    contentText: ContentTextProps;
    questionnaireButton: ButtonProps;
    skipButton: ButtonProps;
};
//#endregion

//#region Component
export const AwakeScreenTemplate: FunctionComponent<AwakeScreenTemplateProps> = (
    props: AwakeScreenTemplateProps
) => {
    return (
        <StandardView>
            <ContentTitle {...props.contentTitle}></ContentTitle>
            <ContentText {...props.contentText}></ContentText>
            <Button {...props.questionnaireButton}></Button>
            <Button {...props.skipButton}></Button>
        </StandardView>
    );
};
//#endregion
