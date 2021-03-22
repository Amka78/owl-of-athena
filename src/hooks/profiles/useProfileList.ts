//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { useCheckLogging, useUserSelector, useWindowDimensions } from "..";
import {
    cache,
    deleteById,
    select,
    update,
    updateFilter,
} from "../../actions/ProfilesActions";
import { ConfirmDialog, LoadingDialog } from "../../components/molecules";
import { Message, MessageKeys } from "../../constants";
import { AuroraProfile } from "../../sdk/AuroraTypes";
import { FilterCondition } from "../../state/ProfileState";
import { useFilterConditionSelector, useFilteredProfileListSelector } from "./";
//#endregion

//#region Hooks
export const useProfileList = (): {
    showFilter: boolean;
    filterCondition: FilterCondition;
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
    const dispatch = useDispatch();
    const filterCondition = useFilterConditionSelector();
    const list = useFilteredProfileListSelector();
    const user = useUserSelector();
    const { navigate } = useNavigation();
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const dimens = useWindowDimensions();
    useCheckLogging();

    const onPressedRefresh = useCallback(async () => {
        LoadingDialog.show({
            dialogTitle: Message.get(MessageKeys.reloading, [
                MessageKeys.profiles,
            ]),
        });
        //const sessions = await SessionRestClientInstance.getAll(user!.id);
        dispatch(cache(new Array<AuroraProfile>()));
        LoadingDialog.close();
    }, [dispatch]);

    const onPressedFilter = useCallback(async () => {
        setShowFilter(!showFilter);
    }, [showFilter]);

    const onShowOfficialPress = useCallback((): void => {
        dispatch(
            updateFilter({
                showOfficial: !filterCondition.showOfficial,
            })
        );
    }, [dispatch, filterCondition.showOfficial]);

    const onShowCommunityPress = useCallback((): void => {
        dispatch(
            updateFilter({
                showCommunity: !filterCondition.showCommunity,
            })
        );
    }, [dispatch, filterCondition.showCommunity]);

    const onShowPrivatePress = useCallback((): void => {
        dispatch(
            updateFilter({
                showPrivate: !filterCondition.showPrivate,
            })
        );
    }, [dispatch, filterCondition.showPrivate]);

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
            dispatch(update(value));
        },
        [dispatch]
    );

    const onDeleteConfirmPress = useCallback(
        (value: AuroraProfile) => {
            dispatch(deleteById(value.id));
        },
        [dispatch]
    );

    const onDeletePress = useCallback(
        (value: AuroraProfile): void => {
            ConfirmDialog.show({
                title: Message.get(MessageKeys.delete_dialog_title, [
                    MessageKeys.profile,
                ]),

                message: Message.get(MessageKeys.delete_dialog_message),

                isCancelable: true,
                onConfirm: () => {
                    onDeleteConfirmPress(value);
                },
            });
        },
        [onDeleteConfirmPress]
    );

    const onMenuPress = useCallback(
        (value: AuroraProfile, index: number): void => {
            dispatch(select(value));

            if (!(dimens.isHorizontal && dimens.isDesktop)) {
                navigate("Detail", {
                    profileIndex: index,
                });
            }
        },
        [dimens.isDesktop, dimens.isHorizontal, dispatch, navigate]
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
