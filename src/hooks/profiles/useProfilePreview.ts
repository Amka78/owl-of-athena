//#region Import Modules
import { useCallback } from "react";

import { ConfirmDialog } from "../../components/molecules/ConfirmDialog";
import { Message, MessageKeys } from "../../constants";
import { buildProfileExportContent, shareText } from "../../services/ExportService";
import { useSelectedProfileSelector } from "./useSelectedProfileSelector";
//#endregion

//#region Hooks
export const useProfilePreview = (): {
    content: string;
    onExportPress: () => Promise<void>;
} => {
    const selectedProfile = useSelectedProfileSelector();
    const content = buildProfileExportContent(selectedProfile);

    const onExportPress = useCallback(async (): Promise<void> => {
        if (!content) return;

        try {
            await shareText(Message.get(MessageKeys.profile_export_title), content);
        } catch (error) {
            console.debug("profile export failed:", error);
            ConfirmDialog.show({
                title: Message.get(MessageKeys.profile_export_title),
                message: Message.get(MessageKeys.export_failed),
            });
        }
    }, [content]);

    return {
        content,
        onExportPress,
    };
};
//#endregion
