//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import type { NativeStackHeaderItemProps } from "@react-navigation/native-stack";
import React, { type FunctionComponent, useLayoutEffect } from "react";

import { useSessinList } from "../../hooks/sessions/useSessionList";
import { FilterByDateValues } from "../../store/sessionStore";
import { FilterIcon, RefreshIcon } from "../atoms";
import { SessionListScreenTemplate } from "./../templates/SessionListScreenTemplate";
//#endregion

//#region Component
export const SessionListScreen: FunctionComponent = () => {
    const sessionListHook = useSessinList();
    const { setOptions } = useNavigation<any>();

    useLayoutEffect(() => {
        setOptions({
            headerLeft: () => {
                return <RefreshIcon onPress={sessionListHook.onRefreshPress}></RefreshIcon>;
            },
            headerRight: (props: NativeStackHeaderItemProps) => {
                return <FilterIcon {...props} onPress={sessionListHook.onFilterPress}></FilterIcon>;
            },
        });
    }, [sessionListHook.onFilterPress, sessionListHook.onRefreshPress, setOptions]);
    return (
        <SessionListScreenTemplate
            showFilter={sessionListHook.showFilter}
            filterMenuProps={{
                anyTimePickerValue: FilterByDateValues.ANY_TIME,
                pastWeekPickerValue: FilterByDateValues.PAST_WEEK,
                pastMonthPickerValue: FilterByDateValues.PAST_MONTH,
                showStarredCheckBoxStatus: sessionListHook.filterCondition.showStarred
                    ? "checked"
                    : "unchecked",

                onShowStarredCheckBoxPress: sessionListHook.onShowStarredPress,
                showNoteCheckBoxStatus: sessionListHook.filterCondition.showNotes
                    ? "checked"
                    : "unchecked",
                selectedPickerValue: sessionListHook.filterCondition.byDate,
                onPickerValueChange: sessionListHook.onPickerValueChange as (
                    itemValue: string | number,
                ) => void,
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
