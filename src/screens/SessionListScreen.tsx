import React, { FunctionComponent, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useCheckLogging, useUserSelector } from "../hooks";
import { StandardView, ProgressCircle } from "../components";
import { useSessionsSelector } from "../hooks/useSessionsSelector";
import { AuroraRestClientInstance } from "../clients";
import { useDispatch } from "react-redux";
import { updateSessions } from "../actions";
import { AuroraSession } from "../sdk/models";
import { Colors, Layout } from "../constants";
import moment from "moment";
import { List } from "react-native-paper";
import { useNavigation } from "react-navigation-hooks";

export type SessionListProps = {};

export const SessionListScreen: FunctionComponent = (
    props: SessionListProps
) => {
    useCheckLogging();
    const dispatch = useDispatch();
    const sessionList = useSessionsSelector();
    const userInfo = useUserSelector();
    const { navigate } = useNavigation();

    useEffect(() => {
        let unmounted = false;
        const f = async (): Promise<void> => {
            if (!unmounted) {
                console.debug("Current session list:", sessionList);
                if (sessionList.length <= 0) {
                    const remoteSessionList = await AuroraRestClientInstance.getAuroraSessions(
                        userInfo!.id
                    );
                    dispatch(updateSessions(remoteSessionList, userInfo!.id));
                }
            }
        };
        f();
        const cleanup = (): void => {
            unmounted = true;
        };
        return cleanup();
    }, [dispatch, sessionList, userInfo]);

    return sessionList ? (
        <StandardView standardViewStyle={{ justifyContent: "flex-start" }}>
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
                        <ProgressCircle
                            labelFontSize={20}
                            style={{ height: 40, width: 40, marginLeft: 5 }}
                            value={value.sleepScore}
                        ></ProgressCircle>
                        <List.Item
                            key={value.id}
                            titleStyle={{ color: Colors.white }}
                            title={sessionAt.format("dddd")}
                            description={sessionAt.format("MM,DD,YYYY")}
                            descriptionStyle={{ color: Colors.gray }}
                            style={{ width: Layout.window.fixedWidth }}
                            onPress={(): void => {
                                console.debug("selectedSessionIndex:", index);
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

const getDuration = (ms: number): Duration => {
    const minutes = Math.ceil((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return { hours, minutes };
};

const getFraction = (denominator: number, numerator: number): number => {
    const ratio = Math.ceil((numerator / denominator) * 100);
    return ratio;
};
