//#region Import Modules

import Slider from "@react-native-community/slider";
import React, { type FunctionComponent } from "react";
import { Text, View } from "react-native";
import { Dimens, Message, MessageKeys } from "../../constants";
import { useConvertibleHeader, useLocale } from "../../hooks";
import type { Dimensions } from "../../hooks/useWindowDimensions";
import { InlineTimePicker, LeftSideButton } from "../atoms";
import type { InlineTimePickerProps } from "../atoms/InlineTimePicker";
import { InternalView, LabeledCheckBox, LabeledSelectorMenu, RightSideButton } from "../molecules";
import type { LabeledCheckBoxProps } from "../molecules/LabeledCheckBox";
import type { TemplateButtonProps, TemplateSelectorMenuProps } from "./TempatedProps";
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
    alarmVolume: number;
    onAlarmVolumeChange: (value: number) => void;
    saveButton: TemplateButtonProps;
    cancelButton: TemplateButtonProps;
    dimens: Dimensions;
    locale?: string;
};
//#endregion

//#region Component
export const SettingsScreenTemplate: FunctionComponent<SettingsScreenTemplateProps> = (
    props: SettingsScreenTemplateProps,
) => {
    useLocale(props.locale);
    useConvertibleHeader(
        MessageKeys.settings_title,
        props.dimens.isDesktop,
        props.dimens.isSmallHeight,
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
            <InlineTimePicker {...props.inlineTimePicker} mode="minute"></InlineTimePicker>
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
                    label={Message.get(MessageKeys.settings_option_rem_stim_audio)}
                ></LabeledSelectorMenu>
                <Text
                    style={{
                        marginTop: Dimens.content_title_margin_top,
                        color: "white",
                    }}
                >
                    {Message.get(MessageKeys.settings_option_volume)}
                </Text>
                <Slider
                    minimumValue={0}
                    maximumValue={1}
                    step={0.05}
                    value={props.alarmVolume}
                    onValueChange={props.onAlarmVolumeChange}
                    minimumTrackTintColor="#00FFFF"
                    maximumTrackTintColor="#888888"
                    thumbTintColor="#00FFFF"
                />
            </View>
            {bottomButtons}
        </InternalView>
    );
};
//#endregion
