//#region "Import modules"
import React, { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";

import { SessionChartPie, SessionSleepChart } from "..";
import { Colors, Dimens, Message, MessageKeys } from "../../constants";
import {
    useLocale,
    useScreenDimensions,
    useWindowDimensions,
} from "../../hooks";
import { CurrentChart } from "../../types/CurrentChart";
import { FlexSpacer, StandardView } from "../atoms";
import {
    ChartRadialProgress,
    ChartRadialProgressProps,
} from "../charts/ChartRadialProgress";
import { SessionTimeView } from "../molecules";
import { SessionChartPieProps } from "../SessionChartPie";
import { SessionSleepChartProps } from "../SessionSleepChart";
import { TemplateTimeViewProps } from "./TempatedProps";
//#endregion

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
    locale?: string;
};

//#endregion

//#region Component
export const SessionScreenTemplate: FunctionComponent<SessionScreenTemplateProps> = (
    props: SessionScreenTemplateProps
) => {
    useLocale(props.locale);
    const dimens = useWindowDimensions();
    const screenDimens = useScreenDimensions();

    const radicalProgressChartSize = dimens.isDesktop
        ? Dimens.session_radial_progress_chart_size_desktop
        : Dimens.session_radial_progress_chart_size_mobile;

    const percentLabelSize = dimens.isDesktop
        ? Dimens.session_percent_label_size_desktop
        : Dimens.session_percent_label_size_mobile;

    const categoryLabelSize = dimens.isDesktop
        ? Dimens.session_category_label_size_desktop
        : Dimens.session_category_label_size_mobile;

    const chartPieOuterRadius = dimens.isDesktop
        ? Dimens.session_chart_pie_outer_radius_desktop
        : Dimens.session_chart_pie_outer_radius_mobile;

    const chartPieInnerRadius = dimens.isDesktop
        ? Dimens.session_chart_pie_inner_radius_desktop
        : Dimens.session_chart_pie_inner_radius_mobile;

    const chartPieCategoryPadding = dimens.isDesktop
        ? Dimens.session_chart_pie_category_label_padding_desktop
        : Dimens.session_chart_pie_category_label_padding_mobile;
    return (
        <StandardView
            standardViewStyle={{
                alignItems: undefined,
            }}
            onLayout={screenDimens.onLayout}
        >
            <View
                style={[
                    styles.sessionInfoHeader,
                    { width: screenDimens.width },
                ]}
            >
                <SessionTimeView
                    {...props.asleepAtTimeLabel}
                    mode={"meridian"}
                    label={Message.get(MessageKeys.session_asleep_time_label)}
                    isDesktop={dimens.isDesktop}
                ></SessionTimeView>
                <ChartRadialProgress
                    {...props.chartRadialProgress}
                    width={radicalProgressChartSize}
                    height={radicalProgressChartSize}
                    fgColor={Colors.teal}
                    bgColor={Colors.semi_transparent}
                    valueLabelColor={Colors.teal}
                    valueLabelSize={
                        dimens.isDesktop
                            ? Dimens.session_radial_progress_chart_font_size_desktop
                            : Dimens.session_radial_progress_chart_font_size_mobile
                    }
                />
                <SessionTimeView
                    {...props.awakeTimeLabel}
                    mode={"meridian"}
                    label={Message.get(MessageKeys.session_awake_time_label)}
                    isDesktop={dimens.isDesktop}
                ></SessionTimeView>
            </View>
            <View style={[styles.chartHeader, { width: screenDimens.width }]}>
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
            <View style={[styles.sessionContent]}>
                {props.currentChart === "SleepChart" ? (
                    <SessionSleepChart
                        {...props.sessionSleepChart}
                        height={screenDimens.height / 2}
                        width={
                            screenDimens.width -
                            (Dimens.session_margin_left +
                                Dimens.session_margin_right)
                        }
                    ></SessionSleepChart>
                ) : (
                    <SessionChartPie
                        {...props.sessionChartPie}
                        categoryLabelSize={categoryLabelSize}
                        categoryLabelPadding={chartPieCategoryPadding}
                        percentLabelSize={percentLabelSize}
                        height={screenDimens.height / 2}
                        width={
                            screenDimens.width -
                            (Dimens.session_margin_left +
                                Dimens.session_margin_right)
                        }
                        outerRadius={chartPieOuterRadius}
                        innerRadius={chartPieInnerRadius}
                    ></SessionChartPie>
                )}
            </View>
            <View
                style={[
                    styles.sessionInfoFooter,
                    { width: screenDimens.width },
                ]}
            >
                <SessionTimeView
                    {...props.sleepDurationLabel}
                    label={Message.get(
                        MessageKeys.session_sleep_duration_label
                    )}
                    mode={"time"}
                    isDesktop={dimens.isDesktop}
                ></SessionTimeView>
                <SessionTimeView
                    {...props.remDurationLabel}
                    label={Message.get(MessageKeys.session_rem_duration_label)}
                    mode={"time"}
                    isDesktop={dimens.isDesktop}
                ></SessionTimeView>
                <SessionTimeView
                    {...props.deepDurationLabel}
                    label={Message.get(MessageKeys.session_deep_duration_label)}
                    mode={"time"}
                    isDesktop={dimens.isDesktop}
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
        marginTop: 30,
    },
    sessionInfoFooter: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-start",
        flex: 1,
    },
    chartHeader: {
        flex: 1,
        flexDirection: "row",
    },
    sessionContent: {
        flex: 5,
        alignItems: "center",
        marginLeft: Dimens.session_margin_left,
        marginRight: Dimens.session_margin_right,
    },
});
//#endregion
