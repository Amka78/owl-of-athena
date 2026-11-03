import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { User } from "../types";

type AuthStore = {
    user?: User;
    token?: string;
    lastUsedEmail?: string;
    inactiveRoles: string[];
    login: (user: User, token: string) => void;
    logout: () => void;
    updateUser: (user: User) => void;
    setInactiveRoles: (roles: string[]) => void;
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: undefined,
            token: undefined,
            lastUsedEmail: undefined,
            inactiveRoles: [],
            login: (user, token) =>
                set({
                    user,
                    token,
                    inactiveRoles: [],
                    lastUsedEmail: user.providers?.email.provider_key,
                }),
            logout: () =>
                set({
                    user: undefined,
                    token: undefined,
                    inactiveRoles: [],
                }),
            updateUser: (user) => set({ user }),
            setInactiveRoles: (roles) => set({ inactiveRoles: roles }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
