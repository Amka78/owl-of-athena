//#region Import modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import { FlatButton, FlatButtonProps } from "../atoms";
import MainTabNavigator from "../../navigation/MainTabNavigator";
import { useLocale, useWindowDimensions } from "../../hooks";
import MainDrawerNavigator from "../../navigation/MainDrawerNavigator";
//#endregion

//#region Types
export type MainScreenTemplateProps = {
    AuroraConnectionStatesBar: FlatButtonProps;
    locale?: string;
};
//#endregion

//#region Component
export const MainScreenTemplate: FunctionComponent<MainScreenTemplateProps> = (
    props: MainScreenTemplateProps
) => {
    useLocale(props.locale);
    const dimens = useWindowDimensions();

    const statusBar = !dimens.isDesktop ? (
        <FlatButton {...props.AuroraConnectionStatesBar}></FlatButton>
    ) : undefined;

    const coreNavigator = dimens.isHorizontal ? (
        <MainDrawerNavigator></MainDrawerNavigator>
    ) : (
        <MainTabNavigator></MainTabNavigator>
    );
    return (
        <View style={{ flex: 1 }}>
            {coreNavigator}
            {statusBar}
        </View>
    );
};
//#endregion
