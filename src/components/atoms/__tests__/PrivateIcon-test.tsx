//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { PrivateIcon, PrivateIconProps } from "../PrivateIcon";
//#endregion

//#region Test
let component: ShallowWrapper<PrivateIconProps, unknown, unknown>;
describe("PrivateIcon UnitTest", () => {
    it("renders correctly", () => {
        component = createMock(<PrivateIcon></PrivateIcon>);

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
