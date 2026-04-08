//#region Import Modules
import React, { type FunctionComponent } from "react";
import { View } from "react-native";

import { Dimens, Message, MessageKeys } from "../../constants";
import { useLocale } from "../../hooks";
import type { Dimensions } from "../../hooks/useWindowDimensions";
import { Button, ContentText, TimeView } from "../atoms";
import { ConvertibleContentTitle, InternalView } from "../molecules";
import type { TemplateTimeViewProps } from "./TempatedProps";
//#endregion

//#region Types
export type SleepingScreenTemplateProps = {
    wakeLockMessage: string;
    onRelockPress: () => void;
    timeView: TemplateTimeViewProps;
    onWakeupPress: () => void;
    onSnoozePress: () => void;
    isSnoozing: boolean;
    dimens: Dimensions;
    locale?: string;
};
//#endregion

//#region Component
export const SleepingScreenTemplate: FunctionComponent<SleepingScreenTemplateProps> = (
    props: SleepingScreenTemplateProps,
) => {
    useLocale(props.locale);

    return (
        <InternalView>
            <ConvertibleContentTitle isDesktop={props.dimens.isDesktop}>
                {Message.get(MessageKeys.sleeping_title)}
            </ConvertibleContentTitle>
            <ContentText onPress={props.onRelockPress}>{props.wakeLockMessage}</ContentText>
            <View style={{ flex: 1 }}>
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
            </View>
            <Button onPress={props.onWakeupPress} screenWidth={props.dimens.width}>
                {Message.get(MessageKeys.sleeping_wakeup_button)}
            </Button>
            {props.isSnoozing ? (
                <ContentText>{Message.get(MessageKeys.sleeping_snoozing_message)}</ContentText>
            ) : (
                <Button onPress={props.onSnoozePress} screenWidth={props.dimens.width}>
                    {Message.get(MessageKeys.sleeping_snooze_button)}
                </Button>
            )}
        </InternalView>
    );
};
//#endregion
