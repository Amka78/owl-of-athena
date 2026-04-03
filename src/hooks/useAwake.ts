//#region Import Modules
import { useCallback } from "react";
import {
    useCheckLogging,
    useUserSelector,
    useSessionListSelector,
    useSessionDetailListSelector,
} from "./";
import { ConfirmDialog, LoadingDialog } from "../components/molecules";
import { SleepStates } from "../sdk";
import { useNavigation } from "@react-navigation/native";
import { useSessionStore } from "../store/sessionStore";
import { Message, MessageKeys } from "../constants";
import { AuroraManagerInstance } from "../managers";
import { GuestUser } from "../types";
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
        ConfirmDialog.show({
            title: Message.get(MessageKeys.wip_dialog_title),
            message: Message.get(MessageKeys.wip_dialog_message),
            isCancelable: false,
        });
    }, []);

    const skipButtonPress = useCallback(async (): Promise<void> => {
        LoadingDialog.show({
            dialogTitle: Message.get(
                MessageKeys.home_go_to_sleep_loading_message
            ),
        });
        try {
            const unsyncedSession = await AuroraManagerInstance.getUnsyncedSessions();

            if (unsyncedSession.length > 0) {
                const pushedSession = await AuroraManagerInstance.pushSessions(
                    unsyncedSession,
                    userInfo?.id === GuestUser
                );

                sessionList.unshift(...pushedSession[0]);
                sessionDetailList.unshift(...pushedSession[1]);
                cacheSessions(sessionList);
                cacheSessionDetails(sessionDetailList);
                selectSession(pushedSession[0][0]);
            }
            AuroraManagerInstance.setSleepState(SleepStates.INIT);
            navigate("Home");
        } finally {
            LoadingDialog.close();
        }
    }, [cacheSessions, cacheSessionDetails, navigate, selectSession, sessionDetailList, sessionList, userInfo?.id]);
    return { questionnaireButtonPress, skipButtonPress };
};
//#endregion
