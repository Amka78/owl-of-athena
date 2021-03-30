//#region Import Modules
import React, { FunctionComponent } from "react";
import { Dimens } from "../../constants";

import { useLocale, useScreenDimensions } from "../../hooks";
import { Dimensions } from "../../hooks/useWindowDimensions";
import { AuroraProfile } from "../../sdk/AuroraTypes";
import { GroupedProfileOptionList } from "../../services/ProfileService";
import { StandardView } from "../atoms";
import { ProfileMenu } from "../organisms/profiles/ProfileMenu";
import { ProfileOptionList } from "../organisms/profiles/ProfileOptionList";
import { ProfileSecondMenu } from "../organisms/profiles/ProfileSecondMenu";
import { UnsavedProfileMenu } from "../organisms/profiles/UnsavedProfileMenu";
//#endregion

export type ProfileScreenTemplateProps = {
    auroraConnected: boolean;
    selectedProfileHasUnSavedChanges: boolean;
    selectedProfile: AuroraProfile;
    isUserProfile: boolean;
    unsavePrfileMenu: {
        onSaveAsNewPress: () => void;
        onOverwriteSavePress: () => void;
        onCancelPress: () => void;
    };
    profileMenu: {
        onInfoPress: () => void;
    };
    profileSecondMenu: {
        onSaveToAuroraPress: () => void;
        onShowAdvancedOptionsPress: () => void;
    };
    grouedOptionList: GroupedProfileOptionList;
    dimens: Dimensions;
    locale?: string;
};

export const ProfileScreenTemplate: FunctionComponent<ProfileScreenTemplateProps> = (
    props: ProfileScreenTemplateProps
) => {
    useLocale(props.locale);
    const screenDimens = useScreenDimensions();
    let profileMenu: React.ReactNode | undefined = undefined;
    if (props.selectedProfileHasUnSavedChanges) {
        profileMenu = (
            <UnsavedProfileMenu
                {...props.unsavePrfileMenu}
                style={{ width: screenDimens.width }}
                dimens={props.dimens}
                isUserProfile={props.isUserProfile}
            ></UnsavedProfileMenu>
        );
    } else {
        profileMenu = (
            <ProfileMenu
                {...props.profileMenu}
                style={{ width: screenDimens.width }}
                selectedProfile={props.selectedProfile}
            ></ProfileMenu>
        );
    }
    return (
        <StandardView onLayout={screenDimens.onLayout}>
            {profileMenu}
            <ProfileSecondMenu
                {...props.profileSecondMenu}
                auroraConnected={props.auroraConnected}
                selectedProfileHasUnsavedChanges={
                    props.selectedProfileHasUnSavedChanges
                }
                dimens={props.dimens}
                style={{
                    width: screenDimens.width,
                    marginTop: Dimens.menu_list_margin,
                }}
            ></ProfileSecondMenu>
            <ProfileOptionList
                groupedOptionList={props.grouedOptionList}
                style={{ width: screenDimens.width }}
            ></ProfileOptionList>
        </StandardView>
    );
};
