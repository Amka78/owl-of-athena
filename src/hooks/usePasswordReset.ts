//#region Import Modules
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";

import { supabase } from "../clients/supabase";
import { Message, MessageKeys } from "../constants";
import { parseAuthLink } from "../services/AuthLinkService";
import { useAuthStore } from "../store/authStore";
import { useRecoveryLinkStore } from "../store/recoveryLinkStore";
import { useTextBox, type useTextBoxReturn } from "./useTextBox";
//#endregion

//#region Types
export type PasswordResetState = "checking" | "ready" | "invalid" | "success";

export type usePasswordResetReturn = {
    state: PasswordResetState;
    loading: boolean;
    newPassword: useTextBoxReturn;
    confirmPassword: useTextBoxReturn;
    errorText: string;
    onSavePress: () => Promise<void>;
    onGoLoginPress: () => void;
    onRequestNewLinkPress: () => void;
};
//#endregion

//#region Hooks
export const usePasswordReset = (): usePasswordResetReturn => {
    const { navigate } = useNavigation<any>();
    const route = useRoute<any>();
    const consumePendingUrl = useRecoveryLinkStore((state) => state.consumePendingUrl);
    const newPassword = useTextBox("");
    const confirmPassword = useTextBox("");
    const [state, setState] = useState<PasswordResetState>("checking");
    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState("");
    const initialUrl: string | undefined = route.params?.url;

    useEffect(() => {
        let active = true;

        const establishSession = async (): Promise<void> => {
            const url = initialUrl ?? consumePendingUrl();
            const params = parseAuthLink(url);

            const hasImplicitSession = !!(params.accessToken && params.refreshToken);

            if (!hasImplicitSession && !params.code) {
                if (active) {
                    setErrorText(params.errorDescription ?? params.error ?? "");
                    setState("invalid");
                }
                return;
            }

            try {
                if (hasImplicitSession) {
                    const { error } = await supabase.auth.setSession({
                        access_token: params.accessToken!,
                        refresh_token: params.refreshToken!,
                    });
                    if (error) throw error;
                } else if (params.code) {
                    const { error } = await supabase.auth.exchangeCodeForSession(params.code);
                    if (error) throw error;
                }

                if (active) setState("ready");
            } catch (error) {
                console.debug("establish reset session failed:", error);
                if (active) {
                    setErrorText((error as Error).message);
                    setState("invalid");
                }
            }
        };

        establishSession();

        return (): void => {
            active = false;
        };
    }, [consumePendingUrl, initialUrl]);

    const onSavePress = useCallback(async (): Promise<void> => {
        setErrorText("");

        if (!newPassword.value) {
            setErrorText(
                Message.get(MessageKeys.required, [
                    Message.get(MessageKeys.change_password_input_new_password),
                ]),
            );
            return;
        }
        if (newPassword.value !== confirmPassword.value) {
            setErrorText(Message.get(MessageKeys.passwords_must_match));
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword.value });
            if (error) throw error;

            await supabase.auth.signOut().catch(() => undefined);
            useAuthStore.getState().logout();
            newPassword.set("");
            confirmPassword.set("");
            setState("success");
        } catch (error) {
            console.debug("update password failed:", error);
            setErrorText(
                (error as Error).message || Message.get(MessageKeys.login_general_error_message),
            );
        } finally {
            setLoading(false);
        }
    }, [confirmPassword, newPassword]);

    const onGoLoginPress = useCallback((): void => {
        navigate("Login");
    }, [navigate]);

    const onRequestNewLinkPress = useCallback((): void => {
        navigate("ForgotPassword");
    }, [navigate]);

    return {
        state,
        loading,
        newPassword,
        confirmPassword,
        errorText,
        onSavePress,
        onGoLoginPress,
        onRequestNewLinkPress,
    };
};
//#endregion