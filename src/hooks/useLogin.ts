import { AsyncStorage } from "react-native";
import { Login } from "../types";
import { useCallback, useState } from "react";
import { useNavigation } from "react-navigation-hooks";

import { TokenManager } from "../utils";
import { useClientSelector } from "./useClientSelector";
import { Message, StorageKeys } from "../constants";

export const useLogin = (
    loadingInitialValue: boolean,
    login: Login
): { loading: boolean; onPress: () => Promise<void>; generalError: string } => {
    const [loading, setLoading] = useState(loadingInitialValue);
    const { auroraClient } = useClientSelector();
    const { navigate } = useNavigation();
    const [generalError, setGeneralError] = useState("");
    const onPress = useCallback(async () => {
        setLoading(true);
        try {
            console.debug("useLogin start", login);
            const result = await auroraClient.login(login);

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
        }

        setLoading(false);
    }, [login, navigate]);
    return { loading, onPress, generalError };
};
