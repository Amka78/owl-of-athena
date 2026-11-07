//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useCallback, useState } from "react";
import { Linking } from "react-native";

import { AuroraRestClientInstance } from "../clients/";
import { Message, MessageKeys } from "../constants";
import type { checkBoxCoreFunctions } from "../hooks/useCheckBox";
import { validate } from "../services/SignupService";
import type { Signup } from "../types";
import { useCheckBox, useTextBox } from "./";
import type { useTextBoxReturn } from "./useTextBox";
//#endregion

//#region Hooks
export const useSignup = (
    loadingInitialValue: boolean,
): {
    loading: boolean;
    emailHooks: useTextBoxReturn;
    passwordHooks: useTextBoxReturn;
    passwordConfirmHooks: useTextBoxReturn;
    firstNameHooks: useTextBoxReturn;
    lastNameHooks: useTextBoxReturn;
    birthDay?: Date;
    onBirthDayChange: (date: Date) => void;
    gender: string;
    onGenderChange: (gender: string) => void;
    newsletterHooks: checkBoxCoreFunctions;
    checkBoxHooks: checkBoxCoreFunctions;
    onSignupPress: () => Promise<void>;
    onCancelPress: () => void;
    onLinkTextPress: () => void;
    generalError?: string;
    emailError?: string;
    passwordError?: string;
    passwordConfirmError?: string;
} => {
    const [loading, setLoading] = useState(loadingInitialValue);
    const { navigate } = useNavigation<any>();
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [passwordConfirmError, setPasswordConfirmError] = useState<string>("");
    const [generalError, setGeneralError] = useState<string>("");
    const emailHooks = useTextBox("");
    const passwordHooks = useTextBox("");
    const passwordConfirmHooks = useTextBox("");
    const firstNameHooks = useTextBox("");
    const lastNameHooks = useTextBox("");
    const [birthDay, setBirthDay] = useState<Date>();
    const [gender, setGender] = useState("male");
    const newsletterHooks = useCheckBox(false);
    const checkBoxHooks = useCheckBox(false);

    const onSignupPress = useCallback(async () => {
        console.debug("useSignup called.");

        const signup: Signup = {
            email: emailHooks.value,
            password: passwordHooks.value,
            passwordConfirm: passwordConfirmHooks.value,
            agreeToTerm: checkBoxHooks.status === "checked",
            firstName: firstNameHooks.value,
            lastName: lastNameHooks.value,
            birthday: birthDay,
            gender,
            newsletter: newsletterHooks.status === "checked",
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
                    },
                )
            ) {
                await AuroraRestClientInstance.signup({
                    email: signup.email,
                    password: signup.password,
                    firstName: signup.firstName,
                    lastName: signup.lastName,
                    birthday: signup.birthday
                        ? moment(signup.birthday).format("YYYY-MM-DD")
                        : undefined,
                    gender: signup.gender,
                    newsletter: signup.newsletter,
                });
                navigate("ConfirmEmail", { email: signup.email });
            }
        } catch (e) {
            const err = e as Error;
            if (err.message) {
                setGeneralError(err.message);
            } else {
                setGeneralError(Message.get(MessageKeys.email_already_registered));
            }
            setLoading(false);
        }
    }, [
        birthDay,
        checkBoxHooks.status,
        emailHooks.value,
        firstNameHooks.value,
        gender,
        lastNameHooks.value,
        navigate,
        newsletterHooks.status,
        passwordConfirmHooks.value,
        passwordHooks.value,
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
        firstNameHooks,
        lastNameHooks,
        birthDay,
        onBirthDayChange: setBirthDay,
        gender,
        onGenderChange: setGender,
        newsletterHooks,
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
