//#region Import Modules
import { ShallowWrapper } from "enzyme";
import React from "react";

import { Colors } from "../../../constants";
import { createMock, toJson } from "../../../utils/TestHelper";
import { BatteryIcon, BatteryIconProps } from "../BatteryIcon";
//#endregion

//#region Types
type TestPairs = {
    batteryLevel?: number | null;
    isUSBConnected: boolean;

    resultIcon:
        | "battery-alert"
        | "battery"
        | "battery-charging"
        | "battery-10"
        | "battery-charging-10"
        | "battery-20"
        | "battery-charging-20"
        | "battery-30"
        | "battery-charging-30"
        | "battery-40"
        | "battery-charging-40"
        | "battery-50"
        | "battery-charging-50"
        | "battery-60"
        | "battery-charging-60"
        | "battery-70"
        | "battery-charging-70"
        | "battery-80"
        | "battery-charging-80"
        | "battery-90"
        | "battery-charging-90";
    resultIconColor: string;
};
//#endregion
//#region Tests
let component: ShallowWrapper<BatteryIconProps, unknown, unknown>;
describe("BatteryIcon UnitTest", () => {
    it("Renders correctly", () => {
        component = createMock(
            <BatteryIcon batteryLevel={100} isUSBConnected={true}></BatteryIcon>
        );

        expect(toJson(component)).toMatchSnapshot();
    });

    it.each<TestPairs>([
        {
            batteryLevel: undefined,
            isUSBConnected: false,
            resultIcon: "battery-alert",
            resultIconColor: Colors.red,
        },
        {
            batteryLevel: null,
            isUSBConnected: false,
            resultIcon: "battery-alert",
            resultIconColor: Colors.red,
        },
        {
            batteryLevel: undefined,
            isUSBConnected: true,
            resultIcon: "battery-alert",
            resultIconColor: Colors.red,
        },
        {
            batteryLevel: null,
            isUSBConnected: true,
            resultIcon: "battery-alert",
            resultIconColor: Colors.red,
        },
        {
            batteryLevel: 0,
            isUSBConnected: false,
            resultIcon: "battery-alert",
            resultIconColor: Colors.red,
        },
        {
            batteryLevel: 0,
            isUSBConnected: false,
            resultIcon: "battery-alert",
            resultIconColor: Colors.red,
        },
        {
            batteryLevel: 9,
            isUSBConnected: false,
            resultIcon: "battery-alert",
            resultIconColor: Colors.red,
        },
        {
            batteryLevel: 9,
            isUSBConnected: false,
            resultIcon: "battery-alert",
            resultIconColor: Colors.red,
        },
        {
            batteryLevel: 10,
            isUSBConnected: false,
            resultIcon: "battery-10",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 10,
            isUSBConnected: true,
            resultIcon: "battery-charging-10",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 19,
            isUSBConnected: false,
            resultIcon: "battery-10",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 19,
            isUSBConnected: true,
            resultIcon: "battery-charging-10",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 20,
            isUSBConnected: false,
            resultIcon: "battery-20",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 20,
            isUSBConnected: true,
            resultIcon: "battery-charging-20",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 29,
            isUSBConnected: false,
            resultIcon: "battery-20",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 29,
            isUSBConnected: true,
            resultIcon: "battery-charging-20",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 30,
            isUSBConnected: false,
            resultIcon: "battery-30",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 30,
            isUSBConnected: true,
            resultIcon: "battery-charging-30",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 39,
            isUSBConnected: false,
            resultIcon: "battery-30",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 39,
            isUSBConnected: true,
            resultIcon: "battery-charging-30",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 40,
            isUSBConnected: false,
            resultIcon: "battery-40",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 40,
            isUSBConnected: true,
            resultIcon: "battery-charging-40",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 49,
            isUSBConnected: false,
            resultIcon: "battery-40",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 49,
            isUSBConnected: true,
            resultIcon: "battery-charging-40",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 50,
            isUSBConnected: false,
            resultIcon: "battery-50",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 50,
            isUSBConnected: true,
            resultIcon: "battery-charging-50",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 59,
            isUSBConnected: false,
            resultIcon: "battery-50",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 59,
            isUSBConnected: true,
            resultIcon: "battery-charging-50",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 60,
            isUSBConnected: false,
            resultIcon: "battery-60",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 60,
            isUSBConnected: true,
            resultIcon: "battery-charging-60",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 69,
            isUSBConnected: false,
            resultIcon: "battery-60",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 69,
            isUSBConnected: true,
            resultIcon: "battery-charging-60",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 70,
            isUSBConnected: false,
            resultIcon: "battery-70",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 70,
            isUSBConnected: true,
            resultIcon: "battery-charging-70",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 79,
            isUSBConnected: false,
            resultIcon: "battery-70",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 79,
            isUSBConnected: true,
            resultIcon: "battery-charging-70",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 80,
            isUSBConnected: false,
            resultIcon: "battery-80",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 80,
            isUSBConnected: true,
            resultIcon: "battery-charging-80",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 89,
            isUSBConnected: false,
            resultIcon: "battery-80",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 89,
            isUSBConnected: true,
            resultIcon: "battery-charging-80",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 90,
            isUSBConnected: false,
            resultIcon: "battery-90",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 90,
            isUSBConnected: true,
            resultIcon: "battery-charging-90",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 99,
            isUSBConnected: false,
            resultIcon: "battery-90",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 99,
            isUSBConnected: true,
            resultIcon: "battery-charging-90",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 100,
            isUSBConnected: false,
            resultIcon: "battery",
            resultIconColor: Colors.aurora_connected,
        },
        {
            batteryLevel: 100,
            isUSBConnected: true,
            resultIcon: "battery-charging",
            resultIconColor: Colors.aurora_connected,
        },
    ])(
        "The icons and colours must correspond to the battery display",
        (props: TestPairs) => {
            component = createMock(
                <BatteryIcon
                    batteryLevel={props.batteryLevel as any}
                    isUSBConnected={props.isUSBConnected}
                ></BatteryIcon>
            );
            expect(component.props().name).toBe(props.resultIcon);
            expect(component.props().color).toBe(props.resultIconColor);
        }
    );

    it("Overwrite default props value.", () => {
        component = createMock(
            <BatteryIcon
                batteryLevel={100}
                isUSBConnected={true}
                size={50}
            ></BatteryIcon>
        );
        expect(component.props().size).toBe(50);
    });
});
//#endregion
