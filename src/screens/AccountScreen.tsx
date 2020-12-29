//#region Import Modules
import React, { FunctionComponent } from "react";

import { Message, MessageKeys } from "../constants";
import { useAcount } from "../hooks";
import { AccountScreenTemplate } from "./templates/AccountScreenTemplate";
//#endregion

//#region Component
export const AccountScreen: FunctionComponent = () => {
    const accountHook = useAcount();

    return (
        <AccountScreenTemplate
            firstName={{
                label: Message.get(MessageKeys.account_input_first_name),
                onChangeText: accountHook.onFirstNameChangeText,
                value: accountHook.firstName,
            }}
            lastName={{
                label: Message.get(MessageKeys.account_input_last_name),
                onChangeText: accountHook.onLastNameChangeText,
                value: accountHook.lastName,
            }}
            birthDay={{
                format: Message.get(MessageKeys.date_format),
                onChange: accountHook.onBirthDayChange,
                selected: accountHook.birthDay,
                label: Message.get(MessageKeys.account_input_birthday),
            }}
            gender={{
                onValueChange: accountHook.onGenderChange,
                value: accountHook.gender,
            }}
            maleRadioButton={{
                label: Message.get(MessageKeys.male),
                value: "male",
            }}
            femaleRadioButton={{
                label: Message.get(MessageKeys.female),
                value: "female",
            }}
            saveButton={{
                onPress: accountHook.onSavePress,
                children: Message.get(MessageKeys.account_button),
            }}
            logoutButton={{
                onPress: accountHook.onLogoutPress,
                children: Message.get(MessageKeys.account_signout),
            }}
        ></AccountScreenTemplate>
    );
};
//#endregion
