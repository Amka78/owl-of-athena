//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import { Dimens, Message, MessageKeys } from "../../constants";
import {
    useConvertibleHeader,
    useLocale,
    useWindowDimensions,
} from "../../hooks";
import { ContentText, ContentTextProps, ContentTitleProps } from "../atoms";
import {
    ConvertibleContentTitle,
    InternalView,
    LeftSideButton,
    RightSideButton,
} from "../molecules";
import { TemplateButtonProps } from "./TempatedProps";
//#endregion

//#region Types
export type AwakeScreenTemplateProps = {
    contentTitle?: ContentTitleProps;
    contentText?: ContentTextProps;
    questionnaireButton: TemplateButtonProps;
    skipButton: TemplateButtonProps;
    locale?: string;
};
//#endregion

//#region Component
export const AwakeScreenTemplate: FunctionComponent<AwakeScreenTemplateProps> = (
    props: AwakeScreenTemplateProps
) => {
    useLocale(props.locale);
    const dimens = useWindowDimensions();
    useConvertibleHeader(
        MessageKeys.awake_title,
        dimens.isDesktop,
        dimens.isSmallHeight
    );
    const questionButton = (
        <LeftSideButton
            {...props.questionnaireButton}
            isLargeWidth={dimens.isLargeWidth}
        >
            {Message.get(MessageKeys.awake_questionnaire_continue_button)}
        </LeftSideButton>
    );
    const skipButton = (
        <RightSideButton
            {...props.skipButton}
            isLargeWidth={dimens.isLargeWidth}
        >
            {Message.get(MessageKeys.awake_questionnaire_skip_button)}
        </RightSideButton>
    );
    const bottomButtons = (
        <View
            style={{
                flexDirection:
                    dimens.isDesktop || dimens.isSmallHeight ? "row" : "column",
            }}
        >
            {questionButton}
            {skipButton}
        </View>
    );
    return (
        <InternalView>
            <ConvertibleContentTitle
                {...props.contentTitle}
                isDesktop={dimens.isDesktop}
            >
                {Message.get(MessageKeys.awake_title)}
            </ConvertibleContentTitle>
            <ContentText {...props.contentText}>
                {Message.get(MessageKeys.awake_text)}
            </ContentText>
            {bottomButtons}
        </InternalView>
    );
};
//#endregion
