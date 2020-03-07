import { AsyncStorage } from "react-native";
import { Login } from "../types";
import { login as loginAction } from "../actions";
import { useCallback, useState } from "react";
import { useNavigation } from "react-navigation-hooks";

import { TokenManager } from "../utils";
import { useRestClientSelector } from "./useRestClientSelector";
import { useDispatch } from "react-redux";
import { Message, StorageKeys } from "../constants";

export const useLogin = (
    loadingInitialValue: boolean,
    login: Login
): { loading: boolean; onPress: () => Promise<void>; generalError: string } => {
    const [loading, setLoading] = useState(loadingInitialValue);
    const restClient = useRestClientSelector();
    const { navigate } = useNavigation();
    const dispatch = useDispatch();
    const [generalError, setGeneralError] = useState("");
    const onPress = useCallback(async () => {
        setLoading(true);
        try {
            console.debug("useLogin start", login);
            const result = await restClient.login(login);
            console.debug("loggedin user", result);

            dispatch(loginAction(result.user));
            await AsyncStorage.setItem(StorageKeys.lastUsedEmail, login.email);

            await TokenManager.set(result.token);

            if (result.user.providers.email.activation_expires_at) {
                throw new Error(Message.get("account_not_activated"));
            }
            navigate("Main");
        } catch (e) {
            console.debug(e);
            if (e.message) {
                setGeneralError(e.message);
            } else {
                setGeneralError(Message.get("login_general_error_message"));
            }
            setLoading(false);
        }
    }, [dispatch, login, navigate, restClient]);
    return { loading, onPress, generalError };
};
