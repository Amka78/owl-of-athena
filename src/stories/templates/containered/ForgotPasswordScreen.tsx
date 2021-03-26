//#region Import Moduels
import React, { FunctionComponent } from "react";
import {
    ForgotPasswordScreenTemplate,
    ForgotPasswordScreenTemplateProps,
} from "../../../components/templates/ForgotPasswordScreenTemplate";
import { useWindowDimensions } from "../../../hooks";
import { Container } from "../../Container";
//#endregion

//#region Types
export type ForgotPasswordScreenProps = Omit<
    ForgotPasswordScreenTemplateProps,
    "dimens"
>;
//#endregion

//#region Component
export const ForgotPasswordScreen: FunctionComponent<ForgotPasswordScreenProps> = (
    props: ForgotPasswordScreenProps
) => {
    const dimens = useWindowDimensions();
    return (
        <Container dimens={dimens}>
            <ForgotPasswordScreenTemplate
                {...props}
                dimens={dimens}
            ></ForgotPasswordScreenTemplate>
        </Container>
    );
};
//#endregion
