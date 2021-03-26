//#region Import Moduels
import React, { FunctionComponent } from "react";
import {
    SessionListScreenTemplate,
    SessionListScreenTemplateProps,
} from "../../../components/templates/SessionListScreenTemplate";
import { useWindowDimensions } from "../../../hooks";
import { Container } from "../../Container";
//#endregion

//#region Types
export type SessionListScreenProps = Omit<
    SessionListScreenTemplateProps,
    "dimens"
>;
//#endregion

//#region Component
export const SessionListScreen: FunctionComponent<SessionListScreenProps> = (
    props: SessionListScreenProps
) => {
    const dimens = useWindowDimensions();
    return (
        <Container dimens={dimens}>
            <SessionListScreenTemplate {...props}></SessionListScreenTemplate>
        </Container>
    );
};
//#endregion
