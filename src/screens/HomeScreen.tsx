import React, { FunctionComponent, useEffect, useState } from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import {
    Button,
    FlatButton,
    StandardView,
    TimeView,
    ErrorText,
    LoadingDialog,
    ConfirmDialog,
} from "../components";
import { useNavigation } from "react-navigation-hooks";
import {
    useCheckLogging,
    useUserSelector,
    useSettingsSelector,
    useProfilesSelector,
} from "../hooks";
import { AuroraManagerInstance, AuroraManagetEventList } from "../managers";
import { MessageKeys, Dimens } from "../constants";
import { cacheSettings, updateProfiles } from "../actions";
import { useDispatch } from "react-redux";
import { AuroraRestClientInstance } from "../clients";
import { AuroraProfile } from "../sdk/AuroraTypes";
export const HomeScreen: FunctionComponent = () => {
    useCheckLogging();
    const { navigate } = useNavigation();
    const dispatch = useDispatch();

    const settings = useSettingsSelector();
    const user = useUserSelector();
    const profiles = useProfilesSelector();
    const [errorText, setErrorText] = useState<string>("");

    let selectedProfile: AuroraProfile | undefined;
    const [wakeLock, setWakeLock] = useState<any>();

    useEffect(() => {
        AuroraManagerInstance.on(AuroraManagetEventList.onSleeping, () => {
            try {
                // @ts-ignore
                navigator.wakeLock
                    .request("screen")
                    .then((wakeLockValue: any) => {
                        setWakeLock(wakeLockValue);

                        wakeLockValue.addEventListener("release", () => {
                            console.log("Screen Wake Lock was released");
                        });
                    });
                console.log("Screen Wake Lock is active");
            } catch (err) {
                console.error(`${err.name}, ${err.message}`);
            }
            navigate("Sleeping");
        });
        AuroraManagerInstance.on(AuroraManagetEventList.onAwake, () => {
            if (wakeLock) {
                wakeLock.release();
            }
            navigate("Awake");
        });
        AuroraManagerInstance.on(AuroraManagetEventList.onWaking, () => {
            if (wakeLock) {
                wakeLock.release();
            }
            navigate("Waking");
        });
        let unmounted = false;
        console.log("Loading profiles start");
        const f = async (): Promise<void> => {
            if (!unmounted && user !== undefined) {
                let auroraProfiles = profiles;

                console.log("Current profiles:", auroraProfiles);
                if (auroraProfiles.length <= 0) {
                    console.log(
                        "Cached profile is not exist, so loading remote profile start."
                    );
                    auroraProfiles = await AuroraRestClientInstance.getAuroraProfiles();
                    console.log("Current remote profile:", auroraProfiles);
                    dispatch(updateProfiles(auroraProfiles));
                }

                if (auroraProfiles.length > 0) {
                    console.log("Profile select start");
                    // get last used profile.
                    if (settings.profileId) {
                        selectedProfile = auroraProfiles.find(
                            (value: AuroraProfile) => {
                                return value.id! === settings.profileId;
                            }
                        );
                    }

                    if (selectedProfile === undefined) {
                        //if we don't have one, use the first (which is the latest saved)
                        selectedProfile = auroraProfiles[0];
                        console.log("selected Profile:", selectedProfile);
                    } else {
                        //check if most recently saved profile is more recent
                        //than last time settings were saved
                        if (
                            settings.savedAt != undefined &&
                            auroraProfiles[0].id !== selectedProfile!.id &&
                            auroraProfiles[0].updatedAt! < settings.savedAt
                        ) {
                            //use the most recently saved profile instead
                            //of the last one used in the app
                            selectedProfile = profiles[0];

                            settings.profileId = selectedProfile!.id;
                            settings.profileTitle = selectedProfile!.title!;
                        }
                    }
                    settings.userId = user!.id;
                    dispatch(cacheSettings(settings));
                }
            }
        };
        f();
        const cleanup = (): void => {
            unmounted = true;
        };
        return cleanup();
    }, [
        dispatch,
        profiles,
        settings,
        settings.profileId,
        settings.profileTitle,
        settings.savedAt,
        user,
    ]);
    return (
        <StandardView>
            <TouchableWithoutFeedback
                onPress={(): void => {
                    navigate("Settings");
                }}
            >
                <View>
                    <TimeView
                        hours={settings.alarmHour}
                        minutes={settings.alarmMinute}
                        mode={"meridian"}
                        timeStyle={{
                            fontSize: Dimens.home_alarm_time_text_size,
                        }}
                        timeMeridianStyle={{
                            fontSize: Dimens.home_alarm_meridian_text_size,
                        }}
                    ></TimeView>
                    <FlatButton>
                        {{ key: MessageKeys.home_edit_alarm_button }}
                    </FlatButton>
                </View>
            </TouchableWithoutFeedback>
            <FlatButton
                onPress={(): void => {
                    navigate("Settings");
                }}
            >
                {{ key: MessageKeys.home_default_profile }}
            </FlatButton>
            <View style={{ alignItems: "center" }}>
                <ErrorText>{{ key: errorText }}</ErrorText>
                <Button
                    // disabled={!AuroraManagerInstance.isConnected()}
                    onPress={async (): Promise<void> => {
                        try {
                            if (AuroraManagerInstance.isConnected()) {
                                LoadingDialog.show({
                                    dialogTitle: {
                                        key:
                                            MessageKeys.home_go_to_sleep_loading_message,
                                    },
                                });
                                await AuroraManagerInstance.goToSleep(
                                    selectedProfile!,
                                    settings
                                );
                            } else {
                                ConfirmDialog.show({
                                    title: {
                                        key:
                                            MessageKeys.home_aurora_disconnected_dialog_title,
                                    },
                                    message: {
                                        key:
                                            MessageKeys.home_aurora_disconnected_dialog_message,
                                    },
                                    isCancelable: false,
                                });
                            }
                        } catch (e) {
                            console.error(e);
                            setErrorText(
                                MessageKeys.home_go_to_sleep_error_message
                            );
                        } finally {
                            LoadingDialog.close();
                        }
                    }}
                >
                    {{ key: MessageKeys.home_go_to_sleep_button }}
                </Button>
            </View>
        </StandardView>
    );
};
