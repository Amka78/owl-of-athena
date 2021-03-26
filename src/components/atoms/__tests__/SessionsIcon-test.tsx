//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { SessionsIcon, SessionsIconProps } from "../SessionsIcon";
//#endregion

//#region Test
let component: ShallowWrapper<SessionsIconProps, unknown, unknown>;
describe("SessionsIcon UnitTest", () => {
    it("renders correctly", () => {
        component = createMock(<SessionsIcon></SessionsIcon>);

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
