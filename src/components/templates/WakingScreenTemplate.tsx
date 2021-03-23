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
export type WakingScreenTemplateProps = {
    timeView: TemplateTimeViewProps;
    onWakeupPress: () => void;
    dimens: { isDesktop: boolean };
    locale?: string;
};
//#endregion

//#region Component
export const WakingScreenTemplate: FunctionComponent<WakingScreenTemplateProps> = (
    props: WakingScreenTemplateProps
) => {
    useLocale(props.locale);

    return (
        <InternalView>
            <ConvertibleContentTitle isDesktop={props.dimens.isDesktop}>
                {Message.get(MessageKeys.waking_title)}
            </ConvertibleContentTitle>
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
            <View style={{ alignItems: "center" }}>
                <Button>{Message.get(MessageKeys.waking_wakeup_button)}</Button>
                <ContentText>
                    {Message.get(MessageKeys.waking_tip_text)}
                </ContentText>
            </View>
        </InternalView>
    );
};
//#endregion
