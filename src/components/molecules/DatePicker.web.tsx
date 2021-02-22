//#region Import Modules
import "rc-calendar/assets/index.css";

import moment from "moment";
import Calendar from "rc-calendar";
import React, { FunctionComponent, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Menu } from "react-native-paper";

import { TextBox } from "../atoms";
import { DatePickerProps } from "./DatePickerProps";
//#endregion

//#region Component
export const DatePicker: FunctionComponent<DatePickerProps> = (
    props: DatePickerProps
) => {
    const selectedDate = moment(props.selected);
    const calendar = (
        <Calendar
            style={{ zIndex: 1001 }}
            defaultValue={selectedDate}
            showDateInput={false}
            onChange={(date: moment.Moment | null): void => {
                if (date && props.onChange) {
                    props.onChange(date.toDate());
                }
            }}
            showOk={true}
            onOk={(): void => {
                setShowCalendar(false);
            }}
        />
    );
    const [showCalendar, setShowCalendar] = useState(false);
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
