//#region Import Modules
import "react-calendar/dist/Calendar.css";

import React, { type FunctionComponent, useState } from "react";
import Calendar from "react-calendar";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Menu } from "react-native-paper";

import dayjs from "../../utils/dayjs";
import { TextBox } from "../ui";
import type { DatePickerProps } from "./DatePickerProps";
//#endregion

//#region Component
export const DatePicker: FunctionComponent<DatePickerProps> = (props: DatePickerProps) => {
    const selectedDate = props.selected !== undefined ? dayjs(props.selected) : dayjs();
    const [showCalendar, setShowCalendar] = useState(false);

    const calendar = (
        <Calendar
            value={props.selected}
            onChange={(value) => {
                // selectRange 無効時は単一 Date が渡るが、Array の場合も耐える
                const date = Array.isArray(value) ? value[0] : value;
                if (date && props.onChange) {
                    props.onChange(date);
                }
                setShowCalendar(false);
            }}
        />
    );

    return (
        <Menu
            anchor={
                <TouchableOpacity
                    onPress={(): void => {
                        setShowCalendar(true);
                    }}
                >
                    <TextBox
                        label={props.label}
                        value={
                            props.format
                                ? selectedDate.format(props.format)
                                : selectedDate.toString()
                        }
                        editable={false}
                        style={props.style}
                        maxWidth={props.maxWidth}
                    ></TextBox>
                </TouchableOpacity>
            }
            onDismiss={(): void => {
                setShowCalendar(false);
            }}
            visible={showCalendar}
        >
            {calendar}
        </Menu>
    );
};
//#endregion
