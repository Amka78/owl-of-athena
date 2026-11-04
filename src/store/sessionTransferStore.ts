import { create } from "zustand";
import type { SessionSyncProgress } from "../managers";
import { AuroraManagerInstance } from "../managers";
import type { FileInfo } from "../sdk/AuroraTypes";

export type TransferStatus = "idle" | "scanning" | "transferring" | "complete" | "error";

type SessionTransferStore = {
    status: TransferStatus;
    unsyncedSessions: FileInfo[];
    transferredCount: number;
    statusText: string;
    progress?: SessionSyncProgress;
    error?: string;

    scanSessions: () => Promise<void>;
    transferSessions: (sessions: FileInfo[], guestLogin?: boolean) => Promise<void>;
    resetTransfer: () => void;
};

export const useSessionTransferStore = create<SessionTransferStore>()((set) => ({
    status: "idle",
    unsyncedSessions: [],
    transferredCount: 0,
    statusText: "",
    progress: undefined,
    error: undefined,

    scanSessions: async () => {
        set({ status: "scanning", error: undefined, unsyncedSessions: [] });
        try {
            const sessions = await AuroraManagerInstance.getUnsyncedSessions();
            set({ status: "idle", unsyncedSessions: sessions });
        } catch (e: any) {
            set({ status: "error", error: e?.message ?? "Failed to scan sessions" });
        }
    },

    transferSessions: async (sessions: FileInfo[], guestLogin = false) => {
        set({
            status: "transferring",
            transferredCount: 0,
            statusText: "",
            progress: undefined,
            error: undefined,
        });
        try {
            const result = await AuroraManagerInstance.pushSessions(
                sessions,
                guestLogin,
                (progress) => set({ progress }),
            );
            set({
                status: "complete",
                transferredCount: result.syncedCount,
                statusText: "",
                progress: undefined,
            });
        } catch (e: any) {
            set({
                status: "error",
                progress: undefined,
                error: e?.message ?? "Failed to transfer sessions",
            });
        }
    },

    resetTransfer: () =>
        set({
            status: "idle",
            unsyncedSessions: [],
            transferredCount: 0,
            statusText: "",
            progress: undefined,
            error: undefined,
        }),
}));
