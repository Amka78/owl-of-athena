//#region Import Modules
import { Picker } from "@react-native-community/picker";
import React, { FunctionComponent } from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";

import { Colors, Message, MessageKeys } from "../../../constants";
import { FilterByDateValues } from "../../../state/SessionState";
import { MenuContainer } from "../../atoms";
import { MenuCheckBox } from "../../molecules";
import { CheckBoxStatus } from "../../molecules/LabeledCheckBox";
//#endregion

//#region Types
export type SessionListMenuProps = {
    containerStyle?: ViewStyle;
    onPickerValueChange: (itemValue: React.ReactText) => void;
    selectedPickerValue: FilterByDateValues;
    anyTimePickerValue: FilterByDateValues;
    pastWeekPickerValue: FilterByDateValues;
    pastMonthPickerValue: FilterByDateValues;
    showStarredCheckBoxStatus: CheckBoxStatus;
    onShowStarredCheckBoxPress: () => void;
    showNoteCheckBoxStatus: CheckBoxStatus;
    onShowNoteCheckBoxPress: () => void;
};
//#endregion

//#region Component
export const SessionListMenu: FunctionComponent<SessionListMenuProps> = (
    props: SessionListMenuProps
) => {
    return (
        <MenuContainer style={props.containerStyle}>
            <View style={pickerContainer}>
                <Text style={filterByDateLabel}>
                    {Message.get(MessageKeys.sessions_filter_by_date_label)}
                </Text>
                <Picker
                    selectedValue={props.selectedPickerValue}
                    onValueChange={props.onPickerValueChange}
                    style={pickerStyle}
                    itemStyle={pickerItemStyle}
                >
                    <Picker.Item
                        value={props.anyTimePickerValue}
                        label={Message.get(
                            MessageKeys.sessions_picker_values_any_time
                        )}
                    ></Picker.Item>
                    <Picker.Item
                        value={props.pastWeekPickerValue}
                        label={Message.get(
                            MessageKeys.sessions_picker_values_past_week
                        )}
                    ></Picker.Item>
                    <Picker.Item
                        value={props.pastMonthPickerValue}
                        label={Message.get(
                            MessageKeys.sessions_picker_values_past_month
                        )}
                    ></Picker.Item>
                </Picker>
            </View>
            <MenuCheckBox
                container={props.containerStyle}
                status={props.showStarredCheckBoxStatus}
                onPress={props.onShowStarredCheckBoxPress}
                label={Message.get(
                    MessageKeys.sessions_check_show_starred_label
                )}
                description={Message.get(
                    MessageKeys.sessions_check_show_starred_description
                )}
            ></MenuCheckBox>
            <MenuCheckBox
                container={props.containerStyle}
                status={props.showNoteCheckBoxStatus}
                onPress={props.onShowNoteCheckBoxPress}
                label={Message.get(MessageKeys.sessions_check_show_notes_label)}
                description={Message.get(
                    MessageKeys.sessions_check_show_notes_description
                )}
            ></MenuCheckBox>
        </MenuContainer>
    );
};
//#endregion

//#region Styles
const pickerContainer: ViewStyle = {
    flex: 1,
    marginTop: 4,
    marginLeft: 20,
    marginRight: 20,
};

const filterByDateLabel: TextStyle = {
    color: Colors.cyan,
    fontSize: 13,
};

const pickerStyle: ViewStyle = {
    backgroundColor: Colors.purple,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomColor: Colors.cyan,
};

const pickerItemStyle: TextStyle = {
    textDecorationColor: Colors.white,
    borderColor: Colors.white,
};
//#endregion
