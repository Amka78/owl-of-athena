//#region Import Modules
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import React, { FunctionComponent, useCallback, useState } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { TextBox } from "../atoms/TextBox";
import { DatePickerProps } from "./DatePickerProps";
//#endregion

//#region Component
export const DatePicker: FunctionComponent<DatePickerProps> = (
    props: DatePickerProps
) => {
    const [date, setDate] = useState(moment(props.selected));
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);

    const showDate = props.format ? date.format(props.format) : date.toString();
    const onFocus = useCallback(() => {
        setShowDateTimePicker(true);
    }, []);

    const onBlur = useCallback(() => {
        if (showDateTimePicker) {
            setShowDateTimePicker(false);
        }
    }, [showDateTimePicker]);

    const onChange = useCallback((event: Event, date?: Date) => {
        console.debug(`event:${event}`);
        setShowDateTimePicker(false);
        setDate(moment(date));
    }, []);

    return (
        <TouchableOpacity onPressIn={onFocus}>
            <View>
                <TextBox
                    label={props.label}
                    value={showDate}
                    editable={false}
                    onBlur={onBlur}
                ></TextBox>
                {showDateTimePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date.toDate()}
                        mode={"date"}
                        is24Hour={true}
                        display="default"
                        onChange={onChange as any}
                    ></DateTimePicker>
                )}
            </View>
        </TouchableOpacity>
    );
};
//#endregion
