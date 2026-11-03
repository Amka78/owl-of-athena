//#region Import Modules
import React, { type FunctionComponent } from "react";

import { usePasswordReset, useWindowDimensions } from "../../hooks";
import { ResetPasswordScreenTemplate } from "../templates/ResetPasswordScreenTemplate";
//#endregion

//#region Component
export const ResetPasswordScreen: FunctionComponent = () => {
    const hook = usePasswordReset();
    const dimens = useWindowDimensions();

    return (
        <ResetPasswordScreenTemplate
            state={hook.state}
            newPassword={hook.newPassword}
            confirmPassword={hook.confirmPassword}
            errorText={{ children: hook.errorText }}
            saveButton={{ onPress: hook.onSavePress }}
            loginButton={{ onPress: hook.onGoLoginPress }}
            requestButton={{ onPress: hook.onRequestNewLinkPress }}
            dimens={dimens}
        ></ResetPasswordScreenTemplate>
    );
};
//#endregion