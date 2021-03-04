//#region
import React, { FunctionComponent } from "react";
import { View } from "react-native";
import SessionTabNavigator from "../../navigation/SessionTabNavigator";
import {
    SessionListScreenTemplate,
    SessionListScreenTemplateProps,
} from "./SessionListScreenTemplate";
import { Colors } from "../../constants";
import { FilterIcon, RefreshIcon } from "../molecules";
import { FlexSpacer } from "../atoms";

export type SessionDesktopScreenTemplateProps = SessionListScreenTemplateProps & {
    onRefreshPress: () => void;
    onFilterPress: () => void;
};
export const SessionDesktopScreenTemplate: FunctionComponent<SessionDesktopScreenTemplateProps> = (
    props: SessionDesktopScreenTemplateProps
) => {
    const sessionList = (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    backgroundColor: Colors.navy,
                    borderBottomColor: Colors.white,
                    borderBottomWidth: 1,
                    flexDirection: "row",
                    justifyContent: "space-around",
                }}
            >
                <RefreshIcon onPress={props.onRefreshPress}></RefreshIcon>
                <FlexSpacer></FlexSpacer>
                <FilterIcon onPress={props.onFilterPress}></FilterIcon>
            </View>
            <SessionListScreenTemplate {...props}></SessionListScreenTemplate>
        </View>
    );

    const sessionNavigator = <SessionTabNavigator></SessionTabNavigator>;
    return (
        <View style={{ flexDirection: "row", flex: 1 }}>
            <View style={{ flex: 3 }}>{sessionList}</View>
            <View
                style={{
                    flex: 7,
                    borderLeftColor: Colors.white,
                    borderLeftWidth: 1,
                }}
            >
                {sessionNavigator}
            </View>
        </View>
    );
};
