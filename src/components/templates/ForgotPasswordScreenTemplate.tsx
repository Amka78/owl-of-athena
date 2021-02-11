//#region Import Modules
import React, { FunctionComponent } from "react";

import {
    Button,
    ContentText,
    ContentTitle,
    ErrorText,
    ErrorTextProps,
    StandardView,
    TextBox,
} from "../atoms";
import { Message, MessageKeys } from "../../constants";
import { useLocale, useTextBoxReturn } from "../../hooks";
import { TemplateButtonProps } from "./TempatedProps";
//#endregion

//#region Type
export type ForgotPasswordScreenTemplateProps = {
    emailAddress: useTextBoxReturn;
    errorText: ErrorTextProps;
    forgotPasswordButton: TemplateButtonProps;
    locale?: string;
};
//#endregion

//#region Component
export const ForgotPasswordScreenTemplate: FunctionComponent<ForgotPasswordScreenTemplateProps> = (
    props: ForgotPasswordScreenTemplateProps
) => {
    useLocale(props.locale);
    return (
        <StandardView>
            <ContentTitle>
                {Message.get(MessageKeys.forgot_password_title)}
            </ContentTitle>
            <ContentText>
                {Message.get(MessageKeys.forgot_password_text)}
            </ContentText>
            <TextBox
                {...props.emailAddress}
                keyboardType={"email-address"}
            ></TextBox>
            <ErrorText {...props.errorText}></ErrorText>
            <Button {...props.forgotPasswordButton}>
                {Message.get(MessageKeys.forgot_password_button)}
            </Button>
        </StandardView>
    );
};
//#endregion
