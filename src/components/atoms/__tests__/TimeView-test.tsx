//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { TimeView, TimeViewProps } from "../TimeView";
//#endregion

//#region Test
let component: ShallowWrapper<TimeViewProps, unknown, unknown>;
describe("TimeView UnitTest", () => {
    it("renders correctly", () => {
        component = createMock(
            <TimeView hours={12} minutes={50} mode={"meridian"}></TimeView>
        );

        expect(toJson(component)).toMatchSnapshot();
    });
});
//#endregion
