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
    FlexSpacer,
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
            <FlexSpacer></FlexSpacer>
            <ContentTitle
                {...props.contentTitle}
                style={{ flex: 1 }}
            ></ContentTitle>
            <ContentText
                {...props.contentText}
                style={{ flex: 1 }}
            ></ContentText>
            <FlexSpacer></FlexSpacer>
            <View>
                <Button {...props.standaloneButton}></Button>
                <Button {...props.loginButton}></Button>
                <Button {...props.signupButton}></Button>
            </View>
        </StandardView>
    );
};
//#endregion
