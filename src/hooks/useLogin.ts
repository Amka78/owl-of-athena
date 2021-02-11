//#region Import Modules
import { Login, Auth, GuestUser } from "../types";
import { login as loginAction } from "../actions";
import { useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { Dispatch } from "redux";
import { useDispatch } from "react-redux";
import { Message, MessageKeys } from "../constants";
import { AuroraRestClientInstance } from "../clients";
import { ConfirmDialog, LoadingDialog } from "../components/molecules";
import { useTextBox, useTextBoxReturn } from "./";
//#endregion

//#region Hooks
export const useLogin = (): {
    email: useTextBoxReturn;
    password: useTextBoxReturn;
    onLoginPress: () => Promise<void>;
    generalError: string;
    onForgotPasswordButtonPress: () => void;
    onSignupButtonPress: () => void;
} => {
    const email = useTextBox("");
    const password = useTextBox("");
    const { navigate } = useNavigation();
    const dispatch = useDispatch();
    const [generalError, setGeneralError] = useState("");
    const onLoginPress = useCallback(async () => {
        LoadingDialog.show({
            dialogTitle: MessageKeys.login_loading_message,
        });
        try {
            const login: Login = {
                email: email.value,
                password: password.value,
            };
            console.debug("useLogin start", login);
            const result = await AuroraRestClientInstance.login(login);
            console.debug("loggedin user", result);

            if (result.user.providers?.email.activation_expires_at) {
                throw new Error(Message.get(MessageKeys.account_not_activated));
            }
            postLoginAction(dispatch, navigate, result);
        } catch (e) {
            console.debug(e);

            LoadingDialog.close();

            ConfirmDialog.show({
                title: Message.get(MessageKeys.standalone_mode_confirm_title),
                message: Message.get(
                    MessageKeys.standalone_mode_confirm_message
                ),
                isCancelable: true,
                onConfirm: () => {
                    const currentDate = Date.now().toLocaleString();
                    postLoginAction(dispatch, navigate, {
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
                    if (e.message) {
                        setGeneralError(e.message);
                    } else {
                        setGeneralError(
                            Message.get(MessageKeys.login_general_error_message)
                        );
                    }
                },
            });
        } finally {
            LoadingDialog.close();
        }
    }, [dispatch, email.value, navigate, password.value]);

    const onForgotPasswordButtonPress = useCallback(() => {
        navigate("ForgotPassword");
    }, [navigate]);

    const onSignupButtonPress = useCallback(() => {
        navigate("Signup");
    }, [navigate]);
    return {
        email,
        password,
        onLoginPress,
        generalError,
        onForgotPasswordButtonPress,
        onSignupButtonPress,
    };
};
//#endregion

//#region Function
function postLoginAction(dispatch: Dispatch<any>, navigate: any, result: Auth) {
    dispatch(loginAction(result.user, result.token));
    navigate("Main");
}
//#endregion
