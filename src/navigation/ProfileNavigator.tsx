//#region Import Modules
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import { ProfileListScreen } from "../components/pages";
import { Message, MessageKeys } from "../constants";
import { useWindowDimensions } from "../hooks";
import ProfileTabNavigator from "./ProfileTabNavigator";
import { StackCommonScreenOptions } from "./StackSettings";
//#endregion

//#region Component
const Stack = createStackNavigator();

const ProfileNavigator = (): JSX.Element => {
    const dimens = useWindowDimensions();

    return (
        <Stack.Navigator screenOptions={StackCommonScreenOptions}>
            <Stack.Screen
                name={"List"}
                component={ProfileListScreen}
                options={{
                    headerTitle: !dimens.isDesktop
                        ? Message.get(MessageKeys.choose, [MessageKeys.profile])
                        : "",
                }}
            ></Stack.Screen>
            <Stack.Screen
                name={"Detail"}
                component={ProfileTabNavigator}
            ></Stack.Screen>
        </Stack.Navigator>
    );
};
//#endregion

export default ProfileNavigator;
