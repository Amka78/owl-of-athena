//#region Import Moduels
import React, { FunctionComponent } from "react";

import {
    WakingScreenTemplate,
    WakingScreenTemplateProps,
} from "../../../components/templates/WakingScreenTemplate";
import { useWindowDimensions } from "../../../hooks";
import { Container } from "../../Container";
//#endregion

//#region Types
export type WakingScreenProps = Omit<WakingScreenTemplateProps, "dimens">;
//#endregion

//#region Component
export const WakingScreen: FunctionComponent<WakingScreenProps> = (
    props: WakingScreenProps
) => {
    const dimens = useWindowDimensions();
    return (
        <Container dimens={dimens}>
            <WakingScreenTemplate
                {...props}
                dimens={dimens}
            ></WakingScreenTemplate>
        </Container>
    );
};
//#endregion
