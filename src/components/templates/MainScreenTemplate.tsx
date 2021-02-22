//#region Import modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import { useLocale, useWindowDimensions } from "../../hooks";
import MainDrawerNavigator from "../../navigation/MainDrawerNavigator";
import MainTabNavigator from "../../navigation/MainTabNavigator";
import { FlatButton, FlatButtonProps } from "../atoms";
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
        <FlatButton
            {...props.AuroraConnectionStatesBar}
            contentStyle={{
                backgroundColor:
                    props.AuroraConnectionStatesBar.contentStyle
                        ?.backgroundColor,
                marginBottom: 0,
            }}
        ></FlatButton>
    ) : undefined;

    const coreNavigator = dimens.isHorizontal ? (
        <MainDrawerNavigator></MainDrawerNavigator>
    ) : (
        <MainTabNavigator></MainTabNavigator>
    );
    return (
        <View
            style={{
                flex: 1,
            }}
        >
            {coreNavigator}
            {statusBar}
        </View>
    );
};
//#endregion
