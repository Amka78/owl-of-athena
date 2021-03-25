//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { DeleteIcon, DeleteIconProps } from "../DeleteIcon";
//#endregion

//#region Test
let component: ShallowWrapper<DeleteIconProps, unknown, unknown>;
describe("DeleteIcon UnitTest", () => {
    it("Renders correctly", () => {
        component = createMock(<DeleteIcon></DeleteIcon>);

        expect(toJson(component)).toMatchSnapshot();
    });

    it("If a value is set, the size must be overwritten.", () => {
        component = createMock(<DeleteIcon size={10}></DeleteIcon>);

        expect(component.props().size).toBe(10);
    });
});
//#endregion
