import { Platform } from "react-native";
import { getVolume, setVolume } from "react-native-volume-manager";

let originalVolume: number | undefined;

/**
 * iOS は端末音量が 0 だとアプリ内音量を上げても聞こえないため、
 * 鳴動中だけ MPVolumeView 経由でシステム音量を最大にする。
 */
export const boostSystemVolume = async (): Promise<void> => {
    if (Platform.OS !== "ios" || originalVolume !== undefined) return;

    try {
        const result = await getVolume();
        originalVolume = result.volume;
        await setVolume(1, { showUI: false });
    } catch (error) {
        originalVolume = undefined;
        console.debug("Failed to boost the system volume:", error);
    }
};

export const restoreSystemVolume = async (): Promise<void> => {
    if (originalVolume === undefined) return;

    const volume = originalVolume;
    originalVolume = undefined;
    try {
        await setVolume(volume, { showUI: false });
    } catch (error) {
        console.debug("Failed to restore the system volume:", error);
    }
};
