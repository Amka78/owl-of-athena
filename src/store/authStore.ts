import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { User } from "../types";

type AuthStore = {
    user?: User;
    token?: string;
    lastUsedEmail?: string;
    login: (user: User, token: string) => void;
    logout: () => void;
    updateUser: (user: User) => void;
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: undefined,
            token: undefined,
            lastUsedEmail: undefined,
            login: (user, token) =>
                set({
                    user,
                    token,
                    lastUsedEmail: user.providers?.email.provider_key,
                }),
            logout: () => set({ user: undefined, token: undefined }),
            updateUser: (user) => set({ user }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
