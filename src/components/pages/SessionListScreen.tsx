//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import React, { FunctionComponent, useLayoutEffect } from "react";

import { useSessinList } from "../../hooks/useSessionList";
import { FilterByDateValues } from "../../state/SessionState";
import { FilterIcon, RefreshIcon } from "../molecules";
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
            picker={{
                selectedValue: sessionListHook.filterCondition.byDate,
                onValueChange: sessionListHook.onPickerValueChange,
            }}
            anyTimePickerItem={{
                value: FilterByDateValues.ANY_TIME,
            }}
            pastWeekPickerItem={{
                value: FilterByDateValues.PAST_WEEK,
            }}
            pastMonthPickerItem={{
                value: FilterByDateValues.PAST_MONTH,
            }}
            showStarredCheckBox={{
                status: sessionListHook.filterCondition.showStarred
                    ? "checked"
                    : "unchecked",
                onPress: sessionListHook.onShowStarredPress,
            }}
            showNoteCheckBox={{
                status: sessionListHook.filterCondition.showNotes
                    ? "checked"
                    : "unchecked",
                onPress: sessionListHook.onShowNotesPress,
            }}
            sessionList={sessionListHook.sessionList}
            onStarPress={sessionListHook.onStarPress}
            onDeletePress={sessionListHook.onDeletePress}
            onMenuPress={sessionListHook.onMenuPress}
        ></SessionListScreenTemplate>
    );
};
//#endregion
