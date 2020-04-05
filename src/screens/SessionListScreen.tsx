import React, { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";
import { useCheckLogging, useSessionDetailListSelector } from "../hooks";
import { StandardView } from "../components";
import { useSessionListSelector } from "../hooks";
import { AuroraRestClientInstance } from "../clients";
import { useDispatch } from "react-redux";
import { selectSession, selectSessionDetail } from "../actions";
import { AuroraSession } from "../sdk/models";
import { Colors, Layout } from "../constants";
import moment from "moment";
import { List } from "react-native-paper";
import { useNavigation } from "react-navigation-hooks";
import { ChartRadialProgress } from "../components/charts";
import { AuroraSessionDetail } from "../sdk/models/AuroraSessionDetail";
import { ScrollView } from "react-native-gesture-handler";
export type SessionListProps = {};

export const SessionListScreen: FunctionComponent = () => {
    useCheckLogging();
    const dispatch = useDispatch();
    const sessionList = useSessionListSelector();
    const sessionDetailList = useSessionDetailListSelector();
    const { navigate } = useNavigation();

    return sessionList ? (
        <StandardView standardViewStyle={{ justifyContent: "flex-start" }}>
            <ScrollView>
                {sessionList.map((value: AuroraSession, index: number) => {
                    const sessionAt = moment(value.sessionAt);
                    return (
                        <View
                            key={value.id}
                            style={{
                                alignItems: "center",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                width: Layout.window.fixedWidth
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
                                        ).format("MM.DD.YYYY")
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
        marginTop: 30
    },
    pieChartContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: Layout.window.fixedWidth,
        flex: 5
    },
    sessionInfoFooter: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-start",
        flex: 1,
        width: Layout.window.fixedWidth
    }
});
