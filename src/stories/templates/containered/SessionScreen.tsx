//#region Import Moduels
import React, { FunctionComponent } from "react";
import {
    SessionScreenTemplate,
    SessionScreenTemplateProps,
} from "../../../components/templates/SessionScreenTemplate";
import { useWindowDimensions } from "../../../hooks";
import { Container } from "../../Container";
//#endregion

//#region Types
export type SessionScreenProps = Omit<SessionScreenTemplateProps, "dimens">;
//#endregion

//#region Component
export const SessionScreen: FunctionComponent<SessionScreenProps> = (
    props: SessionScreenProps
) => {
    const dimens = useWindowDimensions();
    return (
        <Container dimens={dimens}>
            <SessionScreenTemplate {...props}></SessionScreenTemplate>
        </Container>
    );
};
//#endregion
