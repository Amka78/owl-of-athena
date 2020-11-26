import { Login, Auth, GuestUser } from "../types";
import { login as loginAction } from "../actions";
import { useCallback, useState } from "react";
import { useNavigation } from "react-navigation-hooks";

import { Dispatch } from "redux";
import { useDispatch } from "react-redux";
import { Message, MessageKeys } from "../constants";
import { AuroraRestClientInstance } from "../clients";
import { ConfirmDialog, LoadingDialog } from "../components";

export const useLogin = (
    login: Login
): { onPress: () => Promise<void>; generalError: string } => {
    const { navigate } = useNavigation();
    const dispatch = useDispatch();
    const [generalError, setGeneralError] = useState("");
    const onPress = useCallback(async () => {
        LoadingDialog.show({
            dialogTitle: { key: MessageKeys.login_loading_message },
        });
        try {
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
                title: { key: MessageKeys.standalone_mode_confirm_title },
                message: { key: MessageKeys.standalone_mode_confirm_message },
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
    }, [dispatch, login, navigate]);
    return { onPress, generalError };
};
function postLoginAction(dispatch: Dispatch<any>, navigate: any, result: Auth) {
    dispatch(loginAction(result.user, result.token));
    navigate("Main");
}
