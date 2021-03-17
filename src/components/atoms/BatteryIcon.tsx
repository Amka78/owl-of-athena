//#region Import Modules
import React, { FunctionComponent } from "react";

import { Colors, Dimens } from "../../constants";
import { TemplateIcon, TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type BatteryIconProps = Omit<TemplateIconProps, "name" | "color"> & {
    batteryLevel: number;
    isUSBConnected: boolean;
};
//#endregion

//#region Component
export const BatteryIcon: FunctionComponent<BatteryIconProps> = (
    props: BatteryIconProps
) => {
    let batteryLevel = props.batteryLevel;
    if (props.batteryLevel === undefined || props.batteryLevel === null) {
        batteryLevel = 0;
    }
    let batteyIconSuffix = "";
    if (props.isUSBConnected) {
        batteyIconSuffix = "-charging";
    }

    let batterIcon = `battery${batteyIconSuffix}`;
    let color = Colors.aurora_connected;

    if (batteryLevel < 100) {
        if (batteryLevel <= 10) {
            color = Colors.red;
            batterIcon = "battery-alert";
        } else {
            batterIcon = `battery${batteyIconSuffix}-${batteryLevel
                .toString()
                .substring(0, 1)}0`;
        }
    }
    return (
        <TemplateIcon
            {...props}
            name={batterIcon}
            color={color}
            size={props.size ? props.size : Dimens.menu_icon_size}
        ></TemplateIcon>
    );
};
//#endregion
