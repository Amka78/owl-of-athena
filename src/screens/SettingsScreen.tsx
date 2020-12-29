//#region Import Modules
import React, { FunctionComponent } from "react";

import { Message, MessageKeys } from "../constants";
import { useSetting } from "../hooks/useSetting";
import { SettingsScreenTemplate } from "./templates/SettingsScreenTemplates";
//#endregion

//#region Component
export const SettingsScreen: FunctionComponent = () => {
    const settingsHook = useSetting();
    return (
        <SettingsScreenTemplate
            inlineTimePicker={{
                onChangeTime: settingsHook.inlineTimePickerOnChangeTime,
                initialTime: { ...settingsHook.datePickerState, seconds: 0 },
            }}
            smartAlarmAudioMenu={{
                value: settingsHook.smartAlarmAudio.name,
                label: Message.get(MessageKeys.settings_option_alarm_audio),
                onPress: settingsHook.smartAlarmAudioMenuOnPress,
            }}
            profileMenu={{
                hasProfiles: settingsHook.profiles !== undefined,
                value: settingsHook.profileState.profileTitle,
                label: Message.get(MessageKeys.settings_option_profile),
                onPress: settingsHook.profileMenuOnPress,
            }}
            smartAlarmEnabled={{
                status: settingsHook.smartAlarmEnabledStatus,
                onPress: settingsHook.smartAlarmEnabledOnPress,
                label: Message.get(MessageKeys.settings_option_smart_alarm),
            }}
            dslEnabled={{
                status: settingsHook.dslEnabledStatus,
                onPress: settingsHook.dslEnabledOnPress,
                label: Message.get(MessageKeys.settings_option_dsl),
            }}
            remStimEnabled={{
                status: settingsHook.remStimEnabledStatus,
                onPress: settingsHook.remStimEnabledOnPress,
                label: Message.get(MessageKeys.settings_option_rem_stim),
            }}
            remStimAudioMenu={{
                value: settingsHook.remStimAudio.name,
                onPress: settingsHook.remStimAudioMenuOnPress,
                label: Message.get(MessageKeys.settings_option_rem_stim_audio),
            }}
            saveButton={{
                children: Message.get(MessageKeys.save),
                onPress: settingsHook.saveButtonPress,
            }}
        ></SettingsScreenTemplate>
    );
};
//#endregion
