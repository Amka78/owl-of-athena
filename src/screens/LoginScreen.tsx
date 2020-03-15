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
import { MessageKeys } from "../constants";

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
            <ContentTitle>{{ key: MessageKeys.login_title }}</ContentTitle>
            <View style={{ flex: 1 }}>
                <TextBox
                    {...emailHooks}
                    label={{ key: MessageKeys.login_input_email }}
                    keyboardType={"email-address"}
                ></TextBox>
            </View>
            <View style={{ flex: 1 }}>
                <TextBox
                    {...passwordHooks}
                    label={{ key: MessageKeys.login_input_password }}
                    secureTextEntry={true}
                ></TextBox>
            </View>
            <ErrorText>{{ key: login.generalError }}</ErrorText>
            <Button {...login}>{{ key: MessageKeys.login_button }}</Button>
            <FlatButton
                onPress={(): void => {
                    navigate("ForgotPassword");
                }}
            >
                {{ key: MessageKeys.login_forgot_password_button }}
            </FlatButton>
            <FlatButton
                onPress={(): void => {
                    navigate("Signup");
                }}
            >
                {{ key: MessageKeys.login_no_account_button }}
            </FlatButton>
        </StandardView>
    );
};
