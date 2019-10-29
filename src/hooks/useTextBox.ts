import { useCallback, useState } from "react";

export const useTextBox = (
    initialValue: string
): { onChangeText: (e: string) => void; value: string } => {
    const [value, set] = useState(initialValue);

    const onChangeText = useCallback((e: string) => {
        set(e);
    }, []);

    return {
        onChangeText,
        value
    };
};
