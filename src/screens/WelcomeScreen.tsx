import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { useNavigation } from "react-navigation-hooks";

import { Button, ContentText, ContentTitle, StandardView } from "../components";
import { useAutoLogin } from "../hooks";

export const WelcomeScreen: FunctionComponent = () => {
    const { navigate } = useNavigation();
    useAutoLogin();
    return (
        <StandardView>
            <ContentTitle>{"welcome_title"}</ContentTitle>
            <ContentText>{"welcome_text"}</ContentText>
            <View>
                <Button
                    onPress={(): void => {
                        navigate("Login");
                    }}
                >
                    {"welcome_login_button"}
                </Button>
                <Button
                    onPress={(): void => {
                        navigate("Signup");
                    }}
                >
                    {"welcome_signup_button"}
                </Button>
            </View>
        </StandardView>
    );
};
