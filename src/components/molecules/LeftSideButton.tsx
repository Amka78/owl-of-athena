//#region Import Modules
import React, { FunctionComponent } from "react";

import { Dimens } from "../../constants";
import { Button, ButtonProps } from "../atoms";
//#endregion

//#region Types
export type LeftSideButtonProps = ButtonProps & { isLargeWidth: boolean };
//#endregion

//#region Component
export const LeftSideButton: FunctionComponent<LeftSideButtonProps> = (
    props: LeftSideButtonProps
) => {
    return (
        <Button
            {...props}
            style={{
                marginRight: props.isLargeWidth
                    ? Dimens.button_margin
                    : undefined,
            }}
        ></Button>
    );
};
//#endregion
