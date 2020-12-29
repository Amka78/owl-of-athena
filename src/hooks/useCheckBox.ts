//#region Import Modules
import { useCallback, useMemo, useState } from "react";
//#endregion

//#region Types
export type useCheckBoxReturn = ReturnType<typeof useCheckBox>;
//#endregion

//#region Hook
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
        status,
    };
};
//#endregion
