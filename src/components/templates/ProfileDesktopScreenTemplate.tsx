//#region Import Modules
import React, { FunctionComponent } from "react";

import ProfileTabNavigator from "../../navigation/ProfileTabNavigator";
import { FilterIcon, FlexSpacer, RefreshIcon } from "../atoms";
import { ConvertibleListForm } from "../molecules";
import {
    ProfileListScreenTemplate,
    ProfileListScreenTemplateProps,
} from "./ProfileListScreenTemplate";
//#endregion

//#region Types
export type ProfileDesktopScreenTemplateProps = ProfileListScreenTemplateProps & {
    onRefreshPress: () => void;
    onFilterPress: () => void;
};
//#endregion

//#region Component
export const ProfileDesktopScreenTemplate: FunctionComponent<ProfileDesktopScreenTemplateProps> = (
    props: ProfileDesktopScreenTemplateProps
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
                props.list ? (
                    <ProfileListScreenTemplate
                        {...props}
                    ></ProfileListScreenTemplate>
                ) : undefined
            }
            itemScreen={<ProfileTabNavigator></ProfileTabNavigator>}
        ></ConvertibleListForm>
    );
};
//#endregion
