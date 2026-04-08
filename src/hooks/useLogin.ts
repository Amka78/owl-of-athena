//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { AuroraRestClientInstance } from "../clients";
import { ConfirmDialog, LoadingDialog } from "../components/molecules";
import { Message, MessageKeys } from "../constants";
import { useAuthStore } from "../store/authStore";
import { GuestUser, type Login, type User } from "../types";
import type { Auth } from "../types/Auth";
import { useTextBox, type useTextBoxReturn } from "./useTextBox";
//#endregion

//#region Hooks
export const useLogin = (): {
    email: useTextBoxReturn;
    password: useTextBoxReturn;
    onLoginPress: () => Promise<void>;
    onCancelPress: () => void;
    generalError: string;
    onForgotPasswordPress: () => void;
    onSignupPress: () => void;
} => {
    const email = useTextBox("");
    const password = useTextBox("");
    const { navigate } = useNavigation<any>();
    const { login } = useAuthStore();
    const [generalError, setGeneralError] = useState("");
    const onLoginPress = useCallback(async () => {
        LoadingDialog.show({
            dialogTitle: Message.get(MessageKeys.login_loading_message),
        });
        try {
            const loginData: Login = {
                email: email.value,
                password: password.value,
            };
            console.debug("useLogin start", loginData);
            const result = await AuroraRestClientInstance.login(loginData);
            console.debug("loggedin user", result);

            if (!result.user.emailConfirmed) {
                LoadingDialog.close();
                navigate("ConfirmEmail", { email: loginData.email });
                return;
            }
            postLoginAction(login, navigate, result);
        } catch (e) {
            const err = e as Error;
            console.debug(e);

            LoadingDialog.close();

            ConfirmDialog.show({
                title: Message.get(MessageKeys.standalone_mode_confirm_title),
                message: Message.get(MessageKeys.standalone_mode_confirm_message),
                isCancelable: true,
                onConfirm: () => {
                    const currentDate = Date.now().toLocaleString();
                    postLoginAction(login, navigate, {
                        user: {
                            id: GuestUser,
                            birthday: currentDate,
                            created_at: currentDate,
                            updatedAt: currentDate,
                        },
                        token: "",
                    });
                },
                onDissmiss: () => {
                    if (err.message) {
                        setGeneralError(err.message);
                    } else {
                        setGeneralError(Message.get(MessageKeys.login_general_error_message));
                    }
                },
            });
        } finally {
            LoadingDialog.close();
        }
    }, [email.value, login, navigate, password.value]);

    const onCancelPress = useCallback(() => {
        navigate("Welcome");
    }, [navigate]);

    const onForgotPasswordPress = useCallback(() => {
        navigate("ForgotPassword");
    }, [navigate]);

    const onSignupPress = useCallback(() => {
        navigate("Signup");
    }, [navigate]);
    return {
        email,
        password,
        onLoginPress,
        onCancelPress,
        generalError,
        onForgotPasswordPress,
        onSignupPress,
    };
};
//#endregion

//#region Function
function postLoginAction(login: (user: User, token: string) => void, navigate: any, result: Auth) {
    login(result.user, result.token);
    navigate("Main");
}
//#endregion
