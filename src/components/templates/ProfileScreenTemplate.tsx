//#region Import Modules
import React, { FunctionComponent } from "react";

import { useWindowDimensions } from "../../hooks";
import { AuroraProfile } from "../../sdk/AuroraTypes";
import { StandardView } from "../atoms";
import { ProfileMenu } from "../organisms/profiles/ProfileMenu";
import { UnsavedProfileMenu } from "../organisms/profiles/UnsavedProfileMenu";
//#endregion

export type ProfileScreenTemplateProps = {
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
};

export const ProfileScreenTemplate: FunctionComponent<ProfileScreenTemplateProps> = (
    props: ProfileScreenTemplateProps
) => {
    const dimens = useWindowDimensions();
    let profileMenu: React.ReactNode | undefined = undefined;
    if (props.selectedProfileHasUnSavedChanges) {
        profileMenu = (
            <UnsavedProfileMenu
                {...props.unsavePrfileMenu}
                isLargeWidth={dimens.isLargeWidth}
                isUserProfile={props.isUserProfile}
            ></UnsavedProfileMenu>
        );
    } else {
        profileMenu = (
            <ProfileMenu
                {...props.profileMenu}
                selectedProfile={props.selectedProfile}
            ></ProfileMenu>
        );
    }
    return <StandardView>{profileMenu}</StandardView>;
};
