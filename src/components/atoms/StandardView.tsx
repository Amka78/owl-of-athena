//#region Import Modules
import React, { FunctionComponent } from "react";
import { View, ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";

import { CommonStyles } from "../../styles";
//#endregion

//#region Type
type StandardViewProps = {
    children: React.ReactNode;
    standardViewStyle?: ViewStyle | any[] | undefined;
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
            ]}
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
