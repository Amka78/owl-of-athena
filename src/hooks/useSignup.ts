import { useCallback, useState } from "react";
import { useNavigation } from "react-navigation-hooks";

import { Message, MessageKeys } from "../constants";
import { Signup } from "../types";
import { AuroraRestClientInstance } from "../clients/";
export const useSignup = (
    loadingInitialValue: boolean,
    signup: Signup
): {
    loading: boolean;
    onPress: () => Promise<void>;
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
    const onPress = useCallback(async () => {
        console.debug("useSignup called.");
        try {
            if (
                validate(
                    signup,
                    setEmailError,
                    setPasswordError,
                    setPasswordConfirmError,
                    setGeneralError
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
    }, [signup, navigate]);
    return {
        loading,
        onPress,
        generalError,
        emailError,
        passwordError,
        passwordConfirmError,
    };
};

function validate(
    signup: Signup,
    setEmailError: React.Dispatch<React.SetStateAction<string>>,
    setPasswordError: React.Dispatch<React.SetStateAction<string>>,
    setPasswordConfirmError: React.Dispatch<React.SetStateAction<string>>,
    setGeneralError: React.Dispatch<React.SetStateAction<string>>
): boolean {
    if (signup.email === "") {
        setEmailError(
            Message.get(MessageKeys.required, [MessageKeys.signup_input_email])
        );

        return false;
    }
    if (signup.password === "") {
        setPasswordError(
            Message.get(MessageKeys.required, [
                MessageKeys.signup_input_password,
            ])
        );
        return false;
    }
    if (signup.passwordConfirm === "") {
        setPasswordConfirmError(
            Message.get(MessageKeys.required, [
                MessageKeys.signup_input_password_confirm,
            ])
        );
        return false;
    }

    if (signup.password !== signup.passwordConfirm) {
        setPasswordConfirmError(Message.get(MessageKeys.passwords_must_match));
        return false;
    }

    if (signup.agreeToTerm === false) {
        setGeneralError(Message.get(MessageKeys.must_agree_to_term_of_use));
        return false;
    }

    return true;
}
