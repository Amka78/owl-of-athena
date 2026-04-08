//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { LoadingDialog } from "../components/molecules";
import { Message, MessageKeys } from "../constants";
import { createGuestUser } from "../services/WelcomeService";
import { useAuthStore } from "../store/authStore";
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
    const { navigate } = useNavigation<any>();
    const { login } = useAuthStore();

    const onStandalonePress = useCallback(() => {
        LoadingDialog.show({
            dialogTitle: Message.get(MessageKeys.login_loading_message),
        });

        try {
            const guestLogin = createGuestUser(Date.now());
            login(guestLogin.user, guestLogin.token);
            navigate("Main");
        } catch (e) {
            console.error(e);
        } finally {
            LoadingDialog.close();
        }
    }, [login, navigate]);

    const onLoginPress = useCallback(() => {
        navigate("Login");
    }, [navigate]);

    const onCancelPress = useCallback(() => {
        navigate("");
    }, [navigate]);
    const onSignupPress = useCallback(() => {
        navigate("Signup");
    }, [navigate]);
    return { onStandalonePress, onLoginPress, onCancelPress, onSignupPress };
};
//#endregion
