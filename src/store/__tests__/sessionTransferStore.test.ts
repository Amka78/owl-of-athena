import { useSessionTransferStore } from "../sessionTransferStore";

describe("sessionTransferStore UnitTest", () => {
    beforeEach(() => {
        useSessionTransferStore.getState().clearUnsyncedCount();
    });

    it("starts with no unsynced sessions", () => {
        expect(useSessionTransferStore.getState().unsyncedCount).toBe(0);
    });

    it("sets the unsynced session count", () => {
        useSessionTransferStore.getState().setUnsyncedCount(3);
        expect(useSessionTransferStore.getState().unsyncedCount).toBe(3);
    });

    it("clamps a negative count to zero", () => {
        useSessionTransferStore.getState().setUnsyncedCount(-1);
        expect(useSessionTransferStore.getState().unsyncedCount).toBe(0);
    });

    it("clears the unsynced session count", () => {
        useSessionTransferStore.getState().setUnsyncedCount(3);
        useSessionTransferStore.getState().clearUnsyncedCount();
        expect(useSessionTransferStore.getState().unsyncedCount).toBe(0);
    });
});
