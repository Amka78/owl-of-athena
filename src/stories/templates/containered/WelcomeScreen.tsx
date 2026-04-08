//#region Import Moduels
import React, { type FunctionComponent } from "react";

import {
    WelcomeScreenTemplate,
    type WelcomeScreenTemplateProps,
} from "../../../components/templates/WelcomeScreenTemplate";
import { useWindowDimensions } from "../../../hooks";
import { Container } from "../../Container";
//#endregion

//#region Types
export type WelcomeScreenProps = Omit<WelcomeScreenTemplateProps, "dimens">;
//#endregion

//#region Component
export const WelcomeScreen: FunctionComponent<WelcomeScreenProps> = (props: WelcomeScreenProps) => {
    const dimens = useWindowDimensions();
    return (
        <Container dimens={dimens}>
            <WelcomeScreenTemplate {...props} dimens={dimens}></WelcomeScreenTemplate>
        </Container>
    );
};
//#endregion
