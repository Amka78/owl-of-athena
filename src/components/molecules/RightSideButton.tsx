//#region Import Modules
import React, { type FunctionComponent } from "react";

import { Dimens } from "../../constants";
import { Button, type ButtonProps } from "../atoms/Button";
//#endregion

//#region Types
export type RightSideButtonProps = ButtonProps & { needMargin: boolean };
//#endregion

//#region Component
export const RightSideButton: FunctionComponent<RightSideButtonProps> = (
    props: RightSideButtonProps,
) => {
    return (
        <Button
            {...props}
            style={{
                marginLeft: props.needMargin ? Dimens.items_margin : undefined,
            }}
        ></Button>
    );
};
//#endregion
