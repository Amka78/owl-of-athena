//#region Import Modules
import React, { FunctionComponent } from "react";

import { useForgotPassword, useWindowDimensions } from "../../hooks";
import { ForgotPasswordScreenTemplate } from "../templates/ForgotPasswordScreenTemplate";
//#endregion

//#region Component
export const ForgotPasswordScreen: FunctionComponent = () => {
    const forgotPassword = useForgotPassword(false);
    const dimens = useWindowDimensions();
    return (
        <ForgotPasswordScreenTemplate
            emailAddress={{
                ...forgotPassword.emailAddress,
            }}
            errorText={{
                children: forgotPassword.generalError,
            }}
            forgotPasswordButton={{
                onPress: forgotPassword.onForgotPasswordPress,
            }}
            cancelButton={{
                onPress: forgotPassword.onCancelPress,
            }}
            dimens={dimens}
        ></ForgotPasswordScreenTemplate>
    );
};
//#endregion
