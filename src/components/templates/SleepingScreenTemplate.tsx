//#region Import Modules
import React, { FunctionComponent } from "react";

import {
    Button,
    ContentText,
    ContentTextProps,
    ContentTitle,
    ContentTitleProps,
    StandardView,
    TimeView,
    TimeViewProps,
} from "..";
import { Message, MessageKeys } from "../../constants";
import { useLocale } from "../../hooks";
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
    return (
        <StandardView>
            <ContentTitle {...props.contentTitle}>
                {Message.get(MessageKeys.sleeping_title)}
            </ContentTitle>
            <ContentText {...props.contentText}></ContentText>
            <TimeView {...props.timeView} mode={"meridian"}></TimeView>
            <Button {...props.wakeupButton}>
                {Message.get(MessageKeys.sleeping_wakeup_button)}
            </Button>
        </StandardView>
    );
};
//#endregion
