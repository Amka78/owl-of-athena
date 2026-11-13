//#region Import Modules

import Slider from "@react-native-community/slider";
import React, { type FunctionComponent } from "react";
import { Text, type TextStyle, View, type ViewStyle } from "react-native";
import { Colors, Dimens, Message, MessageKeys } from "../../constants";
import { useConvertibleHeader, useLocale } from "../../hooks";
import type { Dimensions } from "../../hooks/useWindowDimensions";
import { InlineTimePicker, LeftSideButton } from "../atoms";
import type { InlineTimePickerProps, TimePickerStyle } from "../atoms/InlineTimePicker";
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
            <View style={optionColumnStyle}>
                <InlineTimePicker
                    {...props.inlineTimePicker}
                    mode="minute"
                    containerStyle={alarmTimePickerContainerStyle}
                    style={alarmTimePickerStyle}
                ></InlineTimePicker>
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
                <Text style={volumeLabelStyle}>
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

//#region Styles
// 時刻ピッカーを下のオプション列と同じ左右インセットに揃え、縦間隔も行間と同じにする。
// コンテンツ基準の 48 より少し多め（48+16）にして両端に余裕を持たせる。
const optionColumnStyle: ViewStyle = {
    marginLeft: Dimens.content_margin_horizontal + 16,
    marginRight: Dimens.content_margin_horizontal + 16,
};

// 時刻フィールドは space-around だと列幅いっぱいに広がるため、中央寄せにして両端に隙間を作る。
const alarmTimePickerContainerStyle: ViewStyle = {
    margin: 0,
    marginTop: Dimens.option_margin_bottom,
    marginBottom: Dimens.option_margin_bottom,
    justifyContent: "center",
};

// 背景 navy 上では MD3 既定の onSurface（暗色）が選ばれて時刻が見えなくなるため、
// 明色テキスト＋ミッドナイトブルーのチップ＋シアン枠、選択中は teal ハイライトを明示する。
const alarmTimePickerStyle: TimePickerStyle = {
    textColor: Colors.white,
    backgroundColor: Colors.third_color,
    activeColor: Colors.teal,
    borderColor: Colors.cyan,
};

// ボリューム見出しの marginTop は他の行と同じ間隔に揃える（従来は content_title_margin_top）。
const volumeLabelStyle: TextStyle = {
    color: Colors.white,
};
