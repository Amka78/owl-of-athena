//#region Import Modules
import React, { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";
import { RadioButton } from "react-native-paper";

import {
    Button,
    ButtonProps,
    DatePicker,
    DatePickerProps,
    ErrorText,
    FlatButton,
    LabeledRadioButton,
    StandardView,
    TextBox,
    TextBoxProps,
} from "../../components";
import { LabeledRadioButtonProps } from "../../components/LabeledRadioButton";

//#endregion

//#region Types
type TemplateTextBoxProps = Pick<
    TextBoxProps,
    "value" | "onChangeText" | "label"
>;

type TemplateRadioButtonProps = Pick<
    LabeledRadioButtonProps,
    "value" | "label"
>;
export type AccountScreenTemplateProps = {
    firstName: TemplateTextBoxProps;
    lastName: TemplateTextBoxProps;
    birthDay: DatePickerProps;
    gender: { value: string; onValueChange: (value: string) => void };
    maleRadioButton: TemplateRadioButtonProps;
    femaleRadioButton: TemplateRadioButtonProps;
    saveButton: ButtonProps;
    logoutButton: ButtonProps;
};
//#endregion

//#region Component
export const AccountScreenTemplate: FunctionComponent<AccountScreenTemplateProps> = (
    props: AccountScreenTemplateProps
) => {
    return (
        <StandardView>
            <TextBox {...props.firstName}></TextBox>
            <TextBox {...props.lastName}></TextBox>
            <DatePicker {...props.birthDay}></DatePicker>
            <View style={styles.radioButtonContainer}>
                <RadioButton.Group {...props.gender}>
                    <LabeledRadioButton
                        {...props.maleRadioButton}
                    ></LabeledRadioButton>
                    <LabeledRadioButton
                        {...props.femaleRadioButton}
                    ></LabeledRadioButton>
                </RadioButton.Group>
            </View>
            <ErrorText>{""}</ErrorText>
            <Button {...props.saveButton}></Button>
            <FlatButton {...props.logoutButton}></FlatButton>
        </StandardView>
    );
};

const styles = StyleSheet.create({
    radioButtonContainer: {
        flex: 0.4,
    },
});
