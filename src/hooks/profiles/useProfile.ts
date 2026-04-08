//#region Import Modules
import { useCallback, useState } from "react";
import { ProfileEditDialog } from "../../components/molecules";
import { useCheckLogging, useWindowDimensions } from "../../hooks";
import { groupingProfileOptionList } from "../../services/ProfileService";
import { useAuthStore } from "../../store/authStore";
import { useProfileStore } from "../../store/profileStore";
//#endregion

//#region Hooks
export const useProfile = () => {
    useCheckLogging();
    const { selected, updateProfile } = useProfileStore();
    const { user } = useAuthStore();
    const dimens = useWindowDimensions();

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const auroraConnected = false;

    const isUserProfile = !!(user && selected && user.id === (selected as any).created_by);
    const groupedOptionList =
        selected?.options && Array.isArray(selected.options)
            ? groupingProfileOptionList(selected.options)
            : [];

    const onSaveAsNewPress = useCallback(() => {
        // TODO: implement save as new
    }, []);

    const onOverwriteSavePress = useCallback(() => {
        if (selected) {
            updateProfile(selected);
            setHasUnsavedChanges(false);
        }
    }, [selected, updateProfile]);

    const onCancelPress = useCallback(() => {
        setHasUnsavedChanges(false);
    }, []);

    const onSaveToAuroraPress = useCallback(() => {
        // TODO: implement save to Aurora
    }, []);

    const onShowAdvancedOptionsPress = useCallback(() => {
        // TODO: implement show advanced options
    }, []);

    const onInfoPress = useCallback(() => {
        if (selected) {
            ProfileEditDialog.show({ profile: selected });
        }
    }, [selected]);

    return {
        auroraConnected,
        selectedProfile: selected,
        hasUnsavedChanges,
        isUserProfile,
        groupedOptionList,
        dimens,
        onSaveAsNewPress,
        onOverwriteSavePress,
        onCancelPress,
        onSaveToAuroraPress,
        onShowAdvancedOptionsPress,
        onInfoPress,
    };
};
//#endregion
