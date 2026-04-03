import { useAppStore } from "../store/appStore";

export const useWakeLockSelector = (): boolean =>
    useAppStore((state) => state.wakeLock);
