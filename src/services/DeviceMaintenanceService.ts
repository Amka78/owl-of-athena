//#region Import Modules
import { ConfirmDialog, LoadingDialog } from "../components/molecules";
import { Message, MessageKeys } from "../constants";
//#endregion

//#region Functions
/** 確認ダイアログを出し、OK が押されたら onConfirm を実行する。 */
export const confirmDeviceMaintenance = (
    confirmTitleKey: string,
    confirmMessageKey: string,
    onConfirm: () => void,
): void => {
    ConfirmDialog.show({
        title: Message.get(confirmTitleKey),
        message: Message.get(confirmMessageKey),
        isCancelable: true,
        onConfirm,
    });
};

/** Aurora にコマンドを送り、進捗・完了・失敗をダイアログで表示する。 */
export const runDeviceMaintenanceCommand = async (
    executeCommand: () => Promise<unknown>,
    inProgressKey: string,
    successKey: string,
): Promise<void> => {
    LoadingDialog.show({ dialogTitle: Message.get(inProgressKey) });
    try {
        await executeCommand();
        ConfirmDialog.show({
            title: Message.get(MessageKeys.device_operation_complete_title),
            message: Message.get(successKey),
            isCancelable: false,
        });
    } catch (e) {
        ConfirmDialog.show({
            title: Message.get(MessageKeys.device_operation_failed_title),
            message: Message.get(MessageKeys.device_operation_failed_message, [String(e)]),
            isCancelable: false,
        });
    } finally {
        LoadingDialog.close();
    }
};
//#endregion
