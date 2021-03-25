//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { FilterIcon, FilterIconProps } from "../FilterIcon";
//#endregion

//#region Test
let component: ShallowWrapper<FilterIconProps, unknown, unknown>;
describe("FilterIcon UnitTest", () => {
    it("renders correctly", () => {
        component = createMock(<FilterIcon></FilterIcon>);

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
