//#region Import Modules
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useState } from "react";

import { supabase } from "../clients/supabase";
import { Message, MessageKeys } from "../constants";
//#endregion

//#region Hooks
export const useConfirmEmail = (): {
    email: string;
    onCheckPress: () => Promise<void>;
    onResendPress: () => Promise<void>;
    onChangeEmailPress: (newEmail: string, password: string) => Promise<void>;
    generalError: string;
    successMessage: string;
    loading: boolean;
} => {
    const { navigate } = useNavigation<any>();
    const route = useRoute<any>();
    const email: string = route.params?.email ?? "";
    const [generalError, setGeneralError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const onCheckPress = useCallback(async () => {
        setGeneralError("");
        setSuccessMessage("");
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.getUser();
            if (error) throw error;

            if (data.user?.email_confirmed_at) {
                navigate("Login");
            } else {
                setGeneralError(Message.get(MessageKeys.confirm_email_not_verified));
            }
        } catch (e) {
            setGeneralError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const onResendPress = useCallback(async () => {
        setGeneralError("");
        setSuccessMessage("");
        if (!email) return;
        setLoading(true);
        try {
            const { error } = await supabase.auth.resend({
                type: "signup",
                email,
            });
            if (error) throw error;
            setSuccessMessage(Message.get(MessageKeys.confirm_email_resent));
        } catch (e) {
            setGeneralError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }, [email]);

    const onChangeEmailPress = useCallback(
        async (newEmail: string, password: string) => {
            setGeneralError("");
            setSuccessMessage("");
            setLoading(true);
            try {
                // Re-authenticate then update email
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;

                const { error } = await supabase.auth.updateUser({
                    email: newEmail,
                });
                if (error) throw error;
                setSuccessMessage(Message.get(MessageKeys.confirm_email_resent));
            } catch (e) {
                setGeneralError((e as Error).message);
            } finally {
                setLoading(false);
            }
        },
        [email],
    );

    return {
        email,
        onCheckPress,
        onResendPress,
        onChangeEmailPress,
        generalError,
        successMessage,
        loading,
    };
};
//#endregion
