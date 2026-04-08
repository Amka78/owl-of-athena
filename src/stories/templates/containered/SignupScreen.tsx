//#region Import Moduels
import React, { type FunctionComponent } from "react";

import {
    SignupScreenTemplate,
    type SignupScreenTemplateProps,
} from "../../../components/templates/SignupScreenTemplate";
import { useWindowDimensions } from "../../../hooks";
import { Container } from "../../Container";
//#endregion

//#region Types
export type SignupScreenProps = Omit<SignupScreenTemplateProps, "dimens">;
//#endregion

//#region Component
export const SignupScreen: FunctionComponent<SignupScreenProps> = (props: SignupScreenProps) => {
    const dimens = useWindowDimensions();
    return (
        <Container dimens={dimens}>
            <SignupScreenTemplate {...props} dimens={dimens}></SignupScreenTemplate>
        </Container>
    );
};
//#endregion
