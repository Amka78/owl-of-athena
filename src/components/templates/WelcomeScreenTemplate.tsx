//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import { Dimens, Message, MessageKeys } from "../../constants";
import { useLocale, useWindowDimensions } from "../../hooks";
import {
    Button,
    ContentText,
    ContentTextProps,
    ContentTitle,
    ContentTitleProps,
    StandardView,
} from "../atoms";
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
    const dimens = useWindowDimensions();
    const allowTwoButtonWidth = dimens.width > Dimens.button_max_width * 2;
    return (
        <StandardView
            standardViewStyle={{
                maxWidth: Dimens.inner_screen_max_width,
                maxHeight: Dimens.inner_screen_max_height,
            }}
        >
            <ContentTitle {...props.contentTitle}>
                {Message.get(MessageKeys.welcome_title)}
            </ContentTitle>
            <ContentText {...props.contentText}>
                {Message.get(MessageKeys.welcome_text)}
            </ContentText>
            <View style={{ alignItems: "center" }}>
                <View
                    style={{
                        flexDirection: allowTwoButtonWidth ? "row" : "column",
                    }}
                >
                    <Button
                        {...props.loginButton}
                        style={{
                            marginRight: allowTwoButtonWidth
                                ? Dimens.button_margin
                                : undefined,
                        }}
                    >
                        {Message.get(MessageKeys.welcome_login_button)}
                    </Button>
                    <Button
                        {...props.signupButton}
                        style={{
                            marginLeft: allowTwoButtonWidth
                                ? Dimens.button_margin
                                : undefined,
                        }}
                    >
                        {Message.get(MessageKeys.welcome_signup_button)}
                    </Button>
                </View>
                <Button {...props.standaloneButton}>
                    {Message.get(MessageKeys.welcome_standalone_button)}
                </Button>
            </View>
        </StandardView>
    );
};
//#endregion
