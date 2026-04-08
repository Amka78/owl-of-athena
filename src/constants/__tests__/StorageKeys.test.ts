import StorageKeys from "../StorageKeys";

describe("StorageKeys", () => {
    it("exports lastUsedEmail key", () => {
        expect(StorageKeys.lastUsedEmail).toBeDefined();
        expect(StorageKeys.lastUsedEmail).toBe("lastUsedEmail");
    });
});
