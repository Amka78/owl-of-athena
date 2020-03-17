import React, { FunctionComponent } from "react";
import { Button } from "react-native-paper";
import { StackHeaderLeftButtonProps } from "react-navigation-stack";

import { Colors } from "../constants";

export const HeaderBackButton: FunctionComponent<StackHeaderLeftButtonProps> = (
    props: StackHeaderLeftButtonProps
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
