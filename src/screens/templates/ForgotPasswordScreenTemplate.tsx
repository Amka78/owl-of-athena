//#region Import Modules
import React, { FunctionComponent } from "react";

import {
    Button,
    ButtonProps,
    ContentText,
    ContentTextProps,
    ContentTitle,
    ContentTitleProps,
    ErrorText,
    ErrorTextProps,
    StandardView,
    TextBox,
} from "../../components";
import { useTextBoxReturn } from "../../hooks";
//#endregion

//#region Type
export type ForgotPasswordScreenTemplateProps = {
    contentTitle: ContentTitleProps;
    contentText: ContentTextProps;
    emailAddress: useTextBoxReturn;
    errorText: ErrorTextProps;
    forgotPasswordButton: ButtonProps;
};
//#endregion

//#region Component
export const ForgotPasswordScreenTemplate: FunctionComponent<ForgotPasswordScreenTemplateProps> = (
    props: ForgotPasswordScreenTemplateProps
) => {
    return (
        <StandardView>
            <ContentTitle {...props.contentTitle}></ContentTitle>
            <ContentText {...props.contentText}></ContentText>
            <TextBox
                {...props.emailAddress}
                keyboardType={"email-address"}
            ></TextBox>
            <ErrorText {...props.errorText}></ErrorText>
            <Button {...props.forgotPasswordButton}></Button>
        </StandardView>
    );
};
//#endregion
