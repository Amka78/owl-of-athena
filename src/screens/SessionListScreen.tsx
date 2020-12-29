//#region Import Modules
import React, { FunctionComponent } from "react";

import { Message, MessageKeys } from "../constants";
import { useSessinList } from "../hooks/useSessionList";
import { FilterByDateValues } from "../state/SessionState";
import { SessionListScreenTemplate } from "./templates/SessionListScreenTemplate";
//#endregion

//#region Component
export const SessionListScreen: FunctionComponent = () => {
    const sessionListHook = useSessinList();

    return (
        <SessionListScreenTemplate
            showFilter={sessionListHook.showFilter}
            filterByDateLabel={{
                children: Message.get(
                    MessageKeys.sessions_filter_by_date_label
                ),
            }}
            picker={{
                selectedValue: sessionListHook.filterCondition.byDate,
                onValueChange: sessionListHook.onPickerValueChange,
            }}
            anyTimePickerItem={{
                label: Message.get(MessageKeys.sessions_picker_values_any_time),
                value: FilterByDateValues.ANY_TIME,
            }}
            pastWeekPickerItem={{
                label: Message.get(
                    MessageKeys.sessions_picker_values_past_week
                ),
                value: FilterByDateValues.PAST_WEEK,
            }}
            pastMonthPickerItem={{
                label: Message.get(
                    MessageKeys.sessions_picker_values_past_month
                ),
                value: FilterByDateValues.PAST_MONTH,
            }}
            showStarredCheckBox={{
                status: sessionListHook.filterCondition.showStarred
                    ? "checked"
                    : "unchecked",
                label: Message.get(
                    MessageKeys.sessions_check_show_starred_label
                ),
                onPress: sessionListHook.onShowStarredPress,
            }}
            showNoteCheckBox={{
                status: sessionListHook.filterCondition.showNotes
                    ? "checked"
                    : "unchecked",
                label: Message.get(MessageKeys.sessions_check_show_notes_label),
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
