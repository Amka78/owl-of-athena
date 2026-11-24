//#region Import Modules
import DateTimePicker from "@react-native-community/datetimepicker";
import { type FunctionComponent, useCallback, useState } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import dayjs, { type Dayjs } from "../../utils/dayjs";
import { TextBox } from "../ui/TextBox";
import type { DatePickerProps } from "./DatePickerProps";
//#endregion

//#region Component
export const DatePicker: FunctionComponent<DatePickerProps> = (props: DatePickerProps) => {
    const [date, setDate] = useState<Dayjs | undefined>(
        props.selected ? dayjs(props.selected) : undefined,
    );
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);

    const showDate = date ? (props.format ? date.format(props.format) : date.toString()) : "";
    const onFocus = useCallback(() => {
        setShowDateTimePicker(true);
    }, []);

    const onBlur = useCallback(() => {
        if (showDateTimePicker) {
            setShowDateTimePicker(false);
        }
    }, [showDateTimePicker]);

    const onChange = useCallback(
        (event: Event, selectedDate?: Date) => {
            console.debug(`event:${event}`);
            setShowDateTimePicker(false);
            if (selectedDate) {
                setDate(dayjs(selectedDate));
                props.onChange?.(selectedDate);
            }
        },
        [props.onChange],
    );

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
                        value={date?.toDate() ?? new Date()}
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
