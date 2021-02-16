//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Linking } from "react-native";

import { AuroraRestClientInstance } from "../clients/";
import { Message, MessageKeys } from "../constants";
import { validate } from "../services/SignupService";
import { Signup } from "../types";
import {
    useCheckBox,
    useCheckBoxReturn,
    useTextBox,
    useTextBoxReturn,
} from "./";
//#endregion

//#region Hooks
export const useSignup = (
    loadingInitialValue: boolean
): {
    loading: boolean;
    emailHooks: useTextBoxReturn;
    passwordHooks: useTextBoxReturn;
    passwordConfirmHooks: useTextBoxReturn;
    checkBoxHooks: useCheckBoxReturn;
    onSignupPress: () => Promise<void>;
    onCancelPress: () => void;
    onLinkTextPress: () => void;
    generalError?: string;
    emailError?: string;
    passwordError?: string;
    passwordConfirmError?: string;
} => {
    const [loading, setLoading] = useState(loadingInitialValue);
    const { navigate } = useNavigation();
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [passwordConfirmError, setPasswordConfirmError] = useState<string>(
        ""
    );
    const [generalError, setGeneralError] = useState<string>("");
    const emailHooks = useTextBox("");
    const passwordHooks = useTextBox("");
    const passwordConfirmHooks = useTextBox("");
    const checkBoxHooks = useCheckBox(false);

    const onSignupPress = useCallback(async () => {
        console.debug("useSignup called.");

        const signup: Signup = {
            email: emailHooks.value,
            password: passwordHooks.value,
            passwordConfirm: passwordConfirmHooks.value,
            agreeToTerm: checkBoxHooks.status == "checked",
        };
        try {
            if (
                validate(
                    signup,
                    (err: string) => {
                        setEmailError(err);
                    },
                    (err: string) => {
                        setPasswordError(err);
                    },
                    (err: string) => {
                        setPasswordConfirmError(err);
                    },
                    (err: string) => {
                        setGeneralError(err);
                    }
                )
            ) {
                await AuroraRestClientInstance.signup({
                    email: signup.email,
                    password: signup.password,
                });
                navigate("Login");
            }
        } catch (e) {
            if (e.message) {
                setGeneralError(e.message);
            } else {
                setGeneralError(
                    Message.get(MessageKeys.email_already_registered)
                );
            }
            setLoading(false);
        }
    }, [
        checkBoxHooks.status,
        emailHooks.value,
        passwordConfirmHooks.value,
        passwordHooks.value,
        navigate,
    ]);

    const onCancelPress = useCallback((): void => {
        navigate("Welcome");
    }, [navigate]);

    const onLinkTextPress = useCallback((): void => {
        Linking.openURL("https://sleepwithaurora.com/shop/order-terms");
    }, []);

    return {
        loading,
        emailHooks,
        passwordHooks,
        passwordConfirmHooks,
        checkBoxHooks,
        onSignupPress,
        onCancelPress,
        onLinkTextPress,
        generalError,
        emailError,
        passwordError,
        passwordConfirmError,
    };
};
//#endregion
