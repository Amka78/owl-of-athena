import React, { FunctionComponent } from "react";
import { DatePickerAndroid, View } from "react-native";

import { TextBox } from "./TextBox";

type DatePickerProps = { label?: string };

export const DatePicker: FunctionComponent<DatePickerProps> = (
    props: DatePickerProps
) => {
    return (
        <View>
            <TextBox
                {...props}
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
