import React, { FunctionComponent } from "react";
import { InlineTimePicker, StandardView } from "../components";
import { Colors } from "../constants";
export const SettingsScreen: FunctionComponent = () => {
    return (
        <StandardView>
            <InlineTimePicker
                mode="minute"
                style={{
                    activeColor: Colors.navy_darker,
                    backgroundColor: Colors.navy,
                    borderColor: Colors.white,
                    containerBackgroudColor: Colors.navy
                }}
            ></InlineTimePicker>
        </StandardView>
    );
};
