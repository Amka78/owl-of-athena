//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import {
    Button,
    ContentText,
    ContentTextProps,
    ContentTitle,
    ContentTitleProps,
    FlexSpacer,
    StandardView,
} from "../atoms";
import { Message, MessageKeys } from "../../constants";
import { useLocale } from "../../hooks";
import { TemplateButtonProps } from "./TempatedProps";
//#endregion

//#region Types
export type WelcomeScreenTemplateProps = {
    contentTitle?: ContentTitleProps;
    contentText?: ContentTextProps;
    standaloneButton: TemplateButtonProps;
    loginButton: TemplateButtonProps;
    signupButton: TemplateButtonProps;
    locale?: string;
};
//#endregion

//#region Component
export const WelcomeScreenTemplate: FunctionComponent<WelcomeScreenTemplateProps> = (
    props: WelcomeScreenTemplateProps
) => {
    useLocale(props.locale);
    return (
        <StandardView>
            <FlexSpacer></FlexSpacer>
            <ContentTitle {...props.contentTitle} style={{ flex: 1 }}>
                {Message.get(MessageKeys.welcome_title)}
            </ContentTitle>
            <ContentText {...props.contentText} style={{ flex: 1 }}>
                {Message.get(MessageKeys.welcome_text)}
            </ContentText>
            <FlexSpacer></FlexSpacer>
            <View>
                <Button {...props.standaloneButton}>
                    {Message.get(MessageKeys.welcome_standalone_button)}
                </Button>
                <Button {...props.loginButton}>
                    {Message.get(MessageKeys.welcome_login_button)}
                </Button>
                <Button {...props.signupButton}>
                    {Message.get(MessageKeys.welcome_signup_button)}
                </Button>
            </View>
        </StandardView>
    );
};
//#endregion
