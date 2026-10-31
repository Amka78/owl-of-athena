//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";

import { AuroraRestClientInstance } from "../clients";
import { LoadingDialog } from "../components/molecules";
import { Message, MessageKeys } from "../constants";
import { AuroraManagerEventList, AuroraManagerInstance } from "../managers";
import { ConnectionStates } from "../sdk";
import type { AuroraProfile } from "../sdk/AuroraTypes";
import type { Settings } from "../sdk/models";
import { WakeLockService } from "../services";
import { createOfficialProfile } from "../services/ProfileService";
import { useAppStore } from "../store/appStore";
import { useAuroraStore } from "../store/auroraStore";
import { useProfileStore } from "../store/profileStore";
import { GuestUser } from "../types";
import {
    useAlarm,
    useCheckLogging,
    useProfileListSelector,
    useSettingsSelector,
    useUserSelector,
    useWakeLockSelector,
} from "./";

//#endregion

/** 未接続で GO TO BED を押したとき、接続を待つ最大時間。 */
const PENDING_GO_TO_SLEEP_TIMEOUT_MS = 10 * 60 * 1000;

//#region Hooks
export const useHome = (): {
    settings: Settings;
    timeViewPress: () => void;
    goToSleepPress: () => void;
    errorText: string;
} => {
    useCheckLogging();
    useAlarm();
    const { navigate } = useNavigation<any>();
    const { cacheProfiles } = useProfileStore();
    const { cacheSettings } = useAuroraStore();

    const settings = useSettingsSelector();
    const user = useUserSelector();
    const profiles = useProfileListSelector();
    const wakeLock = useWakeLockSelector();
    const [errorText, setErrorText] = useState<string>("");
    const pendingGoToSleep = useRef(false);
    const pendingTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const clearPendingTimeout = useCallback((): void => {
        if (pendingTimeout.current !== undefined) {
            clearTimeout(pendingTimeout.current);
            pendingTimeout.current = undefined;
        }
    }, []);

    const onSleepingEvent = useRef(
        onSleeping(
            () => {
                useAppStore.getState().setWakeLock(true);
            },
            () => {
                useAppStore.getState().setWakeLock(false);
                WakeLockService.release();
            },
            () => {
                navigate("Sleeping");
            },
        ),
    );

    const wakeEvent = useRef(() => {
        useAppStore.getState().setWakeLock(false);
        WakeLockService.release();
        navigate("Awake");
    });

    const wakingEvent = useRef(() => {
        useAppStore.getState().setWakeLock(false);
        WakeLockService.release();
        navigate("Waking");
    });

    const selectedProfile = useRef<AuroraProfile | undefined>(undefined);
    useEffect(() => {
        console.log("Called HomeScreen useEffect.");

        AuroraManagerInstance.off(AuroraManagerEventList.onSleeping, onSleepingEvent.current);
        AuroraManagerInstance.on(AuroraManagerEventList.onSleeping, onSleepingEvent.current);
        AuroraManagerInstance.off(AuroraManagerEventList.onAwake, wakeEvent.current);
        AuroraManagerInstance.on(AuroraManagerEventList.onAwake, wakeEvent.current);
        AuroraManagerInstance.off(AuroraManagerEventList.onWaking, wakingEvent.current);
        AuroraManagerInstance.on(AuroraManagerEventList.onWaking, wakingEvent.current);
        let unmounted = false;
        console.log("Loading profiles start");
        const f = async (): Promise<void> => {
            if (!unmounted && user !== undefined) {
                let auroraProfiles = profiles;

                console.log("Current profiles:", auroraProfiles);
                if (auroraProfiles.length <= 0 && user.id !== GuestUser) {
                    console.log("Cached profile is not exist, so loading remote profile start.");
                    try {
                        auroraProfiles = await AuroraRestClientInstance.getAuroraProfiles();
                        console.log("Current remote profile:", auroraProfiles);
                        cacheProfiles(auroraProfiles);
                    } catch (e) {
                        navigate("Logout");
                    }
                }

                if (auroraProfiles.length <= 0) {
                    console.log("At the first start-up, the initial values are read.");

                    const profile = await createOfficialProfile();

                    auroraProfiles.push(profile);
                    cacheProfiles(auroraProfiles);
                }

                if (auroraProfiles.length > 0) {
                    console.log("Profile select start");
                    // get last used profile.
                    if (settings.profileId) {
                        selectedProfile.current = auroraProfiles.find((value: AuroraProfile) => {
                            return value.id === settings.profileId;
                        });
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
                            auroraProfiles[0].id !== selectedProfile.current.id &&
                            auroraProfiles[0].updated_at! < settings.savedAt.getTime()
                        ) {
                            //use the most recently saved profile instead
                            //of the last one used in the app
                            selectedProfile.current = profiles[0];

                            settings.profileId = selectedProfile.current.id;
                            settings.profileTitle = selectedProfile.current.title;
                        }
                    }
                    settings.userId = user.id;
                    cacheSettings(settings);
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
        cacheProfiles,
        cacheSettings,
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
                pendingGoToSleep.current = false;
                clearPendingTimeout();
                LoadingDialog.show({
                    dialogTitle: Message.get(MessageKeys.home_go_to_sleep_loading_message),
                });
                await AuroraManagerInstance.goToSleep(selectedProfile.current!, settings);
            } else {
                // 接続されたら自動で就寝処理を続ける（10分で待機をやめる）
                pendingGoToSleep.current = true;
                setErrorText(Message.get(MessageKeys.home_aurora_disconnected_dialog_message));
                clearPendingTimeout();
                pendingTimeout.current = setTimeout(() => {
                    pendingGoToSleep.current = false;
                    pendingTimeout.current = undefined;
                    setErrorText("");
                }, PENDING_GO_TO_SLEEP_TIMEOUT_MS);
            }
        } catch (e) {
            console.error(e);
            setErrorText(Message.get(MessageKeys.home_go_to_sleep_error_message));
        } finally {
            LoadingDialog.close();
        }
    }, [settings]);

    useEffect(() => {
        const onConnectionChange = (connectionState: ConnectionStates): void => {
            if (connectionState !== ConnectionStates.CONNECTED) return;
            if (!pendingGoToSleep.current) return;

            pendingGoToSleep.current = false;
            clearPendingTimeout();
            setErrorText("");
            void goToSleepPress();
        };

        AuroraManagerInstance.on(AuroraManagerEventList.onConnectionChange, onConnectionChange);
        return () => {
            AuroraManagerInstance.off(
                AuroraManagerEventList.onConnectionChange,
                onConnectionChange,
            );
            clearPendingTimeout();
        };
    }, [clearPendingTimeout, goToSleepPress]);

    return { settings, timeViewPress, goToSleepPress, errorText };
};
//#endregion

//#region Function
function onSleeping(
    succeedWakeLockCallback: () => void,
    releaseWakeLockCallback: () => void,
    postSleepingCallback: () => void,
): (...args: any[]) => void {
    return async (): Promise<void> => {
        try {
            await WakeLockService.request(succeedWakeLockCallback, releaseWakeLockCallback);
            postSleepingCallback();
        } catch (err) {
            console.error(`${(err as Error).name}, ${(err as Error).message}`);
        }
    };
}
//#endregion
