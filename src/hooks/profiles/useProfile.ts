//#region Import Modules
import { useCallback, useEffect, useMemo, useState } from "react";

import { AuroraRestClientInstance } from "../../clients";
import { ConfirmDialog } from "../../components/molecules/ConfirmDialog";
import { LoadingDialog } from "../../components/molecules/LoadingDialog";
import { ProfileEditDialog } from "../../components/molecules/ProfileEditDialog";
import { Message, MessageKeys } from "../../constants";
import AuroraManagerInstance from "../../managers/AuroraManager";
import { AuroraManagerEventList } from "../../managers/AuroraManagerEventList";
import { AuroraInstance } from "../../sdk";
import type { AuroraProfile, SongValue, StimLedValue } from "../../sdk/AuroraTypes";
import {
    createProfileName,
    createProfileTitle,
    groupingProfileOptionList,
    hasProfileUnsavedChanges,
    isProfileOptionVisibleForRoles,
    parseProfileOptions,
    processProfile,
} from "../../services/ProfileService";
import { useAuthStore } from "../../store/authStore";
import { useProfileStore } from "../../store/profileStore";
import { GuestUser } from "../../types/Auth";
import { useCheckLogging } from "../useCheckLogging";
import { useWindowDimensions } from "../useWindowDimensions";
//#endregion

