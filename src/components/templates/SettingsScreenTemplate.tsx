//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import {
    Button,
    InlineTimePicker,
    InlineTimePickerProps,
    LabeledCheckBox,
    LabeledCheckBoxProps,
    LabeledSelectorMenu,
    StandardView,
} from "..";
import { Message, MessageKeys } from "../../constants";
import { useLocale } from "../../hooks";
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
    locale?: string;
};
//#endregion

//#region Component
export const SettingsScreenTemplate: FunctionComponent<SettingsScreenTemplateProps> = (
    props: SettingsScreenTemplateProps
) => {
    useLocale(props.locale);
    return (
        <StandardView>
            <InlineTimePicker
                {...props.inlineTimePicker}
                mode="minute"
            ></InlineTimePicker>
            <View>
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
            <Button {...props.saveButton}>
                {Message.get(MessageKeys.save)}
            </Button>
        </StandardView>
    );
};
//#endregion
