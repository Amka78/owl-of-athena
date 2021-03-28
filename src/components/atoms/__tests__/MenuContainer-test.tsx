//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { MenuContainer, MenuContainerProps } from "../MenuContainer";
//#endregion

//#region Test
let component: ShallowWrapper<MenuContainerProps, unknown, unknown>;
describe("MenuContainer UnitTest", () => {
    it("renders correctly", () => {
        component = createMock(<MenuContainer>{"test"}</MenuContainer>);

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
