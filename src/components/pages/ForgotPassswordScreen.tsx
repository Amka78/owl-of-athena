//#region Import Modules
import React, { FunctionComponent, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import { useForgotPassword, useWindowDimensions } from "../../hooks";
import { ForgotPasswordScreenTemplate } from "../templates/ForgotPasswordScreenTemplate";
import { Dimens } from "../../constants";
//#endregion

//#region Component
export const ForgotPasswordScreen: FunctionComponent = () => {
    const forgotPassword = useForgotPassword(false);
    const dimens = useWindowDimensions();
    const { setOptions } = useNavigation();
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
