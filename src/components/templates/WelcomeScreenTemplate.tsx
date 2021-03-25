//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import { Message, MessageKeys } from "../../constants";
import { useLocale } from "../../hooks";
import { Dimensions } from "../../hooks/useWindowDimensions";
import { Button, ContentText, ContentTitle, LeftSideButton } from "../atoms";
import { InternalView, RightSideButton } from "../molecules";
//#endregion

//#region Types
export type WelcomeScreenTemplateProps = {
    onStandalonePress: () => void;
    onLoginPress: () => void;
    onSignupPress: () => void;
    dimens: Dimensions;
    locale?: string;
};
//#endregion

//#region Component
export const WelcomeScreenTemplate: FunctionComponent<WelcomeScreenTemplateProps> = (
    props: WelcomeScreenTemplateProps
) => {
    useLocale(props.locale);

    const isTwoColumnsBottoms =
        props.dimens.isHorizontal || props.dimens.isLargeWidth;
    return (
        <InternalView>
            <ContentTitle>
                {Message.get(MessageKeys.welcome_title)}
            </ContentTitle>
            <ContentText>{Message.get(MessageKeys.welcome_text)}</ContentText>
            <View style={{ alignItems: "center" }}>
                <View
                    style={{
                        flexDirection: isTwoColumnsBottoms ? "row" : "column",
                    }}
                >
                    <LeftSideButton
                        onPress={props.onLoginPress}
                        screenWidth={props.dimens.width}
                        needMargin={isTwoColumnsBottoms}
                    >
                        {Message.get(MessageKeys.welcome_login_button)}
                    </LeftSideButton>
                    <RightSideButton
                        onPress={props.onSignupPress}
                        screenWidth={props.dimens.width}
                        needMargin={isTwoColumnsBottoms}
                    >
                        {Message.get(MessageKeys.welcome_signup_button)}
                    </RightSideButton>
                </View>
                <Button
                    onPress={props.onStandalonePress}
                    screenWidth={props.dimens.width}
                >
                    {Message.get(MessageKeys.welcome_standalone_button)}
                </Button>
            </View>
        </InternalView>
    );
};
//#endregion
