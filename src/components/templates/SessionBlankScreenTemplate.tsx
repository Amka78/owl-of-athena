//#region Import Modules
import React, { FunctionComponent } from "react";
import { Message, MessageKeys } from "../../constants";
import { ContentText, StandardView } from "../atoms";
//#endregion

//#region Component
export const SessionBlankScreenTemplate: FunctionComponent = () => {
    return (
        <StandardView>
            <ContentText>{Message.get(MessageKeys.session_blank)}</ContentText>
        </StandardView>
    );
};
//#endregion
