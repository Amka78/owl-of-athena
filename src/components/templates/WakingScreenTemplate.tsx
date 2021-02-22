//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import { Dimens, Message, MessageKeys } from "../../constants";
import {
    useConvertibleHeader,
    useLocale,
    useWindowDimensions,
} from "../../hooks";
import {
    Button,
    ContentText,
    ContentTextProps,
    ContentTitleProps,
    TimeView,
    TimeViewProps,
} from "../atoms";
import { ConvertibleContentTitle, InternalView } from "../molecules";
import { TemplateButtonProps } from "./TempatedProps";
//#endregion

//#region Types
export type WakingScreenTemplateProps = {
    contentTitle?: ContentTitleProps;
    timeView: Omit<TimeViewProps, "mode">;
    wakeupButton: TemplateButtonProps;
    contentText?: ContentTextProps;
    locale?: string;
};
//#endregion

//#region Component
export const WakingScreenTemplate: FunctionComponent<WakingScreenTemplateProps> = (
    props: WakingScreenTemplateProps
) => {
    useLocale(props.locale);
    const dimens = useWindowDimensions();

    useConvertibleHeader(
        MessageKeys.waking_title,
        dimens.isDesktop,
        dimens.isSmallHeight
    );
    return (
        <InternalView>
            <ConvertibleContentTitle
                {...props.contentTitle}
                isDesktop={dimens.isDesktop}
            >
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
                <Button {...props.wakeupButton}>
                    {Message.get(MessageKeys.waking_wakeup_button)}
                </Button>
                <ContentText {...props.contentText}>
                    {Message.get(MessageKeys.waking_tip_text)}
                </ContentText>
            </View>
        </InternalView>
    );
};
//#endregion
