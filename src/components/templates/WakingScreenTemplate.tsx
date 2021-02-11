//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import {
    Button,
    ContentText,
    ContentTextProps,
    ContentTitle,
    ContentTitleProps,
    StandardView,
    TimeView,
    TimeViewProps,
} from "../atoms";
import { Message, MessageKeys } from "../../constants";
import { useLocale } from "../../hooks";
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
    return (
        <StandardView>
            <ContentTitle {...props.contentTitle}>
                {Message.get(MessageKeys.waking_title)}
            </ContentTitle>
            <TimeView {...props.timeView} mode={"meridian"}></TimeView>
            <View style={{ alignItems: "center" }}>
                <Button {...props.wakeupButton}>
                    {Message.get(MessageKeys.waking_wakeup_button)}
                </Button>
                <ContentText {...props.contentText}>
                    {Message.get(MessageKeys.waking_tip_text)}
                </ContentText>
            </View>
        </StandardView>
    );
};
//#endregion
