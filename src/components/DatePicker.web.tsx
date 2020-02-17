import React, { FunctionComponent } from "react";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import * as Localization from "expo-localization";
import "react-datepicker/dist/react-datepicker.css";
import { DatePickerProps } from "./DatePickerProps";
import en from "date-fns/locale/en-US";
import ja from "date-fns/locale/ja";
registerLocale("en", en);
registerLocale("ja", ja);

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
