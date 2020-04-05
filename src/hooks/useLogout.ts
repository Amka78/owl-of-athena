import { useCallback } from "react";
import { useNavigation } from "react-navigation-hooks";
import { useDispatch } from "react-redux";

import { logout } from "../actions";
import { initializeAurora } from "../actions/ProfilesAction";
import { initializeSession } from "../actions/SessionsActions";

export const useLogout = (): { onPress: () => Promise<void> } => {
    const { navigate } = useNavigation();
    const dispatch = useDispatch();
    const onPress = useCallback(async () => {
        console.debug("useSignout start");

        dispatch(initializeAurora());
        dispatch(initializeSession());
        dispatch(logout());

        navigate("Logout");
    }, [dispatch, navigate]);
    return { onPress };
};
