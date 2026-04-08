//#region Import Modules
import React, { type FunctionComponent } from "react";

import { useChangePassword, useWindowDimensions } from "../../hooks";
import { ChangePasswordScreenTemplate } from "../templates/ChangePasswordScreenTemplate";
//#endregion

//#region Component
export const ChangePasswordScreen: FunctionComponent = () => {
    const hook = useChangePassword();
    const dimens = useWindowDimensions();

    return (
        <ChangePasswordScreenTemplate
            newPassword={hook.newPassword}
            confirmPassword={hook.confirmPassword}
            errorText={{ children: hook.generalError }}
            successMessage={hook.successMessage}
            saveButton={{ onPress: hook.onSavePress }}
            cancelButton={{ onPress: hook.onCancelPress }}
            dimens={dimens}
        />
    );
};
//#endregion
