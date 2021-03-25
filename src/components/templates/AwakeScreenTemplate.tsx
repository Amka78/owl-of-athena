//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import { Message, MessageKeys } from "../../constants";
import { useConvertibleHeader, useLocale } from "../../hooks";
import { Dimensions } from "../../hooks/useWindowDimensions";
import { ContentText, LeftSideButton } from "../atoms";
import { ContentTextProps } from "../atoms/ContentText";
import { ContentTitleProps } from "../atoms/ContentTitle";
import {
    ConvertibleContentTitle,
    InternalView,
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
    dimens: Dimensions;
    locale?: string;
};
//#endregion

//#region Component
export const AwakeScreenTemplate: FunctionComponent<AwakeScreenTemplateProps> = (
    props: AwakeScreenTemplateProps
) => {
    useLocale(props.locale);
    useConvertibleHeader(
        MessageKeys.awake_title,
        props.dimens.isDesktop,
        props.dimens.isSmallHeight
    );
    const questionButton = (
        <LeftSideButton
            {...props.questionnaireButton}
            needMargin={props.dimens.isLargeWidth}
            screenWidth={props.dimens.width}
        >
            {Message.get(MessageKeys.awake_questionnaire_continue_button)}
        </LeftSideButton>
    );
    const skipButton = (
        <RightSideButton
            {...props.skipButton}
            needMargin={props.dimens.isLargeWidth}
            screenWidth={props.dimens.width}
        >
            {Message.get(MessageKeys.awake_questionnaire_skip_button)}
        </RightSideButton>
    );
    const bottomButtons = (
        <View
            style={{
                flexDirection:
                    props.dimens.isDesktop || props.dimens.isSmallHeight
                        ? "row"
                        : "column",
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
                isDesktop={props.dimens.isDesktop}
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
