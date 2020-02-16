import React, { FunctionComponent, useState } from "react";
import { View } from "react-native";
import {
    AudioDialog,
    InlineTimePicker,
    StandardView,
    LabeledSelectorMenu
} from "../components";
import { Colors, Message, Fonts } from "../constants";
export const SettingsScreen: FunctionComponent = () => {
    const [showAlarmSoundDialog, setShowAlarmSoundDialog] = useState<boolean>(
        false
    );

    return (
        <StandardView>
            <InlineTimePicker
                mode="minute"
                style={{
                    activeColor: Colors.navy_darker,
                    backgroundColor: Colors.navy,
                    borderColor: Colors.white,
                    containerBackgroudColor: Colors.navy,
                    textColor: Colors.cyan
                }}
            ></InlineTimePicker>
            <LabeledSelectorMenu
                value={"None"}
                label={"settings_option_alarm_audio"}
                onPress={(): void => {
                    setShowAlarmSoundDialog(true);
                }}
            ></LabeledSelectorMenu>
            <LabeledSelectorMenu
                value={"My Default Profile"}
                label={"settings_option_profile"}
            ></LabeledSelectorMenu>
            <LabeledSelectorMenu
                value={"None"}
                label={"settings_option_rem_stim_audio"}
                onPress={(): void => {
                    setShowAlarmSoundDialog(true);
                }}
            ></LabeledSelectorMenu>
            <AudioDialog
                visible={showAlarmSoundDialog}
                onDissmiss={(): void => {
                    setShowAlarmSoundDialog(false);
                }}
            ></AudioDialog>
        </StandardView>
    );
};
