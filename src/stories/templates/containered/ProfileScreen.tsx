//#region Import Moduels
import React, { type FunctionComponent } from "react";
import {
    ProfileScreenTemplate,
    type ProfileScreenTemplateProps,
} from "../../../components/templates/ProfileScreenTemplate";
import { useWindowDimensions } from "../../../hooks";
import { Container } from "../../Container";
//#endregion

//#region Types
export type ProfileScreenProps = Omit<ProfileScreenTemplateProps, "dimens">;
//#endregion

//#region Component
export const ProfileScreen: FunctionComponent<ProfileScreenProps> = (props: ProfileScreenProps) => {
    const dimens = useWindowDimensions();
    return (
        <Container dimens={dimens}>
            <ProfileScreenTemplate {...props} dimens={dimens}></ProfileScreenTemplate>
        </Container>
    );
};
//#endregion
