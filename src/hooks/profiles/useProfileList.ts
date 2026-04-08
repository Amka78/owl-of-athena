//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ConfirmDialog, LoadingDialog } from "../../components/molecules";
import { Message, MessageKeys } from "../../constants";
import type { AuroraProfile } from "../../sdk/AuroraTypes";
import { type ProfileFilterCondition, useProfileStore } from "../../store/profileStore";
import { useCheckLogging, useUserSelector, useWindowDimensions } from "..";
import { useFilterConditionSelector, useFilteredProfileListSelector } from "./";
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
        LoadingDialog.show({
            dialogTitle: Message.get(MessageKeys.reloading, [MessageKeys.profiles]),
        });
        //const sessions = await SessionRestClientInstance.getAll(user!.id);
        cacheProfiles([] as AuroraProfile[]);
        LoadingDialog.close();
    }, [cacheProfiles]);

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
            /*const updateInfo: Partial<AuroraProfile> = {
                starred: !value.starred,
            };*/

            /*if (user?.id !== GuestUser) {
                await SessionRestClientInstance.updateById(
                    value.id,
                    updateInfo
                );
            }*/

            value.starred = !value.starred;
            updateProfile(value);
        },
        [updateProfile],
    );

    const onDeleteConfirmPress = useCallback(
        (value: AuroraProfile) => {
            deleteProfile(value.id);
        },
        [deleteProfile],
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
//#endregion
