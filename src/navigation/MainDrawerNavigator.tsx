//#region Import Modules
import React, { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeNavigator from "./HomeNavigator";
import SessionNavigator from "./SessionNavigator";
import SettingNavigator from "./SettingNavigator";
import { Colors, Message, MessageKeys } from "../constants";
import { useWindowDimensions } from "../hooks";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import {
    HomeIcon,
    SessionsIcon,
    SettingsIcon,
    MenuIcon,
} from "../components/atoms";
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
    const dimens = useWindowDimensions();
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(dimens.isDesktop);
    const [drawerTypeState, setDrawerTypeState] = useState<string>(
        dimens.isDesktop ? "permanent" : "slide"
    );
    const { dispatch } = useNavigation();
    return (
        <Drawer.Navigator
            initialRouteName={"Sleep Process"}
            openByDefault={dimens.isDesktop}
            drawerType={drawerTypeState as any}
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
                            color={isDrawerOpen ? Colors.cyan : Colors.white}
                            size={40}
                            onPress={() => {
                                if (isDrawerOpen) {
                                    if (drawerTypeState === "permanent") {
                                        setDrawerTypeState("slide");
                                        setIsDrawerOpen(false);
                                    }
                                } else {
                                    if (dimens.isDesktop) {
                                        setDrawerTypeState("permanent");
                                    }
                                    setIsDrawerOpen(true);
                                }

                                dispatch(DrawerActions.toggleDrawer());
                            }}
                        ></MenuIcon>
                    );
                },
                headerShown: dimens.isDesktop,
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
                    drawerLabel: dimens.isDesktop
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
                    drawerLabel: dimens.isDesktop
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
                    drawerLabel: dimens.isDesktop
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
