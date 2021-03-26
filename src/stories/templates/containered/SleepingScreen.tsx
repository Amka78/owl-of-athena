//#region Import Modules
import React, { FunctionComponent } from "react";

import {
    SleepingScreenTemplate,
    SleepingScreenTemplateProps,
} from "../../../components/templates/SleepingScreenTemplate";
import { useWindowDimensions } from "../../../hooks";
import { Container } from "../../Container";
//#endregion

//#region Types
export type SleepingScreenProps = Omit<SleepingScreenTemplateProps, "dimens">;
//#endregion

//#region Component
export const SleepingScreen: FunctionComponent<SleepingScreenProps> = (
    props: SleepingScreenProps
) => {
    const dimens = useWindowDimensions();
    return (
        <Container dimens={dimens}>
            <SleepingScreenTemplate
                {...props}
                dimens={dimens}
            ></SleepingScreenTemplate>
        </Container>
    );
};
//#endregion
