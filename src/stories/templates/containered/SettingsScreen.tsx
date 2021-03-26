//#region Import Modules
import React, { FunctionComponent } from "react";
import {
    SettingsScreenTemplate,
    SettingsScreenTemplateProps,
} from "../../../components/templates/SettingsScreenTemplate";
import { useWindowDimensions } from "../../../hooks";
import { Container } from "../../Container";
//#endregion

//#region Types
export type SettingsScreenProps = Omit<SettingsScreenTemplateProps, "dimens">;
//#endregion

//#region Component
export const SettingsScreen: FunctionComponent<SettingsScreenProps> = (
    props: SettingsScreenProps
) => {
    const dimens = useWindowDimensions();
    return (
        <Container dimens={dimens}>
            <SettingsScreenTemplate
                {...props}
                dimens={dimens}
            ></SettingsScreenTemplate>
        </Container>
    );
};
//#endregion
