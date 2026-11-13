//#region Import Modules
import React, { type FunctionComponent } from "react";
import { type TextStyle, TouchableWithoutFeedback, View } from "react-native";
import { Colors, Dimens, Message, MessageKeys } from "../../constants";
import { useConvertibleHeader, useLocale } from "../../hooks";
import type { Dimensions } from "../../hooks/useWindowDimensions";
import { Button, ErrorText, FlatButton, TimeView } from "../atoms";
import type { ErrorTextProps } from "../atoms/ErrorText";
import type { TimeViewProps } from "../atoms/TimeView";
import { InternalView } from "../molecules";
import type { TemplateButtonProps, TemplateFlatButtonProps } from "./TempatedProps";
//#endregion

//#region Types
export type HomeScreenTemplateProps = {
    timeViewField: { onPress: () => void };
    timeView: Pick<TimeViewProps, "hours" | "minutes">;
    profileButton: TemplateFlatButtonProps;
    errorText: ErrorTextProps;
    goToSleepButton: TemplateButtonProps;
    dimens: Dimensions;
    locale?: string;
};
//#endregion

//#region Component
export const HomeScreenTemplate: FunctionComponent<HomeScreenTemplateProps> = (
    props: HomeScreenTemplateProps,
) => {
    useLocale(props.locale);

    useConvertibleHeader(
        MessageKeys.home_title,
        props.dimens.isDesktop,
        props.dimens.isSmallHeight,
    );
    return (
        <InternalView>
            <TouchableWithoutFeedback {...props.timeViewField}>
                <View>
                    <TimeView
                        {...props.timeView}
                        mode={"meridian"}
                        timeStyle={{
                            fontSize: Dimens.home_alarm_time_text_size,
                        }}
                        timeMeridianStyle={{
                            fontSize: Dimens.home_alarm_meridian_text_size,
                        }}
                    ></TimeView>
                    <FlatButton labelStyle={flatLinkLabelStyle}>
                        {Message.get(MessageKeys.home_edit_alarm_button)}
                    </FlatButton>
                </View>
            </TouchableWithoutFeedback>
            <FlatButton {...props.profileButton} labelStyle={flatLinkLabelStyle}>
                {Message.get(MessageKeys.home_default_profile)}
            </FlatButton>
            <View style={{ alignItems: "center" }}>
                <ErrorText {...props.errorText}></ErrorText>
                <Button {...props.goToSleepButton} screenWidth={props.dimens.width}>
                    {Message.get(MessageKeys.home_go_to_sleep_button)}
                </Button>
            </View>
        </InternalView>
    );
};
//#endregion

//#region Styles
// 背景が navy の画面に直接置くテキストリンクは、MD3 既定の onSurface（暗色）では視認性が低いため、
// ログイン画面と同じ Colors.cyan で描画する。
const flatLinkLabelStyle: TextStyle = { color: Colors.cyan };
//#endregion
