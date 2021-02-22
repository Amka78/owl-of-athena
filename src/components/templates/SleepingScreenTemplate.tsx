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
export type SleepingScreenTemplateProps = {
    contentTitle?: ContentTitleProps;
    contentText: ContentTextProps;
    timeView: Omit<TimeViewProps, "mode">;
    wakeupButton: TemplateButtonProps;
    locale?: string;
};
//#endregion

//#region Component
export const SleepingScreenTemplate: FunctionComponent<SleepingScreenTemplateProps> = (
    props: SleepingScreenTemplateProps
) => {
    useLocale(props.locale);

    const dimens = useWindowDimensions();
    useConvertibleHeader(
        MessageKeys.sleeping_title,
        dimens.isDesktop,
        dimens.isSmallHeight
    );
    return (
        <InternalView>
            <ConvertibleContentTitle
                {...props.contentTitle}
                isDesktop={dimens.isDesktop}
            >
                {Message.get(MessageKeys.sleeping_title)}
            </ConvertibleContentTitle>
            <ContentText {...props.contentText}></ContentText>
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
            <Button {...props.wakeupButton}>
                {Message.get(MessageKeys.sleeping_wakeup_button)}
            </Button>
        </InternalView>
    );
};
//#endregion
