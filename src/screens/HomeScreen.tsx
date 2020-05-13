import React, { FunctionComponent, useEffect, useState, useRef } from "react";
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

type WakeLockSentinel = {
    addEventListener(
        event: string,
        listener: (...args: any[]) => void,
        opts?: { once: boolean }
    ): any;
    release(): void;
};
type WakeLock = {
    request: (target: string) => Promise<WakeLockSentinel>;
};
type ExperimentalNavigator = Navigator & {
    wakeLock: WakeLock;
};
declare const navigator: ExperimentalNavigator;

export const HomeScreen: FunctionComponent = () => {
    useCheckLogging();
    const { navigate } = useNavigation();
    const dispatch = useDispatch();

    const settings = useSettingsSelector();
    const user = useUserSelector();
    const profiles = useProfilesSelector();
    const [errorText, setErrorText] = useState<string>("");

    const selectedProfile = useRef<AuroraProfile | undefined>(undefined);
    const wakeLockContainer = useRef<WakeLockSentinel | undefined>(undefined);

    useEffect(() => {
        console.log("Called HomeScreen useEffect.");
        AuroraManagerInstance.removeListener(
            AuroraManagetEventList.onSleeping,
            onSleeping
        );
        AuroraManagerInstance.on(
            AuroraManagetEventList.onSleeping,
            onSleeping(wakeLockContainer, navigate)
        );
        AuroraManagerInstance.on(AuroraManagetEventList.onAwake, () => {
            wakeLockContainer.current?.release();
            navigate("Awake");
        });
        AuroraManagerInstance.on(AuroraManagetEventList.onWaking, () => {
            wakeLockContainer.current?.release();
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
                        selectedProfile.current = auroraProfiles.find(
                            (value: AuroraProfile) => {
                                return value.id! === settings.profileId;
                            }
                        );
                    }

                    if (selectedProfile.current === undefined) {
                        //if we don't have one, use the first (which is the latest saved)
                        selectedProfile.current = auroraProfiles[0];
                        console.log("selected Profile:", selectedProfile);
                    } else {
                        //check if most recently saved profile is more recent
                        //than last time settings were saved
                        if (
                            settings.savedAt != undefined &&
                            auroraProfiles[0].id !==
                                selectedProfile.current.id &&
                            auroraProfiles[0].updatedAt! < settings.savedAt
                        ) {
                            //use the most recently saved profile instead
                            //of the last one used in the app
                            selectedProfile.current = profiles[0];

                            settings.profileId = selectedProfile.current.id;
                            settings.profileTitle = selectedProfile.current.title!;
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
        navigate,
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
                                    selectedProfile.current!,
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

function onSleeping(
    wakeLockContainer: React.MutableRefObject<WakeLockSentinel | undefined>,
    navigate: any
): (...args: any[]) => void {
    return async (): Promise<void> => {
        try {
            const wakeLockSentinel = await navigator.wakeLock.request("screen");

            wakeLockContainer.current = wakeLockSentinel;
            wakeLockSentinel.addEventListener("release", () => {
                console.log("Screen Wake Lock was released");
            });
            console.log("Screen Wake Lock is active");
        } catch (err) {
            console.error(`${err.name}, ${err.message}`);
        }
        navigate("Sleeping");
    };
}
