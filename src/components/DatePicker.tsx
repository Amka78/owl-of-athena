import React, { FunctionComponent } from "react";
import { DatePickerAndroid, View } from "react-native";

import { TextBox } from "./TextBox";
import { DatePickerProps } from "./DatePickerProps";

export const DatePicker: FunctionComponent<DatePickerProps> = (
    props: DatePickerProps
) => {
    return (
        <TextBox
            onFocus={() => {
                console.log(props);
                DatePickerAndroid.open({
                    date: new Date(),
                    mode: "calendar",
                });
            }}
        ></TextBox>
    );
};
