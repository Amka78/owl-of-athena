import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AppStore = {
    wakeLock: boolean;
    setWakeLock: (value: boolean) => void;
};

export const useAppStore = create<AppStore>()(
    persist(
        (set) => ({
            wakeLock: false,
            setWakeLock: (value) => set({ wakeLock: value }),
        }),
        {
            name: "app-storage",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
