//#region Import Modules
import React, { FunctionComponent } from "react";
import { LayoutChangeEvent, View, ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";

import { Dimens } from "../../constants";
//#endregion

//#region Type
export type StandardViewProps = {
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
                rootContainer,
                { backgroundColor: theme.colors?.background },
                props.rootViewStyle,
            ]}
            onLayout={props.onLayout}
        >
            <View
                style={[
                    standardView,
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

//#region Styles
const rootContainer: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
};
const standardView: ViewStyle = {
    alignItems: "center",
    marginLeft: Dimens.content_margin_horizontal,
    marginRight: Dimens.content_margin_horizontal,
    flex: 1,
    justifyContent: "space-between",
};
//#endregion
