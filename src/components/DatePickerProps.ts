export type DatePickerProps = {
    label?: string;
    selected?: Date;
    format?: string;
    onChange: (date: Date) => void;
};
