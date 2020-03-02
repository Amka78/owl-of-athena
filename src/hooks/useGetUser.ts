import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { User } from "../types";
import { useClientSelector } from "./useClientSelector";

export const useGetUser = (onInitialize: (user: User) => void): void => {
    const restClient = useClientSelector();
    const dispatch = useDispatch();
    useEffect(() => {
        let unmounted = false;
        console.debug("useGetUser start");
        const f = async (): Promise<User | undefined> => {
            if (!unmounted)
                try {
                    const result = await restClient.getAuthUser();
                    console.debug("authenticatedUser", result);
                    return result;
                } catch (ex) {
                    console.debug(ex);
                }
            return undefined;
        };
        f().then((value?: User) => {
            onInitialize(value!);
            //dispatch(updateUser(value!));
        });
        const cleanup = (): void => {
            unmounted = true;
        };
        return cleanup;
    }, [dispatch, onInitialize, restClient]);
};
