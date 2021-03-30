//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { EditIcon, EditIconProps } from "../EditIcon";
//#endregion

//#region Test
let component: ShallowWrapper<EditIconProps, unknown, unknown>;
describe("EditIcon UnitTest", () => {
    it("Renders correctly", () => {
        component = createMock(<EditIcon></EditIcon>);

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
