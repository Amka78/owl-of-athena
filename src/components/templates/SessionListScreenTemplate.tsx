//#region Import Modules
import moment from "moment";
import React, { FunctionComponent } from "react";
import { View, ViewStyle } from "react-native";

import { Colors, Message, MessageKeys } from "../../constants";
import { useLocale, useScreenDimensions } from "../../hooks";
import { AuroraSession } from "../../sdk/models";
import {
    DeleteIcon,
    ListItem,
    ScrollableList,
    StandardView,
    StarIcon,
} from "../atoms";
import { ListItemComponentProps } from "../atoms/ListItem";
import { ChartRadialProgress } from "../charts";
import {
    SessionListMenu,
    SessionListMenuProps,
} from "../organisms/sessions/SessionListMenu";
//#endregion

//#region Types

export type SessionListScreenTemplateProps = {
    showFilter: boolean;
    filterMenuProps: Omit<SessionListMenuProps, "containerStyle">;
    sessionList?: AuroraSession[];
    onStarPress: (value: AuroraSession) => Promise<void>;
    onDeletePress: (value: AuroraSession) => Promise<void>;
    onMenuPress: (value: AuroraSession, index: number) => Promise<void>;
    locale?: string;
};
//#endregion

//#region Component
export const SessionListScreenTemplate: FunctionComponent<SessionListScreenTemplateProps> = (
    props: SessionListScreenTemplateProps
) => {
    useLocale(props.locale);

    const screenDimens = useScreenDimensions();
    let menu = undefined;
    if (props.showFilter) {
        menu = (
            <SessionListMenu
                {...props.filterMenuProps}
                containerStyle={{ width: screenDimens.width }}
            ></SessionListMenu>
        );
    }
    return props.sessionList ? (
        <StandardView
            standardViewStyle={standardView}
            onLayout={screenDimens.onLayout}
        >
            {props.showFilter ? menu : undefined}
            <ScrollableList>
                {props.sessionList.map(
                    (value: AuroraSession, index: number) => {
                        const sessionAt = moment(value.sessionAt);
                        return (
                            <ListItem
                                key={value.id}
                                left={(
                                    props: ListItemComponentProps
                                ): React.ReactNode => (
                                    <ChartRadialProgress
                                        width={38}
                                        height={38}
                                        value={
                                            value.sleepScore == 117
                                                ? 72
                                                : value.sleepScore
                                        }
                                        fgColor={Colors.teal}
                                        bgColor={props.color}
                                        valueLabel={String(
                                            value.sleepScore == 117
                                                ? 72
                                                : value.sleepScore
                                        )}
                                    />
                                )}
                                right={(
                                    rightProps: ListItemComponentProps
                                ): React.ReactNode => (
                                    <View
                                        {...rightProps}
                                        style={starIconContainer}
                                    >
                                        <StarIcon
                                            starred={value.starred}
                                            onPress={async () => {
                                                await props.onStarPress(value);
                                            }}
                                        ></StarIcon>

                                        <DeleteIcon
                                            onPress={async () => {
                                                await props.onDeletePress(
                                                    value
                                                );
                                            }}
                                        ></DeleteIcon>
                                    </View>
                                )}
                                title={sessionAt.format("dddd")}
                                description={sessionAt.format(
                                    Message.get(MessageKeys.date_format)
                                )}
                                style={{ width: screenDimens.width }}
                                onPress={async () => {
                                    props.onMenuPress(value, index);
                                }}
                            ></ListItem>
                        );
                    }
                )}
            </ScrollableList>
        </StandardView>
    ) : null;
};
//#endregion

//#region Styles
const standardView: ViewStyle = { justifyContent: "flex-start" };
const starIconContainer: ViewStyle = {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
};
//#endregion
