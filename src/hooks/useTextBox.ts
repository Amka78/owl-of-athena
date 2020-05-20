import { useState } from "react";

export const useTextBox = (
    initialValue: string
): { onChangeText: (e: string) => void; value: string; set: any } => {
    const [value, set] = useState(initialValue);

    const onChangeText = (e: string): void => {
        set(e);
    };

    return {
        onChangeText,
        set,
        value,
    };
};
