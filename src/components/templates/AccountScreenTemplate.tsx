//#region Import Modules
import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { RadioButton } from "react-native-paper";

import { Dimens, Message, MessageKeys } from "../../constants";
import { useConvertibleHeader, useLocale } from "../../hooks";
import { Dimensions } from "../../hooks/useWindowDimensions";
import { Button, ErrorText, FlatButton, TextBox } from "../atoms";
import {
    DatePicker,
    DatePickerProps,
    InternalView,
    LabeledRadioButton,
} from "../molecules";
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
    dimens: Dimensions;
    locale?: string;
};
//#endregion

//#region Component
export const AccountScreenTemplate: FunctionComponent<AccountScreenTemplateProps> = (
    props: AccountScreenTemplateProps
) => {
    useLocale(props.locale);

    useConvertibleHeader(
        Message.get(MessageKeys.account_title),
        props.dimens.isDesktop,
        props.dimens.isSmallHeight
    );

    const saveButton = (
        <Button {...props.saveButton} screenWidth={props.dimens.width}>
            {Message.get(MessageKeys.account_button)}
        </Button>
    );
    const logoutButton = props.dimens.isDesktop ? undefined : (
        <FlatButton {...props.logoutButton}>
            {Message.get(MessageKeys.account_signout)}
        </FlatButton>
    );

    const splitWidth = props.dimens.isHorizontal
        ? Dimens.input_text_max_width / 2
        : undefined;

    const itemMargin = props.dimens.isHorizontal
        ? Dimens.items_margin
        : undefined;

    return (
        <InternalView>
            <View
                style={{
                    flexDirection: props.dimens.isHorizontal ? "row" : "column",
                    maxWidth: Dimens.inner_screen_max_width,
                }}
            >
                <TextBox
                    {...props.firstName}
                    label={Message.get(MessageKeys.account_input_first_name)}
                    style={{
                        marginRight: itemMargin,
                    }}
                    maxWidth={splitWidth}
                ></TextBox>

                <TextBox
                    {...props.lastName}
                    label={Message.get(MessageKeys.account_input_last_name)}
                    style={{
                        marginLeft: itemMargin,
                    }}
                    maxWidth={splitWidth}
                ></TextBox>
            </View>
            <View
                style={{
                    flexDirection: props.dimens.isHorizontal ? "row" : "column",
                    maxWidth: Dimens.inner_screen_max_width,
                }}
            >
                <DatePicker
                    {...props.birthDay}
                    format={Message.get(MessageKeys.date_format)}
                    label={Message.get(MessageKeys.account_input_birthday)}
                    style={{ marginRight: itemMargin }}
                    maxWidth={splitWidth}
                ></DatePicker>
                <View
                    style={{
                        alignItems: "center",
                        width: splitWidth,
                        marginLeft: itemMargin,
                        maxWidth: splitWidth,
                    }}
                >
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
            </View>
            <ErrorText>{""}</ErrorText>
            {saveButton}
            {logoutButton}
        </InternalView>
    );
};
