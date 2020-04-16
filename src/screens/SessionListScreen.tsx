import React, { FunctionComponent, useEffect, useState } from "react";
import { StyleSheet, Text, View, Picker } from "react-native";
import {
    useFilterConditionSelector,
    useFilteredSessionListSelector,
    useSessionDetailListSelector,
    useTokenSelector,
    useUserSelector,
} from "../hooks";
import { StandardView, LoadingDialog, LabeledCheckBox } from "../components";
import { AuroraRestClientInstance } from "../clients";
import { useDispatch } from "react-redux";
import {
    selectSession,
    selectSessionDetail,
    cacheSessions,
    updateFilter,
} from "../actions/SessionsActions";
import { AuroraSession, AuroraSessionDetail } from "../sdk/models";
import { Colors, Layout, MessageKeys, Message } from "../constants";
import moment from "moment";
import { List } from "react-native-paper";
import { useNavigation } from "react-navigation-hooks";
import { ChartRadialProgress } from "../components/charts";
import { ScrollView } from "react-native-gesture-handler";
import { FilterByDateValues } from "../state/SessionState";

export const SessionListScreen: FunctionComponent = () => {
    const dispatch = useDispatch();
    const user = useUserSelector();
    const filterCondition = useFilterConditionSelector();
    const sessionList = useFilteredSessionListSelector();
    const sessionDetailList = useSessionDetailListSelector();
    const { navigate, setParams } = useNavigation();
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const token = useTokenSelector();
    useEffect(() => {
        if (!token) {
            navigate("Welcome");
        }
        setParams({
            onPressedRefresh: async () => {
                LoadingDialog.show({
                    dialogTitle: { key: MessageKeys.session_reloading },
                });
                const sessions = await AuroraRestClientInstance.getAuroraSessions(
                    user!.id
                );
                dispatch(cacheSessions(sessions));
                LoadingDialog.close();
            },
            onPressedFilter: async () => {
                setShowMenu(!showMenu);
            },
        });
        const cleanup = (): void => {
            return;
        };
        return cleanup;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showMenu]);

    let menu = undefined;
    if (showMenu) {
        menu = (
            <View
                style={{
                    backgroundColor: Colors.purple,
                    flex: 1,
                    width: Layout.window.fixedWidth,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        marginTop: 4,
                        marginLeft: 20,
                        marginRight: 20,
                    }}
                >
                    <Text
                        style={{
                            color: Colors.cyan,
                            fontSize: 13,
                        }}
                    >
                        {Message.get(MessageKeys.sessions_filter_by_date_label)}
                    </Text>
                    <Picker
                        style={{
                            // @ts-ignore
                            color: Colors.white,
                            backgroundColor: Colors.purple,
                            borderLeftWidth: 0,
                            borderRightWidth: 0,
                            borderTopWidth: 0,
                            borderBottomColor: Colors.cyan,
                        }}
                        itemStyle={{
                            textDecorationColor: Colors.white,
                            borderColor: Colors.white,
                        }}
                        selectedValue={filterCondition.byDate}
                        onValueChange={(
                            itemValue: FilterByDateValues
                        ): void => {
                            dispatch(updateFilter({ byDate: itemValue }));
                        }}
                    >
                        <Picker.Item
                            label={Message.get(
                                MessageKeys.sessions_picker_values_any_time
                            )}
                            value={FilterByDateValues.ANY_TIME}
                        ></Picker.Item>
                        <Picker.Item
                            label={Message.get(
                                MessageKeys.sessions_picker_values_past_week
                            )}
                            value={FilterByDateValues.PAST_WEEK}
                        ></Picker.Item>
                        <Picker.Item
                            label={Message.get(
                                MessageKeys.sessions_picker_values_past_month
                            )}
                            value={FilterByDateValues.PAST_MONTH}
                        ></Picker.Item>
                    </Picker>
                </View>
                <LabeledCheckBox
                    labelPlace={"right"}
                    status={
                        filterCondition.showStarred ? "checked" : "unchecked"
                    }
                    container={{
                        marginLeft: 20,
                        marginRight: 20,
                        marginTop: 4,
                    }}
                    label={{
                        key: MessageKeys.sessions_check_show_starred_label,
                    }}
                    labelStyle={{ color: Colors.white, marginBottom: 0 }}
                    description={{
                        key:
                            MessageKeys.sessions_check_show_starred_description,
                    }}
                    descriptionStyle={{
                        color: Colors.gray,
                        fontSize: 10,
                    }}
                    onPress={(): void => {
                        dispatch(
                            updateFilter({
                                showStarred: !filterCondition.showStarred,
                            })
                        );
                    }}
                ></LabeledCheckBox>
                <LabeledCheckBox
                    labelPlace={"right"}
                    container={{
                        marginLeft: 20,
                        marginRight: 20,
                        marginTop: 4,
                    }}
                    status={filterCondition.showNotes ? "checked" : "unchecked"}
                    label={{
                        key: MessageKeys.sessions_check_show_notes_label,
                    }}
                    labelStyle={{ color: Colors.white, marginBottom: 0 }}
                    description={{
                        key: MessageKeys.sessions_check_show_notes_description,
                    }}
                    descriptionStyle={{
                        color: Colors.gray,
                        fontSize: 10,
                    }}
                    onPress={(): void => {
                        dispatch(
                            updateFilter({
                                showNotes: !filterCondition.showNotes,
                            })
                        );
                    }}
                ></LabeledCheckBox>
            </View>
        );
    }
    return sessionList ? (
        <StandardView standardViewStyle={{ justifyContent: "flex-start" }}>
            {showMenu ? menu : undefined}
            <ScrollView style={{ flex: Layout.isSmallDevice ? 2 : 4 }}>
                {sessionList.map((value: AuroraSession, index: number) => {
                    const sessionAt = moment(value.sessionAt);
                    return (
                        <View
                            key={value.id}
                            style={{
                                alignItems: "center",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                width: Layout.window.fixedWidth,
                            }}
                        >
                            <List.Item
                                key={value.id}
                                left={(props: {
                                    color: string;
                                    style: {
                                        marginLeft: number;
                                        marginRight: number;
                                        marginVertical?: number;
                                    };
                                }): React.ReactNode => (
                                    <ChartRadialProgress
                                        {...props}
                                        width={40}
                                        height={40}
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
                                titleStyle={{ color: Colors.white }}
                                title={sessionAt.format("dddd")}
                                description={sessionAt.format("MM,DD,YYYY")}
                                descriptionStyle={{ color: Colors.gray }}
                                style={{ width: Layout.window.fixedWidth }}
                                // @ts-ignore
                                onPress={async (): Promise<void> => {
                                    dispatch(selectSession(value));

                                    let sessionDetail;
                                    if (sessionDetailList.length > 0) {
                                        sessionDetail = sessionDetailList.find(
                                            (
                                                detailValue: AuroraSessionDetail
                                            ) => {
                                                return (
                                                    detailValue.sessionId ===
                                                    value.id
                                                );
                                            }
                                        );
                                    }

                                    if (!sessionDetail) {
                                        sessionDetail = await AuroraRestClientInstance.getSessionDetails(
                                            value.id
                                        );
                                    }

                                    dispatch(
                                        selectSessionDetail(sessionDetail)
                                    );

                                    navigate("Detail", {
                                        sessionIndex: index,
                                        sessionTitle: moment(
                                            value.sessionAt
                                        ).format("MM.DD.YYYY"),
                                    });
                                }}
                            ></List.Item>
                        </View>
                    );
                })}
            </ScrollView>
        </StandardView>
    ) : null;
};
const style = StyleSheet.create({
    sessionInfoHeader: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-start",
        flex: 1,
        width: Layout.window.fixedWidth,
        marginTop: 30,
    },
    pieChartContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: Layout.window.fixedWidth,
        flex: 5,
    },
    sessionInfoFooter: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-start",
        flex: 1,
        width: Layout.window.fixedWidth,
    },
});
