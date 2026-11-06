import { AuroraManagerInstance } from "../../managers";
import type { FileInfo } from "../../sdk/AuroraTypes";
import { useSessionTransferStore } from "../sessionTransferStore";

jest.mock("../../managers", () => ({
    AuroraManagerInstance: {
        getUnsyncedSessions: jest.fn(),
        pushSessions: jest.fn(),
    },
}));

const sessions: FileInfo[] = [
    { file: "sessions/a/session.txt", name: "a" },
    { file: "sessions/b/session.txt", name: "b" },
] as FileInfo[];

describe("sessionTransferStore UnitTest", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useSessionTransferStore.getState().resetTransfer();
        useSessionTransferStore.getState().clearUnsyncedCount();
    });

    it("tracks the unsynced count from scans and transfers", async () => {
        (AuroraManagerInstance.getUnsyncedSessions as jest.Mock).mockResolvedValue(sessions);
        (AuroraManagerInstance.pushSessions as jest.Mock).mockResolvedValue({
            sessions: [],
            sessionDetails: [],
            syncedCount: 1,
            failedCount: 0,
            removedEmptyCount: 0,
        });

        await useSessionTransferStore.getState().scanSessions();
        expect(useSessionTransferStore.getState().unsyncedCount).toBe(2);

        await useSessionTransferStore.getState().transferSessions([sessions[0]]);
        expect(useSessionTransferStore.getState().unsyncedCount).toBe(1);
    });

    it("exposes progress while pushing sessions", async () => {
        let finish: (() => void) | undefined;
        (AuroraManagerInstance.pushSessions as jest.Mock).mockImplementation(
            (_sessions, _guestLogin, onProgress) => {
                onProgress({ phase: "reading", completed: 1, total: 2 });
                return new Promise((resolve) => {
                    finish = () => {
                        onProgress({ phase: "uploading", completed: 2, total: 2 });
                        resolve({
                            sessions: [],
                            sessionDetails: [],
                            syncedCount: 2,
                            failedCount: 0,
                            removedEmptyCount: 0,
                        });
                    };
                });
            },
        );

        const promise = useSessionTransferStore.getState().transferSessions(sessions);

        expect(useSessionTransferStore.getState().status).toBe("transferring");
        expect(useSessionTransferStore.getState().progress).toEqual({
            phase: "reading",
            completed: 1,
            total: 2,
        });

        finish?.();
        await promise;

        expect(useSessionTransferStore.getState().status).toBe("complete");
        expect(useSessionTransferStore.getState().transferredCount).toBe(2);
        expect(useSessionTransferStore.getState().progress).toBeUndefined();
    });

    it("clears progress on failure", async () => {
        (AuroraManagerInstance.pushSessions as jest.Mock).mockImplementation(
            (_sessions, _guestLogin, onProgress) => {
                onProgress({ phase: "reading", completed: 1, total: 2 });
                return Promise.reject(new Error("disconnected"));
            },
        );

        await useSessionTransferStore.getState().transferSessions(sessions);

        expect(useSessionTransferStore.getState().status).toBe("error");
        expect(useSessionTransferStore.getState().error).toBe("disconnected");
        expect(useSessionTransferStore.getState().progress).toBeUndefined();
    });
});
