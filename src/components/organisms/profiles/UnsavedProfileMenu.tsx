//#region Import Modules
import React, { FunctionComponent } from "react";
import { View, ViewStyle } from "react-native";

import { Colors, Message, MessageKeys } from "../../../constants";
import { Dimensions } from "../../../hooks/useWindowDimensions";
import { FlatButton, LeftSideButton } from "../../atoms";
//#endregion

//#region Types
export type UnsavedProfileMenuProps = {
    style?: ViewStyle;
    isUserProfile: boolean;
    dimens: Dimensions;
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
            needMargin={props.dimens.isLargeWidth}
            screenWidth={props.dimens.width}
        >
            {Message.get(MessageKeys.save_as_new)}
        </LeftSideButton>
    );

    const overwriteSaveButton:
        | React.ReactNode
        | undefined = props.isUserProfile ? (
        <LeftSideButton
            onPress={props.onOverwriteSavePress}
            needMargin={props.dimens.isLargeWidth}
            screenWidth={props.dimens.width}
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
        <View style={[menuStyle, props.style]}>
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
