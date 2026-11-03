//#region Import Modules
import React, { type FunctionComponent } from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import { Switch } from "react-native-paper";

import { Colors, Message, MessageKeys } from "../../../constants";
import { MenuContainer } from "../../atoms/MenuContainer";
//#endregion

//#region Types
export type SessionDetailsMenuProps = {
    isFilterEnabled: boolean;
    showTimeline: boolean;
    showStimEvents: boolean;
    showAwakeningEvents: boolean;
    showButtonEvents: boolean;
    onFilterToggle: () => void;
    onTimelineToggle: () => void;
    onStimEventsToggle: () => void;
    onAwakeningEventsToggle: () => void;
    onButtonEventsToggle: () => void;
    containerStyle?: ViewStyle;
};
//#endregion

//#region Component
export const SessionDetailsMenu: FunctionComponent<SessionDetailsMenuProps> = (
    props: SessionDetailsMenuProps,
) => {
    const rows = [
        {
            key: MessageKeys.session_detail_filter_data,
            testId: "filter-data",
            value: props.isFilterEnabled,
            onToggle: props.onFilterToggle,
            disabled: false,
        },
        {
            key: MessageKeys.session_detail_show_timeline,
            testId: "timeline",
            value: props.showTimeline,
            onToggle: props.onTimelineToggle,
            disabled: false,
        },
        {
            key: MessageKeys.session_detail_show_stim_events,
            testId: "stim-events",
            value: props.showStimEvents,
            onToggle: props.onStimEventsToggle,
            disabled: !props.showTimeline,
        },
        {
            key: MessageKeys.session_detail_show_awakening_events,
            testId: "awakening-events",
            value: props.showAwakeningEvents,
            onToggle: props.onAwakeningEventsToggle,
            disabled: !props.showTimeline,
        },
        {
            key: MessageKeys.session_detail_show_button_events,
            testId: "button-events",
            value: props.showButtonEvents,
            onToggle: props.onButtonEventsToggle,
            disabled: !props.showTimeline,
        },
    ];

    return (
        <MenuContainer style={[styles.container, props.containerStyle]}>
            {rows.map((row) => (
                <View key={row.key} style={styles.row}>
                    <Text style={[styles.label, row.disabled ? styles.disabled : undefined]}>
                        {Message.get(row.key)}
                    </Text>
                    <Switch
                        testID={`session-details-${row.testId}`}
                        value={row.value}
                        disabled={row.disabled}
                        onValueChange={(): void => {
                            if (!row.disabled) row.onToggle();
                        }}
                    ></Switch>
                </View>
            ))}
        </MenuContainer>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    container: {
        flex: 0,
        paddingTop: 4,
        paddingBottom: 4,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 2,
        paddingBottom: 2,
    },
    label: {
        color: Colors.white,
        fontSize: 13,
    },
    disabled: {
        color: Colors.gray,
    },
});
//#endregion
