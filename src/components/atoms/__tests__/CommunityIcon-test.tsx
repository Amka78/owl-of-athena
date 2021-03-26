//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { CommunityIcon, CommunityIconProps } from "../CommunityIcon";
//#endregion

//#region Test
let component: ShallowWrapper<CommunityIconProps, unknown, unknown>;
describe("CommunityIcon UnitTest", () => {
    it("Renders correctly", () => {
        component = createMock(<CommunityIcon></CommunityIcon>);

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
