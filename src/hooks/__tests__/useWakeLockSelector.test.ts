import { renderHook } from "@testing-library/react-native";
import { useAppStore } from "../../store/appStore";
import { useWakeLockSelector } from "../useWakeLockSelector";

describe("useWakeLockSelector", () => {
    beforeEach(() => {
        useAppStore.setState({ wakeLock: true } as any);
    });

    afterEach(() => {
        useAppStore.setState({ wakeLock: false } as any);
    });

    it("returns wakeLock value from state", () => {
        const { result } = renderHook(() => useWakeLockSelector());
        expect(result.current).toBe(true);
    });
});
