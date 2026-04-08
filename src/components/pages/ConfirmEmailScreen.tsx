//#region Import Modules
import React, { type FunctionComponent } from "react";
import { useWindowDimensions } from "../../hooks";
import { useConfirmEmail } from "../../hooks/useConfirmEmail";
import { ConfirmEmailScreenTemplate } from "../templates/ConfirmEmailScreenTemplate";
//#endregion

//#region Component
export const ConfirmEmailScreen: FunctionComponent = () => {
    const confirmEmail = useConfirmEmail();
    const dimens = useWindowDimensions();

    return (
        <ConfirmEmailScreenTemplate
            email={confirmEmail.email}
            checkButton={{ onPress: confirmEmail.onCheckPress }}
            resendButton={{ onPress: confirmEmail.onResendPress }}
            onChangeEmailPress={confirmEmail.onChangeEmailPress}
            errorText={confirmEmail.generalError}
            successMessage={confirmEmail.successMessage}
            dimens={dimens}
        />
    );
};
//#endregion
