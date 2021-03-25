//#region Import Modules
import React, { FunctionComponent } from "react";

import { useAcount, useWindowDimensions } from "../../hooks";
import { AccountScreenTemplate } from "./../templates/AccountScreenTemplate";
//#endregion

//#region Component
export const AccountScreen: FunctionComponent = () => {
    const accountHook = useAcount();
    const dimens = useWindowDimensions();

    return (
        <AccountScreenTemplate
            firstName={{
                onChangeText: accountHook.onFirstNameChangeText,
                value: accountHook.firstName,
            }}
            lastName={{
                onChangeText: accountHook.onLastNameChangeText,
                value: accountHook.lastName,
            }}
            birthDay={{
                onChange: accountHook.onBirthDayChange,
                selected: accountHook.birthDay,
            }}
            gender={{
                onValueChange: accountHook.onGenderChange,
                value: accountHook.gender,
            }}
            maleRadioButton={{
                value: "male",
            }}
            femaleRadioButton={{
                value: "female",
            }}
            saveButton={{
                onPress: accountHook.onSavePress,
            }}
            logoutButton={{
                onPress: accountHook.onLogoutPress,
            }}
            dimens={dimens}
        ></AccountScreenTemplate>
    );
};
//#endregion
