import { MessageLocalizationParam } from "../constants/Message";

export type DatePickerProps = {
    label?: MessageLocalizationParam;
    selected?: Date;
    format?: string;
    onChange: (date: Date) => void;
};
