import { Platform } from "react-native";
import { ExperimentalNavigator, WakeLockSentinel } from "../types";

let wakeLockSentinel: WakeLockSentinel | undefined = undefined;
export const request = async (
    succeedWakeLockCallback: () => void,
    releaseWakeLockCallback: () => void
): Promise<void> => {
    const exNavigator = navigator as ExperimentalNavigator;

    if (exNavigator.wakeLock && Platform.OS === "web") {
        wakeLockSentinel = await (navigator as ExperimentalNavigator).wakeLock.request(
            "screen"
        );

        wakeLockSentinel.addEventListener("release", () => {
            releaseWakeLockCallback();
            console.debug("Screen Wake Lock was released");
        });
    }
    succeedWakeLockCallback();
    console.debug("Screen Wake Lock is active");
};

export const release = (): void => {
    if (wakeLockSentinel) {
        if (!wakeLockSentinel.released) {
            wakeLockSentinel.release();
            wakeLockSentinel = undefined;
        }
    }
};
