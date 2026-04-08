//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import type { NativeStackHeaderItemProps } from "@react-navigation/native-stack";
import React, { type FunctionComponent, useLayoutEffect } from "react";
import { useWindowDimensions } from "../../hooks";
import { useProfileList } from "../../hooks/profiles/useProfileList";
import { FilterIcon, RefreshIcon } from "../atoms";
import { ProfileListScreenTemplate } from "../templates/ProfileListScreenTemplate";
//#endregion

//#region Component
export const ProfileListScreen: FunctionComponent = () => {
    const profileListHook = useProfileList();
    const dimens = useWindowDimensions();
    const { setOptions } = useNavigation<any>();

    useLayoutEffect(() => {
        setOptions({
            headerLeft: () => {
                return <RefreshIcon onPress={profileListHook.onRefreshPress}></RefreshIcon>;
            },
            headerRight: (props: NativeStackHeaderItemProps) => {
                return <FilterIcon {...props} onPress={profileListHook.onFilterPress}></FilterIcon>;
            },
        });
    }, [profileListHook.onFilterPress, profileListHook.onRefreshPress, setOptions]);
    return (
        <ProfileListScreenTemplate
            showFilter={profileListHook.showFilter}
            filterMenuProps={{
                showOfficialCheckBoxStatus: profileListHook.filterCondition.showOfficial
                    ? "checked"
                    : "unchecked",

                onShowOfficialCheckBoxPress: profileListHook.onShowOfficialPress,
                showCommunityCheckBoxStatus: profileListHook.filterCondition.showCommunity
                    ? "checked"
                    : "unchecked",
                onShowCommunityCheckBoxPress: profileListHook.onShowCommunityPress,
                showPrivateCheckBoxStatus: profileListHook.filterCondition.showPrivate
                    ? "checked"
                    : "unchecked",
                onShowPrivateCheckBoxPress: profileListHook.onShowPrivatePress,
            }}
            list={profileListHook.list}
            userId={profileListHook.userId}
            dimens={dimens}
            onStarPress={profileListHook.onStarPress}
            onDeletePress={profileListHook.onDeletePress}
            onMenuPress={profileListHook.onMenuPress}
        ></ProfileListScreenTemplate>
    );
};
//#endregion
