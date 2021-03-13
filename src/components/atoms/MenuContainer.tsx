//#region Import Modules
import React, { FunctionComponent } from "react";
import { Platform, View, ViewStyle } from "react-native";

import { Colors } from "../../constants";
//#endregion

//#region Types
export type MenuContainerProps = {
    children: React.ReactNode;
    style?: ViewStyle;
};
//#endregion

//#region Component
export const MenuContainer: FunctionComponent<MenuContainerProps> = (
    props: MenuContainerProps
) => {
    return (
        <View style={[menuContainerStyle, props.style]}>{props.children}</View>
    );
};
//#endregion

//#region Styles
const menuContainerStyle: ViewStyle = {
    backgroundColor: Colors.purple,
    flex: Platform.OS !== "web" ? 0.4 : undefined,
};
//#endregion
