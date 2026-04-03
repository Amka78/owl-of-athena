import { setWakeLock } from "../AppActions";

describe("AppActions", () => {
    it("setWakeLock creates correct action with true", () => {
        const result = setWakeLock(true);
        expect(result.type).toBe("WAKE_LOCK");
        expect(result.payload.data).toBe(true);
    });

    it("setWakeLock creates correct action with false", () => {
        const result = setWakeLock(false);
        expect(result.type).toBe("WAKE_LOCK");
        expect(result.payload.data).toBe(false);
    });
});
