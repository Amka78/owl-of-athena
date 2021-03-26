//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { FlexSpacer } from "../FlexSpacer";
//#endregion

//#region Test
let component: ShallowWrapper<unknown, unknown, unknown>;
describe("FlexSpacer UnitTest", () => {
    it("Renders correctly", () => {
        component = createMock(<FlexSpacer>{"test"}</FlexSpacer>);

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
