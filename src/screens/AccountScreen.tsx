import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { RadioButton } from "react-native-paper";

import {
    Button,
    DatePicker,
    ErrorText,
    FlatButton,
    LabeledRadioButton,
    StandardView,
    TextBox
} from "../components";
import {
    useGetUser,
    useLogout,
    useRadioGroup,
    useTextBox,
    useUpdateUser,
    useDatePicker,
    useUserSelector
} from "../hooks";
import { User } from "../types";

export const AccountScreen: FunctionComponent = () => {
    const useFirstNameHook = useTextBox("");
    const useLastNameHook = useTextBox("");
    const useBirthDayHook = useDatePicker(new Date());
    const useRadioGroupHook = useRadioGroup("");
    useGetUser((user: User) => {
        console.debug("onInitialize called");

        useFirstNameHook.onChangeText(user.first_name!);
        useLastNameHook.onChangeText(user.last_name!);
        useRadioGroupHook.onValueChange(user.gender!);
        useBirthDayHook.onChange(new Date(user.birthday!));
    });

    const { user } = useUserSelector();

    const useLogoutHook = useLogout();

    const useUpdateUserHook = useUpdateUser(false, {
        id: user.id,
        birthday: useBirthDayHook.selected,
        first_name: useFirstNameHook.value,
        last_name: useLastNameHook.value,
        gender: useRadioGroupHook.value
    });

    return (
        <StandardView>
            <View style={{ flex: 1 }}>
                <TextBox
                    {...useFirstNameHook}
                    label={"account_input_first_name"}
                ></TextBox>
            </View>
            <View style={{ flex: 1 }}>
                <TextBox
                    {...useLastNameHook}
                    label={"account_input_last_name"}
                ></TextBox>
            </View>
            <DatePicker
                {...useBirthDayHook}
                label={"account_input_birthday"}
            ></DatePicker>
            <View style={{ flex: 1 }}></View>
            <RadioButton.Group {...useRadioGroupHook}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        alignContent: "center",
                        justifyContent: "center"
                    }}
                >
                    <LabeledRadioButton
                        value={"male"}
                        label={"male"}
                    ></LabeledRadioButton>
                    <LabeledRadioButton
                        value={"female"}
                        label={"female"}
                    ></LabeledRadioButton>
                </View>
            </RadioButton.Group>
            <ErrorText>{""}</ErrorText>
            <Button {...useUpdateUserHook}>{"account_button"}</Button>
            <FlatButton {...useLogoutHook}>{"account_signout"}</FlatButton>
        </StandardView>
    );
};
