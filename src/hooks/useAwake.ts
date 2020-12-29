//#region Import Modules
import { useCallback } from "react";
import {
    useCheckLogging,
    useUserSelector,
    useSessionListSelector,
    useSessionDetailListSelector,
} from "./";
import { ConfirmDialog, LoadingDialog } from "../components";
import { SleepStates } from "../sdk";
import { useNavigation } from "react-navigation-hooks";
import { useDispatch } from "react-redux";
import { Message, MessageKeys } from "../constants";
import { AuroraManagerInstance } from "../managers";
import { cacheSessions, selectSession, cacheSessionDetails } from "../actions";
import { GuestUser } from "../types";
//#endregion

//#region Hooks
export const useAwake = (): {
    questionnaireButtonPress: () => void;
    skipButtonPress: () => Promise<void>;
} => {
    useCheckLogging();
    const dispatch = useDispatch();
    const { navigate } = useNavigation();
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
                dispatch(cacheSessions(sessionList));
                dispatch(cacheSessionDetails(sessionDetailList));
                dispatch(selectSession(pushedSession[0][0]));
            }
            AuroraManagerInstance.setSleepState(SleepStates.INIT);
            navigate("Home");
        } finally {
            LoadingDialog.close();
        }
    }, []);
    return { questionnaireButtonPress, skipButtonPress };
};
//#endregion
