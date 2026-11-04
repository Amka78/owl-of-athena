import { act, renderHook, waitFor } from "@testing-library/react-native";
import * as Network from "expo-network";

import { toNetworkStatus, useNetworkStatus } from "../useNetworkStatus";

jest.mock("expo-network", () => ({
    getNetworkStateAsync: jest.fn(),
    addNetworkStateListener: jest.fn(() => ({ remove: jest.fn() })),
}));

describe("toNetworkStatus", () => {
    it("maps a connected and reachable network to online", () => {
        expect(toNetworkStatus({ isConnected: true, isInternetReachable: true })).toBe("online");
    });

    it("treats an unreachable network as offline", () => {
        expect(toNetworkStatus({ isConnected: true, isInternetReachable: false })).toBe("offline");
    });

    it("treats a disconnected network as offline", () => {
        expect(toNetworkStatus({ isConnected: false, isInternetReachable: false })).toBe("offline");
    });

    it("returns unknown while the state is not determined", () => {
        expect(toNetworkStatus({})).toBe("unknown");
    });
});

describe("useNetworkStatus", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (Network.addNetworkStateListener as jest.Mock).mockReturnValue({ remove: jest.fn() });
    });

    it("starts unknown and resolves the initial state", async () => {
        (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue({
            isConnected: true,
            isInternetReachable: true,
        });

        const { result } = renderHook(() => useNetworkStatus());

        expect(result.current).toBe("unknown");
        await waitFor(() => expect(result.current).toBe("online"));
    });

    it("follows listener updates", async () => {
        (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue({
            isConnected: true,
            isInternetReachable: true,
        });

        const { result } = renderHook(() => useNetworkStatus());
        await waitFor(() => expect(result.current).toBe("online"));

        const listener = (Network.addNetworkStateListener as jest.Mock).mock.calls[0][0];
        act(() => listener({ isConnected: false, isInternetReachable: false }));

        expect(result.current).toBe("offline");
    });

    it("removes the listener on unmount", async () => {
        const remove = jest.fn();
        (Network.getNetworkStateAsync as jest.Mock).mockResolvedValue({
            isConnected: true,
            isInternetReachable: true,
        });
        (Network.addNetworkStateListener as jest.Mock).mockReturnValue({ remove });

        const { unmount } = renderHook(() => useNetworkStatus());
        unmount();

        expect(remove).toHaveBeenCalledTimes(1);
    });
});
