//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import { Message, MessageKeys } from "../../constants";
import { useLocale, useWindowDimensions } from "../../hooks";
import {
    Button,
    ContentText,
    ContentTextProps,
    ContentTitle,
    ContentTitleProps,
} from "../atoms";
import { InternalView, LeftSideButton, RightSideButton } from "../molecules";
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

    return (
        <InternalView>
            <ContentTitle {...props.contentTitle}>
                {Message.get(MessageKeys.welcome_title)}
            </ContentTitle>
            <ContentText {...props.contentText}>
                {Message.get(MessageKeys.welcome_text)}
            </ContentText>
            <View style={{ alignItems: "center" }}>
                <View
                    style={{
                        flexDirection:
                            dimens.isHorizontal || dimens.isLargeWidth
                                ? "row"
                                : "column",
                    }}
                >
                    <LeftSideButton
                        {...props.loginButton}
                        isLargeWidth={
                            dimens.isHorizontal || dimens.isLargeWidth
                        }
                    >
                        {Message.get(MessageKeys.welcome_login_button)}
                    </LeftSideButton>
                    <RightSideButton
                        {...props.signupButton}
                        isLargeWidth={
                            dimens.isHorizontal || dimens.isLargeWidth
                        }
                    >
                        {Message.get(MessageKeys.welcome_signup_button)}
                    </RightSideButton>
                </View>
                <Button {...props.standaloneButton}>
                    {Message.get(MessageKeys.welcome_standalone_button)}
                </Button>
            </View>
        </InternalView>
    );
};
//#endregion
