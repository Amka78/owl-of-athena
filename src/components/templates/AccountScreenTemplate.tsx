//#region Import Modules
import React, { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";
import { RadioButton } from "react-native-paper";

import { Message, MessageKeys } from "../../constants";
import { useLocale } from "../../hooks";
import { Button, ErrorText, FlatButton, StandardView, TextBox } from "../atoms";
import { DatePicker, DatePickerProps, LabeledRadioButton } from "../molecules";
import {
    TemplateButtonProps,
    TemplateRadioButtonProps,
    TemplateTextBoxProps,
} from "./TempatedProps";
//#endregion

//#region Types
export type AccountScreenTemplateProps = {
    firstName: TemplateTextBoxProps;
    lastName: TemplateTextBoxProps;
    birthDay: DatePickerProps;
    gender: {
        value: string;
        onValueChange: (value: string) => void;
    };
    maleRadioButton: TemplateRadioButtonProps;
    femaleRadioButton: TemplateRadioButtonProps;
    saveButton: TemplateButtonProps;
    logoutButton: TemplateButtonProps;
    locale?: string;
};
//#endregion

//#region Component
export const AccountScreenTemplate: FunctionComponent<AccountScreenTemplateProps> = (
    props: AccountScreenTemplateProps
) => {
    useLocale(props.locale);
    return (
        <StandardView>
            <TextBox
                {...props.firstName}
                label={Message.get(MessageKeys.account_input_first_name)}
            ></TextBox>

            <TextBox
                {...props.lastName}
                label={Message.get(MessageKeys.account_input_last_name)}
            ></TextBox>
            <DatePicker
                {...props.birthDay}
                format={Message.get(MessageKeys.date_format)}
                label={Message.get(MessageKeys.account_input_birthday)}
            ></DatePicker>
            <View style={styles.radioButtonContainer}>
                <RadioButton.Group {...props.gender}>
                    <LabeledRadioButton
                        {...props.maleRadioButton}
                        label={Message.get(MessageKeys.male)}
                    ></LabeledRadioButton>
                    <LabeledRadioButton
                        {...props.femaleRadioButton}
                        label={Message.get(MessageKeys.female)}
                    ></LabeledRadioButton>
                </RadioButton.Group>
            </View>
            <ErrorText>{""}</ErrorText>
            <Button {...props.saveButton}>
                {Message.get(MessageKeys.account_button)}
            </Button>
            <FlatButton {...props.logoutButton}>
                {Message.get(MessageKeys.account_signout)}
            </FlatButton>
        </StandardView>
    );
};

const styles = StyleSheet.create({
    radioButtonContainer: {
        flex: 0.4,
    },
});
