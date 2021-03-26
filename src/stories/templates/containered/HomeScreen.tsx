//#region Import Moduels
import React, { FunctionComponent } from "react";
import {
    HomeScreenTemplate,
    HomeScreenTemplateProps,
} from "../../../components/templates/HomeScreenTemplate";
import { useWindowDimensions } from "../../../hooks";
import { Container } from "../../Container";
//#endregion

//#region Types
export type HomeScreenProps = Omit<HomeScreenTemplateProps, "dimens">;
//#endregion

//#region Component
export const HomeScreen: FunctionComponent<HomeScreenProps> = (
    props: HomeScreenProps
) => {
    const dimens = useWindowDimensions();
    return (
        <Container dimens={dimens}>
            <HomeScreenTemplate {...props} dimens={dimens}></HomeScreenTemplate>
        </Container>
    );
};
//#endregion
