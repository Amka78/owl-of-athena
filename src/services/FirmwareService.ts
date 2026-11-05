//#region Import Modules
import { Message, MessageKeys } from "../constants";
import type { FirmwareRelease, FirmwareUpdate } from "../types";
//#endregion

//#region Types
export type InstalledFirmwareVersions = {
    app: number;
    bootloader: number;
    ble: number;
};
//#endregion

//#region Function
/**
 * 端末のバージョンは 10402 のように major*10000 + minor*100 + build で表される。
 * 端末のバージョンが不明（0）のときは更新を促さない。
 */
export const shouldUpdateFirmware = (deviceVersion: number, latestVersion: number): boolean => {
    if (deviceVersion <= 0) return false;
    if (latestVersion <= 0) return false;
    return latestVersion > deviceVersion;
};

/**
 * 配布情報から次に適用する更新を 1 件選ぶ。
 * アプリ本体を優先し、アプリが最新のときだけブートローダー、BLE の順に検討する。
 */
export const selectFirmwareUpdate = (
    installed: InstalledFirmwareVersions,
    release: FirmwareRelease,
    getUrl: (hexPath: string) => string,
): FirmwareUpdate | undefined => {
    if (release.minAppVersion !== undefined && installed.app < release.minAppVersion) {
        return undefined;
    }

    if (shouldUpdateFirmware(installed.app, release.version)) {
        return {
            ...release,
            url: getUrl(release.hexPath),
            component: "app",
        };
    }

    if (
        release.bootloaderVersion !== undefined &&
        release.bootloaderHexPath &&
        shouldUpdateFirmware(installed.bootloader, release.bootloaderVersion)
    ) {
        return {
            ...release,
            version: release.bootloaderVersion,
            url: getUrl(release.bootloaderHexPath),
            component: "bootloader",
            hasBootstrap: release.bootloaderHasBootstrap,
            notes: release.bootloaderNotes ?? release.notes,
        };
    }

    if (
        release.bleVersion !== undefined &&
        release.bleHexPath &&
        shouldUpdateFirmware(installed.ble, release.bleVersion)
    ) {
        return {
            ...release,
            version: release.bleVersion,
            url: getUrl(release.bleHexPath),
            component: "ble",
            notes: release.bleNotes ?? release.notes,
        };
    }

    return undefined;
};

export const firmwareFlashType = (update: FirmwareUpdate): string => {
    if (update.component === "bootloader" && update.hasBootstrap) {
        return "bootloader-and-bootstrap";
    }
    return update.component;
};

/**
 * 更新確認ダイアログの本文を組み立てる。
 * 未転送セッションがある場合は、更新で失われることを本文に添える。
 */
export const buildFirmwareUpdateMessage = (options: {
    baseMessage: string;
    notes?: string;
    unsyncedCount?: number;
}): string => {
    const parts = [options.baseMessage];

    if (options.notes) {
        parts.push(options.notes);
    }
    if ((options.unsyncedCount ?? 0) > 0) {
        parts.push(
            Message.get(MessageKeys.firmware_update_unsynced_warning, [
                String(options.unsyncedCount),
            ]),
        );
    }

    return parts.join("\n\n");
};
//#endregion
