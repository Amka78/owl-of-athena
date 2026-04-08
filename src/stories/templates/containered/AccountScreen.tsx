//#region Import Moduels
import React, { type FunctionComponent } from "react";
import {
    AccountScreenTemplate,
    type AccountScreenTemplateProps,
} from "../../../components/templates/AccountScreenTemplate";
import { useWindowDimensions } from "../../../hooks";
import { Container } from "../../Container";
//#endregion

//#region Types
export type AccountScreenProps = Omit<AccountScreenTemplateProps, "dimens">;
//#endregion

//#region Component
export const AccountScreen: FunctionComponent<AccountScreenProps> = (props: AccountScreenProps) => {
    const dimens = useWindowDimensions();
    return (
        <Container dimens={dimens}>
            <AccountScreenTemplate {...props} dimens={dimens}></AccountScreenTemplate>
        </Container>
    );
};
//#endregion
