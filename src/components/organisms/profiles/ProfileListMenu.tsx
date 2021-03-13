//#region Import Modules
import React, { FunctionComponent } from "react";
import { Text, TextStyle, ViewStyle } from "react-native";

import { Colors, Message, MessageKeys } from "../../../constants";
import { MenuContainer } from "../../atoms";
import { MenuCheckBox } from "../../molecules";
import { CheckBoxStatus } from "../../molecules/LabeledCheckBox";
//#endregion

//#region Types
export type ProfileListMenuProps = {
    containerStyle?: ViewStyle;
    showOfficialCheckBoxStatus: CheckBoxStatus;
    onShowOfficialCheckBoxPress: () => void;
    showCommunityCheckBoxStatus: CheckBoxStatus;
    onShowCommunityCheckBoxPress: () => void;
    showPrivateCheckBoxStatus: CheckBoxStatus;
    onShowPrivateCheckBoxPress: () => void;
};
//#endregion

//#region Component
export const ProfileListMenu: FunctionComponent<ProfileListMenuProps> = (
    props: ProfileListMenuProps
) => {
    const checkBoxStyle = [props.containerStyle, { marginLeft: 0 }];
    return (
        <MenuContainer style={props.containerStyle}>
            <Text style={profileTypeCheckBoxes}>
                {Message.get(MessageKeys.profile_filter_menu_header_label)}
            </Text>
            <MenuCheckBox
                container={checkBoxStyle}
                status={props.showOfficialCheckBoxStatus}
                onPress={props.onShowOfficialCheckBoxPress}
                label={Message.get(
                    MessageKeys.profile_filter_menu_official_check_box_label
                )}
                description={Message.get(
                    MessageKeys.profile_filter_menu_official_check_box_description
                )}
            ></MenuCheckBox>
            <MenuCheckBox
                container={checkBoxStyle}
                status={props.showCommunityCheckBoxStatus}
                onPress={props.onShowCommunityCheckBoxPress}
                label={Message.get(
                    MessageKeys.profile_filter_menu_community_check_box_label
                )}
                description={Message.get(
                    MessageKeys.profile_filter_menu_community_check_box_description
                )}
            ></MenuCheckBox>
            <MenuCheckBox
                container={checkBoxStyle}
                status={props.showPrivateCheckBoxStatus}
                onPress={props.onShowPrivateCheckBoxPress}
                label={Message.get(
                    MessageKeys.profile_filter_menu_private_check_box_label
                )}
                description={Message.get(
                    MessageKeys.profile_filter_menu_private_check_box_description
                )}
            ></MenuCheckBox>
        </MenuContainer>
    );
};
//#endregion

//#region Styles
const profileTypeCheckBoxes: TextStyle = {
    color: Colors.cyan,
    fontSize: 13,
};
//#endregion
