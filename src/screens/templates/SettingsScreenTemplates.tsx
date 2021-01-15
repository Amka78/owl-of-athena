//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";

import {
    Button,
    ButtonProps,
    InlineTimePicker,
    InlineTimePickerProps,
    LabeledCheckBox,
    LabeledCheckBoxProps,
    LabeledSelectorMenu,
    LabeledSelectorMenuProps,
    StandardView,
} from "../../components";
import { Colors } from "../../constants";
//#endregion

//#region Types
export type SettingsScreenTemplateProps = {
    inlineTimePicker: InlineTimePickerProps;
    smartAlarmAudioMenu: LabeledSelectorMenuProps;
    profileMenu: LabeledSelectorMenuProps & { hasProfiles: boolean };
    smartAlarmEnabled: LabeledCheckBoxProps;
    dslEnabled: LabeledCheckBoxProps;
    remStimEnabled: LabeledCheckBoxProps;
    remStimAudioMenu: LabeledSelectorMenuProps;
    saveButton: ButtonProps;
};
//#endregion

//#region Component
export const SettingsScreenTemplate: FunctionComponent<SettingsScreenTemplateProps> = (
    props: SettingsScreenTemplateProps
) => {
    return (
        <StandardView>
            <InlineTimePicker
                {...props.inlineTimePicker}
                mode="minute"
                style={{
                    activeColor: Colors.navy_darker,
                    backgroundColor: Colors.navy,
                    borderColor: Colors.white,
                    containerBackgroudColor: Colors.navy,
                    textColor: Colors.cyan,
                }}
            ></InlineTimePicker>
            <View>
                <LabeledSelectorMenu
                    {...props.smartAlarmAudioMenu}
                ></LabeledSelectorMenu>
                {props.profileMenu.hasProfiles ? (
                    <LabeledSelectorMenu
                        {...props.profileMenu}
                    ></LabeledSelectorMenu>
                ) : null}
                <LabeledCheckBox
                    {...props.smartAlarmEnabled}
                    labelPlace={"left"}
                ></LabeledCheckBox>
                <LabeledCheckBox
                    {...props.dslEnabled}
                    labelPlace={"left"}
                ></LabeledCheckBox>
                <LabeledCheckBox
                    {...props.remStimEnabled}
                    labelPlace={"left"}
                ></LabeledCheckBox>
                <LabeledSelectorMenu
                    {...props.remStimAudioMenu}
                ></LabeledSelectorMenu>
            </View>
            <Button {...props.saveButton}></Button>
        </StandardView>
    );
};
//#endregion
