//#region Import Modules
import { useCallback, useState } from "react";

import { useCheckLogging, useUserSelector } from "..";
import { useSessionStore } from "../../store/sessionStore";
import { SessionRestClientInstance } from "../../clients";
import { GuestUser } from "../../types";
import { useSelectedSessionSelector } from "./useSelectedSessionSelector";
//#endregion

//#region Hooks
export const useSessionNote = (): {
    onBlur: () => void;
    onChangeText: (value: string) => void;
    notes?: string;
} => {
    useCheckLogging();

    const { updateSession } = useSessionStore();
    const userInfo = useUserSelector();
    const selectedSession = useSelectedSessionSelector();
    const [notes, setNotes] = useState(selectedSession!.notes);

    const onBlur = useCallback((): void => {
        if (notes !== selectedSession!.notes) {
            if (userInfo?.id !== GuestUser) {
                SessionRestClientInstance.updateById(selectedSession!.id, {
                    notes,
                });
            }
            selectedSession!.notes = notes;
            updateSession(selectedSession!);
        }
    }, [notes, selectedSession, updateSession, userInfo?.id]);

    const onChangeText = useCallback((value: string): void => {
        setNotes(value);
    }, []);
    return { onBlur, onChangeText, notes };
};
//#endregion
