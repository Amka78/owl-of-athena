//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { logout } from "../actions";
import { initialize } from "../actions/ProfilesActions";
import { initializeSession } from "../actions/SessionsActions";
import { useUserSelector } from "../hooks";
import { GuestUser } from "../types";
//#endregion

//#region Hooks
export const useLogout = (): { onPress: () => Promise<void> } => {
    const { navigate } = useNavigation();
    const user = useUserSelector();
    const dispatch = useDispatch();
    const onPress = useCallback(async () => {
        console.debug("useSignout start");

        if (user?.id !== GuestUser) {
            dispatch(initialize());
            dispatch(initializeSession());
        }
        dispatch(logout());
        navigate("Unauthenticated", { screen: "Welcome" });
    }, [dispatch, navigate, user?.id]);

    return { onPress };
};
//#endregion
