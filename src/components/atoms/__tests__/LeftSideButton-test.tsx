/* eslint-disable @typescript-eslint/ban-ts-comment */
//#region Import Modules
import "react-native";

import { ShallowWrapper } from "enzyme";
import React from "react";

import { createMock, toJson } from "../../../utils/TestHelper";
import { LeftSideButton, LeftSideButtonProps } from "../LeftSideButton";
//#endregion

//#region Test
let component: ShallowWrapper<LeftSideButtonProps, unknown, unknown>;
describe("LeftSideButton UnitTest", () => {
    it("Renders correctly", () => {
        component = createMock(
            <LeftSideButton needMargin={true} screenWidth={100}>
                {"test"}
            </LeftSideButton>
        );

        expect(toJson(component)).toMatchSnapshot();
    });

    it("If margins are not required, no margins should be set.", () => {
        component = createMock(
            <LeftSideButton needMargin={false} screenWidth={100}>
                {"test"}
            </LeftSideButton>
        );

        // @ts-ignore
        expect(component.props().style.marginRight).toBeUndefined();
    });
});
//#endregion
