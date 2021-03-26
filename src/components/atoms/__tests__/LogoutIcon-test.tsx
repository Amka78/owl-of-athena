//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { LogoutIcon, LogoutIconProps } from "../LogoutIcon";
//#endregion

//#region Test
let component: ShallowWrapper<LogoutIconProps, unknown, unknown>;
describe("LogoutIcon UnitTest", () => {
    it("Renders correctly", () => {
        component = createMock(<LogoutIcon></LogoutIcon>);

        expect(toJson(component)).toMatchSnapshot();
    });

    it("If a value is set, the size must be overwritten.", () => {
        component = createMock(<LogoutIcon size={10}></LogoutIcon>);

        expect(component.props().size).toBe(10);
    });
});
//#endregion
