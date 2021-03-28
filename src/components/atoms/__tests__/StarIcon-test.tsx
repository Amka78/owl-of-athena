//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { StarIcon, StarIconProps } from "../StarIcon";
//#endregion

//#region Test
let component: ShallowWrapper<StarIconProps, unknown, unknown>;
describe("StarIcon UnitTest", () => {
    it("renders correctly", () => {
        component = createMock(<StarIcon starred={true}></StarIcon>);

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
