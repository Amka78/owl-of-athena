import React, { FunctionComponent } from "react";
import { DatePickerAndroid, View } from "react-native";

import { TextBox } from "./TextBox";
import { DatePickerProps } from "./DatePickerProps";

export const DatePicker: FunctionComponent<DatePickerProps> = (
    props: DatePickerProps
) => {
    return (
        <View>
            <TextBox
                onFocus={() => {
                    DatePickerAndroid.open({
                        date: new Date(),
                        mode: "calendar"
                    });
                }}
            ></TextBox>
        </View>
    );
};
