//#region Import Modules
import { AuroraInfoDialog, ConfirmDialog } from "../components/molecules";
import { Message, MessageKeys } from "../constants";
import { AuroraManagerInstance } from "../managers";
import { confirmDeviceMaintenance, runDeviceMaintenanceCommand } from "./DeviceMaintenanceService";
//#endregion

//#region Constants
/** src-electrobun/main.ts の Aurora メニューから渡されるアクション名。 */
export const AURORA_MENU_ACTIONS = {
    firmwareInfo: "owl-aurora:firmware-info",
    resetDevice: "owl-aurora:reset-device",
    formatSd: "owl-aurora:format-sd",
} as const;
//#endregion

//#region Functions
/** デスクトップ（ElectroBun）のネイティブメニューからのアクションを受け取る窓口を登録する。Web 以外では何もしない。 */
export const installDesktopMenuBridge = (): void => {
    if (typeof window === "undefined") return;
    const holder = window as unknown as { __owlAuroraMenu?: (action: string) => void };
    if (holder.__owlAuroraMenu) return;
    holder.__owlAuroraMenu = (action: string): void => {
        handleDesktopMenuAction(action);
    };
};

export const handleDesktopMenuAction = (action: string): void => {
    switch (action) {
        case AURORA_MENU_ACTIONS.firmwareInfo:
            showFirmwareInfo();
            break;
        case AURORA_MENU_ACTIONS.resetDevice:
            requestMaintenance(
                "os-reset",
                MessageKeys.device_reset_confirm_title,
                MessageKeys.device_reset_confirm_message,
                MessageKeys.device_reset_in_progress,
                MessageKeys.device_reset_success,
            );
            break;
        case AURORA_MENU_ACTIONS.formatSd:
            requestMaintenance(
                "sd-format",
                MessageKeys.device_sd_format_confirm_title,
                MessageKeys.device_sd_format_confirm_message,
                MessageKeys.device_sd_format_in_progress,
                MessageKeys.device_sd_format_success,
            );
            break;
    }
};

const showFirmwareInfo = (): void => {
    const osInfo = AuroraManagerInstance.getOSInfo();
    if (osInfo) {
        AuroraInfoDialog.show({ osInfo });
    } else {
        showNotConnected();
    }
};

const requestMaintenance = (
    command: string,
    confirmTitleKey: string,
    confirmMessageKey: string,
    inProgressKey: string,
    successKey: string,
): void => {
    if (!AuroraManagerInstance.isConnected()) {
        showNotConnected();
        return;
    }
    confirmDeviceMaintenance(confirmTitleKey, confirmMessageKey, () => {
        void runDeviceMaintenanceCommand(
            () => AuroraManagerInstance.executeCommand(command),
            inProgressKey,
            successKey,
        );
    });
};

const showNotConnected = (): void => {
    ConfirmDialog.show({
        title: Message.get(MessageKeys.device_not_connected),
        message: Message.get(MessageKeys.aurora_disconnected),
        isCancelable: true,
    });
};
//#endregion
