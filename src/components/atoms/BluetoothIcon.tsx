//#region Import Modules
import React, { FunctionComponent } from "react";
import { IconProps } from "react-native-vector-icons/Icon";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ConnectionStates } from "../../sdk";
import { Colors } from "../../constants";
//#endregion

//#region Types
export type BluetoothIconProps = Omit<IconProps, "name" | "color"> & {
    connectionStates: ConnectionStates;
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
        <MaterialCommunityIcons
            {...props}
            color={stateColor}
            name={stateIcon}
        ></MaterialCommunityIcons>
    );
};
//#endregion
