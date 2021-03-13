//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import React, { FunctionComponent, useLayoutEffect } from "react";

import { useSessinList } from "../../hooks/sessions/useSessionList";
import { FilterByDateValues } from "../../state/SessionState";
import { FilterIcon, RefreshIcon } from "../atoms";
import { SessionListScreenTemplate } from "./../templates/SessionListScreenTemplate";
//#endregion

//#region Component
export const SessionListScreen: FunctionComponent = () => {
    const sessionListHook = useSessinList();
    const { setOptions } = useNavigation();

    useLayoutEffect(() => {
        setOptions({
            headerLeft: () => {
                return (
                    <RefreshIcon
                        onPress={sessionListHook.onRefreshPress}
                    ></RefreshIcon>
                );
            },
            headerRight: (props: StackHeaderLeftButtonProps) => {
                return (
                    <FilterIcon
                        {...props}
                        onPress={sessionListHook.onFilterPress}
                    ></FilterIcon>
                );
            },
        });
    }, [
        sessionListHook.onFilterPress,
        sessionListHook.onRefreshPress,
        setOptions,
    ]);
    return (
        <SessionListScreenTemplate
            showFilter={sessionListHook.showFilter}
            filterMenuProps={{
                anyTimePickerValue: FilterByDateValues.ANY_TIME,
                pastWeekPickerValue: FilterByDateValues.PAST_WEEK,
                pastMonthPickerValue: FilterByDateValues.PAST_MONTH,
                showStarredCheckBoxStatus: sessionListHook.filterCondition
                    .showStarred
                    ? "checked"
                    : "unchecked",

                onShowStarredCheckBoxPress: sessionListHook.onShowStarredPress,
                showNoteCheckBoxStatus: sessionListHook.filterCondition
                    .showNotes
                    ? "checked"
                    : "unchecked",
                selectedPickerValue: sessionListHook.filterCondition.byDate,
                onPickerValueChange: sessionListHook.onPickerValueChange,
                onShowNoteCheckBoxPress: sessionListHook.onShowNotesPress,
            }}
            sessionList={sessionListHook.sessionList}
            onStarPress={sessionListHook.onStarPress}
            onDeletePress={sessionListHook.onDeletePress}
            onMenuPress={sessionListHook.onMenuPress}
        ></SessionListScreenTemplate>
    );
};
//#endregion