//#region Hooks
export const useProfile = () => {
    useCheckLogging();
    const {
        selected,
        list,
        optionValues,
        optionValuesProfileId,
        showAdvancedOptions,
        addProfile,
        updateProfile,
        setOptionValue,
        syncSelectedProfileOptions,
        toggleAdvancedOptions,
    } = useProfileStore();
    const { user } = useAuthStore();
    const dimens = useWindowDimensions();
    const [auroraConnected, setAuroraConnected] = useState(AuroraManagerInstance.isConnected());
    const [optionValuesKey, setOptionValuesKey] = useState(0);

    useEffect(() => {
        const updateConnection = (): void => {
            setAuroraConnected(AuroraManagerInstance.isConnected());
        };

        AuroraManagerInstance.on(AuroraManagerEventList.onConnectionChange, updateConnection);
        updateConnection();

        return (): void => {
            AuroraManagerInstance.off(AuroraManagerEventList.onConnectionChange, updateConnection);
        };
    }, []);

    useEffect(() => {
        if (selected && optionValuesProfileId !== selected.id) {
            syncSelectedProfileOptions();
        }
    }, [selected, optionValuesProfileId, syncSelectedProfileOptions]);

    const roleSlugs = useMemo(() => (user?.roles ?? []).map((role) => role.slug), [user?.roles]);

    const groupedOptionList = useMemo(() => {
        if (!selected) return [];

        const options = parseProfileOptions(selected.options).filter((option) => {
            if (option.advanced && !showAdvancedOptions) return false;
            return isProfileOptionVisibleForRoles(option, roleSlugs);
        });

        return groupingProfileOptionList(options);
    }, [selected, showAdvancedOptions, roleSlugs]);

    const hasUnsavedChanges = useMemo(
        () => hasProfileUnsavedChanges(selected, optionValues),
        [selected, optionValues],
    );

    const isUserProfile = !!(
        user &&
        selected &&
        selected.type === "private" &&
        selected.created_by === user.id
    );

    const showInfo = useCallback((message: string): void => {
        ConfirmDialog.show({
            title: Message.get(MessageKeys.profile_edit_title),
            message,
        });
    }, []);

    const onSaveAsNewPress = useCallback(async (): Promise<void> => {
        if (!selected) return;

        const now = Date.now();
        const draft: AuroraProfile = {
            ...selected,
            id: "",
            type: "private",
            title: createProfileTitle(
                selected.title,
                list.map((profile) => profile.title),
            ),
            name: createProfileName(list.map((profile) => profile.name)),
            parent_profile_id: selected.parent_profile_id ?? selected.id,
            created_by: user?.id,
            created_at: now,
            updated_at: now,
        };

        LoadingDialog.show({ dialogTitle: Message.get(MessageKeys.save) });
        let failed = false;

        try {
            const processed = processProfile(draft, optionValues);
            const created =
                user && user.id !== GuestUser
                    ? await AuroraRestClientInstance.createAuroraProfile(processed, user.id)
                    : {
                          ...processed,
                          id: `local-${now}-${Math.random().toString(36).slice(2, 8)}`,
                      };

            addProfile(created);
        } catch (error) {
            console.debug("create profile failed:", error);
            failed = true;
        } finally {
            LoadingDialog.close();
        }

        if (failed) showInfo(Message.get(MessageKeys.profile_save_failed));
    }, [selected, list, user, optionValues, addProfile, showInfo]);

    const onOverwriteSavePress = useCallback(async (): Promise<void> => {
        if (!selected) return;

        const processed = processProfile(
            {
                ...selected,
                updated_at: Date.now(),
            },
            optionValues,
        );

        LoadingDialog.show({ dialogTitle: Message.get(MessageKeys.save) });
        let failed = false;

        try {
            const saved =
                user &&
                user.id !== GuestUser &&
                selected.type === "private" &&
                selected.created_by === user.id
                    ? await AuroraRestClientInstance.updateAuroraProfile(processed)
                    : processed;

            updateProfile(saved);
            syncSelectedProfileOptions();
        } catch (error) {
            console.debug("update profile failed:", error);
            failed = true;
        } finally {
            LoadingDialog.close();
        }

        if (failed) showInfo(Message.get(MessageKeys.profile_save_failed));
    }, [selected, user, optionValues, updateProfile, syncSelectedProfileOptions, showInfo]);

    const onCancelPress = useCallback((): void => {
        syncSelectedProfileOptions();
        // 時刻ピッカーなど内部状態を持つフィールドを初期値に戻す。
        setOptionValuesKey((value) => value + 1);
    }, [syncSelectedProfileOptions]);

    const onSaveToAuroraPress = useCallback(async (): Promise<void> => {
        if (!selected) return;

        if (!AuroraManagerInstance.isConnected()) {
            showInfo(Message.get(MessageKeys.profile_not_connected));
            return;
        }

        LoadingDialog.show({ dialogTitle: Message.get(MessageKeys.profile_save_to_aurora) });
        let message = "";

        try {
            await saveProfileToAurora(processProfile(selected, optionValues));
            message = Message.get(MessageKeys.profile_saved_to_aurora);
        } catch (error) {
            console.debug("save profile to Aurora failed:", error);
            message = Message.get(MessageKeys.profile_save_to_aurora_failed);
        } finally {
            LoadingDialog.close();
        }

        if (message) showInfo(message);
    }, [selected, optionValues, showInfo]);

    const onShowAdvancedOptionsPress = useCallback((): void => {
        toggleAdvancedOptions();
    }, [toggleAdvancedOptions]);

    const onOptionValueChange = useCallback(
        (optionName: string, value: unknown): void => {
            setOptionValue(optionName, value);
        },
        [setOptionValue],
    );

    const onPreviewEffectPress = useCallback((value: StimLedValue): void => {
        AuroraManagerInstance.playLedEffect(value).catch((error) => {
            console.debug("preview LED effect failed:", error);
        });
    }, []);

    const onPreviewSongPress = useCallback((value: SongValue): void => {
        AuroraManagerInstance.playBuzzSong(value).catch((error) => {
            console.debug("preview buzz song failed:", error);
        });
    }, []);

    const onInfoPress = useCallback((): void => {
        if (selected) {
            ProfileEditDialog.show({ profile: selected });
        }
    }, [selected]);

    return {
        auroraConnected,
        selectedProfile: selected,
        hasUnsavedChanges,
        isUserProfile,
        optionValues,
        optionValuesKey,
        showAdvancedOptions,
        groupedOptionList,
        dimens,
        onSaveAsNewPress,
        onOverwriteSavePress,
        onCancelPress,
        onSaveToAuroraPress,
        onShowAdvancedOptionsPress,
        onOptionValueChange,
        onPreviewEffectPress,
        onPreviewSongPress,
        onInfoPress,
    };
};

/** プロフィール本体と _profiles.list の該当行だけを更新する。 */
const saveProfileToAurora = async (profile: AuroraProfile): Promise<void> => {
    await AuroraInstance.writeFile(`profiles/${profile.name}`, profile.content);

    let listContent = "";
    try {
        const result = await AuroraInstance.readFile("profiles/_profiles.list", false, false);
        listContent = result.output ?? "";
    } catch {
        listContent = "";
    }

    const lines = listContent
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .filter((line) => {
            const parts = line.replace(/^:/, "").split(":");
            return parts[0] !== profile.name;
        });

    lines.push(`${profile.name}:${profile.id}`);

    await AuroraInstance.writeFile("profiles/_profiles.list", lines.join("\r\n"));
};
//#endregion
