import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { useNavigation } from "react-navigation-hooks";

import {
    Button,
    ContentTitle,
    ErrorText,
    FlatButton,
    StandardView,
    TextBox
} from "../components";
import { useLogin, useTextBox } from "../hooks";

export const LoginScreen: FunctionComponent = () => {
    const emailHooks = useTextBox("");
    const passwordHooks = useTextBox("");
    const { navigate } = useNavigation();
    const login = useLogin(false, {
        email: emailHooks.value,
        password: passwordHooks.value
    });
    return (
        <StandardView>
            <ContentTitle>{"login_title"}</ContentTitle>
            <View style={{ flex: 1 }}>
                <TextBox
                    {...emailHooks}
                    label={"login_input_email"}
                    keyboardType={"email-address"}
                ></TextBox>
            </View>
            <View style={{ flex: 1 }}>
                <TextBox
                    {...passwordHooks}
                    label={"login_input_password"}
                    secureTextEntry={true}
                ></TextBox>
            </View>
            <ErrorText>{login.generalError}</ErrorText>
            <Button {...login}>{"login_button"}</Button>
            <FlatButton
                onPress={(): void => {
                    navigate("ForgotPassword");
                }}
            >
                {"login_forgot_password_button"}
            </FlatButton>
            <FlatButton
                onPress={(): void => {
                    navigate("Signup");
                }}
            >
                {"login_no_account_button"}
            </FlatButton>
        </StandardView>
    );
};
