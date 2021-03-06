//#region Import modules
import React, { FunctionComponent, useState, useLayoutEffect } from "react";
import { View } from "react-native";

import { useLocale, useWindowDimensions } from "../../hooks";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { Colors, Message, MessageKeys } from "../../constants";
import MainDrawerNavigator from "../../navigation/MainDrawerNavigator";
import { FlatButton } from "../atoms";
import {
    ConfirmDialog,
    HomeIcon,
    LoadingDialog,
    SessionsIcon,
    SettingsIcon,
} from "../molecules";
import { ConnectionStates } from "../../sdk";
//#endregion

//#region Types
export type MainScreenTemplateProps = {
    onBluetoothConnectPress: () => Promise<string>;
    bluetoothConnect: ConnectionStates;
    currentFirmwareVersion: string;
    error: string;
    batteryLevel: number;
    onHomePress: () => void;
    onSessionsPress: () => void;
    onSettingsPress: () => void;
    locale?: string;
};
//#endregion

type BottomMenus = "home" | "sessions" | "settings";

//#region Component
export const MainScreenTemplate: FunctionComponent<MainScreenTemplateProps> = (
    props: MainScreenTemplateProps
) => {
    useLocale(props.locale);
    const dimens = useWindowDimensions();
    const { dispatch } = useNavigation();
    const [selectedMenu, setSelectedMenu] = useState<BottomMenus>("home");

    const statusBar = !dimens.isDesktop ? (
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

    const bottomTabBar = dimens.isVertical ? (
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
