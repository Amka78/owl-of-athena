//#region Import Modules
import type { FunctionComponent } from "react";

import { MessageKeys } from "../../constants";
import { useAcount, useWindowDimensions } from "../../hooks";
import type { Dimensions } from "../../hooks/useWindowDimensions";
import { AccountScreenTemplate } from "../templates/AccountScreenTemplate";
//#endregion

//#region Component
// アカウント編集フォーム本体（useAcount とフォーム描画をまとめた共通部品）。
// デスクトップは AccountScreen にインライン表示、モバイルは AccountEditScreen として
// ボタン一覧から遷移する別画面で使う。
export const AccountEditForm: FunctionComponent<{
    dimens: Dimensions;
    titleKey?: string;
}> = (props) => {
    const accountHook = useAcount();
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
            countryCode={{
                value: accountHook.countryCode,
                onChangeText: accountHook.onCountryCodeChangeText,
            }}
            postalCode={{
                value: accountHook.postalCode,
                onChangeText: accountHook.onPostalCodeChangeText,
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
            dimens={props.dimens}
            titleKey={props.titleKey}
        ></AccountScreenTemplate>
    );
};

// モバイル用のアカウント編集画面。Account メニュー（ボタン一覧）から遷移する。
export const AccountEditScreen: FunctionComponent = () => {
    const dimens = useWindowDimensions();
    return <AccountEditForm dimens={dimens} titleKey={MessageKeys.account_edit_title} />;
};
//#endregion
