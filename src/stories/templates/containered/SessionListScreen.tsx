//#region Import Moduels
import React, { type FunctionComponent } from "react";
import {
    SessionListScreenTemplate,
    type SessionListScreenTemplateProps,
} from "../../../components/templates/SessionListScreenTemplate";
import { useWindowDimensions } from "../../../hooks";
import { Container } from "../../Container";
//#endregion

//#region Types
export type SessionListScreenProps = Omit<SessionListScreenTemplateProps, "dimens">;
//#endregion

//#region Component
export const SessionListScreen: FunctionComponent<SessionListScreenProps> = (
    props: SessionListScreenProps,
) => {
    const dimens = useWindowDimensions();
    return (
        <Container dimens={dimens}>
            <SessionListScreenTemplate {...props}></SessionListScreenTemplate>
        </Container>
    );
};
//#endregion
