import { useEffect } from "react";
import type { User } from "../types";
import { AuroraRestClientInstance } from "../clients";

export const useGetUser = (onInitialize: (user: User) => void): void => {
    useEffect(() => {
        let unmounted = false;
        console.debug("useGetUser start");
        const f = async (): Promise<User | undefined> => {
            if (!unmounted)
                try {
                    const result = await AuroraRestClientInstance.getAuthUser();
                    console.debug("authenticatedUser", result);
                    return result;
                } catch (ex) {
                    console.debug(ex);
                }
            return undefined;
        };
        f().then((value?: User) => {
            onInitialize(value!);
        });
        const cleanup = (): void => {
            unmounted = true;
        };
        return cleanup;
    }, [onInitialize]);
};
