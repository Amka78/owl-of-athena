//#region Import Modules
import moment from "moment";
import type React from "react";
import type { FunctionComponent } from "react";
import { Text, type TextStyle, View, type ViewStyle } from "react-native";

import { Colors, Message, MessageKeys } from "../../constants";
import { useLocale, useScreenDimensions } from "../../hooks";
import type { AuroraSession } from "../../sdk/models";
import { buildSessionListRows } from "../../services/SessionListService";
import { DeleteIcon, ListItem, ScrollableList, StandardView, StarIcon } from "../atoms";
import type { ListItemComponentProps } from "../atoms/ListItem";
import { ChartRadialProgress } from "../charts";
import { SessionListMenu, type SessionListMenuProps } from "../organisms/sessions/SessionListMenu";
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
    props: SessionListScreenTemplateProps,
) => {
    useLocale(props.locale);

    const screenDimens = useScreenDimensions();
    let menu: React.ReactNode;
    if (props.showFilter) {
        menu = (
            <SessionListMenu
                {...props.filterMenuProps}
                containerStyle={{ width: screenDimens.width }}
            ></SessionListMenu>
        );
    }
    return props.sessionList ? (
        <StandardView standardViewStyle={standardView} onLayout={screenDimens.onLayout}>
            {props.showFilter ? menu : undefined}
            <ScrollableList>
                {buildSessionListRows(props.sessionList, (sessionAt) =>
                    sessionAt.format(Message.get(MessageKeys.session_list_month_format)),
                ).map((row, index) => {
                    if (row.type === "month") {
                        return (
                            <Text key={row.key} style={monthHeader}>
                                {row.label}
                            </Text>
                        );
                    }

                    const value = row.session;
                    const sessionAt = moment(value.sessionAt);
                    return (
                        <ListItem
                            key={row.key}
                            left={(props: ListItemComponentProps): React.ReactNode => (
                                <ChartRadialProgress
                                    width={38}
                                    height={38}
                                    value={value.sleepScore}
                                    fgColor={Colors.teal}
                                    bgColor={props.color}
                                    valueLabel={String(value.sleepScore)}
                                />
                            )}
                            right={(rightProps: ListItemComponentProps): React.ReactNode => (
                                <View {...rightProps} style={starIconContainer}>
                                    {value.isNew ? (
                                        <View style={newBadge}>
                                            <Text style={newBadgeText}>
                                                {Message.get(MessageKeys.session_list_new)}
                                            </Text>
                                        </View>
                                    ) : null}
                                    <StarIcon
                                        starred={value.starred}
                                        onPress={async () => {
                                            await props.onStarPress(value);
                                        }}
                                    ></StarIcon>

                                    <DeleteIcon
                                        onPress={async () => {
                                            await props.onDeletePress(value);
                                        }}
                                    ></DeleteIcon>
                                </View>
                            )}
                            title={sessionAt.format("dddd")}
                            description={sessionAt.format(Message.get(MessageKeys.date_format))}
                            style={{ width: screenDimens.width }}
                            onPress={async () => {
                                props.onMenuPress(value, index);
                            }}
                        ></ListItem>
                    );
                })}
            </ScrollableList>
        </StandardView>
    ) : null;
};
//#endregion

//#region Styles
const standardView: ViewStyle = { justifyContent: "flex-start" };
const monthHeader: TextStyle = {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.blue,
};
const starIconContainer: ViewStyle = {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
};
const newBadge: ViewStyle = {
    backgroundColor: Colors.first_accent_color,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginRight: 6,
};
const newBadgeText: TextStyle = { color: Colors.white, fontSize: 9, fontWeight: "bold" };
//#endregion
