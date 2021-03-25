//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { ProfilesIcon, ProfilesIconProps } from "../ProfilesIcon";
//#endregion

//#region Test
let component: ShallowWrapper<ProfilesIconProps, unknown, unknown>;
describe("ProfilesIcon UnitTest", () => {
    it("renders correctly", () => {
        component = createMock(<ProfilesIcon></ProfilesIcon>);

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
