//#region Import Modules
import React, { FunctionComponent } from "react";
import { View, ViewStyle } from "react-native";

import { Colors, Dimens, Message, MessageKeys } from "../../../constants";
import { Dimensions } from "../../../hooks/useWindowDimensions";
import { Button, FlatButton } from "../../atoms";
//#endregion

//#region Types
export type ProfileSecondMenuProps = {
    auroraConnected: boolean;
    selectedProfileHasUnsavedChanges: boolean;
    style?: ViewStyle;
    dimens: Dimensions;
    onSaveToAuroraPress: () => void;
    onShowAdvancedOptionsPress: () => void;
};
//#endregion

//#region Component
export const ProfileSecondMenu: FunctionComponent<ProfileSecondMenuProps> = (
    props: ProfileSecondMenuProps
) => {
    return (
        <View style={[menuStyle, props.style]}>
            <Button
                disabled={
                    !props.auroraConnected ||
                    props.selectedProfileHasUnsavedChanges
                }
                onPress={props.onSaveToAuroraPress}
                screenWidth={props.dimens.width}
                style={{ marginLeft: Dimens.button_margin }}
            >
                {Message.get(MessageKeys.profile_save_to_aurora)}
            </Button>
            <FlatButton
                onPress={props.onShowAdvancedOptionsPress}
                contentStyle={{ marginRight: Dimens.button_flat_margin }}
            >
                {Message.get(MessageKeys.profile_show_advanced_options)}
            </FlatButton>
        </View>
    );
};
//#endregion

//#region Styles
const menuStyle: ViewStyle = {
    alignItems: "center",
    backgroundColor: Colors.third_accent_color,
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 10,
};
//#endregion
