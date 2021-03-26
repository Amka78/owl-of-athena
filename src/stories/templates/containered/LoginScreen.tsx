//#region Import Moduels
import React, { FunctionComponent } from "react";
import {
    LoginScreenTemplate,
    LoginScreenTemplateProps,
} from "../../../components/templates/LoginScreenTemplate";
import { useWindowDimensions } from "../../../hooks";
import { Container } from "../../Container";
//#endregion

//#region Types
export type LoginScreenProps = Omit<LoginScreenTemplateProps, "dimens">;
//#endregion

//#region Component
export const LoginScreen: FunctionComponent<LoginScreenProps> = (
    props: LoginScreenProps
) => {
    const dimens = useWindowDimensions();
    return (
        <Container dimens={dimens}>
            <LoginScreenTemplate
                {...props}
                dimens={dimens}
            ></LoginScreenTemplate>
        </Container>
    );
};
//#endregion
