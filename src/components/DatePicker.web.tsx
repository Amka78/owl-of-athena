//#region Import Modules
import React, { FunctionComponent, useState } from "react";
import { Menu } from "react-native-paper";
import { DatePickerProps } from "./DatePickerProps";
import { TextBox } from "../components";
import Calendar from "rc-calendar";
import "rc-calendar/assets/index.css";
import moment from "moment";
import { TouchableOpacity } from "react-native-gesture-handler";
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
                if (date) {
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
