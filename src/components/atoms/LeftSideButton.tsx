//#region Import Modules
import React, { FunctionComponent } from "react";

import { Dimens } from "../../constants";
import { Button, ButtonProps } from "./Button";
//#endregion

//#region Types
export type LeftSideButtonProps = ButtonProps & { needMargin: boolean };
//#endregion

//#region Component
export const LeftSideButton: FunctionComponent<LeftSideButtonProps> = (
    props: LeftSideButtonProps
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
