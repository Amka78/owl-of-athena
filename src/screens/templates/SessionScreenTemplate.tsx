//#region "Import modules"
import React, { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";

import {
    FlexSpacer,
    LabeledTimeViewProps,
    SessionChartPie,
    SessionChartPieProps,
    SessionSleepChart,
    SessionSleepChartProps,
    SessionTimeView,
    StandardView,
} from "../../components";
import {
    ChartRadialProgress,
    ChartRadialProgressProps,
} from "../../components/charts";
import { Colors, Dimens, Layout } from "../../constants";
import { CurrentChart } from "../../types/CurrentChart";
//#endregion

type TemplateTimeViewProps = Omit<LabeledTimeViewProps, "mode">;
//#region Types
export type SessionScreenTemplateProps = {
    asleepAtTimeLabel: TemplateTimeViewProps;
    chartRadialProgress: Pick<ChartRadialProgressProps, "value" | "valueLabel">;
    awakeTimeLabel: TemplateTimeViewProps;
    leftSelectButton: { onPress: () => void };
    rightSelectButton: { onPress: () => void };
    currentChart: CurrentChart;
    sessionSleepChart: Omit<SessionSleepChartProps, "width" | "height">;
    sessionChartPie: Pick<SessionChartPieProps, "session">;
    sleepDurationLabel: TemplateTimeViewProps;
    remDurationLabel: TemplateTimeViewProps;
    deepDurationLabel: TemplateTimeViewProps;
};
//#endregion

//#region Component
export const SessionScreenTemplate: FunctionComponent<SessionScreenTemplateProps> = (
    props: SessionScreenTemplateProps
) => {
    return (
        <StandardView>
            <View style={styles.sessionInfoHeader}>
                <SessionTimeView
                    {...props.asleepAtTimeLabel}
                    mode={"meridian"}
                ></SessionTimeView>
                <ChartRadialProgress
                    {...props.chartRadialProgress}
                    width={Dimens.session_radial_progress_chart_width}
                    height={Dimens.session_radial_progress_chart_height}
                    fgColor={Colors.teal}
                    bgColor={Colors.semi_transparent}
                    valueLabelColor={Colors.teal}
                    valueLabelSize={
                        Dimens.session_radial_progress_chart_font_size
                    }
                />
                <SessionTimeView
                    {...props.awakeTimeLabel}
                    mode={"meridian"}
                ></SessionTimeView>
            </View>
            <View style={styles.chartHeader}>
                <IconButton
                    {...props.leftSelectButton}
                    icon={"chevron-left"}
                    size={40}
                    color={Colors.white}
                    style={{ marginLeft: Dimens.session_margin_left }}
                ></IconButton>
                <FlexSpacer></FlexSpacer>
                <IconButton
                    {...props.rightSelectButton}
                    icon={"chevron-right"}
                    size={40}
                    color={Colors.white}
                    style={{ marginRight: Dimens.session_margin_right }}
                ></IconButton>
            </View>
            <View style={styles.sessionContent}>
                {props.currentChart === "SleepChart" ? (
                    <SessionSleepChart
                        {...props.sessionSleepChart}
                        height={Layout.window.height / 2.3}
                        width={Dimens.session_chart_width}
                    ></SessionSleepChart>
                ) : (
                    <SessionChartPie
                        {...props.sessionChartPie}
                        categoryLabelSize={Dimens.session_category_label_size}
                        categoryLabelPadding={
                            Dimens.session_chart_pie_category_label_padding
                        }
                        percentLabelSize={Dimens.session_percent_label_size}
                        height={Layout.window.height / 2.3}
                        width={Layout.window.fixedWidth}
                        outerRadius={Dimens.session_chart_pie_outer_radius}
                        innerRadius={Dimens.session_chart_pie_inner_radius}
                    ></SessionChartPie>
                )}
            </View>
            <View style={styles.sessionInfoFooter}>
                <SessionTimeView
                    {...props.sleepDurationLabel}
                    mode={"time"}
                ></SessionTimeView>
                <SessionTimeView
                    {...props.remDurationLabel}
                    mode={"time"}
                ></SessionTimeView>
                <SessionTimeView
                    {...props.deepDurationLabel}
                    mode={"time"}
                ></SessionTimeView>
            </View>
        </StandardView>
    );
};
//#endregion

//#region Styles
const styles = StyleSheet.create({
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
    chartHeader: {
        flex: 1,
        flexDirection: "row",
        width: Layout.window.fixedWidth,
    },
    sessionContent: {
        flex: 5,
        alignItems: "center",
        marginLeft: Dimens.session_margin_left,
        marginRight: Dimens.session_margin_right,
    },
});
//#endregion
