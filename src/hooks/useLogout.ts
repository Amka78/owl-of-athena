//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

import { useUserSelector } from "../hooks";
import { useAuthStore } from "../store/authStore";
import { useProfileStore } from "../store/profileStore";
import { useSessionStore } from "../store/sessionStore";
import { GuestUser } from "../types";
//#endregion

//#region Hooks
export const useLogout = (): { onPress: () => Promise<void> } => {
    const { navigate } = useNavigation<any>();
    const user = useUserSelector();
    const { logout } = useAuthStore();
    const { initializeProfiles } = useProfileStore();
    const { initializeSession } = useSessionStore();
    const onPress = useCallback(async () => {
        console.debug("useSignout start");

        if (user?.id !== GuestUser) {
            initializeProfiles();
            initializeSession();
        }
        logout();
        navigate("Unauthenticated", { screen: "Welcome" });
    }, [initializeProfiles, initializeSession, logout, navigate, user?.id]);

    return { onPress };
};
//#endregion
