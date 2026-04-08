import { renderHook } from "@testing-library/react-native";
import { useAuthStore } from "../../store/authStore";
import { useTokenSelector } from "../useTokenSelector";

describe("useTokenSelector", () => {
    beforeEach(() => {
        useAuthStore.setState({ token: "my-token" } as any);
    });

    afterEach(() => {
        useAuthStore.setState({ token: undefined } as any);
    });

    it("returns token from state", () => {
        const { result } = renderHook(() => useTokenSelector());
        expect(result.current).toBe("my-token");
    });
});
