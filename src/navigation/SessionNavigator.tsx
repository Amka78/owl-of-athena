//#region Import Modules
import { createStackNavigator } from "@react-navigation/stack";
import moment from "moment";
import * as React from "react";
import { View } from "react-native";

import { ConfirmDialog, LoadingDialog } from "../components/molecules";
import { SessionListScreen, SessionScreen } from "../components/pages";
import { Colors, Message, MessageKeys } from "../constants";
import { useSelectedSessionSelector, useWindowDimensions } from "../hooks";
import { CommonStyles } from "../styles";
import SessionTabNavigator from "./SessionTabNavigator";
//#endregion

//#region Component
const Stack = createStackNavigator();

const SessionNavigator = (): JSX.Element => {
    const sessionSelector = useSelectedSessionSelector();
    const title = sessionSelector
        ? moment(sessionSelector?.sessionAt).format(
              Message.get(MessageKeys.date_format)
          )
        : "";
    const dimens = useWindowDimensions();

    const settionStack = (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: "center",
                headerTintColor: Colors.cyan,
                headerStyle: CommonStyles.headerStyle,
                headerTitle: "",
            }}
        >
            <Stack.Screen
                name={"List"}
                component={SessionListScreen}
                options={{
                    headerTitle: !dimens.isDesktop
                        ? Message.get(MessageKeys.session_list_title)
                        : "",
                }}
            ></Stack.Screen>
            <Stack.Screen
                name={"Detail"}
                component={SessionTabNavigator}
                options={{ title }}
            ></Stack.Screen>
        </Stack.Navigator>
    );

    const sessionScreen = <SessionScreen></SessionScreen>;

    let sessinView = undefined;
    if (dimens.isHorizontal && dimens.isDesktop) {
        sessinView = (
            <View style={{ flexDirection: "row", flex: 1 }}>
                <View style={{ flex: 3 }}>{settionStack}</View>
                <View style={{ flex: 7 }}>{sessionScreen}</View>
            </View>
        );
    } else {
        sessinView = settionStack;
    }
    return (
        <View style={{ flex: 1 }}>
            {sessinView}
            <LoadingDialog></LoadingDialog>
            <ConfirmDialog
                dialogContainer={{ width: dimens.width }}
            ></ConfirmDialog>
        </View>
    );
};
//#endregion

export default SessionNavigator;
