//#region Import Modules
import React, { FunctionComponent } from "react";
import { View, ViewStyle } from "react-native";

import { Colors, Message, MessageKeys } from "../../../constants";
import { FlatButton, LeftSideButton } from "../../atoms";
//#endregion

//#region Types
export type UnsavedProfileMenuProps = {
    isUserProfile: boolean;
    isLargeWidth: boolean;
    onSaveAsNewPress: () => void;
    onOverwriteSavePress: () => void;
    onCancelPress: () => void;
};
//#endregion

//#region Component
export const UnsavedProfileMenu: FunctionComponent<UnsavedProfileMenuProps> = (
    props: UnsavedProfileMenuProps
) => {
    const saveButton: React.ReactNode = (
        <LeftSideButton
            onPress={props.onSaveAsNewPress}
            isLargeWidth={props.isLargeWidth}
        >
            {Message.get(MessageKeys.save_as_new)}
        </LeftSideButton>
    );

    const overwriteSaveButton:
        | React.ReactNode
        | undefined = props.isUserProfile ? (
        <LeftSideButton
            onPress={props.onOverwriteSavePress}
            isLargeWidth={props.isLargeWidth}
        >
            {Message.get(MessageKeys.overwrite_save)}
        </LeftSideButton>
    ) : undefined;

    const cancelButton: React.ReactNode = (
        <FlatButton onPress={props.onCancelPress}>
            {Message.get(MessageKeys.cancel)}
        </FlatButton>
    );

    return (
        <View style={menuStyle}>
            {saveButton}
            {overwriteSaveButton}
            {cancelButton}
        </View>
    );
};
//#endregion

//#region Styles
const menuStyle: ViewStyle = {
    alignItems: "center",
    backgroundColor: Colors.third_accent_color,
    flexDirection: "row",
    justifyContent: "flex-end",
};
//#endregion
