//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { login as loginAction } from "../actions";
import { LoadingDialog } from "../components/molecules";
import { Message, MessageKeys } from "../constants";
import { createGuestUser } from "../services/WelcomeService";
import { Auth } from "../types";
import { useAutoLogin } from "./useAutoLogin";
//#endregion

//#region Hooks
export const useWelcome = (): {
    onStandalonePress: () => void;
    onLoginPress: () => void;
    onCancelPress: () => void;
    onSignupPress: () => void;
} => {
    useAutoLogin();
    const { navigate } = useNavigation();
    const dispatch = useDispatch();

    const onStandalonePress = useCallback(() => {
        LoadingDialog.show({
            dialogTitle: Message.get(MessageKeys.login_loading_message),
        });

        try {
            const guestLogin: Auth = createGuestUser(Date.now());
            dispatch(loginAction(guestLogin.user, guestLogin.token));
            navigate("Main");
        } catch (e) {
            console.error(e);
        } finally {
            LoadingDialog.close();
        }
    }, [dispatch, navigate]);

    const onLoginPress = useCallback(() => {
        navigate("Login");
    }, [navigate]);

    const onCancelPress = useCallback(() => {
        navigate("");
    }, [navigate]);
    const onSignupPress = useCallback(() => {
        navigate("Signup");
    }, [navigate]);
    return { onStandalonePress, onLoginPress, onSignupPress };
};
//#endregion
