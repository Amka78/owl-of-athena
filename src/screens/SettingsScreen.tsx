import React, { FunctionComponent, useState } from "react";
import { View } from "react-native";
import {
    AudioDialog,
    Button,
    InlineTimePicker,
    StandardView,
    SoundList,
    LabeledSelectorMenu,
    LabeledCheckBox,
    ProfilesDialog
} from "../components";
import { Colors, MessageKeys } from "../constants";
import {
    useCheckLogging,
    useSettingsSelector,
    useProfilesSelector,
    useUserSelector
} from "../hooks";
import { Settings } from "../sdk/models";
import { cacheSettings } from "../actions";
import { useDispatch } from "react-redux";
import { useNavigation } from "react-navigation-hooks";
export const SettingsScreen: FunctionComponent = () => {
    useCheckLogging();

    const { navigate } = useNavigation();
    const settings = useSettingsSelector();
    const profiles = useProfilesSelector();
    const user = useUserSelector();

    const dispatch = useDispatch();
    const [datePickerState, setDatePickerState] = useState<{
        hours: number;
        minutes: number;
    }>({ hours: settings.alarmHour!, minutes: settings.alarmMinute! });
    const [profileState, setProfileState] = useState<{
        profileId: string;
        profileTitle: string;
    }>({ profileId: settings.profileId!, profileTitle: settings.profileTitle });
    const [smartAlarmAudio, setSmartAlarmSound] = useState<{
        name: SoundList;
        path?: string;
    }>({ name: settings.alarmAudio, path: settings.alarmAudioPath });
    const [smartAlarmEnabled, setSmartAlarmEnabled] = useState<boolean>(
        settings.smartAlarmEnabled
    );
    const [dslEnabled, setDslEnabled] = useState<boolean>(settings.dslEnabled);
    const [remStimEnabled, setRemStimEnabled] = useState<boolean>(
        settings.remStimEnabled
    );
    const [remStimAudio, setRemStimAudio] = useState<{
        name: SoundList;
        path?: string;
    }>({ name: settings.remStimAudio, path: settings.remStimAudioPath });

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
                onChangeTime={(hours?: number, minutes?: number): void => {
                    setDatePickerState({ hours: hours!, minutes: minutes! });
                }}
                initialTime={{ ...datePickerState, seconds: 0 }}
            ></InlineTimePicker>
            <View>
                <LabeledSelectorMenu
                    value={smartAlarmAudio.name}
                    label={{ key: MessageKeys.settings_option_alarm_audio }}
                    onPress={(): void => {
                        AudioDialog.show(
                            {
                                onConfirm: (
                                    showName: SoundList,
                                    fileName: string
                                ) => {
                                    setSmartAlarmSound({
                                        name: showName,
                                        path: fileName
                                    });
                                }
                            },
                            smartAlarmAudio.name
                        );
                    }}
                ></LabeledSelectorMenu>
                <LabeledSelectorMenu
                    value={profileState.profileTitle}
                    label={{ key: MessageKeys.settings_option_profile }}
                    onPress={(): void => {
                        ProfilesDialog.show({
                            profileList: profiles,
                            selectedProfileId: profileState.profileId,
                            onConfirm: (
                                profileId: string,
                                profileTitle: string
                            ) => {
                                setProfileState({ profileId, profileTitle });
                            }
                        });
                    }}
                ></LabeledSelectorMenu>
                <LabeledCheckBox
                    status={smartAlarmEnabled ? "checked" : "unchecked"}
                    onPress={(): void => {
                        setSmartAlarmEnabled(!smartAlarmEnabled);
                    }}
                    label={{ key: MessageKeys.settings_option_smart_alarm }}
                ></LabeledCheckBox>
                <LabeledCheckBox
                    status={dslEnabled ? "checked" : "unchecked"}
                    onPress={(): void => {
                        setDslEnabled(!dslEnabled);
                    }}
                    label={{ key: MessageKeys.settings_option_dsl }}
                ></LabeledCheckBox>
                <LabeledCheckBox
                    status={remStimEnabled ? "checked" : "unchecked"}
                    onPress={(): void => {
                        setRemStimEnabled(!remStimEnabled);
                    }}
                    label={{ key: MessageKeys.settings_option_rem_stim }}
                ></LabeledCheckBox>
                <LabeledSelectorMenu
                    value={remStimAudio.name}
                    label={{ key: MessageKeys.settings_option_rem_stim_audio }}
                    onPress={(): void => {
                        AudioDialog.show(
                            {
                                onConfirm: (
                                    showName: SoundList,
                                    fileName: string
                                ) => {
                                    setRemStimAudio({
                                        name: showName,
                                        path: fileName
                                    });
                                }
                            },
                            remStimAudio.name
                        );
                    }}
                ></LabeledSelectorMenu>
            </View>
            <Button
                onPress={(): void => {
                    const settings = new Settings({});

                    settings.alarmHour = datePickerState.hours;
                    settings.alarmMinute = datePickerState.minutes;
                    settings.profileId = profileState.profileId;
                    settings.profileTitle = profileState.profileTitle;
                    settings.alarmAudio = smartAlarmAudio.name;
                    settings.alarmAudioPath = smartAlarmAudio.path;

                    settings.smartAlarmEnabled = smartAlarmEnabled;
                    settings.dslEnabled = dslEnabled;
                    settings.remStimEnabled = remStimEnabled;
                    settings.remStimAudio = remStimAudio.name;
                    settings.remStimAudioPath = remStimAudio.path;
                    settings.savedAt = new Date();

                    console.log("updated Settings:", settings);
                    dispatch(cacheSettings(settings, user!.id));

                    navigate("Home");
                }}
            >
                {{ key: MessageKeys.save }}
            </Button>
        </StandardView>
    );
};
