//#region "Import modules"
import React, { FunctionComponent, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
    useCheckLogging,
    useSelectedSessionSelector,
    useSelectedSessionDetailSelector,
} from "../hooks";
import {
    StandardView,
    SessionTimeView,
    SessionChartPie,
    SessionSleepChart,
    FlexSpacer,
} from "../components";
import { Colors, Layout, MessageKeys, Dimens } from "../constants";
import { ChartRadialProgress } from "../components/charts";
import { IconButton } from "react-native-paper";
import moment, { Moment } from "moment";
//#endregion

//#region "Private type definition"
type Duration = {
    hours: number;
    minutes: number;
};

type CurrentChart = "SleepChart" | "PieChart";
//#endregion
export const SessionScreen: FunctionComponent = () => {
    useCheckLogging();
    const selectedSession = useSelectedSessionSelector();
    const selectedSessionDetail = useSelectedSessionDetailSelector();

    const [currentChart, setCurrentChart] = useState<CurrentChart>(
        "SleepChart"
    );

    let asleepAt: Moment;
    let awakeAt: Moment;
    let sleepDuration: Duration;
    let remDuration: Duration;
    let deepDuration: Duration;

    if (selectedSession) {
        asleepAt = moment(selectedSession!.asleepAt).utc();
        awakeAt = moment(selectedSession!.awakeAt).utc();
        sleepDuration = getDuration(selectedSession!.sleepDuration);
        remDuration = getDuration(selectedSession!.remDuration);
        deepDuration = getDuration(selectedSession!.deepDuration);
    }

    const scaleXDomain = [
        selectedSession!.sessionAt - 300000,
        selectedSession!.sessionAt + selectedSession!.sessionDuration + 300000,
    ];

    return selectedSession ? (
        <StandardView>
            <View style={style.sessionInfoHeader}>
                <SessionTimeView
                    label={{
                        key: MessageKeys.session_asleep_time_label,
                    }}
                    hours={asleepAt!.hours()}
                    minutes={asleepAt!.minutes()}
                    mode={"meridian"}
                ></SessionTimeView>
                <ChartRadialProgress
                    width={Dimens.session_radial_progress_chart_width}
                    height={Dimens.session_radial_progress_chart_height}
                    value={
                        selectedSession!.sleepScore == 117
                            ? 72
                            : selectedSession!.sleepScore
                    }
                    fgColor={Colors.teal}
                    bgColor={Colors.semi_transparent}
                    valueLabel={(selectedSession!.sleepScore == 117
                        ? 72
                        : selectedSession!.sleepScore
                    ).toString()}
                    valueLabelColor={Colors.teal}
                    valueLabelSize={
                        Dimens.session_radial_progress_chart_font_size
                    }
                />
                <SessionTimeView
                    label={{
                        key: MessageKeys.session_awake_time_label,
                    }}
                    hours={awakeAt!.hours()}
                    minutes={awakeAt!.minutes()}
                    mode={"meridian"}
                ></SessionTimeView>
            </View>
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    width: Layout.window.fixedWidth,
                }}
            >
                <IconButton
                    icon={"chevron-left"}
                    size={40}
                    color={Colors.white}
                    style={{ marginLeft: Dimens.session_margin_left }}
                    onPress={(): void => {
                        currentChart === "SleepChart"
                            ? setCurrentChart("PieChart")
                            : setCurrentChart("SleepChart");
                    }}
                ></IconButton>
                <FlexSpacer></FlexSpacer>
                <IconButton
                    icon={"chevron-right"}
                    size={40}
                    color={Colors.white}
                    style={{ marginRight: Dimens.session_margin_right }}
                    onPress={(): void => {
                        currentChart === "SleepChart"
                            ? setCurrentChart("PieChart")
                            : setCurrentChart("SleepChart");
                    }}
                ></IconButton>
            </View>
            <View
                style={{
                    flex: 5,
                    alignItems: "center",
                    marginLeft: Dimens.session_margin_left,
                    marginRight: Dimens.session_margin_right,
                }}
            >
                {currentChart === "SleepChart" ? (
                    <SessionSleepChart
                        height={Layout.window.height / 2.3}
                        width={Dimens.session_chart_width}
                        isFilterEnabled={false}
                        scaleXDomain={scaleXDomain}
                        sessionDetail={selectedSessionDetail}
                        totalSleepHour={sleepDuration!.hours}
                    ></SessionSleepChart>
                ) : (
                    <SessionChartPie
                        categoryLabelSize={Dimens.session_category_label_size}
                        categoryLabelPadding={
                            Dimens.session_chart_pie_category_label_padding
                        }
                        height={Layout.window.height / 2.3}
                        width={Layout.window.fixedWidth}
                        outerRadius={Dimens.session_chart_pie_outer_radius}
                        innerRadius={Dimens.session_chart_pie_inner_radius}
                        percentLabelSize={Dimens.session_percent_label_size}
                        session={selectedSession}
                    ></SessionChartPie>
                )}
            </View>
            <View style={style.sessionInfoFooter}>
                <SessionTimeView
                    label={{
                        key: MessageKeys.session_sleep_duration_label,
                    }}
                    hours={sleepDuration!.hours}
                    minutes={sleepDuration!.minutes}
                    mode={"time"}
                ></SessionTimeView>
                <SessionTimeView
                    label={{
                        key: MessageKeys.session_rem_duration_label,
                    }}
                    hours={remDuration!.hours}
                    minutes={remDuration!.minutes}
                    mode={"time"}
                ></SessionTimeView>
                <SessionTimeView
                    label={{
                        key: MessageKeys.session_deep_duration_label,
                    }}
                    hours={deepDuration!.hours}
                    minutes={deepDuration!.minutes}
                    mode={"time"}
                ></SessionTimeView>
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

const getDuration = (ms: number): Duration => {
    const minutes = Math.ceil((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return { hours, minutes };
};
