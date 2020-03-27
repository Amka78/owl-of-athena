import React, { FunctionComponent, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useCheckLogging, useUserSelector } from "../hooks";
import {
    StandardView,
    ProgressCircle,
    LabeledTimeView,
    LabeledCircle
} from "../components";
import { useSessionsSelector } from "../hooks/useSessionsSelector";
import { AuroraRestClientInstance } from "../clients";
import { useDispatch } from "react-redux";
import { updateSessions } from "../actions";
import { AuroraSession } from "../sdk/models";
import { Colors, Layout, MessageKeys } from "../constants";
import { PieChart, PieChartData } from "react-native-svg-charts";
import { Svg, Text as SvgText } from "react-native-svg";
import { useNavigation } from "react-navigation-hooks";
import moment from "moment";
export type SessionProps = {
    children?: React.ReactNode;
    sessionIndex?: number;
};
type Duration = {
    hours: number;
    minutes: number;
};

type SleepSlice = {
    pieCentroid: number[];
    data: PieChartData;
};

export const SessionScreen: FunctionComponent = (props: SessionProps) => {
    useCheckLogging();
    const dispatch = useDispatch();
    const sessionList = useSessionsSelector();
    const userInfo = useUserSelector();
    const [selectedSession, setSelectedSession] = useState<AuroraSession>();
    const { getParam, setParams } = useNavigation();
    //let selectedSession: AuroraSession | undefined;
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

                if (getParam("sessionIndex") !== undefined) {
                    setSelectedSession(sessionList[getParam("sessionIndex")]);
                } else {
                    setSelectedSession(sessionList[sessionList.length - 1]);
                }
                console.debug("selected session:", selectedSession);
            }
        };
        f();
        const cleanup = (): void => {
            unmounted = true;
        };
        return cleanup();
    }, [
        dispatch,
        getParam,
        props.sessionIndex,
        selectedSession,
        sessionList,
        setSelectedSession,
        userInfo
    ]);
    let asleepAt: Date;
    let awakeAt: Date;
    let sleepDuration: Duration;
    let remDuration: Duration;
    let lightDuration: Duration;
    let awakeDuration: Duration;
    let deepDuration: Duration;
    let noSignalDuration: Duration;
    const ratioGraph = new Array<PieChartData>();

    if (selectedSession) {
        asleepAt = new Date(selectedSession!.asleepAt);
        awakeAt = new Date(selectedSession!.awakeAt);
        sleepDuration = getDuration(selectedSession!.sleepDuration);
        lightDuration = getDuration(selectedSession!.lightDuration);
        awakeDuration = getDuration(selectedSession!.awakeDuration);
        remDuration = getDuration(selectedSession!.remDuration);
        deepDuration = getDuration(selectedSession!.deepDuratin);
        noSignalDuration = getDuration(selectedSession!.noSignalDuration);
        console.debug("asleepAt:", asleepAt);
        console.debug("awakeAt", awakeAt);

        ratioGraph.push({
            key: 1,
            value: getFraction(
                selectedSession.sleepDuration,
                selectedSession.lightDuration
            ),
            svg: { fill: Colors.cyan }
        });
        ratioGraph.push({
            key: 2,
            value: getFraction(
                selectedSession.sleepDuration,
                selectedSession.deepDuratin
            ),
            svg: { fill: Colors.purple }
        });
        ratioGraph.push({
            key: 3,
            value: getFraction(
                selectedSession.sleepDuration,
                selectedSession.remDuration
            ),
            svg: { fill: Colors.charcoal }
        });
        ratioGraph.push({
            key: 4,
            value: getFraction(
                selectedSession.sleepDuration,
                selectedSession.awakeDuration
            ),
            svg: { fill: Colors.yellow }
        });
        ratioGraph.push({
            key: 5,
            value: getFraction(
                selectedSession.sessionDuration,
                selectedSession.noSignalDuration
            ),
            svg: { fill: Colors.black }
        });
    }

    const Labels = ({
        slices,
        height,
        width
    }: {
        slices?: SleepSlice[];
        height?: number;
        width?: number;
    }): JSX.Element[] => {
        return slices!.map((slice, index) => {
            const { pieCentroid, data } = slice;
            return (
                <SvgText
                    key={index}
                    x={pieCentroid[0]}
                    y={pieCentroid[1]}
                    fill={Colors.white}
                    textAnchor={"middle"}
                    alignmentBaseline={"middle"}
                    fontSize={15}
                    stroke={Colors.black}
                    strokeWidth={0.2}
                >
                    {`${data.value}%`}
                </SvgText>
            );
        });
    };
    return selectedSession ? (
        <StandardView>
            <View style={style.sessionInfoHeader}>
                <LabeledTimeView
                    label={{
                        key: MessageKeys.session_asleep_time_label
                    }}
                    hours={asleepAt!.getHours()}
                    minutes={asleepAt!.getMinutes()}
                    mode={"meridian"}
                ></LabeledTimeView>
                <ProgressCircle
                    value={selectedSession.sleepScore}
                ></ProgressCircle>
                <LabeledTimeView
                    label={{
                        key: MessageKeys.session_awake_time_label
                    }}
                    hours={awakeAt!.getHours()}
                    minutes={awakeAt!.getMinutes()}
                    mode={"meridian"}
                ></LabeledTimeView>
            </View>
            <View style={style.pieChartContainer}>
                <PieChart
                    animate={true}
                    style={{
                        height: "60%",
                        width: 200,
                        flex: 1
                    }}
                    valueAccessor={({ item }: { item: PieChartData }): number =>
                        item.value!
                    }
                    sort={(a: PieChartData, b: PieChartData): number => {
                        if (a.value! > b.value!) return -1;
                        if (a.value! < b.value!) return 1;
                        return 0;
                    }}
                    data={ratioGraph}
                    outerRadius={"100%"}
                >
                    {<Labels />}
                </PieChart>
                <Svg style={{ flex: 1, height: "60%" }}>
                    <LabeledCircle
                        color={Colors.cyan}
                        x={30}
                        y={40}
                        duration={lightDuration!}
                        label={MessageKeys.session_light_pie_chart_label}
                    ></LabeledCircle>
                    <LabeledCircle
                        color={Colors.purple}
                        x={30}
                        y={100}
                        duration={deepDuration!}
                        label={MessageKeys.session_deep_pie_chart_label}
                    ></LabeledCircle>
                    <LabeledCircle
                        color={Colors.charcoal}
                        x={30}
                        y={160}
                        duration={remDuration!}
                        label={MessageKeys.session_rem_pie_chart_label}
                    ></LabeledCircle>
                    <LabeledCircle
                        color={Colors.yellow}
                        x={30}
                        y={220}
                        duration={awakeDuration!}
                        label={MessageKeys.session_awake_pie_chart_label}
                    ></LabeledCircle>
                    <LabeledCircle
                        color={Colors.black}
                        x={30}
                        y={280}
                        duration={noSignalDuration!}
                        label={MessageKeys.session_no_signal_pie_chart_label}
                    ></LabeledCircle>
                </Svg>
            </View>
            <View style={style.sessionInfoFooter}>
                <LabeledTimeView
                    label={{
                        key: MessageKeys.session_sleep_duration_label
                    }}
                    hours={sleepDuration!.hours}
                    minutes={sleepDuration!.minutes}
                    mode={"time"}
                ></LabeledTimeView>
                <LabeledTimeView
                    label={{
                        key: MessageKeys.session_rem_duration_label
                    }}
                    hours={remDuration!.hours}
                    minutes={remDuration!.minutes}
                    mode={"time"}
                ></LabeledTimeView>
                <LabeledTimeView
                    label={{
                        key: MessageKeys.session_deep_duration_label
                    }}
                    hours={deepDuration!.hours}
                    minutes={deepDuration!.minutes}
                    mode={"time"}
                ></LabeledTimeView>
            </View>
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
