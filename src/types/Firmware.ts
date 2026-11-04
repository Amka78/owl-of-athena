//#region Types
/** 同時に配布するファームウェアの種類。 */
export type FirmwareComponent = "app" | "bootloader" | "ble";

/** Supabase の firmware_releases テーブル 1 行分。 */
export type FirmwareRelease = {
    version: number;
    hexPath: string;
    notes?: string;
    bootloaderVersion?: number;
    bootloaderHexPath?: string;
    bootloaderHasBootstrap?: boolean;
    bootloaderNotes?: string;
    bleVersion?: number;
    bleHexPath?: string;
    bleNotes?: string;
    minAppVersion?: number;
};

/** 更新中のフェーズ。 */
export type FirmwareUpdatePhase = "uploading" | "flashing" | "verifying";

/** 端末に適用できる新しいファームウェア。 */
export type FirmwareUpdate = FirmwareRelease & {
    url: string;
    component: FirmwareComponent;
    hasBootstrap?: boolean;
};
//#endregion
