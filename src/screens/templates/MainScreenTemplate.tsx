//#region Import modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import { FlatButton } from "../../components";
import { FlatButtonProps } from "../../components/FlatButton";
import MainTabNavigator from "../../navigation/MainTabNavigator";
//#endregion

//#region Types
export type MainScreenTemplateProps = {
    AuroraConnectionStatesBar: FlatButtonProps;
};
//#endregion

//#region Component
export const MainScreenTemplate: FunctionComponent<MainScreenTemplateProps> = (
    props: MainScreenTemplateProps
) => {
    return (
        <View style={{ flex: 1 }}>
            <MainTabNavigator></MainTabNavigator>
            <FlatButton {...props.AuroraConnectionStatesBar}></FlatButton>
        </View>
    );
};
//#endregion
