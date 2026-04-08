//#region Import Moduels
import React, { type FunctionComponent } from "react";
import {
    AwakeScreenTemplate,
    type AwakeScreenTemplateProps,
} from "../../../components/templates/AwakeScreenTemplate";
import { useWindowDimensions } from "../../../hooks";
import { Container } from "../../Container";
//#endregion

//#region Types
export type AwakeScreenProps = Omit<AwakeScreenTemplateProps, "dimens">;
//#endregion

//#region Component
export const AwakeScreen: FunctionComponent<AwakeScreenProps> = (props: AwakeScreenProps) => {
    const dimens = useWindowDimensions();
    return (
        <Container dimens={dimens}>
            <AwakeScreenTemplate {...props} dimens={dimens}></AwakeScreenTemplate>
        </Container>
    );
};
//#endregion
