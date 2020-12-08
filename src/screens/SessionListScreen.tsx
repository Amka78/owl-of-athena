import React, { FunctionComponent, useEffect, useState } from "react";
import { StyleSheet, Text, View, Picker } from "react-native";
import {
    useFilterConditionSelector,
    useFilteredSessionListSelector,
    useSessionDetailListSelector,
    useTokenSelector,
    useUserSelector,
} from "../hooks";
import {
    StandardView,
    LoadingDialog,
    LabeledCheckBox,
    ConfirmDialog,
} from "../components";
import { SessionRestClientInstance } from "../clients";
import { useDispatch } from "react-redux";
import {
    selectSession,
    selectSessionDetail,
    cacheSessions,
    updateFilter,
    updateSession,
    deleteSession,
} from "../actions/SessionsActions";
import { AuroraSession, AuroraSessionDetail } from "../sdk/models";
import { Colors, Layout, MessageKeys, Message } from "../constants";
import moment from "moment";
import { List, IconButton } from "react-native-paper";
import { useNavigation } from "react-navigation-hooks";
import { ChartRadialProgress } from "../components/charts";
import { ScrollView } from "react-native-gesture-handler";
import { FilterByDateValues } from "../state/SessionState";
import { AuroraSessionJson } from "../sdk/AuroraTypes";
import { AuroraManagerInstance } from "../managers";
import { GuestUser } from "../types";

export type ListItemProps = {
    color: string;
    style: {
        marginLeft?: number;
        marginRight: number;
        marginVertical?: number;
    };
};
export const SessionListScreen: FunctionComponent = () => {
    const dispatch = useDispatch();
    const user = useUserSelector();
    const filterCondition = useFilterConditionSelector();
    const sessionList = useFilteredSessionListSelector();
    const sessionDetailList = useSessionDetailListSelector();
    const { navigate, setParams } = useNavigation();
    const [showFilter, setShowFilter] = useState<boolean>(false);
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
                const sessions = await SessionRestClientInstance.getAll(
                    user!.id
                );
                dispatch(cacheSessions(sessions));
                LoadingDialog.close();
            },
            onPressedFilter: async () => {
                setShowFilter(!showFilter);
            },
        });
        const cleanup = (): void => {
            return;
        };
        return cleanup;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showFilter]);

    let menu = undefined;
    if (showFilter) {
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
        <StandardView standardViewStyle={style.standardView}>
            {showFilter ? menu : undefined}
            <ScrollView style={{ flex: Layout.isSmallDevice ? 2 : 4 }}>
                {sessionList.map((value: AuroraSession, index: number) => {
                    const sessionAt = moment(value.sessionAt);
                    return (
                        <View key={value.id} style={style.sessionItemContainer}>
                            <List.Item
                                key={value.id}
                                left={(
                                    props: ListItemProps
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
                                right={(props: unknown): React.ReactNode => (
                                    <View
                                        {...props}
                                        style={{
                                            justifyContent: "center",
                                            alignItems: "center",
                                            flexDirection: "row",
                                        }}
                                    >
                                        <IconButton
                                            icon={
                                                value.starred
                                                    ? "star"
                                                    : "star-outline"
                                            }
                                            size={25}
                                            color={Colors.white}
                                            onPress={(): void => {
                                                const asyncFunc = async (): Promise<void> => {
                                                    const updateInfo: Partial<AuroraSessionJson> = {
                                                        starred: !value.starred,
                                                    };

                                                    if (
                                                        user?.id !== GuestUser
                                                    ) {
                                                        await SessionRestClientInstance.updateById(
                                                            value.id,
                                                            updateInfo
                                                        );
                                                    }

                                                    value.starred = !value.starred;
                                                    dispatch(
                                                        updateSession(value)
                                                    );
                                                };

                                                asyncFunc();
                                            }}
                                        ></IconButton>
                                        <IconButton
                                            icon={"delete"}
                                            size={25}
                                            color={Colors.white}
                                            onPress={(): void => {
                                                ConfirmDialog.show({
                                                    title: {
                                                        key:
                                                            MessageKeys.delete_dialog_title,
                                                    },
                                                    message: {
                                                        key:
                                                            MessageKeys.delete_dialog_message,
                                                    },
                                                    isCancelable: true,
                                                    onConfirm: async () => {
                                                        if (
                                                            user?.id !==
                                                            GuestUser
                                                        ) {
                                                            await SessionRestClientInstance.deleteById(
                                                                value.id
                                                            );
                                                        }

                                                        if (
                                                            AuroraManagerInstance.isConnected()
                                                        ) {
                                                            try {
                                                                await AuroraManagerInstance.executeCommand(
                                                                    `sd-dir-del sessions/${value.id}`
                                                                );
                                                            } catch (e) {
                                                                console.error(
                                                                    e
                                                                );
                                                            }
                                                        }
                                                        dispatch(
                                                            deleteSession(
                                                                value.id
                                                            )
                                                        );
                                                    },
                                                });
                                            }}
                                        ></IconButton>
                                    </View>
                                )}
                                titleStyle={{ color: Colors.white }}
                                title={sessionAt.format("dddd")}
                                description={sessionAt.format(
                                    Message.get(MessageKeys.date_format)
                                )}
                                descriptionStyle={{ color: Colors.gray }}
                                style={{
                                    width: Layout.window.fixedWidth,
                                    justifyContent: "center",
                                }}
                                onPress={(): void => {
                                    const asyncFunction = async (): Promise<void> => {
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

                                        if (
                                            !sessionDetail &&
                                            user?.id !== GuestUser
                                        ) {
                                            sessionDetail = await SessionRestClientInstance.getDetailsById(
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
                                            ).format(
                                                Message.get(
                                                    MessageKeys.date_format
                                                )
                                            ),
                                        });
                                    };
                                    asyncFunction();
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
    standardView: { justifyContent: "flex-start" },
    sessionItemContainer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "flex-start",
        width: Layout.window.fixedWidth,
    },
});
