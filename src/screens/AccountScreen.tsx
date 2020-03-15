import React, { FunctionComponent, useEffect, useState } from "react";
import { View } from "react-native";
import { RadioButton } from "react-native-paper";

import { useRestClientSelector } from "../hooks/useRestClientSelector";
import { useDispatch } from "react-redux";

import { updateUser } from "../actions";
import {
    Button,
    DatePicker,
    ErrorText,
    FlatButton,
    LabeledRadioButton,
    StandardView,
    TextBox
} from "../components";
import { useLogout, useUpdateUser, useCheckLogging } from "../hooks";

export const AccountScreen: FunctionComponent = () => {
    useCheckLogging();
    const restClient = useRestClientSelector();
    const dispatch = useDispatch();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [male, setMale] = useState("");
    const [birthDay, setBirthDay] = useState(new Date());

    useEffect(() => {
        let unmounted = false;
        console.debug("useGetUser start");
        const f = async (): Promise<void> => {
            if (!unmounted)
                try {
                    console.debug("useGetUser useEffect start");
                    const result = await restClient.getAuthUser();
                    console.debug("authenticatedUser", result);
                    dispatch(updateUser(result));
                    setFirstName(result.first_name!);
                    setLastName(result.last_name!);
                    setMale(result.gender);
                    setBirthDay(new Date(result.birthday!));
                } catch (ex) {
                    console.debug(ex);
                }
        };
        f();
        const cleanup = (): void => {
            unmounted = true;
        };
        return cleanup;
    }, [dispatch, restClient]);

    const useLogoutHook = useLogout();

    const useUpdateUserHook = useUpdateUser(false, {
        birthday: birthDay.toJSON().split("T")[0],
        first_name: firstName,
        last_name: lastName,
        gender: male
    });

    return (
        <StandardView>
            <View style={{ flex: 1 }}>
                <TextBox
                    value={firstName}
                    onChangeText={(text: string): void => {
                        setFirstName(text);
                    }}
                    label={{ key: MessageKeys.account_input_first_name }}
                ></TextBox>
            </View>
            <View style={{ flex: 1 }}>
                <TextBox
                    value={lastName}
                    onChangeText={(text: string): void => {
                        setLastName(text);
                    }}
                    label={{ key: MessageKeys.account_input_last_name }}
                ></TextBox>
            </View>
            <DatePicker
                onChange={(date: Date): void => {
                    setBirthDay(date);
                }}
                selected={birthDay}
                label={"account_input_birthday"}
            ></DatePicker>
            <View style={{ flex: 1 }}></View>
            <RadioButton.Group
                value={male}
                onValueChange={(value: string): void => {
                    setMale(value);
                }}
            >
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
                        label={{ key: MessageKeys.male }}
                    ></LabeledRadioButton>
                    <LabeledRadioButton
                        value={"female"}
                        label={{ key: MessageKeys.female }}
                    ></LabeledRadioButton>
                </View>
            </RadioButton.Group>
            <ErrorText>{{ key: "" }}</ErrorText>
            <Button {...useUpdateUserHook}>
                {{ key: MessageKeys.account_button }}
            </Button>
            <FlatButton {...useLogoutHook}>
                {{ key: MessageKeys.account_signout }}
            </FlatButton>
        </StandardView>
    );
};
