//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { UpdateSnackBar, UpdateSnackBarProps } from "../UpdateSnackBar";
//#endregion

//#region Test
let component: ShallowWrapper<UpdateSnackBarProps, unknown, unknown>;
describe("UpdateSnackBar UnitTest", () => {
    it("renders correctly", () => {
        component = createMock(<UpdateSnackBar></UpdateSnackBar>);

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
