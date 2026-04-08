//#region Import Modules
import React, { type FunctionComponent } from "react";
import { Text, type TextStyle, View, type ViewStyle } from "react-native";

import { Colors } from "../../../constants";
import type { AuroraProfile } from "../../../sdk/AuroraTypes";
import { EditIcon } from "../../atoms";
//#endregion

//#region Types
export type ProfileMenuProps = {
    style?: ViewStyle;
    selectedProfile: AuroraProfile;
    onEditPress?: () => void;
    onInfoPress?: () => void;
};
//#endregion

//#region Component
export const ProfileMenu: FunctionComponent<ProfileMenuProps> = (props: ProfileMenuProps) => {
    return (
        <View style={[menuStyle, props.style]}>
            <EditIcon onPress={props.onInfoPress}></EditIcon>
            <Text style={menuTitleStyle}>{props.selectedProfile.title}</Text>
        </View>
    );
};
//#endregion

//#region Styles
const menuStyle: ViewStyle = {
    alignItems: "center",
    backgroundColor: Colors.third_accent_color,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: 10,
};

const menuTitleStyle: TextStyle = {
    color: Colors.white,
    fontSize: 35,
    marginLeft: 10,
};
//#endregion
