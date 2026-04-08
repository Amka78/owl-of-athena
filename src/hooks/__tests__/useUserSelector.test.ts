import { renderHook } from "@testing-library/react-native";
import { useAuthStore } from "../../store/authStore";
import { useUserSelector } from "../useUserSelector";

const mockUser = { id: "user-1", birthday: "2000-01-01" };

describe("useUserSelector", () => {
    beforeEach(() => {
        useAuthStore.setState({ user: mockUser } as any);
    });

    afterEach(() => {
        useAuthStore.setState({ user: undefined } as any);
    });

    it("returns user from state", () => {
        const { result } = renderHook(() => useUserSelector());
        expect(result.current).toEqual(mockUser);
    });
});
