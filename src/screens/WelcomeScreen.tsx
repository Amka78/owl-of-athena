import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { CommonStyles } from "../styles";
import { Button, ContentTitle, ContentText } from "../components";
import { useNavigation } from "react-navigation-hooks";
export const WelcomeScreen: FunctionComponent = () => {
    const { navigate } = useNavigation();
    return (
        <View style={CommonStyles.rootContainer}>
            <View style={CommonStyles.standardView}>
                <ContentTitle>{"welcome_title"}</ContentTitle>
                <ContentText>{"welcome_text"}</ContentText>
                <View>
                    <Button
                        onPress={() => {
                            navigate("Login");
                        }}
                    >
                        {"welcome_login_button"}
                    </Button>
                    <Button
                        onPress={() => {
                            navigate("Signup");
                        }}
                    >
                        {"welcome_signup_button"}
                    </Button>
                </View>
            </View>
        </View>
    );
};
