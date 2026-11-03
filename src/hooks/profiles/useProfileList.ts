//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";

import { AuroraRestClientInstance } from "../../clients";
import { ConfirmDialog } from "../../components/molecules/ConfirmDialog";
import { LoadingDialog } from "../../components/molecules/LoadingDialog";
import { Message, MessageKeys } from "../../constants";
import type { AuroraProfile } from "../../sdk/AuroraTypes";
import { type ProfileFilterCondition, useProfileStore } from "../../store/profileStore";
import { GuestUser } from "../../types/Auth";
import { useCheckLogging } from "../useCheckLogging";
import { useUserSelector } from "../useUserSelector";
import { useWindowDimensions } from "../useWindowDimensions";
import { useFilterConditionSelector } from "./useFilteredConditionSelector";
import { useFilteredProfileListSelector } from "./useFilteredProfileListSelector";
//#endregion

//#region Hooks
export const useProfileList = (): {
    showFilter: boolean;
    filterCondition: ProfileFilterCondition;
    onShowOfficialPress: () => void;
    onShowCommunityPress: () => void;
    onShowPrivatePress: () => void;
    userId: string;
    list: AuroraProfile[];
    onStarPress: (value: AuroraProfile) => Promise<void>;
    onDeletePress: (value: AuroraProfile) => void;
    onMenuPress: (value: AuroraProfile, index: number) => void;
    onRefreshPress: () => void;
    onFilterPress: () => void;
} => {
    const { cacheProfiles, deleteProfile, selectProfile, updateProfile, updateFilter } =
        useProfileStore();
    const filterCondition = useFilterConditionSelector();
    const list = useFilteredProfileListSelector();
    const user = useUserSelector();
    const { navigate } = useNavigation<any>();
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const dimens = useWindowDimensions();
    useCheckLogging();

    const onPressedRefresh = useCallback(async () => {
        if (!user || user.id === GuestUser) return;

        LoadingDialog.show({
            dialogTitle: Message.get(MessageKeys.reloading, [MessageKeys.profiles]),
        });

        try {
            const remote = await AuroraRestClientInstance.getAuroraProfiles();
            if (remote.length > 0) cacheProfiles(remote);
        } catch (error) {
            console.debug("reload profiles failed:", error);
        } finally {
            LoadingDialog.close();
        }
    }, [cacheProfiles, user]);

    const onPressedFilter = useCallback(async () => {
        setShowFilter(!showFilter);
    }, [showFilter]);

    const onShowOfficialPress = useCallback((): void => {
        updateFilter({
            showOfficial: !filterCondition.showOfficial,
        });
    }, [filterCondition.showOfficial, updateFilter]);

    const onShowCommunityPress = useCallback((): void => {
        updateFilter({
            showCommunity: !filterCondition.showCommunity,
        });
    }, [filterCondition.showCommunity, updateFilter]);

    const onShowPrivatePress = useCallback((): void => {
        updateFilter({
            showPrivate: !filterCondition.showPrivate,
        });
    }, [filterCondition.showPrivate, updateFilter]);

    const onStarPress = useCallback(
        async (value: AuroraProfile): Promise<void> => {
            const starred = !value.starred;

            try {
                if (isOwnServerProfile(value, user?.id)) {
                    await AuroraRestClientInstance.setAuroraProfileStarred(value.id, starred);
                }
                updateProfile({ ...value, starred });
            } catch (error) {
                console.debug("star profile failed:", error);
            }
        },
        [updateProfile, user],
    );

    const onDeleteConfirmPress = useCallback(
        async (value: AuroraProfile): Promise<void> => {
            try {
                if (isOwnServerProfile(value, user?.id)) {
                    await AuroraRestClientInstance.deleteAuroraProfile(value.id);
                }
                deleteProfile(value.id);
            } catch (error) {
                console.debug("delete profile failed:", error);
                ConfirmDialog.show({
                    title: Message.get(MessageKeys.delete_dialog_title, [MessageKeys.profile]),
                    message: Message.get(MessageKeys.profile_delete_failed),
                });
            }
        },
        [deleteProfile, user],
    );

    const onDeletePress = useCallback(
        (value: AuroraProfile): void => {
            ConfirmDialog.show({
                title: Message.get(MessageKeys.delete_dialog_title, [MessageKeys.profile]),

                message: Message.get(MessageKeys.delete_dialog_message),

                isCancelable: true,
                onConfirm: () => {
                    onDeleteConfirmPress(value);
                },
            });
        },
        [onDeleteConfirmPress],
    );

    const onMenuPress = useCallback(
        (value: AuroraProfile, index: number): void => {
            selectProfile(value);

            if (!(dimens.isHorizontal && dimens.isDesktop)) {
                navigate("Detail", {
                    profileIndex: index,
                });
            }
        },
        [dimens.isDesktop, dimens.isHorizontal, navigate, selectProfile],
    );

    const userId = user ? user.id : "";
    return {
        showFilter,
        filterCondition,
        onShowOfficialPress,
        onShowCommunityPress,
        onShowPrivatePress,
        userId,
        list,
        onStarPress,
        onDeletePress,
        onMenuPress,
        onRefreshPress: onPressedRefresh,
        onFilterPress: onPressedFilter,
    };
};

const isLocalProfile = (profile: AuroraProfile): boolean => profile.id.startsWith("local-");

/** サーバー上の自分のプロフィールだけが更新・削除の対象。 */
const isOwnServerProfile = (
    profile: AuroraProfile,
    userId: string | undefined,
): boolean => {
    return (
        !!userId &&
        userId !== GuestUser &&
        profile.type === "private" &&
        profile.created_by === userId &&
        !isLocalProfile(profile)
    );
};
//#endregion
