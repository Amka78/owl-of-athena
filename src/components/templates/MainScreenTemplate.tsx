//#region Import modules
import React, { FunctionComponent, useState } from "react";
import { View } from "react-native";

import { Colors, Message, MessageKeys } from "../../constants";
import { useLocale, useWindowDimensions } from "../../hooks";
import { Dimensions } from "../../hooks/useWindowDimensions";
import MainDrawerNavigator from "../../navigation/MainDrawerNavigator";
import { ConnectionStates } from "../../sdk";
import {
    FlatButton,
    HomeIcon,
    ProfilesIcon,
    SessionsIcon,
    SettingsIcon,
} from "../atoms";
import { ConfirmDialog, LoadingDialog } from "../molecules";
//#endregion

//#region Types
export type MainScreenTemplateProps = {
    onBluetoothConnectPress: () => Promise<string>;
    bluetoothConnect: ConnectionStates;
    currentFirmwareVersion: string;
    error: string;
    batteryLevel: number;
    onHomePress: () => void;
    onProfilesPress: () => void;
    onSessionsPress: () => void;
    onSettingsPress: () => void;
    dimens: Dimensions;
    locale?: string;
};
//#endregion

type BottomMenus = "home" | "profiles" | "sessions" | "settings";

//#region Component
export const MainScreenTemplate: FunctionComponent<MainScreenTemplateProps> = (
    props: MainScreenTemplateProps
) => {
    useLocale(props.locale);
    const [selectedMenu, setSelectedMenu] = useState<BottomMenus>("home");

    const statusBar = !props.dimens.isDesktop ? (
        <FlatButton
            contentStyle={{
                backgroundColor:
                    props.bluetoothConnect === ConnectionStates.CONNECTED
                        ? Colors.aurora_connected
                        : Colors.aurora_disconnected,
                marginBottom: 0,
            }}
            labelStyle={{
                color:
                    props.bluetoothConnect === ConnectionStates.CONNECTED
                        ? Colors.aurora_connected_text
                        : Colors.aurora_disconnected_text,
            }}
            onPress={props.onBluetoothConnectPress}
        >
            {props.error !== ""
                ? props.error
                : props.bluetoothConnect === ConnectionStates.CONNECTED
                ? Message.get(MessageKeys.aurora_connected, [
                      props.currentFirmwareVersion,
                      props.batteryLevel.toString(),
                  ])
                : Message.get(MessageKeys.aurora_disconnected)}
        </FlatButton>
    ) : undefined;

    const bottomTabBar = props.dimens.isVertical ? (
        <View
            style={{
                backgroundColor: Colors.navy,
                borderTopColor: Colors.white,
                borderTopWidth: 1,
                flexDirection: "row",
                justifyContent: "space-evenly",
            }}
        >
            <HomeIcon
                color={selectedMenu === "home" ? Colors.cyan : Colors.white}
                onPress={() => {
                    setSelectedMenu("home");
                    props.onHomePress();
                }}
            ></HomeIcon>
            <ProfilesIcon
                color={selectedMenu === "profiles" ? Colors.cyan : Colors.white}
                onPress={() => {
                    setSelectedMenu("profiles");
                    props.onProfilesPress();
                }}
            ></ProfilesIcon>
            <SessionsIcon
                color={selectedMenu === "sessions" ? Colors.cyan : Colors.white}
                onPress={() => {
                    setSelectedMenu("sessions");
                    props.onSessionsPress();
                }}
            ></SessionsIcon>
            <SettingsIcon
                color={selectedMenu === "settings" ? Colors.cyan : Colors.white}
                onPress={() => {
                    setSelectedMenu("settings");
                    props.onSettingsPress();
                }}
            ></SettingsIcon>
        </View>
    ) : undefined;

    return (
        <View
            style={{
                flex: 1,
            }}
        >
            <MainDrawerNavigator
                batteryLevel={props.batteryLevel}
                onBluetoothConnectPress={props.onBluetoothConnectPress}
                bluetoothConnect={props.bluetoothConnect}
            ></MainDrawerNavigator>
            {bottomTabBar}
            <ConfirmDialog></ConfirmDialog>
            <LoadingDialog></LoadingDialog>
            {statusBar}
        </View>
    );
};
//#endregion
