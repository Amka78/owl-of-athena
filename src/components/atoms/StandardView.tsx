//#region Import Modules
import React, { FunctionComponent } from "react";
import { LayoutChangeEvent, View, ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";

import { CommonStyles } from "../../styles";
//#endregion

//#region Type
type StandardViewProps = {
    children: React.ReactNode;
    rootViewStyle?: ViewStyle | any[] | undefined;
    standardViewStyle?: ViewStyle | any[] | undefined;
    onLayout?: (event: LayoutChangeEvent) => void;
};
//#endregion

//#region Component
export const StandardView: FunctionComponent<StandardViewProps> = (
    props: StandardViewProps
) => {
    const theme = useTheme();
    return (
        <View
            style={[
                CommonStyles.rootContainer,
                { backgroundColor: theme.colors?.background },
                props.rootViewStyle,
            ]}
            onLayout={props.onLayout}
        >
            <View
                style={[
                    CommonStyles.standardView,
                    { backgroundColor: theme.colors?.background },
                    props.standardViewStyle,
                ]}
            >
                {props.children}
            </View>
        </View>
    );
};
//#endregion
