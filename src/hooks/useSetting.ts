//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { cacheSettings } from "../actions";
import { AudioDialog, ProfilesDialog, SoundList } from "../components/molecules";
import { CheckBoxStatus } from "../components/molecules/LabeledCheckBox";
import {
    useCheckLogging,
    useProfilesSelector,
    useSettingsSelector,
    useUserSelector,
} from "../hooks";
import { AuroraProfile } from "../sdk/AuroraTypes";
import { Settings } from "../sdk/models";
//#endregion

//#region Types
type DatePickerState = {
    hours: number;
    minutes: number;
};

type ProfileState = {
    profileId: string;
    profileTitle: string;
};

type AudioState = {
    name: SoundList;
    path?: string;
};
//#endregion

//#region Hooks
export const useSetting = (): {
    datePickerState: DatePickerState;
    inlineTimePickerOnChangeTime: (hours?: number, minutes?: number) => void;
    smartAlarmAudio: AudioState;
    smartAlarmAudioMenuOnPress: () => void;
    profileState: ProfileState;
    profileMenuOnPress: () => void;
    smartAlarmEnabledStatus: CheckBoxStatus;
    smartAlarmEnabledOnPress: () => void;
    dslEnabledStatus: CheckBoxStatus;
    dslEnabledOnPress: () => void;
    remStimEnabledStatus: CheckBoxStatus;
    remStimEnabledOnPress: () => void;
    remStimAudio: AudioState;
    remStimAudioMenuOnPress: () => void;
    saveButtonPress: () => void;
    profiles?: AuroraProfile[];
} => {
    useCheckLogging();

    const { navigate } = useNavigation();
    const settings = useSettingsSelector();
    const profiles = useProfilesSelector();
    const user = useUserSelector();

    const dispatch = useDispatch();
    const [datePickerState, setDatePickerState] = useState<DatePickerState>({
        hours: settings.alarmHour!,
        minutes: settings.alarmMinute!,
    });

    const [profileState, setProfileState] = useState<ProfileState>({
        profileId: settings.profileId!,
        profileTitle: settings.profileTitle,
    });

    const [smartAlarmAudio, setSmartAlarmSound] = useState<AudioState>({
        name: settings.alarmAudio,
        path: settings.alarmAudioPath,
    });
    const [smartAlarmEnabled, setSmartAlarmEnabled] = useState<boolean>(
        settings.smartAlarmEnabled
    );
    const [dslEnabled, setDslEnabled] = useState<boolean>(settings.dslEnabled);
    const [remStimEnabled, setRemStimEnabled] = useState<boolean>(
        settings.remStimEnabled
    );
    const [remStimAudio, setRemStimAudio] = useState<AudioState>({
        name: settings.remStimAudio,
        path: settings.remStimAudioPath,
    });

    const inlineTimePickerOnChangeTime = useCallback(
        (hours?: number, minutes?: number): void => {
            setDatePickerState({ hours: hours!, minutes: minutes! });
        },
        []
    );

    const smartAlarmAudioMenuOnPress = useCallback((): void => {
        AudioDialog.show(
            {
                onConfirm: (showName: SoundList, fileName: string) => {
                    setSmartAlarmSound({
                        name: showName,
                        path: fileName,
                    });
                },
            },
            smartAlarmAudio.name
        );
    }, [smartAlarmAudio]);

    const profileMenuOnPress = useCallback((): void => {
        ProfilesDialog.show({
            profileList: profiles,
            selectedProfileId: profileState.profileId,
            onConfirm: (profileId: string, profileTitle: string) => {
                setProfileState({ profileId, profileTitle });
            },
        });
    }, [profileState.profileId, profiles]);

    const smartAlarmEnabledStatus: CheckBoxStatus = smartAlarmEnabled
        ? "checked"
        : "unchecked";

    const smartAlarmEnabledOnPress = useCallback((): void => {
        setSmartAlarmEnabled(!smartAlarmEnabled);
    }, [smartAlarmEnabled]);

    const dslEnabledStatus: CheckBoxStatus = dslEnabled
        ? "checked"
        : "unchecked";
    const dslEnabledOnPress = useCallback((): void => {
        setDslEnabled(!dslEnabled);
    }, [dslEnabled]);

    const remStimEnabledStatus: CheckBoxStatus = remStimEnabled
        ? "checked"
        : "unchecked";

    const remStimEnabledOnPress = useCallback((): void => {
        setRemStimEnabled(!remStimEnabled);
    }, [remStimEnabled]);

    const remStimAudioMenuOnPress = useCallback((): void => {
        AudioDialog.show(
            {
                onConfirm: (showName: SoundList, fileName: string) => {
                    setRemStimAudio({
                        name: showName,
                        path: fileName,
                    });
                },
            },
            remStimAudio.name
        );
    }, []);

    const saveButtonPress = useCallback((): void => {
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
    }, [
        datePickerState.hours,
        datePickerState.minutes,
        dispatch,
        dslEnabled,
        navigate,
        profileState.profileId,
        profileState.profileTitle,
        remStimAudio.name,
        remStimAudio.path,
        remStimEnabled,
        smartAlarmAudio.name,
        smartAlarmAudio.path,
        smartAlarmEnabled,
        user,
    ]);
    return {
        datePickerState,
        inlineTimePickerOnChangeTime,
        smartAlarmAudio,
        smartAlarmAudioMenuOnPress,
        profileState,
        profileMenuOnPress,
        smartAlarmEnabledStatus,
        smartAlarmEnabledOnPress,
        dslEnabledStatus,
        dslEnabledOnPress,
        remStimEnabledStatus,
        remStimEnabledOnPress,
        remStimAudio,
        remStimAudioMenuOnPress,
        saveButtonPress,
    };
};
//#endregion
