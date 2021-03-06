//#region Import Modules
import React, { FunctionComponent } from "react";

import { Colors, Dimens } from "../../constants";
import { ConnectionStates } from "../../sdk/AuroraConstants";
import { TemplateIcon, TemplateIconProps } from "./TemplateIcon";
//#endregion

//#region Types
export type BluetoothIconProps = Omit<TemplateIconProps, "name" | "color"> & {
    connectionStates: ConnectionStates;
    name?: string;
    color?: string;
};
//#endregion

//#region Component
export const BluetoothIcon: FunctionComponent<BluetoothIconProps> = (
    props: BluetoothIconProps
) => {
    let stateIcon = "bluetooth-off";
    let stateColor = Colors.white;
    if (props.connectionStates === ConnectionStates.CONNECTED) {
        stateIcon = "bluetooth-connect";
        stateColor = Colors.aurora_connected;
    } else if (props.connectionStates === ConnectionStates.BUSY) {
        stateIcon = "bluetooth-transfer";
        stateColor = Colors.purple;
    } else if (
        props.connectionStates === ConnectionStates.CONNECTING ||
        props.connectionStates === ConnectionStates.DISCONNECTING ||
        props.connectionStates === ConnectionStates.IDLE ||
        props.connectionStates === ConnectionStates.INIT ||
        props.connectionStates === ConnectionStates.RECONNECTING
    ) {
        stateIcon = "bluetooth-settings";
        stateColor = Colors.aurora_connected;
    }
    return (
        <TemplateIcon
            {...props}
            size={props.size ? props.size : Dimens.menu_icon_size}
            color={stateColor}
            name={stateIcon}
        ></TemplateIcon>
    );
};
//#endregion
