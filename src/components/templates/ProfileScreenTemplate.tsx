//#region Import Modules
import type React from "react";
import type { FunctionComponent } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Dimens } from "../../constants";

import { useLocale, useScreenDimensions } from "../../hooks";
import type { Dimensions } from "../../hooks/useWindowDimensions";
import type { AuroraProfile, SongValue, StimLedValue } from "../../sdk/AuroraTypes";
import type { GroupedProfileOptionList, ProfileOptionValues } from "../../services/ProfileService";
import { ProfileMenu } from "../features/profiles/ProfileMenu";
import { ProfileOptionList } from "../features/profiles/ProfileOptionList";
import { ProfileSecondMenu } from "../features/profiles/ProfileSecondMenu";
import { UnsavedProfileMenu } from "../features/profiles/UnsavedProfileMenu";
import { ProfileEditDialog } from "../molecules/ProfileEditDialog";
import { StandardView } from "../ui";
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
            <ScrollView
                style={[styles.optionScroll, { width: screenDimens.width }]}
                contentContainerStyle={styles.optionScrollContent}
            >
                <ProfileOptionList
                    key={`${props.selectedProfile.id}-${props.optionValuesKey ?? 0}`}
                    groupedOptionList={props.grouedOptionList}
                    optionValues={props.optionValues ?? {}}
                    isLargeWidth={props.dimens.isLargeWidth}
                    onValueChange={props.onOptionValueChange}
                    onPreviewEffectPress={props.onPreviewEffectPress}
                    onPreviewSongPress={props.onPreviewSongPress}
                    style={{ width: screenDimens.width }}
                ></ProfileOptionList>
            </ScrollView>
            <ProfileEditDialog />
        </StandardView>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    optionScroll: {
        flex: 1,
    },
    optionScrollContent: {
        paddingBottom: Dimens.profile_list_option_list_margin,
    },
});
//#endregion
