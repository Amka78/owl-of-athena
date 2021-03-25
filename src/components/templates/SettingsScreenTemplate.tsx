//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import { Dimens, Message, MessageKeys } from "../../constants";
import { useConvertibleHeader, useLocale } from "../../hooks";
import { Dimensions } from "../../hooks/useWindowDimensions";
import { InlineTimePicker, LeftSideButton } from "../atoms";
import { InlineTimePickerProps } from "../atoms/InlineTimePicker";
import {
    InternalView,
    LabeledCheckBox,
    LabeledSelectorMenu,
    RightSideButton,
} from "../molecules";
import { LabeledCheckBoxProps } from "../molecules/LabeledCheckBox";
import {
    TemplateButtonProps,
    TemplateSelectorMenuProps,
} from "./TempatedProps";
//#endregion

//#region Types
export type SettingsScreenTemplateProps = {
    inlineTimePicker: InlineTimePickerProps;
    smartAlarmAudioMenu: TemplateSelectorMenuProps;
    profileMenu: TemplateSelectorMenuProps & { hasProfiles: boolean };
    smartAlarmEnabled: LabeledCheckBoxProps;
    dslEnabled: LabeledCheckBoxProps;
    remStimEnabled: LabeledCheckBoxProps;
    remStimAudioMenu: TemplateSelectorMenuProps;
    saveButton: TemplateButtonProps;
    cancelButton: TemplateButtonProps;
    dimens: Dimensions;
    locale?: string;
};
//#endregion

//#region Component
export const SettingsScreenTemplate: FunctionComponent<SettingsScreenTemplateProps> = (
    props: SettingsScreenTemplateProps
) => {
    useLocale(props.locale);
    useConvertibleHeader(
        MessageKeys.settings_title,
        props.dimens.isDesktop,
        props.dimens.isSmallHeight
    );

    const saveButton = (
        <LeftSideButton
            {...props.saveButton}
            needMargin={props.dimens.isLargeWidth}
            screenWidth={props.dimens.width}
        >
            {Message.get(MessageKeys.save)}
        </LeftSideButton>
    );

    const cancelButton = (
        <RightSideButton
            {...props.cancelButton}
            needMargin={props.dimens.isLargeWidth}
            screenWidth={props.dimens.width}
        >
            {Message.get(MessageKeys.cancel)}
        </RightSideButton>
    );

    let bottomButtons;
    if (props.dimens.isDesktop || props.dimens.isSmallHeight) {
        bottomButtons = (
            <View style={{ flexDirection: "row" }}>
                {saveButton}
                {cancelButton}
            </View>
        );
    } else {
        bottomButtons = saveButton;
    }
    return (
        <InternalView>
            <InlineTimePicker
                {...props.inlineTimePicker}
                mode="minute"
            ></InlineTimePicker>
            <View
                style={{
                    marginLeft: Dimens.content_margin_horizontal,
                    marginRight: Dimens.content_margin_horizontal,
                }}
            >
                <LabeledSelectorMenu
                    {...props.smartAlarmAudioMenu}
                    label={Message.get(MessageKeys.settings_option_alarm_audio)}
                ></LabeledSelectorMenu>
                {props.profileMenu.hasProfiles ? (
                    <LabeledSelectorMenu
                        {...props.profileMenu}
                        label={Message.get(MessageKeys.settings_option_profile)}
                    ></LabeledSelectorMenu>
                ) : null}
                <LabeledCheckBox
                    {...props.smartAlarmEnabled}
                    label={Message.get(MessageKeys.settings_option_smart_alarm)}
                    labelPlace={"left"}
                ></LabeledCheckBox>
                <LabeledCheckBox
                    {...props.dslEnabled}
                    label={Message.get(MessageKeys.settings_option_dsl)}
                    labelPlace={"left"}
                ></LabeledCheckBox>
                <LabeledCheckBox
                    {...props.remStimEnabled}
                    label={Message.get(MessageKeys.settings_option_rem_stim)}
                    labelPlace={"left"}
                ></LabeledCheckBox>
                <LabeledSelectorMenu
                    {...props.remStimAudioMenu}
                    label={Message.get(
                        MessageKeys.settings_option_rem_stim_audio
                    )}
                ></LabeledSelectorMenu>
            </View>
            {bottomButtons}
        </InternalView>
    );
};
//#endregion
