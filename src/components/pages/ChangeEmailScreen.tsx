//#region Import Modules
import React, { type FunctionComponent } from "react";

import { useChangeEmail, useWindowDimensions } from "../../hooks";
import { ChangeEmailScreenTemplate } from "../templates/ChangeEmailScreenTemplate";
//#endregion

//#region Component
export const ChangeEmailScreen: FunctionComponent = () => {
    const hook = useChangeEmail();
    const dimens = useWindowDimensions();

    return (
        <ChangeEmailScreenTemplate
            newEmail={hook.newEmail}
            confirmEmail={hook.confirmEmail}
            errorText={{ children: hook.generalError }}
            successMessage={hook.successMessage}
            saveButton={{ onPress: hook.onSavePress }}
            cancelButton={{ onPress: hook.onCancelPress }}
            dimens={dimens}
        />
    );
};
//#endregion
