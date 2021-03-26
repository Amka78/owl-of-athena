//#region Import Modules
import React, { FunctionComponent } from "react";

import { ProfileDesktopScreenTemplate } from "../../components/templates/ProfileDesktopScreenTemplate";
import { useWindowDimensions } from "../../hooks";
import { useProfileList } from "../../hooks/profiles/useProfileList";
//#endregion

//#region Component
export const ProfileDesktopScreen: FunctionComponent = () => {
    const profileListHook = useProfileList();
    const dimens = useWindowDimensions();

    return (
        <ProfileDesktopScreenTemplate
            onFilterPress={profileListHook.onFilterPress}
            onRefreshPress={profileListHook.onRefreshPress}
            showFilter={profileListHook.showFilter}
            filterMenuProps={{
                showOfficialCheckBoxStatus: profileListHook.filterCondition
                    .showOfficial
                    ? "checked"
                    : "unchecked",
                onShowOfficialCheckBoxPress:
                    profileListHook.onShowOfficialPress,
                showCommunityCheckBoxStatus: profileListHook.filterCondition
                    .showCommunity
                    ? "checked"
                    : "unchecked",
                onShowCommunityCheckBoxPress:
                    profileListHook.onShowCommunityPress,
                showPrivateCheckBoxStatus: profileListHook.filterCondition
                    .showPrivate
                    ? "checked"
                    : "unchecked",
                onShowPrivateCheckBoxPress: profileListHook.onShowPrivatePress,
            }}
            list={profileListHook.list}
            dimens={dimens}
            onStarPress={profileListHook.onStarPress}
            onDeletePress={profileListHook.onDeletePress}
            onMenuPress={profileListHook.onMenuPress}
        ></ProfileDesktopScreenTemplate>
    );
};
//#endregion
