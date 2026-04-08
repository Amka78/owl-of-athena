//#region Inport modules
import React, { type FunctionComponent } from "react";

import { useSessionNote } from "../../hooks/sessions/useSessionNote";
import { SessionNoteScreenTemplate } from "./../templates/SessionNoteScreenTemplate";
//#endregion

//#region Component
export const SessionNoteScreen: FunctionComponent = () => {
    const sessionNoteHook = useSessionNote();
    return (
        <SessionNoteScreenTemplate
            onBlur={sessionNoteHook.onBlur}
            onChangeText={sessionNoteHook.onChangeText}
            value={sessionNoteHook.notes}
        ></SessionNoteScreenTemplate>
    );
};
//#endregion
