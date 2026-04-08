//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";

import {
    useCheckLogging,
    useFilterConditionSelector,
    useSessionDetailListSelector,
    useUserSelector,
    useWindowDimensions,
} from "..";
import { SessionRestClientInstance } from "../../clients";
import { ConfirmDialog, LoadingDialog } from "../../components/molecules";
import { Message, MessageKeys } from "../../constants";
import { AuroraManagerInstance } from "../../managers";
import type { AuroraSessionJson } from "../../sdk/AuroraTypes";
import { AuroraSession, AuroraSessionDetail } from "../../sdk/models";
import { useSessionStore, SessionFilterCondition, FilterByDateValues } from "../../store/sessionStore";
import { GuestUser } from "../../types";
import { useFilteredSessionListSelector, useSelectedSessionSelector } from "./";
//#endregion

//#region Hooks
export const useSessinList = (): {
    showFilter: boolean;
    filterCondition: SessionFilterCondition;
    onPickerValueChange: (itemValue: FilterByDateValues) => void;
    onShowStarredPress: () => void;
    onShowNotesPress: () => void;
    sessionList: AuroraSession[];
    selectedSession?: AuroraSession;
    onStarPress: (value: AuroraSession) => Promise<void>;
    onDeletePress: (value: AuroraSession) => Promise<void>;
    onMenuPress: (value: AuroraSession, index: number) => Promise<void>;
    onRefreshPress: () => void;
    onFilterPress: () => void;
} => {
    const {
        cacheSessions,
        deleteSession,
        selectSession,
        selectSessionDetail,
        updateFilter,
        updateSession,
    } = useSessionStore();
    const user = useUserSelector();
    const filterCondition = useFilterConditionSelector();
    const sessionList = useFilteredSessionListSelector();
    const sessionDetailList = useSessionDetailListSelector();
    const selectedSession = useSelectedSessionSelector();
    const { navigate } = useNavigation<any>();
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const dimens = useWindowDimensions();
    useCheckLogging();

    const onPressedRefresh = useCallback(async () => {
        LoadingDialog.show({
            dialogTitle: Message.get(MessageKeys.reloading, [
                MessageKeys.sessions,
            ]),
        });
        const sessions = await SessionRestClientInstance.getAll(user!.id);
        cacheSessions(sessions);
        LoadingDialog.close();
    }, [cacheSessions, user]);

    const onPressedFilter = useCallback(async () => {
        setShowFilter(!showFilter);
    }, [showFilter]);

    const onPickerValueChange = useCallback(
        (itemValue: FilterByDateValues): void => {
            updateFilter({ byDate: itemValue });
        },
        [updateFilter]
    );

    const onShowStarredPress = useCallback((): void => {
        updateFilter({
            showStarred: !filterCondition.showStarred,
        });
    }, [filterCondition.showStarred, updateFilter]);

    const onShowNotesPress = useCallback((): void => {
        updateFilter({
            showNotes: !filterCondition.showNotes,
        });
    }, [filterCondition.showNotes, updateFilter]);

    const onStarPress = useCallback(
        async (value: AuroraSession): Promise<void> => {
            const updateInfo: Partial<AuroraSessionJson> = {
                starred: !value.starred,
            };

            if (user?.id !== GuestUser) {
                await SessionRestClientInstance.updateById(
                    value.id,
                    updateInfo
                );
            }

            value.starred = !value.starred;
            updateSession(value);
        },
        [updateSession, user?.id]
    );

    const onDeleteConfirmPress = useCallback(
        async (value: AuroraSession) => {
            if (user?.id !== GuestUser) {
                await SessionRestClientInstance.deleteById(value.id);
            }

            if (AuroraManagerInstance.isConnected()) {
                try {
                    await AuroraManagerInstance.executeCommand(
                        `sd-dir-del sessions/${value.id}`
                    );
                } catch (e) {
                    console.error(e);
                }
            }
            deleteSession(value.id);
        },
        [deleteSession, user?.id]
    );

    const onDeletePress = useCallback(
        async (value: AuroraSession): Promise<void> => {
            ConfirmDialog.show({
                title: Message.get(MessageKeys.delete_dialog_title, [
                    MessageKeys.session,
                ]),

                message: Message.get(MessageKeys.delete_dialog_message),

                isCancelable: true,
                onConfirm: () => {
                    onDeleteConfirmPress(value);
                },
            });
        },
        [onDeleteConfirmPress]
    );

    const onMenuPress = useCallback(
        async (value: AuroraSession, index: number): Promise<void> => {
            selectSession(value);

            let sessionDetail;
            if (sessionDetailList.length > 0) {
                sessionDetail = sessionDetailList.find(
                    (detailValue: AuroraSessionDetail) => {
                        return detailValue.sessionId === value.id;
                    }
                );
            }

            if (!sessionDetail && user?.id !== GuestUser) {
                sessionDetail = await SessionRestClientInstance.getDetailsById(
                    value.id
                );
            }

            if (sessionDetail) {
                selectSessionDetail(sessionDetail);
            }

            if (!(dimens.isHorizontal && dimens.isDesktop)) {
                navigate("Detail", {
                    sessionIndex: index,
                });
            }
        },
        [
            dimens.isDesktop,
            dimens.isHorizontal,
            navigate,
            selectSession,
            selectSessionDetail,
            sessionDetailList,
            user?.id,
        ]
    );
    return {
        showFilter,
        filterCondition,
        onPickerValueChange,
        onShowStarredPress,
        onShowNotesPress,
        sessionList,
        selectedSession,
        onStarPress,
        onDeletePress,
        onMenuPress,
        onRefreshPress: onPressedRefresh,
        onFilterPress: onPressedFilter,
    };
};
//#endregion
