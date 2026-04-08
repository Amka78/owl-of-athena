//#region Import Modules

import type React from "react";
import type { FunctionComponent } from "react";
import type { ViewStyle } from "react-native";
import { Dimens } from "../../constants";
import { StandardView } from "../atoms";
//#endregion

//#region Type
export type InternalViewProps = {
    children: React.ReactNode;
    internalView?: ViewStyle;
};
//#endregion

//#region Component
export const InternalView: FunctionComponent<InternalViewProps> = (props: InternalViewProps) => {
    return (
        <StandardView standardViewStyle={[commonInternalView, props.internalView]}>
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
