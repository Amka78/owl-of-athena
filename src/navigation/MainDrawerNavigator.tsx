//#region Import Modules
import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";

import {
    HomeIcon,
    LogoutIcon,
    MenuIcon,
    SessionsIcon,
    SettingsIcon,
} from "../components/atoms";
import { Colors, Message, MessageKeys } from "../constants";
import { useMainDrawerNavigator } from "../hooks";
import HomeNavigator from "./HomeNavigator";
import SessionNavigator from "./SessionNavigator";
import SettingNavigator from "./SettingNavigator";
//#endregion

//#region Type
type DrawerIconProps = {
    color: string;
    focused: boolean;
    size: number;
};
//#endregion

//#region Compnent
const Drawer = createDrawerNavigator();

const MainDrawerNavigator = (): JSX.Element => {
    const mainDrawerHook = useMainDrawerNavigator();
    return (
        <Drawer.Navigator
            initialRouteName={"Sleep Process"}
            openByDefault={mainDrawerHook.isDesktop}
            drawerType={mainDrawerHook.drawerType}
            drawerStyle={{ backgroundColor: Colors.blue }}
            drawerContentOptions={{
                activeBackgroundColor: Colors.navy_darker,
                activeTintColor: Colors.cyan,
                inactiveTintColor: Colors.white,
            }}
            screenOptions={{
                headerLeft: () => {
                    return (
                        <MenuIcon
                            color={
                                mainDrawerHook.isDrawerOpen
                                    ? Colors.cyan
                                    : Colors.white
                            }
                            size={40}
                            onPress={mainDrawerHook.onDrawerMenuPress}
                        ></MenuIcon>
                    );
                },
                headerRight: () => {
                    return (
                        <LogoutIcon
                            color={Colors.white}
                            size={40}
                            onPress={mainDrawerHook.onLogoutPress}
                        ></LogoutIcon>
                    );
                },
                headerShown: mainDrawerHook.isDesktop,
                headerTitle: "",
                headerStyle: { backgroundColor: Colors.blue },
            }}
        >
            <Drawer.Screen
                name="Home"
                component={HomeNavigator}
                options={{
                    drawerIcon: (props: DrawerIconProps) => {
                        return <HomeIcon {...props}></HomeIcon>;
                    },
                    drawerLabel: mainDrawerHook.isDesktop
                        ? Message.get(MessageKeys.drawer_items_main)
                        : "",
                }}
            />
            <Drawer.Screen
                name="Sessions"
                component={SessionNavigator}
                options={{
                    drawerIcon: (props: DrawerIconProps) => {
                        return <SessionsIcon {...props}></SessionsIcon>;
                    },
                    drawerLabel: mainDrawerHook.isDesktop
                        ? Message.get(MessageKeys.drawer_items_sessions)
                        : "",
                }}
            />
            <Drawer.Screen
                name="Settings"
                component={SettingNavigator}
                options={{
                    drawerIcon: (props: DrawerIconProps) => {
                        return <SettingsIcon {...props}></SettingsIcon>;
                    },
                    drawerLabel: mainDrawerHook.isDesktop
                        ? Message.get(MessageKeys.drawer_items_account)
                        : "",
                }}
            ></Drawer.Screen>
        </Drawer.Navigator>
    );
};
//#endregion

//#region Export
export default MainDrawerNavigator;
//#endregion
