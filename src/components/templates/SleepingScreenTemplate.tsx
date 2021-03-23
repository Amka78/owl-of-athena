//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import { Dimens, Message, MessageKeys } from "../../constants";
import { useLocale } from "../../hooks";
import { Button, ContentText, TimeView } from "../atoms";
import { ConvertibleContentTitle, InternalView } from "../molecules";
import { TemplateTimeViewProps } from "./TempatedProps";
//#endregion

//#region Types
export type SleepingScreenTemplateProps = {
    wakeLockMessage: string;
    onRelockPress: () => void;
    timeView: TemplateTimeViewProps;
    onWakeupPress: () => void;
    dimens: { isDesktop: boolean };
    locale?: string;
};
//#endregion

//#region Component
export const SleepingScreenTemplate: FunctionComponent<SleepingScreenTemplateProps> = (
    props: SleepingScreenTemplateProps
) => {
    useLocale(props.locale);

    return (
        <InternalView>
            <ConvertibleContentTitle isDesktop={props.dimens.isDesktop}>
                {Message.get(MessageKeys.sleeping_title)}
            </ConvertibleContentTitle>
            <ContentText onPress={props.onRelockPress}>
                {props.wakeLockMessage}
            </ContentText>
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
            <Button onPress={props.onWakeupPress}>
                {Message.get(MessageKeys.sleeping_wakeup_button)}
            </Button>
        </InternalView>
    );
};
//#endregion
