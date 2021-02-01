//#region Import Modules
import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { useUserSelector } from "../hooks";
import { logout } from "../actions";
import { initializeAurora } from "../actions/ProfilesActions";
import { initializeSession } from "../actions/SessionsActions";
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
            dispatch(initializeAurora());
            dispatch(initializeSession());
        }
        dispatch(logout());

        navigate("Logout");
    }, [dispatch, navigate, user]);
    return { onPress };
};
//#endregion
