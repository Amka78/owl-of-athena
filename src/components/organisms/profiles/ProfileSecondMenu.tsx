//#region Import Modules
import React, { type FunctionComponent } from "react";
import { View, type ViewStyle } from "react-native";

import { Colors, Dimens, Message, MessageKeys } from "../../../constants";
import type { Dimensions } from "../../../hooks/useWindowDimensions";
import { Button, FlatButton } from "../../atoms";
//#endregion

//#region Types
export type ProfileSecondMenuProps = {
    auroraConnected: boolean;
    selectedProfileHasUnsavedChanges: boolean;
    showAdvancedOptions?: boolean;
    style?: ViewStyle;
    dimens: Dimensions;
    onSaveToAuroraPress: () => void;
    onShowAdvancedOptionsPress: () => void;
};
//#endregion

//#region Component
export const ProfileSecondMenu: FunctionComponent<ProfileSecondMenuProps> = (
    props: ProfileSecondMenuProps,
) => {
    const isWide = props.dimens.isLargeWidth;
    return (
        <View style={[menuStyle, isWide ? wideMenuStyle : narrowMenuStyle, props.style]}>
            <Button
                disabled={!props.auroraConnected}
                onPress={props.onSaveToAuroraPress}
                screenWidth={props.dimens.width}
                style={
                    isWide ? { marginLeft: Dimens.button_margin } : { marginLeft: 0, width: "100%" }
                }
            >
                {Message.get(MessageKeys.profile_save_to_aurora)}
            </Button>
            <FlatButton
                onPress={props.onShowAdvancedOptionsPress}
                labelStyle={{ color: Colors.cyan }}
                contentStyle={{ marginRight: Dimens.button_flat_margin }}
            >
                {Message.get(
                    props.showAdvancedOptions
                        ? MessageKeys.profile_hide_advanced_options
                        : MessageKeys.profile_show_advanced_options,
                )}
            </FlatButton>
        </View>
    );
};
//#endregion

//#region Styles
const menuStyle: ViewStyle = {
    backgroundColor: Colors.third_accent_color,
};
// 狭幅（モバイル）では横並びだとボタン列が画面幅に収まらないため縦積みにする。
const wideMenuStyle: ViewStyle = {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
};
const narrowMenuStyle: ViewStyle = {
    alignItems: "flex-end",
    flexDirection: "column",
};
//#endregion
