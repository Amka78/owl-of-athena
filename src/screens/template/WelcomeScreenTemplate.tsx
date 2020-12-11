//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import {
    Button,
    ContentText,
    ContentTitle,
    StandardView,
} from "../../components";
import { MessageLocalizationParam } from "../../constants/Message";
//#endregion

export type WelcomeScreenTemplateProps = {
    contentTitleText: MessageLocalizationParam;
    contentText: MessageLocalizationParam;
    standaloneButtonText: MessageLocalizationParam;
    standaloneButtonPress: () => void;
    loginButtonText: MessageLocalizationParam;
    loginButtonPress: () => void;
    signupButtonText: MessageLocalizationParam;
    signupButtonPress: () => void;
};

//#region Component
export const WelcomeScreenTemplate: FunctionComponent<WelcomeScreenTemplateProps> = (
    props: WelcomeScreenTemplateProps
) => {
    return (
        <StandardView>
            <ContentTitle>{props.contentTitleText}</ContentTitle>
            <ContentText>{props.contentText}</ContentText>
            <View>
                <Button onPress={props.standaloneButtonPress}>
                    {props.standaloneButtonText}
                </Button>
                <Button onPress={props.loginButtonPress}>
                    {props.loginButtonText}
                </Button>
                <Button onPress={props.signupButtonPress}>
                    {props.signupButtonText}
                </Button>
            </View>
        </StandardView>
    );
};
//#endregion
