//#region Import Modules
import React, { FunctionComponent } from "react";

import SessionTabNavigator from "../../navigation/SessionTabNavigator";
import { AuroraSession } from "../../sdk/models";
import { FilterIcon, FlexSpacer, RefreshIcon } from "../atoms";
import { ConvertibleListForm } from "../molecules";
import { SessionBlankScreenTemplate } from "./SessionBlankScreenTemplate";
import {
    SessionListScreenTemplate,
    SessionListScreenTemplateProps,
} from "./SessionListScreenTemplate";
//#endregion

//#region Types
export type SessionDesktopScreenTemplateProps = SessionListScreenTemplateProps & {
    onRefreshPress: () => void;
    onFilterPress: () => void;
    selected?: AuroraSession;
};
//#endregion

//#region Component
export const SessionDesktopScreenTemplate: FunctionComponent<SessionDesktopScreenTemplateProps> = (
    props: SessionDesktopScreenTemplateProps
) => {
    return (
        <ConvertibleListForm
            listMenu={[
                <RefreshIcon
                    key={0}
                    onPress={props.onRefreshPress}
                ></RefreshIcon>,
                <FlexSpacer key={1}></FlexSpacer>,
                <FilterIcon key={2} onPress={props.onFilterPress}></FilterIcon>,
            ]}
            listScreen={
                props.sessionList ? (
                    <SessionListScreenTemplate
                        {...props}
                    ></SessionListScreenTemplate>
                ) : undefined
            }
            itemScreen={
                props.selected ? (
                    <SessionTabNavigator></SessionTabNavigator>
                ) : (
                    <SessionBlankScreenTemplate></SessionBlankScreenTemplate>
                )
            }
        ></ConvertibleListForm>
    );
};
//#endregion
