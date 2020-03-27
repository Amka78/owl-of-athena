import React, { FunctionComponent, useEffect, useState } from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import {
    Button,
    FlatButton,
    StandardView,
    TimeView,
    ErrorText,
    LoadingDialog,
    ConfirmDialog
} from "../components";
import { useNavigation } from "react-navigation-hooks";
import {
    useCheckLogging,
    useUserSelector,
    useSettingsSelector,
    useProfilesSelector
} from "../hooks";
import { AuroraManagerInstance } from "../managers";
import { MessageKeys } from "../constants";
import { updateSettings, updateProfiles } from "../actions";
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

    useEffect(() => {
        let unmounted = false;
        console.log("Loading profiles start");
        const f = async (): Promise<void> => {
            if (!unmounted) {
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
                    dispatch(updateSettings(settings));
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
        user
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
                    disabled={!AuroraManagerInstance.isConnected()}
                    onPress={(): void => {
                        AuroraManagerInstance.goToSleep(
                            selectedProfile!,
                            settings
                        );
                    }}
                >
                    {{ key: MessageKeys.home_go_to_sleep_button }}
                </Button>
            </View>
        </StandardView>
    );
};
