import React, { FunctionComponent } from "react";
import { View } from "react-native";
import { useCheckLogging } from "../hooks";

export const SessionListScreen: FunctionComponent = () => {
    useCheckLogging();
    return <View></View>;
};
