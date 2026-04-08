//#region Import Modules
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import moment from "moment";
import type * as React from "react";

import { SessionListScreen } from "../components/pages";
import { Message, MessageKeys } from "../constants";
import { useWindowDimensions } from "../hooks";
import { useSelectedSessionSelector } from "../hooks/sessions";
import SessionTabNavigator from "./SessionTabNavigator";
import { StackCommonScreenOptions } from "./StackSettings";

//#endregion

//#region Component
const Stack = createNativeStackNavigator();

const SessionNavigator = (): React.ReactNode => {
    const sessionSelector = useSelectedSessionSelector();
    const dimens = useWindowDimensions();
    const title = sessionSelector
        ? moment(sessionSelector?.sessionAt).format(Message.get(MessageKeys.date_format))
        : "";

    return (
        <Stack.Navigator screenOptions={StackCommonScreenOptions}>
            <Stack.Screen
                name={"List"}
                component={SessionListScreen}
                options={{
                    headerTitle: !dimens.isDesktop
                        ? Message.get(MessageKeys.choose, [MessageKeys.session])
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
};
//#endregion

export default SessionNavigator;
