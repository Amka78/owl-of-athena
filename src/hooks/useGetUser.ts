import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { updateUser } from "../actions";
import { User } from "../types";
import { useClientSelector } from "./useClientSelector";

export const useGetUser = (onInitialize: (user: User) => void): void => {
    const { auroraClient } = useClientSelector();
    const dispatch = useDispatch();
    useEffect(() => {
        let unmounted = false;
        console.debug("useGetUser start");
        const f = async (): Promise<User | undefined> => {
            if (!unmounted)
                try {
                    const result = await auroraClient.getAuthUser();
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
    }, [auroraClient, dispatch, onInitialize]);
};
