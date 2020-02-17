import React, { FunctionComponent, useState } from "react";
import { View } from "react-native";
import {
    AudioDialog,
    InlineTimePicker,
    StandardView,
    LabeledSelectorMenu,
    LabeledCheckBox
} from "../components";
import { Colors } from "../constants";
import { useCheckLogging } from "../hooks";
export const SettingsScreen: FunctionComponent = () => {
    useCheckLogging();
    const [showAlarmSoundDialog, setShowAlarmSoundDialog] = useState<boolean>(
        false
    );

    return (
        <StandardView standardViewStyle={{ justifyContent: "flex-start" }}>
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
            <View>
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
                <LabeledCheckBox
                    status={"unchecked"}
                    label={"settings_option_smart_alarm"}
                ></LabeledCheckBox>
                <LabeledCheckBox
                    status={"unchecked"}
                    label={"settings_option_dsl"}
                ></LabeledCheckBox>
                <LabeledCheckBox
                    status={"unchecked"}
                    label={"settings_option_rem_stim"}
                ></LabeledCheckBox>
                <LabeledSelectorMenu
                    value={"None"}
                    label={"settings_option_rem_stim_audio"}
                    onPress={(): void => {
                        setShowAlarmSoundDialog(true);
                    }}
                ></LabeledSelectorMenu>
            </View>
            <AudioDialog
                visible={showAlarmSoundDialog}
                onDissmiss={(): void => {
                    setShowAlarmSoundDialog(false);
                }}
            ></AudioDialog>
        </StandardView>
    );
};
