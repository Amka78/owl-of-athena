//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

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
export type WelcomeScreenTemplateProps = {
    contentTitle: ContentTitleProps;
    contentText: ContentTextProps;
    standaloneButton: ButtonProps;
    loginButton: ButtonProps;
    signupButton: ButtonProps;
};
//#endregion

//#region Component
export const WelcomeScreenTemplate: FunctionComponent<WelcomeScreenTemplateProps> = (
    props: WelcomeScreenTemplateProps
) => {
    return (
        <StandardView>
            <ContentTitle {...props.contentTitle}></ContentTitle>
            <ContentText {...props.contentText}></ContentText>
            <View>
                <Button {...props.standaloneButton}></Button>
                <Button {...props.loginButton}></Button>
                <Button {...props.signupButton}></Button>
            </View>
        </StandardView>
    );
};
//#endregion
