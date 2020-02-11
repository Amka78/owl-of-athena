import React, { FunctionComponent } from "react";
import ReactDatePicker from "react-datepicker";
import * as Localization from "expo-localization";
import "react-datepicker/dist/react-datepicker.css";

type DatePickerProps = {
    label?: string;
    selected?: Date;
    onChange: (date: Date) => {};
};

export const DatePicker: FunctionComponent<DatePickerProps> = (
    props: DatePickerProps
) => {
    return (
        <ReactDatePicker
            selected={props.selected}
            onChange={props.onChange}
            locale={Localization.locale}
        ></ReactDatePicker>
    );
};
