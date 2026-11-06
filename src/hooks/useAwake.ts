//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

import { ConfirmDialog, LoadingDialog, QuestionnaireDialog } from "../components/molecules";
import { Message, MessageKeys } from "../constants";
import { AuroraManagerInstance, type SessionSyncResult } from "../managers";
import { SleepStates } from "../sdk";
import { useSessionStore } from "../store/sessionStore";
import { useSessionTransferStore } from "../store/sessionTransferStore";
import { GuestUser } from "../types";
import {
    useCheckLogging,
    useSessionDetailListSelector,
    useSessionListSelector,
    useUserSelector,
} from "./";

//#endregion

//#region Functions
/** 同期に失敗したセッションがあるときだけ件数を知らせる。 */
const showSyncSummary = (result?: SessionSyncResult): void => {
    if (result === undefined || result.failedCount === 0) return;

    const message =
        result.syncedCount > 0
            ? Message.get(MessageKeys.aurora_sync_mixed_message, [
                  result.syncedCount.toString(),
                  result.failedCount.toString(),
              ])
            : Message.get(MessageKeys.aurora_sync_failed_message, [result.failedCount.toString()]);

    ConfirmDialog.show({
        title: Message.get(MessageKeys.aurora_sync_dialog_title),
        message,
        isCancelable: true,
    });
};
//#endregion

//#region Hooks
export const useAwake = (): {
    questionnaireButtonPress: () => void;
    skipButtonPress: () => Promise<void>;
} => {
    useCheckLogging();
    const { cacheSessions, cacheSessionDetails, selectSession } = useSessionStore();
    const { navigate } = useNavigation<any>();
    const userInfo = useUserSelector();
    const sessionList = useSessionListSelector();
    const sessionDetailList = useSessionDetailListSelector();

    const questionnaireButtonPress = useCallback((): void => {
        QuestionnaireDialog.show({
            onComplete: () => navigate("Home"),
            onClose: () => navigate("Home"),
        });
    }, [navigate]);

    const skipButtonPress = useCallback(async (): Promise<void> => {
        // 電池切れで同期できない場合は端末を落として、充電後の接続時に同期する
        if (AuroraManagerInstance.isBatteryLow()) {
            try {
                await AuroraManagerInstance.shutdown();
            } catch (e) {
                console.error("[useAwake] failed to shut down Aurora:", e);
            }
            AuroraManagerInstance.setSleepState(SleepStates.INIT);
            ConfirmDialog.show({
                title: Message.get(MessageKeys.aurora_wakeup_battery_low_title),
                message: Message.get(MessageKeys.aurora_wakeup_battery_low_message),
                isCancelable: false,
                onConfirm: () => navigate("Home"),
            });
            return;
        }

        LoadingDialog.show({
            dialogTitle: Message.get(MessageKeys.home_go_to_sleep_loading_message),
        });

        let syncResult: SessionSyncResult | undefined;
        try {
            const unsyncedSessions = await AuroraManagerInstance.getUnsyncedSessions();
            useSessionTransferStore.getState().setUnsyncedCount(unsyncedSessions.length);
            if (unsyncedSessions.length > 0) {
                syncResult = await AuroraManagerInstance.pushSessions(
                    unsyncedSessions,
                    userInfo?.id === GuestUser,
                );
                useSessionTransferStore
                    .getState()
                    .setUnsyncedCount(
                        Math.max(0, unsyncedSessions.length - syncResult.syncedCount),
                    );

                if (syncResult.sessions.length > 0) {
                    sessionList.unshift(...syncResult.sessions);
                    sessionDetailList.unshift(...syncResult.sessionDetails);
                    cacheSessions(sessionList);
                    cacheSessionDetails(sessionDetailList);
                    selectSession(syncResult.sessions[0]);
                }
            }
            AuroraManagerInstance.setSleepState(SleepStates.INIT);
        } finally {
            LoadingDialog.close();
        }

        showSyncSummary(syncResult);
        navigate("Home");
        if (syncResult !== undefined && syncResult.sessions.length > 0) {
            navigate("Sessions");
        }
    }, [
        cacheSessions,
        cacheSessionDetails,
        navigate,
        selectSession,
        sessionDetailList,
        sessionList,
        userInfo?.id,
    ]);
    return { questionnaireButtonPress, skipButtonPress };
};
//#endregion
