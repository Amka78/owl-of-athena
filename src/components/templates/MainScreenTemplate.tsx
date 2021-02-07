//#region Import modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import { FlatButton } from "..";
import { FlatButtonProps } from "../FlatButton";
import MainTabNavigator from "../../navigation/MainTabNavigator";
import { useLocale } from "../../hooks";
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
    return (
        <View style={{ flex: 1 }}>
            <MainTabNavigator></MainTabNavigator>
            <FlatButton {...props.AuroraConnectionStatesBar}></FlatButton>
        </View>
    );
};
//#endregion
