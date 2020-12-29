//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

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
export type WakingScreenTemplateProps = {
    contentTitle: ContentTitleProps;
    timeView: Omit<TimeViewProps, "mode">;
    wakeupButton: ButtonProps;
    contentText: ContentTextProps;
};
//#endregion

//#region Component
export const WakingScreenTemplate: FunctionComponent<WakingScreenTemplateProps> = (
    props: WakingScreenTemplateProps
) => {
    return (
        <StandardView>
            <ContentTitle {...props.contentTitle}></ContentTitle>
            <TimeView {...props.timeView} mode={"meridian"}></TimeView>
            <View style={{ alignItems: "center" }}>
                <Button {...props.wakeupButton}></Button>
                <ContentText {...props.contentText}></ContentText>
            </View>
        </StandardView>
    );
};
//#endregion
