//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";

import { supabase } from "../clients/supabase";
import { Message, MessageKeys } from "../constants";
import { useTextBox, type useTextBoxReturn } from "./useTextBox";
//#endregion

//#region Hooks
export const useForgotPassword = (
    loadingInitialValue: boolean,
): {
    loading: boolean;
    onForgotPasswordPress: () => Promise<void>;
    onCancelPress: () => void;
    emailAddress: useTextBoxReturn;
    generalError: string;
    successMessage: string;
} => {
    const emailAddress = useTextBox("");
    const { navigate } = useNavigation<any>();
    const [loading, setLoading] = useState(loadingInitialValue);
    const [generalError, setGeneralError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const onForgotPasswordPress = useCallback(async () => {
        setGeneralError("");
        setSuccessMessage("");

        const email = emailAddress.value.trim();
        if (!email) {
            setGeneralError(
                Message.get(MessageKeys.required, [Message.get(MessageKeys.input_email)]),
            );
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) throw error;
            setSuccessMessage(Message.get(MessageKeys.forgot_password_success));
        } catch (e) {
            const err = e as Error;
            setGeneralError(err.message || Message.get(MessageKeys.login_general_error_message));
        } finally {
            setLoading(false);
        }
    }, [emailAddress.value]);

    const onCancelPress = useCallback(() => {
        navigate("Welcome");
    }, [navigate]);

    return {
        loading,
        onForgotPasswordPress,
        onCancelPress,
        emailAddress,
        generalError,
        successMessage,
    };
};
//#endregion
