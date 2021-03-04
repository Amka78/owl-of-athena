//#region Import Modules
import React, { FunctionComponent } from "react";

import { useSessinList } from "../../hooks/useSessionList";
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
        ></SessionDesktopScreenTemplate>
    );
};
//#endregion
