import type { NetworkState } from "expo-network";
import * as Network from "expo-network";
import { useEffect, useState } from "react";

export type NetworkStatus = "unknown" | "online" | "offline";

export const toNetworkStatus = (state: NetworkState): NetworkStatus => {
    if (state.isConnected === undefined) return "unknown";
    if (!state.isConnected) return "offline";
    return state.isInternetReachable === false ? "offline" : "online";
};

/**
 * 端末の接続状態を購読する。不明な間は "unknown" を返すので、
 * バナーは初回取得が終わるまで表示しない。
 */
export const useNetworkStatus = (): NetworkStatus => {
    const [status, setStatus] = useState<NetworkStatus>("unknown");

    useEffect(() => {
        let mounted = true;

        const update = (state: NetworkState): void => {
            if (mounted) setStatus(toNetworkStatus(state));
        };

        Network.getNetworkStateAsync()
            .then(update)
            .catch((error) => {
                console.debug("network state unavailable:", error);
            });

        let subscription: { remove: () => void } | undefined;
        try {
            subscription = Network.addNetworkStateListener(update);
        } catch (error) {
            console.debug("failed to subscribe to network state:", error);
        }

        return (): void => {
            mounted = false;
            subscription?.remove();
        };
    }, []);

    return status;
};
