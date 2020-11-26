import React, { FunctionComponent, useEffect, useState } from "react";
import { View } from "react-native";
import { RadioButton } from "react-native-paper";

import { AuroraRestClientInstance } from "../clients";
import { useDispatch } from "react-redux";

import { updateUser } from "../actions";
import {
    Button,
    DatePicker,
    ErrorText,
    FlatButton,
    LabeledRadioButton,
    StandardView,
    TextBox,
} from "../components";
import {
    useLogout,
    useUpdateUser,
    useCheckLogging,
    useUserSelector,
} from "../hooks";
import { MessageKeys, Message } from "../constants";
import { GuestUser } from "../types";

export const AccountScreen: FunctionComponent = () => {
    useCheckLogging();
    const dispatch = useDispatch();

    const userInfo = useUserSelector();
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
                    let currentUser;

                    if (userInfo?.id === GuestUser) {
                        currentUser = userInfo;
                    } else {
                        currentUser = await AuroraRestClientInstance.getAuthUser();
                    }
                    console.debug("authenticatedUser", currentUser);
                    dispatch(updateUser(currentUser));
                    setFirstName(currentUser.first_name!);
                    setLastName(currentUser.last_name!);
                    setMale(currentUser.gender ? currentUser.gender : "male");
                    setBirthDay(new Date(currentUser.birthday!));
                } catch (ex) {
                    console.debug(ex);
                }
        };
        f();
        const cleanup = (): void => {
            unmounted = true;
        };
        return cleanup;
    }, [dispatch, userInfo]);

    const useLogoutHook = useLogout();

    const useUpdateUserHook = useUpdateUser(false, {
        birthday:
            birthDay.toJSON() !== null ? birthDay.toJSON().split("T")[0] : "",
        first_name: firstName,
        last_name: lastName,
        gender: male,
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
                format={Message.get(MessageKeys.date_format)}
                onChange={(date: Date): void => {
                    setBirthDay(date);
                }}
                selected={birthDay}
                label={{ key: "account_input_birthday" }}
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
                        justifyContent: "center",
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
