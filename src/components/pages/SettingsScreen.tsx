//#region Import Modules
import React, { FunctionComponent } from "react";

import { useSetting } from "../../hooks/useSetting";
import { SettingsScreenTemplate } from "../templates/SettingsScreenTemplate";
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
                onPress: settingsHook.smartAlarmAudioMenuOnPress,
            }}
            profileMenu={{
                hasProfiles: settingsHook.profiles !== undefined,
                value: settingsHook.profileState.profileTitle,
                onPress: settingsHook.profileMenuOnPress,
            }}
            smartAlarmEnabled={{
                status: settingsHook.smartAlarmEnabledStatus,
                onPress: settingsHook.smartAlarmEnabledOnPress,
            }}
            dslEnabled={{
                status: settingsHook.dslEnabledStatus,
                onPress: settingsHook.dslEnabledOnPress,
            }}
            remStimEnabled={{
                status: settingsHook.remStimEnabledStatus,
                onPress: settingsHook.remStimEnabledOnPress,
            }}
            remStimAudioMenu={{
                value: settingsHook.remStimAudio.name,
                onPress: settingsHook.remStimAudioMenuOnPress,
            }}
            saveButton={{
                onPress: settingsHook.saveButtonPress,
            }}
            cancelButton={{
                onPress: settingsHook.cancelButtonPress,
            }}
        ></SettingsScreenTemplate>
    );
};
//#endregion
