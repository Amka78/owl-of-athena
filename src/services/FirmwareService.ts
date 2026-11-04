//#region Import Modules
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
//#endregion
