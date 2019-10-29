import React, { FunctionComponent } from "react";
import { Button } from "react-native-paper";
import { HeaderBackButtonProps } from "react-navigation-stack";

import { Colors } from "../constants";

export const HeaderBackButton: FunctionComponent<HeaderBackButtonProps> = (
    props: HeaderBackButtonProps
) => {
    return (
        <Button
            icon={"chevron-left"}
            color={Colors.white}
            onPress={props.onPress}
        >
            {""}
        </Button>
    );
};
