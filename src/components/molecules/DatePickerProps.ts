import { ViewStyle } from "react-native";

export type DatePickerProps = {
    label?: string;
    selected?: Date;
    format?: string;
    onChange?: (date: Date) => void;
    style?: ViewStyle;
    maxWidth?: number;
};
