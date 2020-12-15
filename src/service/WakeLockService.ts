import { ExperimentalNavigator, WakeLockSentinel } from "../types";
export const requestWakeLock = async (
    succeedWakeLockCallback: (wakeLock: WakeLockSentinel) => void,
    releaseWakeLockCallback: () => void
): Promise<void> => {
    const wakeLockSentinel = await (navigator as ExperimentalNavigator).wakeLock.request(
        "screen"
    );

    wakeLockSentinel.addEventListener("release", () => {
        releaseWakeLockCallback();
        console.debug("Screen Wake Lock was released");
    });

    succeedWakeLockCallback(wakeLockSentinel);
    console.debug("Screen Wake Lock is active");
};
