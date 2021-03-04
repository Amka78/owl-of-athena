//#region Import Modules
import moment from "moment";
import React, { FunctionComponent, useState } from "react";
import {
    LayoutChangeEvent,
    Picker,
    PickerProps,
    Platform,
    StyleSheet,
    Text,
    TextProps,
    View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { IconButton, List } from "react-native-paper";

import { StandardView } from "../atoms";
import { LabeledCheckBox, LabeledCheckBoxProps } from "../molecules";
import { ChartRadialProgress } from "../charts";
import { Colors, Message, MessageKeys } from "../../constants";
import { AuroraSession } from "../../sdk/models";
import { TemplatePickerItemProps } from "./TempatedProps";
import { useLocale, useScreenDimensions } from "../../hooks";
//#endregion

//#region Types
export type ListItemProps = {
    color: string;
    style: {
        marginLeft?: number;
        marginRight: number;
        marginVertical?: number;
    };
};

export type SessionListScreenTemplateProps = {
    showFilter: boolean;
    filterByDateLabel?: TextProps & { children: string };
    picker: PickerProps;
    anyTimePickerItem: TemplatePickerItemProps;
    pastWeekPickerItem: TemplatePickerItemProps;
    pastMonthPickerItem: TemplatePickerItemProps;
    showStarredCheckBox: LabeledCheckBoxProps;
    showNoteCheckBox: LabeledCheckBoxProps;
    sessionList?: AuroraSession[];
    onStarPress: (value: AuroraSession) => Promise<void>;
    onDeletePress: (value: AuroraSession) => Promise<void>;
    onMenuPress: (value: AuroraSession, index: number) => Promise<void>;
    locale?: string;
};
//#endregion

//#region Component
export const SessionListScreenTemplate: FunctionComponent<SessionListScreenTemplateProps> = (
    props: SessionListScreenTemplateProps
) => {
    useLocale(props.locale);

    const screenDimens = useScreenDimensions();
    let menu = undefined;
    if (props.showFilter) {
        menu = (
            <View style={[styles.menuContainer, { width: screenDimens.width }]}>
                <View style={styles.pickerContainer}>
                    <Text
                        {...props.filterByDateLabel}
                        style={styles.filterByDateLabel}
                    >
                        {Message.get(MessageKeys.sessions_filter_by_date_label)}
                    </Text>
                    <Picker
                        {...props.picker}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                    >
                        <Picker.Item
                            {...props.anyTimePickerItem}
                            label={Message.get(
                                MessageKeys.sessions_picker_values_any_time
                            )}
                        ></Picker.Item>
                        <Picker.Item
                            {...props.pastWeekPickerItem}
                            label={Message.get(
                                MessageKeys.sessions_picker_values_past_week
                            )}
                        ></Picker.Item>
                        <Picker.Item
                            {...props.pastMonthPickerItem}
                            label={Message.get(
                                MessageKeys.sessions_picker_values_past_month
                            )}
                        ></Picker.Item>
                    </Picker>
                </View>
                <LabeledCheckBox
                    {...props.showStarredCheckBox}
                    labelPlace={"right"}
                    container={styles.showStarredContainer}
                    label={Message.get(
                        MessageKeys.sessions_check_show_starred_label
                    )}
                    labelStyle={styles.showStarredLabel}
                    descriptionStyle={styles.showStarredDescription}
                ></LabeledCheckBox>
                <LabeledCheckBox
                    {...props.showNoteCheckBox}
                    labelPlace={"right"}
                    container={styles.showNotesContainer}
                    label={Message.get(
                        MessageKeys.sessions_check_show_notes_label
                    )}
                    labelStyle={styles.showNotesLabel}
                    descriptionStyle={styles.showNotesDescription}
                ></LabeledCheckBox>
            </View>
        );
    }
    return props.sessionList ? (
        <StandardView
            standardViewStyle={styles.standardView}
            onLayout={screenDimens.onLayout}
        >
            {props.showFilter ? menu : undefined}
            <ScrollView style={{ flex: 1 }}>
                <List.Section style={{ flex: 1 }}>
                    {props.sessionList.map(
                        (value: AuroraSession, index: number) => {
                            const sessionAt = moment(value.sessionAt);
                            return (
                                <List.Item
                                    key={value.id}
                                    left={(
                                        props: ListItemProps
                                    ): React.ReactNode => (
                                        <ChartRadialProgress
                                            width={38}
                                            height={38}
                                            value={
                                                value.sleepScore == 117
                                                    ? 72
                                                    : value.sleepScore
                                            }
                                            fgColor={Colors.teal}
                                            bgColor={props.color}
                                            valueLabel={String(
                                                value.sleepScore == 117
                                                    ? 72
                                                    : value.sleepScore
                                            )}
                                        />
                                    )}
                                    right={(
                                        rightProps: unknown
                                    ): React.ReactNode => (
                                        <View
                                            {...rightProps}
                                            style={styles.starIconContainer}
                                        >
                                            <IconButton
                                                icon={
                                                    value.starred
                                                        ? "star"
                                                        : "star-outline"
                                                }
                                                size={25}
                                                color={Colors.white}
                                                onPress={async () => {
                                                    await props.onStarPress(
                                                        value
                                                    );
                                                }}
                                            ></IconButton>
                                            <IconButton
                                                icon={"delete"}
                                                size={25}
                                                color={Colors.white}
                                                onPress={async () => {
                                                    await props.onDeletePress(
                                                        value
                                                    );
                                                }}
                                            ></IconButton>
                                        </View>
                                    )}
                                    titleStyle={styles.menuLabel}
                                    title={sessionAt.format("dddd")}
                                    description={sessionAt.format(
                                        Message.get(MessageKeys.date_format)
                                    )}
                                    descriptionStyle={styles.menuDescription}
                                    style={{ width: screenDimens.width }}
                                    onPress={async () => {
                                        props.onMenuPress(value, index);
                                    }}
                                ></List.Item>
                            );
                        }
                    )}
                </List.Section>
            </ScrollView>
        </StandardView>
    ) : null;
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
    menuContainer: {
        backgroundColor: Colors.purple,
        flex: Platform.OS !== "web" ? 0.4 : undefined,
    },
    pickerContainer: {
        flex: 1,
        marginTop: 4,
        marginLeft: 20,
        marginRight: 20,
    },
    filterByDateLabel: {
        color: Colors.cyan,
        fontSize: 13,
    },
    picker: {
        backgroundColor: Colors.purple,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomColor: Colors.cyan,
    },
    pickerItem: {
        textDecorationColor: Colors.white,
        borderColor: Colors.white,
    },
    showStarredContainer: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 4,
    },
    showStarredLabel: { color: Colors.white, marginBottom: 0 },
    showStarredDescription: {
        color: Colors.gray,
        fontSize: 10,
    },
    showNotesContainer: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 4,
    },
    showNotesDescription: {
        color: Colors.gray,
        fontSize: 10,
    },
    showNotesLabel: { color: Colors.white, marginBottom: 0 },
    menuLabel: { color: Colors.white },
    menuDescription: { color: Colors.gray },
    starIconContainer: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    standardView: { justifyContent: "flex-start" },
});
//#endregion
