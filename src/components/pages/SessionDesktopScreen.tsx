//#region Import Modules
import React, { FunctionComponent } from "react";

import { useSessinList } from "../../hooks/sessions/useSessionList";
import { FilterByDateValues } from "../../state/SessionState";
import { SessionDesktopScreenTemplate } from "./../templates/SessionDesktopScreenTemplate";
//#endregion

//#region Component
export const SessionDesktopScreen: FunctionComponent = () => {
    const sessionListHook = useSessinList();

    return (
        <SessionDesktopScreenTemplate
            onFilterPress={sessionListHook.onFilterPress}
            onRefreshPress={sessionListHook.onRefreshPress}
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
            selected={sessionListHook.selectedSession}
            onStarPress={sessionListHook.onStarPress}
            onDeletePress={sessionListHook.onDeletePress}
            onMenuPress={sessionListHook.onMenuPress}
        ></SessionDesktopScreenTemplate>
    );
};
//#endregion
