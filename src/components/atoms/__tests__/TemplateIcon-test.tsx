//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { TemplateIcon, TemplateIconProps } from "../TemplateIcon";
//#endregion

//#region Test
let component: ShallowWrapper<TemplateIconProps, unknown, unknown>;
describe("TemplateIcon UnitTest", () => {
    it("renders correctly", () => {
        component = createMock(<TemplateIcon name={"test"}></TemplateIcon>);

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
