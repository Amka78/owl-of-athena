import { useCallback } from "react";
import { useNavigation } from "react-navigation-hooks";
import { useDispatch } from "react-redux";

import { logout } from "../actions";
import { TokenManager } from "../utils";

export const useLogout = (): { onPress: () => Promise<void> } => {
    const { navigate } = useNavigation();
    const dispatch = useDispatch();
    const onPress = useCallback(async () => {
        console.debug("useSignout start");

        dispatch(logout());

        await TokenManager.reset();

        navigate("Unauthenticated");
    }, [dispatch, navigate]);
    return { onPress };
};
