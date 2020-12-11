//#region Import Modules
import { Auth } from "../types";
import { login as loginAction } from "../actions";
import { useCallback } from "react";
import { useNavigation } from "react-navigation-hooks";
import { useAutoLogin } from "./useAutoLogin";
import { useDispatch } from "react-redux";
import { MessageKeys } from "../constants";
import { LoadingDialog } from "../components";
import { createGuestUser } from "../service/WelcomeService";
//#endregion

//#region Hooks
export const useWelcome = (): {
    onStandalonePress: () => Promise<void>;
    onLoginPress: () => Promise<void>;
    onSignupPress: () => Promise<void>;
} => {
    useAutoLogin();
    const { navigate } = useNavigation();
    const dispatch = useDispatch();

    const onStandalonePress = useCallback(async () => {
        LoadingDialog.show({
            dialogTitle: { key: MessageKeys.login_loading_message },
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

    const onLoginPress = useCallback(async () => {
        navigate("Login");
    }, [navigate]);

    const onSignupPress = useCallback(async () => {
        navigate("Signup");
    }, [navigate]);
    return { onStandalonePress, onLoginPress, onSignupPress };
};
//#endregion
