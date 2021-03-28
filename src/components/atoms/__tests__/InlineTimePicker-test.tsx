//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { InlineTimePicker, InlineTimePickerProps } from "../InlineTimePicker";
//#endregion

//#region Test
let component: ShallowWrapper<InlineTimePickerProps, unknown, unknown>;
describe("InlineTimePicker UnitTest", () => {
    it("Renders correctly", () => {
        component = createMock(<InlineTimePicker></InlineTimePicker>);

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
