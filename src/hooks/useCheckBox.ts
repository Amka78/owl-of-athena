import { useCallback, useState, useMemo } from "react";

export const useCheckBox = (
    initialCheck: boolean
): {
    onPress: () => void;
    status: "checked" | "unchecked" | "indeterminate";
} => {
    const [value, set] = useState(initialCheck);

    const status = useMemo(() => (value ? "checked" : "unchecked"), [value]);

    const onPress = useCallback(() => {
        set(!value);
    }, [value]);

    return {
        onPress,
        status
    };
};
