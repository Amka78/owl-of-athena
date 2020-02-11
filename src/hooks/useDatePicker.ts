import { useCallback, useState } from "react";

export const useDatePicker = (
    initialValue: Date
): { onChange: (e: Date) => void; selected: Date } => {
    const [selected, set] = useState(initialValue);

    const onChange = useCallback((e: Date) => {
        console.debug("called datePicker onChange");
        set(e);
    }, []);

    return {
        onChange,
        selected
    };
};
