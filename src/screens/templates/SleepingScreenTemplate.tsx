//#region Import Modules
import React, { FunctionComponent } from "react";

import {
    Button,
    ButtonProps,
    ContentText,
    ContentTextProps,
    ContentTitle,
    ContentTitleProps,
    StandardView,
    TimeView,
    TimeViewProps,
} from "../../components";
//#endregion

//#region Types
type SleepingScreenTemplateProps = {
    contentTitle: ContentTitleProps;
    contentText: ContentTextProps;
    timeView: Omit<TimeViewProps, "mode">;
    wakeupButton: ButtonProps;
};
//#endregion

//#region Component
export const SleepingScreenTemplate: FunctionComponent<SleepingScreenTemplateProps> = (
    props: SleepingScreenTemplateProps
) => {
    return (
        <StandardView>
            <ContentTitle {...props.contentTitle}></ContentTitle>
            <ContentText {...props.contentText}></ContentText>
            <TimeView {...props.timeView} mode={"meridian"}></TimeView>
            <Button {...props.wakeupButton}></Button>
        </StandardView>
    );
};
//#endregion
