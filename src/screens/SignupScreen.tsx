import React, { FunctionComponent } from "react";
import { Linking, Text, View } from "react-native";

import {
    Button,
    CheckBox,
    ContentTitle,
    ErrorText,
    StandardView,
    TextBox
} from "../components";
import { Colors, Message, MessageKeys } from "../constants";
import { useCheckBox, useSignup, useTextBox } from "../hooks";

export const SignupScreen: FunctionComponent = () => {
    const emailHooks = useTextBox("");
    const passwordHooks = useTextBox("");
    const passwordConfirmHooks = useTextBox("");
    const checkBoxHooks = useCheckBox(false);
    const signup = useSignup(false, {
        email: emailHooks.value,
        password: passwordHooks.value,
        passwordConfirm: passwordConfirmHooks.value,
        agreeToTerm: checkBoxHooks.status === "checked"
    });
    return (
        <StandardView>
            <ContentTitle>{{ key: MessageKeys.signup_title }}</ContentTitle>
            <View style={{ flex: 1 }}>
                <TextBox
                    {...emailHooks}
                    label={{ key: MessageKeys.signup_input_email }}
                    keyboardType={"email-address"}
                ></TextBox>
            </View>
            <View style={{ flex: 1 }}>
                <TextBox
                    {...passwordHooks}
                    label={{ key: MessageKeys.signup_input_password }}
                    secureTextEntry={true}
                ></TextBox>
            </View>
            <View style={{ flex: 1 }}>
                <TextBox
                    {...passwordConfirmHooks}
                    label={{ key: MessageKeys.signup_input_password_confirm }}
                    secureTextEntry={true}
                ></TextBox>
            </View>
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <CheckBox {...checkBoxHooks}></CheckBox>
                <Text
                    style={{ color: Colors.cyan }}
                    onPress={(): void => {
                        Linking.openURL(
                            "https://sleepwithaurora.com/shop/order-terms"
                        );
                    }}
                >
                    {Message.get(MessageKeys.signup_terms)}
                </Text>
            </View>
            <ErrorText>{{ key: signup.generalError }}</ErrorText>
            <Button {...signup}>{{ key: MessageKeys.signup_button }}</Button>
        </StandardView>
    );
};
