import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Settings } from "../sdk/models";

type AuroraStore = {
    userSettings: Settings;
    cacheSettings: (settings: Settings) => void;
    initializeAurora: () => void;
};

export const useAuroraStore = create<AuroraStore>()(
    persist(
        (set) => ({
            userSettings: new Settings({}),
            cacheSettings: (settings) => set({ userSettings: settings }),
            initializeAurora: () => set({ userSettings: new Settings({}) }),
        }),
        {
            name: "aurora-storage",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
