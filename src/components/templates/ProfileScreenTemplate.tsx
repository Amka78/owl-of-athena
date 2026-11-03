//#region Import Modules
import type React from "react";
import type { FunctionComponent } from "react";
import { Dimens } from "../../constants";

import { useLocale, useScreenDimensions } from "../../hooks";
import type { Dimensions } from "../../hooks/useWindowDimensions";
import type { AuroraProfile, SongValue, StimLedValue } from "../../sdk/AuroraTypes";
import type { GroupedProfileOptionList, ProfileOptionValues } from "../../services/ProfileService";
import { StandardView } from "../atoms";
import { ProfileEditDialog } from "../molecules/ProfileEditDialog";
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
    optionValues?: ProfileOptionValues;
    optionValuesKey?: number;
    showAdvancedOptions?: boolean;
    onOptionValueChange?: (optionName: string, value: unknown) => void;
    onPreviewEffectPress?: (value: StimLedValue) => void;
    onPreviewSongPress?: (value: SongValue) => void;
    dimens: Dimensions;
    locale?: string;
};

export const ProfileScreenTemplate: FunctionComponent<ProfileScreenTemplateProps> = (
    props: ProfileScreenTemplateProps,
) => {
    useLocale(props.locale);
    const screenDimens = useScreenDimensions();
    let profileMenu: React.ReactNode | undefined;
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
                selectedProfileHasUnsavedChanges={props.selectedProfileHasUnSavedChanges}
                showAdvancedOptions={props.showAdvancedOptions ?? false}
                dimens={props.dimens}
                style={{
                    width: screenDimens.width,
                    marginTop: Dimens.menu_list_margin,
                }}
            ></ProfileSecondMenu>
            <ProfileOptionList
                key={`${props.selectedProfile.id}-${props.optionValuesKey ?? 0}`}
                groupedOptionList={props.grouedOptionList}
                optionValues={props.optionValues ?? {}}
                onValueChange={props.onOptionValueChange}
                onPreviewEffectPress={props.onPreviewEffectPress}
                onPreviewSongPress={props.onPreviewSongPress}
                style={{ width: screenDimens.width }}
            ></ProfileOptionList>
            <ProfileEditDialog />
        </StandardView>
    );
};
