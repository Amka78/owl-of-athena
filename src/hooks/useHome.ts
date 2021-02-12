//#region Import Modules
import { useCallback, useEffect, useRef, useState } from "react";
import { Settings } from "../sdk/models";
import { AuroraManagerInstance, AuroraManagerEventList } from "../managers";
import { ConfirmDialog, LoadingDialog } from "../components/molecules";
import { useNavigation } from "@react-navigation/native";
import {
    useCheckLogging,
    useUserSelector,
    useSettingsSelector,
    useProfilesSelector,
    useWakeLockSelector,
} from "./";
import { cacheSettings, updateProfiles, setWakeLock } from "../actions";
import { useDispatch } from "react-redux";
import { AuroraRestClientInstance } from "../clients";
import { AuroraProfile } from "../sdk/AuroraTypes";
import { GuestUser } from "../types";
import { Message, MessageKeys } from "../constants";
import { WakeLockService } from "../services";
import { Platform } from "react-native";
//#endregion

//#region Hooks
export const useHome = (): {
    settings: Settings;
    timeViewPress: () => void;
    goToSleepPress: () => void;
    errorText: string;
} => {
    useCheckLogging();
    const { navigate } = useNavigation();
    const dispatch = useDispatch();

    const settings = useSettingsSelector();
    const user = useUserSelector();
    const profiles = useProfilesSelector();
    const wakeLock = useWakeLockSelector();
    const [errorText, setErrorText] = useState<string>("");

    const onSleepingEvent = useRef(
        Platform.OS === "web"
            ? onSleeping(
                  () => {
                      dispatch(setWakeLock(true));
                  },
                  () => {
                      dispatch(setWakeLock(false));
                      WakeLockService.release();
                  },
                  () => {
                      navigate("Sleeping");
                  }
              )
            : undefined
    );

    const wakeEvent = useRef(() => {
        dispatch(setWakeLock(false));
        WakeLockService.release();
        navigate("Awake");
    });

    const wakingEvent = useRef(() => {
        dispatch(setWakeLock(false));
        WakeLockService.release();
        navigate("Waking");
    });

    const selectedProfile = useRef<AuroraProfile | undefined>(undefined);
    useEffect(() => {
        console.log("Called HomeScreen useEffect.");

        if (Platform.OS === "web") {
            AuroraManagerInstance.off(
                AuroraManagerEventList.onSleeping,
                onSleepingEvent.current
            );
            AuroraManagerInstance.on(
                AuroraManagerEventList.onSleeping,
                onSleepingEvent.current
            );
            AuroraManagerInstance.off(
                AuroraManagerEventList.onAwake,
                wakeEvent.current
            );
            AuroraManagerInstance.on(
                AuroraManagerEventList.onAwake,
                wakeEvent.current
            );
            AuroraManagerInstance.off(
                AuroraManagerEventList.onWaking,
                wakingEvent.current
            );
            AuroraManagerInstance.on(
                AuroraManagerEventList.onWaking,
                wakingEvent.current
            );
        }
        let unmounted = false;
        console.log("Loading profiles start");
        const f = async (): Promise<void> => {
            if (!unmounted && user !== undefined) {
                let auroraProfiles = profiles;

                console.log("Current profiles:", auroraProfiles);
                if (auroraProfiles.length <= 0 && user.id !== GuestUser) {
                    console.log(
                        "Cached profile is not exist, so loading remote profile start."
                    );
                    try {
                        auroraProfiles = await AuroraRestClientInstance.getAuroraProfiles();
                        console.log("Current remote profile:", auroraProfiles);
                        dispatch(updateProfiles(auroraProfiles));
                    } catch (e) {
                        navigate("Logout");
                    }
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
                    settings.userId = user.id;
                    dispatch(cacheSettings(settings));
                }
            }
        };
        f();
        const cleanup = (): void => {
            unmounted = true;
            console.debug("HomeScreen cleen up called.");
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
        wakeLock,
    ]);
    const timeViewPress = useCallback((): void => {
        navigate("Settings");
    }, [navigate]);

    const goToSleepPress = useCallback(async (): Promise<void> => {
        try {
            if (AuroraManagerInstance.isConnected()) {
                LoadingDialog.show({
                    dialogTitle: Message.get(
                        MessageKeys.home_go_to_sleep_loading_message
                    ),
                });
                await AuroraManagerInstance.goToSleep(
                    selectedProfile.current!,
                    settings
                );
            } else {
                ConfirmDialog.show({
                    title: Message.get(
                        MessageKeys.home_aurora_disconnected_dialog_title
                    ),
                    message: Message.get(
                        MessageKeys.home_aurora_disconnected_dialog_message
                    ),
                    isCancelable: false,
                });
            }
        } catch (e) {
            console.error(e);
            setErrorText(
                Message.get(MessageKeys.home_go_to_sleep_error_message)
            );
        } finally {
            LoadingDialog.close();
        }
    }, [settings]);
    return { settings, timeViewPress, goToSleepPress, errorText };
};
//#endregion

//#region Function
function onSleeping(
    succeedWakeLockCallback: () => void,
    releaseWakeLockCallback: () => void,
    postSleepingCallback: () => void
): (...args: any[]) => void {
    return async (): Promise<void> => {
        try {
            await WakeLockService.request(
                succeedWakeLockCallback,
                releaseWakeLockCallback
            );
            postSleepingCallback();
        } catch (err) {
            console.error(`${err.name}, ${err.message}`);
        }
    };
}
//#endregion
