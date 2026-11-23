//#region Import Modules
import React, { type FunctionComponent } from "react";

import { Dimens } from "../../constants";
import { Button, type ButtonProps } from "./Button";
//#endregion

//#region Types
export type LeftSideButtonProps = ButtonProps & { needMargin: boolean };
//#endregion

//#region Component
export const LeftSideButton: FunctionComponent<LeftSideButtonProps> = (
    props: LeftSideButtonProps,
) => {
    return (
        <Button
            {...props}
            style={{
                marginRight: props.needMargin ? Dimens.items_margin : undefined,
            }}
        ></Button>
    );
};
//#endregion
