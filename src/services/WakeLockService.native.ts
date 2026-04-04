import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

const WAKELOCK_TAG = "aurora-sleep-session";

let isActive = false;

export const request = async (
    succeedWakeLockCallback: () => void,
    releaseWakeLockCallback: () => void
): Promise<void> => {
    try {
        await activateKeepAwakeAsync(WAKELOCK_TAG);
        isActive = true;
        succeedWakeLockCallback();
        console.debug("Screen Wake Lock is active (native)");
    } catch (error) {
        console.error("Failed to activate keep awake:", error);
        releaseWakeLockCallback();
    }
};

export const release = (): void => {
    if (isActive) {
        deactivateKeepAwake(WAKELOCK_TAG);
        isActive = false;
        console.debug("Screen Wake Lock was released (native)");
    }
};
