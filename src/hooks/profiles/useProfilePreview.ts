//#region Import Modules
import { useSelectedProfileSelector } from "./useSelectedProfileSelector";
//#endregion

//#region Hooks
export const useProfilePreview = (): { content: string } => {
    const selectedProfile = useSelectedProfileSelector();

    const content = selectedProfile ? selectedProfile.content : "";

    return {
        content,
    };
};
//#endregion
