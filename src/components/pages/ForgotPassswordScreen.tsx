//#region Import Modules

import { useNavigation } from "@react-navigation/native";
import React, { type FunctionComponent, useLayoutEffect } from "react";
import { Dimens } from "../../constants";
import { useForgotPassword, useWindowDimensions } from "../../hooks";
import { ForgotPasswordScreenTemplate } from "../templates/ForgotPasswordScreenTemplate";
//#endregion

//#region Component
export const ForgotPasswordScreen: FunctionComponent = () => {
    const forgotPassword = useForgotPassword(false);
    const dimens = useWindowDimensions();
    const { setOptions } = useNavigation<any>();
    useLayoutEffect(() => {
        setOptions({
            headerTitleStyle: {
                fontSize: Dimens.forgot_password_title_font_size,
            },
        });
    }, [setOptions]);
    return (
        <ForgotPasswordScreenTemplate
            emailAddress={{
                ...forgotPassword.emailAddress,
            }}
            errorText={{
                children: forgotPassword.generalError,
            }}
            successMessage={forgotPassword.successMessage}
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
