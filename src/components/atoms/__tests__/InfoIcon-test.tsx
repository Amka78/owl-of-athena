//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { InfoIcon, InfoIconProps } from "../InfoIcon";
//#endregion

//#region Test
let component: ShallowWrapper<InfoIconProps, unknown, unknown>;
describe("InfoIcon UnitTest", () => {
    it("renders correctly", () => {
        component = createMock(<InfoIcon></InfoIcon>);

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
