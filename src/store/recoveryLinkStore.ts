import { create } from "zustand";

type RecoveryLinkStore = {
    pendingUrl?: string;
    setPendingUrl: (url: string) => void;
    consumePendingUrl: () => string | undefined;
};

export const useRecoveryLinkStore = create<RecoveryLinkStore>((set, get) => ({
    pendingUrl: undefined,
    setPendingUrl: (url) => set({ pendingUrl: url }),
    consumePendingUrl: () => {
        const url = get().pendingUrl;
        if (url) set({ pendingUrl: undefined });
        return url;
    },
}));