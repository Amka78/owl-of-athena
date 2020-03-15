import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { useNavigation } from "react-navigation-hooks";

import { Button, ContentText, ContentTitle, StandardView } from "../components";
import { useAutoLogin } from "../hooks";
import { MessageKeys } from "../constants";
export const WelcomeScreen: FunctionComponent = () => {
    const { navigate } = useNavigation();
    useAutoLogin();
    return (
        <StandardView>
            <ContentTitle>{{ key: MessageKeys.welcome_title }}</ContentTitle>
            <ContentText>{{ key: MessageKeys.welcome_text }}</ContentText>
            <View>
                <Button
                    onPress={(): void => {
                        navigate("Login");
                    }}
                >
                    {{ key: MessageKeys.welcome_login_button }}
                </Button>
                <Button
                    onPress={(): void => {
                        navigate("Signup");
                    }}
                >
                    {{ key: MessageKeys.welcome_signup_button }}
                </Button>
            </View>
        </StandardView>
    );
};
