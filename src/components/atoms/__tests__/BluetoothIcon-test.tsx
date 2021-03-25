//#region Import Modules
import "react-native";
import { ShallowWrapper } from "enzyme";
import React from "react";
import { createMock, toJson } from "../../../utils/TestHelper";
import { BluetoothIcon, BluetoothIconProps } from "../BluetoothIcon";
import { ConnectionStates } from "../../../sdk/AuroraConstants";
import { Colors } from "../../../constants";
//#endregion

//#region Types
type TestPairs = {
    connectionState: ConnectionStates;
    resultIcon:
        | "bluetooth-connect"
        | "bluetooth-off"
        | "bluetooth-transfer"
        | "bluetooth-settings";
    resultColor: string;
};

//#endregion
//#region Tests
let component: ShallowWrapper<BluetoothIconProps, unknown, unknown>;
describe("BluetoothIcon UnitTest", () => {
    it("renders correctly", () => {
        component = createMock(
            <BluetoothIcon
                connectionStates={ConnectionStates.CONNECTED}
            ></BluetoothIcon>
        );

        expect(toJson(component)).toMatchSnapshot();
    });

    it.each<TestPairs>([
        {
            connectionState: ConnectionStates.CONNECTED,
            resultColor: Colors.aurora_connected,
            resultIcon: "bluetooth-connect",
        },
        {
            connectionState: ConnectionStates.BUSY,
            resultColor: Colors.purple,
            resultIcon: "bluetooth-transfer",
        },
        {
            connectionState: ConnectionStates.CONNECTING,
            resultColor: Colors.aurora_connected,
            resultIcon: "bluetooth-settings",
        },
        {
            connectionState: ConnectionStates.DISCONNECTING,
            resultColor: Colors.aurora_connected,
            resultIcon: "bluetooth-settings",
        },
        {
            connectionState: ConnectionStates.IDLE,
            resultColor: Colors.aurora_connected,
            resultIcon: "bluetooth-settings",
        },
        {
            connectionState: ConnectionStates.INIT,
            resultColor: Colors.aurora_connected,
            resultIcon: "bluetooth-settings",
        },
        {
            connectionState: ConnectionStates.RECONNECTING,
            resultColor: Colors.aurora_connected,
            resultIcon: "bluetooth-settings",
        },
        {
            connectionState: ConnectionStates.DISCONNECTED,
            resultColor: Colors.white,
            resultIcon: "bluetooth-off",
        },
    ])(
        "The isons and color must be correspond to ConnectionStates.",
        (testPairs: TestPairs) => {
            component = createMock(
                <BluetoothIcon
                    connectionStates={testPairs.connectionState}
                ></BluetoothIcon>
            );

            expect(component.props().name).toBe(testPairs.resultIcon);
            expect(component.props().color).toBe(testPairs.resultColor);
        }
    );
    it("Overwrite default props value.", () => {
        component = createMock(
            <BluetoothIcon
                connectionStates={ConnectionStates.CONNECTED}
                size={50}
            ></BluetoothIcon>
        );
        expect(component.props().size).toBe(50);
    });
});
//#endregion
