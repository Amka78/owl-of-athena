//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";

import { supabase } from "../clients/supabase";
import { Message, MessageKeys } from "../constants";
import { useTextBox, type useTextBoxReturn } from "./useTextBox";
//#endregion

//#region Hooks
export const useChangeEmail = (): {
    loading: boolean;
    newEmail: useTextBoxReturn;
    confirmEmail: useTextBoxReturn;
    onSavePress: () => Promise<void>;
    onCancelPress: () => void;
    generalError: string;
    successMessage: string;
} => {
    const newEmail = useTextBox("");
    const confirmEmail = useTextBox("");
    const { goBack } = useNavigation<any>();
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const onSavePress = useCallback(async () => {
        setGeneralError("");
        setSuccessMessage("");

        if (!newEmail.value) {
            setGeneralError(
                Message.get(MessageKeys.required, [
                    Message.get(MessageKeys.change_email_input_new_email),
                ]),
            );
            return;
        }
        if (newEmail.value !== confirmEmail.value) {
            setGeneralError(Message.get(MessageKeys.emails_must_match));
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ email: newEmail.value });
            if (error) throw error;
            setSuccessMessage(Message.get(MessageKeys.change_email_success));
            newEmail.set("");
            confirmEmail.set("");
        } catch (e) {
            const err = e as Error;
            setGeneralError(err.message || Message.get(MessageKeys.login_general_error_message));
        } finally {
            setLoading(false);
        }
    }, [newEmail, confirmEmail]);

    const onCancelPress = useCallback(() => {
        goBack();
    }, [goBack]);

    return {
        loading,
        newEmail,
        confirmEmail,
        onSavePress,
        onCancelPress,
        generalError,
        successMessage,
    };
};
//#endregion
