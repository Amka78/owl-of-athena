import React, { FunctionComponent } from "react";
import {
    Button,
    StandardView,
    ContentTitle,
    ContentText,
    ConfirmDialog,
    LoadingDialog
} from "../components";

import { useNavigation } from "react-navigation-hooks";
import { useCheckLogging, useSessionListSelector } from "../hooks";
import { MessageKeys } from "../constants";
import { AuroraManagerInstance } from "../managers";
import { useDispatch } from "react-redux";
import { cacheSessions, selectSession } from "../actions";
import { SleepStates } from "../sdk/AuroraConstants";
export const AwakeScreen: FunctionComponent = () => {
    useCheckLogging();
    const dispatch = useDispatch();
    const { navigate } = useNavigation();
    const sessionList = useSessionListSelector();
    return (
        <StandardView>
            <ContentTitle>{{ key: MessageKeys.awake_title }}</ContentTitle>
            <ContentText>{{ key: MessageKeys.awake_text }}</ContentText>
            <Button
                onPress={(): void => {
                    ConfirmDialog.show({
                        title: { key: MessageKeys.wip_dialog_title },
                        message: { key: MessageKeys.wip_dialog_message },
                        isCancelable: false
                    });
                }}
            >
                {{ key: MessageKeys.awake_questionnaire_continue_button }}
            </Button>
            <Button
                onPress={async (): Promise<void> => {
                    LoadingDialog.show({
                        dialogTitle: {
                            key: MessageKeys.home_go_to_sleep_loading_message
                        }
                    });
                    try {
                        const unsyncedSession = await AuroraManagerInstance.getUnsyncedSessions();

                        if (unsyncedSession.length > 0) {
                            const pushedSession = await AuroraManagerInstance.pushSessions(
                                unsyncedSession
                            );

                            sessionList.unshift(...pushedSession);
                            dispatch(cacheSessions(sessionList));
                            dispatch(selectSession(pushedSession[0]));
                        }
                        AuroraManagerInstance.setSleepState(SleepStates.INIT);
                        navigate("Home");
                    } finally {
                        LoadingDialog.close();
                    }
                }}
            >
                {{ key: MessageKeys.awake_questionnaire_skip_button }}
            </Button>
        </StandardView>
    );
};
