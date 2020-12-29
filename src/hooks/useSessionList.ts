//#region Import Modules
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useNavigation } from "react-navigation-hooks";
import { useDispatch } from "react-redux";

import {
    cacheSessions,
    deleteSession,
    selectSession,
    selectSessionDetail,
    updateFilter,
    updateSession,
} from "../actions/SessionsActions";
import { SessionRestClientInstance } from "../clients";
import { ConfirmDialog, LoadingDialog } from "../components";
import { Message, MessageKeys } from "../constants";
import { AuroraManagerInstance } from "../managers";
import { AuroraSessionJson } from "../sdk/AuroraTypes";
import { AuroraSession, AuroraSessionDetail } from "../sdk/models";
import { FilterByDateValues, FilterCondition } from "../state/SessionState";
import { GuestUser } from "../types";
import {
    useFilterConditionSelector,
    useFilteredSessionListSelector,
    useSessionDetailListSelector,
    useTokenSelector,
    useUserSelector,
} from "./";
//#endregion

//#region Hooks
export const useSessinList = (): {
    showFilter: boolean;
    filterCondition: FilterCondition;
    onPickerValueChange: (itemValue: FilterByDateValues) => void;
    onShowStarredPress: () => void;
    onShowNotesPress: () => void;
    sessionList: AuroraSession[];
    onStarPress: (value: AuroraSession) => Promise<void>;
    onDeletePress: (value: AuroraSession) => Promise<void>;
    onMenuPress: (value: AuroraSession, index: number) => Promise<void>;
} => {
    const dispatch = useDispatch();
    const user = useUserSelector();
    const filterCondition = useFilterConditionSelector();
    const sessionList = useFilteredSessionListSelector();
    const sessionDetailList = useSessionDetailListSelector();
    const { navigate, setParams } = useNavigation();
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const token = useTokenSelector();
    useEffect(() => {
        if (!token) {
            navigate("Welcome");
        }
        setParams({
            onPressedRefresh: async () => {
                LoadingDialog.show({
                    dialogTitle: Message.get(MessageKeys.session_reloading),
                });
                const sessions = await SessionRestClientInstance.getAll(
                    user!.id
                );
                dispatch(cacheSessions(sessions));
                LoadingDialog.close();
            },
            onPressedFilter: async () => {
                setShowFilter(!showFilter);
            },
        });
        const cleanup = (): void => {
            return;
        };
        return cleanup;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showFilter]);

    const onPickerValueChange = useCallback(
        (itemValue: FilterByDateValues): void => {
            dispatch(updateFilter({ byDate: itemValue }));
        },
        [dispatch]
    );

    const onShowStarredPress = useCallback((): void => {
        dispatch(
            updateFilter({
                showStarred: !filterCondition.showStarred,
            })
        );
    }, [dispatch, filterCondition.showStarred]);

    const onShowNotesPress = useCallback((): void => {
        dispatch(
            updateFilter({
                showNotes: !filterCondition.showNotes,
            })
        );
    }, [dispatch, filterCondition.showNotes]);

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
            dispatch(updateSession(value));
        },
        [dispatch, user?.id]
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
            dispatch(deleteSession(value.id));
        },
        [dispatch, user?.id]
    );

    const onDeletePress = useCallback(
        async (value: AuroraSession): Promise<void> => {
            ConfirmDialog.show({
                title: Message.get(MessageKeys.delete_dialog_title),

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
            dispatch(selectSession(value));

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

            dispatch(selectSessionDetail(sessionDetail));

            navigate("Detail", {
                sessionIndex: index,
                sessionTitle: moment(value.sessionAt).format(
                    Message.get(MessageKeys.date_format)
                ),
            });
        },
        [dispatch, navigate, sessionDetailList, user?.id]
    );
    return {
        showFilter,
        filterCondition,
        onPickerValueChange,
        onShowStarredPress,
        onShowNotesPress,
        sessionList,
        onStarPress,
        onDeletePress,
        onMenuPress,
    };
};
//#endregion
