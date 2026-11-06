import { act, renderHook, waitFor } from "@testing-library/react-native";
import * as Updates from "expo-updates";
import { AppState } from "react-native";

import { useAppUpdate } from "../useAppUpdate.native";

jest.mock("expo-updates", () => ({
    isEnabled: true,
    checkForUpdateAsync: jest.fn(),
    fetchUpdateAsync: jest.fn(),
    reloadAsync: jest.fn(),
}));

describe("useAppUpdate (native)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(AppState, "addEventListener").mockImplementation(
            () => ({ remove: jest.fn() }) as any,
        );
        (Updates.fetchUpdateAsync as jest.Mock).mockResolvedValue({});
        (Updates.reloadAsync as jest.Mock).mockResolvedValue(undefined);
    });

    it("fetches an available update and shows the reload prompt", async () => {
        (Updates.checkForUpdateAsync as jest.Mock).mockResolvedValue({ isAvailable: true });

        const { result } = renderHook(() => useAppUpdate());

        await waitFor(() => {
            expect(result.current.showReload).toBe(true);
        });
        expect(Updates.fetchUpdateAsync).toHaveBeenCalledTimes(1);
    });

    it("stays hidden when no update is available", async () => {
        (Updates.checkForUpdateAsync as jest.Mock).mockResolvedValue({ isAvailable: false });

        const { result } = renderHook(() => useAppUpdate());

        await waitFor(() => {
            expect(Updates.checkForUpdateAsync).toHaveBeenCalledTimes(1);
        });
        expect(result.current.showReload).toBe(false);
        expect(Updates.fetchUpdateAsync).not.toHaveBeenCalled();
    });

    it("reloads the app when the user accepts the update", async () => {
        (Updates.checkForUpdateAsync as jest.Mock).mockResolvedValue({ isAvailable: true });

        const { result } = renderHook(() => useAppUpdate());
        await waitFor(() => {
            expect(result.current.showReload).toBe(true);
        });

        act(() => {
            result.current.reloadPageCallback();
        });

        expect(result.current.showReload).toBe(false);
        expect(Updates.reloadAsync).toHaveBeenCalledTimes(1);
    });
});
