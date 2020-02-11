import { useCallback, useState } from "react";

export const useRadioGroup = (
    initialState: string
): {
    onValueChange: (value: string) => void;
    value: string;
} => {
    const [value, set] = useState(initialState);

    const onValueChange = useCallback(
        (value: string) => {
            set(value);
        },
        [value]
    );

    return {
        onValueChange,
        value
    };
};
