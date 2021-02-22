//#region Import Modules
import { ViewStyle } from "react-native";

import React, { FunctionComponent } from "react";
import { StandardView } from "../atoms";
import { Dimens } from "../../constants";
//#endregion

//#region Type
export type InternalViewProps = {
    children: React.ReactNode;
    internalView?: ViewStyle;
};
//#endregion

//#region Component
export const InternalView: FunctionComponent<InternalViewProps> = (
    props: InternalViewProps
) => {
    return (
        <StandardView
            standardViewStyle={[commonInternalView, props.internalView]}
        >
            {props.children}
        </StandardView>
    );
};
//#endregion

//#region StyleSheet
const commonInternalView: ViewStyle = {
    maxHeight: Dimens.inner_screen_max_height,
    maxWidth: Dimens.inner_screen_max_width,
};
//#endregion
