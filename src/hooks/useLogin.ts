import { Login } from "../types";
import { login as loginAction } from "../actions";
import { useCallback, useState } from "react";
import { useNavigation } from "react-navigation-hooks";

import { useDispatch } from "react-redux";
import { Message, MessageKeys } from "../constants";
import { AuroraRestClientInstance } from "../clients";
import { LoadingDialog } from "../components";

export const useLogin = (
    login: Login
): { loading: boolean; onPress: () => Promise<void>; generalError: string } => {
    const { navigate } = useNavigation();
    const dispatch = useDispatch();
    const [generalError, setGeneralError] = useState("");
    const onPress = useCallback(async () => {
        LoadingDialog.show({
            dialogTitle: { key: MessageKeys.login_loading_message }
        });
        try {
            console.debug("useLogin start", login);
            const result = await AuroraRestClientInstance.login(login);
            console.debug("loggedin user", result);

            dispatch(loginAction(result.user, result.token));

            if (result.user.providers.email.activation_expires_at) {
                throw new Error(Message.get(MessageKeys.account_not_activated));
            }
            navigate("Main");
        } catch (e) {
            console.debug(e);
            if (e.message) {
                setGeneralError(e.message);
            } else {
                setGeneralError(
                    Message.get(MessageKeys.login_general_error_message)
                );
            }
        } finally {
            LoadingDialog.close();
        }
    }, [dispatch, login, navigate]);
    return { onPress, generalError };
};
