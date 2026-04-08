//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";

import { supabase } from "../clients/supabase";
import { Message, MessageKeys } from "../constants";
import { useTextBox, type useTextBoxReturn } from "./useTextBox";
//#endregion

//#region Hooks
export const useChangePassword = (): {
    loading: boolean;
    newPassword: useTextBoxReturn;
    confirmPassword: useTextBoxReturn;
    onSavePress: () => Promise<void>;
    onCancelPress: () => void;
    generalError: string;
    successMessage: string;
} => {
    const newPassword = useTextBox("");
    const confirmPassword = useTextBox("");
    const { goBack } = useNavigation<any>();
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const onSavePress = useCallback(async () => {
        setGeneralError("");
        setSuccessMessage("");

        if (!newPassword.value) {
            setGeneralError(
                Message.get(MessageKeys.required, [
                    Message.get(MessageKeys.change_password_input_new_password),
                ]),
            );
            return;
        }
        if (newPassword.value !== confirmPassword.value) {
            setGeneralError(Message.get(MessageKeys.passwords_must_match));
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword.value });
            if (error) throw error;
            setSuccessMessage(Message.get(MessageKeys.change_password_success));
            newPassword.set("");
            confirmPassword.set("");
        } catch (e) {
            const err = e as Error;
            setGeneralError(err.message || Message.get(MessageKeys.login_general_error_message));
        } finally {
            setLoading(false);
        }
    }, [newPassword, confirmPassword]);

    const onCancelPress = useCallback(() => {
        goBack();
    }, [goBack]);

    return {
        loading,
        newPassword,
        confirmPassword,
        onSavePress,
        onCancelPress,
        generalError,
        successMessage,
    };
};
//#endregion
