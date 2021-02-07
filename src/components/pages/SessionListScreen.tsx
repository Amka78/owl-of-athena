//#region Import Modules
import { useNavigation } from "@react-navigation/native";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import React, { FunctionComponent, useLayoutEffect } from "react";
import { IconButton } from "react-native-paper";

import { Colors } from "../../constants";
import { useSessinList } from "../../hooks/useSessionList";
import { FilterByDateValues } from "../../state/SessionState";
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
                    <IconButton
                        icon={"refresh"}
                        size={40}
                        color={Colors.white}
                        onPress={sessionListHook.onPressedRefresh}
                    ></IconButton>
                );
            },
            headerRight: (props: StackHeaderLeftButtonProps) => {
                return (
                    <IconButton
                        {...props}
                        icon={"filter-variant"}
                        size={40}
                        color={Colors.white}
                        onPress={sessionListHook.onPressedFilter}
                    ></IconButton>
                );
            },
        });
    }, [
        sessionListHook.onPressedFilter,
        sessionListHook.onPressedRefresh,
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
