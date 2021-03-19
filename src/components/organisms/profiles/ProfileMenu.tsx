//#region Import Modules
import React, { FunctionComponent } from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";
import { Colors } from "../../../constants";
import { AuroraProfile } from "../../../sdk/AuroraTypes";
import { InfoIcon } from "../../atoms";
//#endregion

//#region Types
export type ProfileMenuProps = {
    selectedProfile: AuroraProfile;
    onInfoPress: () => void;
};
//#endregion

//#region Component
export const ProfileMenu: FunctionComponent<ProfileMenuProps> = (
    props: ProfileMenuProps
) => {
    return (
        <View style={menuStyle}>
            <InfoIcon onPress={props.onInfoPress}></InfoIcon>
            <Text style={menuTitleStyle}>{props.selectedProfile.title}</Text>
        </View>
    );
};
//#endregion

//#region Styles
const menuStyle: ViewStyle = {
    alignItems: "center",
    backgroundColor: Colors.third_accent_color,
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
